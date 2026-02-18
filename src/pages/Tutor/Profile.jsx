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
import usuarioService from "../../services/usuario.service";
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
                designacion: data.designacion || "No registrada",
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
            celular: tutorData.celular === "No registrado" ? "" : tutorData.celular,
            sede: tutorData.sede === "No registrado" ? "" : tutorData.sede,
            departamento: tutorData.departamento === "No registrado" ? "" : tutorData.departamento,
            especialidad: tutorData.especialidad === "Docente Titulación" ? "" : tutorData.especialidad,
            cedula: tutorData.cedula || "",
            designacion: tutorData.designacion === "No registrada" ? "" : tutorData.designacion
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
        { icon: <AssignmentIcon color="primary" />, label: "Designación", value: tutorData.designacion },
        { icon: <DateRangeIcon color="primary" />, label: "Ingreso", value: tutorData.fechaIngreso }
    ];

    // State for password change dialog
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    // Handlers
    const handleChangePassword = () => setOpenPasswordDialog(true);
    const handlePasswordSubmit = async (passwordData) => {
        try {
            await usuarioService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            showAlert("Éxito", "Contraseña cambiada correctamente", "success");
            setOpenPasswordDialog(false);
        } catch (error) {
            showAlert("Error", error.message || "No se pudo cambiar la contraseña", "error");
        }
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

            </Box>

            {/* Profile Header Card */}
            <ProfileHeader
                name={tutorData.name}
                subtitle={tutorData.especialidad}
                initials={tutorData.initials}
                tags={[tutorData.departamento, tutorData.status]}
                onChangePassword={handleChangePassword}
                onEditProfile={handleEditClick}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Professional Information */}
                <Grid size={{ xs: 12, md: 12 }}>
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
                            label="Número de Cédula"
                            name="cedula"
                            value={editFormData.cedula || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
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
                        <TextField
                            label="Designación (ej: Director de Carrera)"
                            name="designacion"
                            value={editFormData.designacion || ''}
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
