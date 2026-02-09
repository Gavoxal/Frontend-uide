import { Box, Typography, Grid, IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Work as WorkIcon,
    DateRange as DateRangeIcon,
    Edit as EditIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getDataUser } from "../../storage/user.model.jsx";
import { TutorService } from "../../services/tutor.service";
import ProfileHeader from "../../components/Profile/tutor/ProfileHeader";
import InfoCardModern from "../../components/Profile/tutor/InfoCardModern";
import ChangePasswordDialog from "../../components/Profile/ChangePasswordDialog";
import AlertMui from '../../components/alert.mui.component';

function TutorProfile() {
    const user = getDataUser();

    // Datos del tutor
    const [tutorData, setTutorData] = useState({
        name: "",
        initials: "",
        email: "",
        cedula: "",
        sede: "",
        especialidad: "",
        departamento: "",
        titulo: "",
        status: "",
        celular: "",
        direccion: "",
        fechaIngreso: ""
    });

    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // Alert state
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '', status: 'info' });
    const showAlert = (title, message, status = 'info') => setAlertConfig({ open: true, title, message, status });
    const closeAlert = () => setAlertConfig(prev => ({ ...prev, open: false }));

    // Cargar datos
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await TutorService.getProfile();
            const perfil = data.tutorPerfil || {};

            setTutorData({
                name: `${data.nombres} ${data.apellidos}`,
                initials: (data.nombres[0] || "") + (data.apellidos[0] || ""),
                email: data.correoInstitucional,
                cedula: data.cedula,
                sede: perfil.sede || "No registrado",
                especialidad: perfil.especialidad || "Docente Titulación",
                departamento: perfil.departamento || "No registrado",
                titulo: perfil.titulo || "Docente",
                status: "Activo", // El usuario siempre está activo si puede loguearse
                celular: perfil.celular || "No registrado",
                fechaIngreso: new Date(data.createdAt).toLocaleDateString()
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            showAlert("Error", "No se pudo cargar la información del perfil", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditFormData({
            titulo: tutorData.titulo === "Docente" ? "" : tutorData.titulo,
            telefono: tutorData.telefono === "No registrado" ? "" : tutorData.telefono,
            celular: tutorData.celular === "No registrado" ? "" : tutorData.celular,
            sede: tutorData.sede === "No registrado" ? "" : tutorData.sede,
            departamento: tutorData.departamento === "No registrado" ? "" : tutorData.departamento,
            especialidad: tutorData.especialidad === "Docente Titulación" ? "" : tutorData.especialidad
        });
        setEditDialogOpen(true);
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async () => {
        try {
            await TutorService.updateProfile(editFormData);
            showAlert("Éxito", "Perfil actualizado correctamente", "success");
            setEditDialogOpen(false);
            fetchProfile(); // Recargar datos
        } catch (error) {
            console.error("Error updating profile:", error);
            showAlert("Error", "No se pudo actualizar el perfil", "error");
        }
    };

    // Preparar items de información profesional
    const professionalInfoItems = [
        { icon: <EmailIcon color="primary" />, label: "Email", value: tutorData.email },
        { icon: <PhoneIcon color="primary" />, label: "Celular", value: tutorData.celular },
        { icon: <LocationIcon color="primary" />, label: "Sede", value: tutorData.sede },
        { icon: <AssignmentIcon color="primary" />, label: "Cédula", value: tutorData.cedula },
        { icon: <WorkIcon color="primary" />, label: "Especialidad", value: tutorData.especialidad },
        { icon: <SchoolIcon color="primary" />, label: "Título", value: tutorData.titulo },
        { icon: <WorkIcon color="primary" />, label: "Departamento", value: tutorData.departamento },
        { icon: <DateRangeIcon color="primary" />, label: "Ingreso", value: tutorData.fechaIngreso }
    ];

    // State for password change dialog
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    // Handlers
    const handleChangePassword = () => setOpenPasswordDialog(true);
    const handlePasswordSubmit = (passwordData) => {
        // TODO: Implement API call
        console.log("Cambiar contraseña:", passwordData);
        showAlert("Info", "Cambio de contraseña no implementado en esta demo", "info");
    };

    return (
        <Box sx={{ width: "100%" }}>
            <AlertMui
                open={alertConfig.open}
                title={alertConfig.title}
                message={alertConfig.message}
                status={alertConfig.status}
                handleClose={closeAlert}
                showBtnL={true}
                btnNameL="Aceptar"
                actionBtnL={closeAlert}
            />

            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Perfil del Tutor
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gestiona tu información profesional y configuración
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditClick}
                    sx={{ backgroundColor: '#667eea', '&:hover': { backgroundColor: '#5a6fd6' } }}
                >
                    Editar Información
                </Button>
            </Box>

            {/* Profile Header Card */}
            <ProfileHeader
                name={tutorData.name}
                subtitle={tutorData.especialidad}
                initials={tutorData.initials}
                tags={[tutorData.departamento, tutorData.status]}
                onChangePassword={handleChangePassword}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Professional Information */}
                <Grid item xs={12} md={12}>
                    <InfoCardModern
                        title="Información Profesional"
                        items={professionalInfoItems}
                        onEdit={handleEditClick}
                    />
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Información Profesional</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Título Profesional"
                            name="titulo"
                            value={editFormData.titulo || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            label="Especialidad"
                            name="especialidad"
                            value={editFormData.especialidad || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            label="Departamento / Facultad"
                            name="departamento"
                            value={editFormData.departamento || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            label="Sede"
                            name="sede"
                            value={editFormData.sede || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            label="Teléfono Celular"
                            name="celular"
                            value={editFormData.celular || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEditSubmit} variant="contained" sx={{ backgroundColor: '#667eea' }}>Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Password Change Dialog */}
            <ChangePasswordDialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                onSubmit={handlePasswordSubmit}
            />
        </Box>
    );
}

export default TutorProfile;
