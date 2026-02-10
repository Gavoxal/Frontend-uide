import { Box, Typography, Grid } from "@mui/material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getDataUser } from "../../storage/user.model.jsx";
import { getPrerequisites, prerequisitesToRequirements } from "../../storage/prerequisites.model";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import InfoCardModern from "../../components/Profile/InfoCardModern";
import RequirementsCardModern from "../../components/Profile/RequirementsCardModern";
import { UserService } from "../../services/user.service";
import { PrerequisiteService } from "../../services/prerequisites.service";
import { AuthService } from "../../services/auth.service";
import ChangePasswordDialog from "../../components/Profile/ChangePasswordDialog";

function StudentProfile() {
    const user = getDataUser();

    const [studentData, setStudentData] = useState({
        name: (user?.nombres && user?.apellidos) ? `${user.nombres} ${user.apellidos}` : (user?.name || "Cargando..."),
        initials: ((user?.nombres?.[0] || user?.name?.[0] || "") + (user?.apellidos?.[0] || user?.lastName?.[0] || "")) || "U",
        email: user?.correo || user?.email || "",
        cedula: user?.cedula || "No registrada",
        sede: user?.sede || "UIDE - Loja",
        carrera: user?.carrera || "Ingeniería en Tecnologías de Información",
        malla: user?.malla || user?.codigoMalla || "ITIL_MAI.2019",
        semestre: user?.semestre || "8vo Semestre",
        status: user?.estado || "Activo",
        telefono: user?.telefono || "No registrado",
        direccion: user?.direccion || user?.ciudad || "No registrada",
        ubicacion: user?.ubicacion || (user?.ciudad ? `${user.ciudad.toUpperCase()}, ECUADOR` : "ZAMORA, ECUADOR")
    });



    // State for password change dialog
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    // Cargar datos frescos del backend
    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const freshData = await UserService.getById(user.id);
                    if (freshData) {
                        console.log("Full User Data:", freshData);

                        // Intentar obtener datos del perfil (si vienen anidados o planos)
                        // Ajustado basado en logs: estudiantePerfil (camelCase, singular)
                        const profile = freshData.estudiantePerfil || freshData.estudiantesperfil || freshData.estudiantesPerfil || freshData;
                        console.log("Profile Data extracted:", profile);

                        const firstName = freshData.nombres || freshData.nombre || user.nombres || user.name || "";
                        const lastName = freshData.apellidos || freshData.apellido || user.apellidos || user.lastName || "";

                        setStudentData(prev => ({
                            ...prev,
                            name: (firstName && lastName) ? `${firstName} ${lastName}` : (firstName || lastName || "Usuario Estudiante"),
                            initials: ((firstName?.[0] || "") + (lastName?.[0] || "")) || "U",
                            // Ajustado: correoInstitucional (camelCase)
                            email: freshData.correoInstitucional || freshData.correo || prev.email,
                            cedula: freshData.cedula || prev.cedula,
                            telefono: freshData.telefono || prev.telefono,
                            // Mapeo de campos de estudiantesperfil
                            sede: profile.sede || prev.sede,
                            carrera: profile.escuela || prev.carrera,
                            malla: profile.malla || profile.codigoMalla || prev.malla,
                            // Fix: Ensure ciudad is correctly mapped
                            direccion: profile.ciudad || prev.direccion,
                            ubicacion: profile.ciudad ? `${profile.ciudad.toUpperCase()}, ECUADOR` : prev.ubicacion,
                            status: freshData.estado || prev.status
                        }));
                    }
                } catch (error) {
                    console.error("Error cargando perfil:", error);
                }
            }
        };

        fetchUserData();
    }, [user?.id]);

    // Cargar requisitos desde backend (Endpoint optimizado)
    const [requirements, setRequirements] = useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            if (!user?.id) return;

            try {
                // Usar getByStudent que ya tiene el mapeo dinámico y robusto
                const data = await PrerequisiteService.getByStudent(user.id);
                console.log("Prerequisites Profile Load:", data);

                const apiPrerequisites = {
                    english: { completed: false, verified: false },
                    internship: { completed: false, verified: false },
                    community: { completed: false, verified: false }
                };

                if (Array.isArray(data)) {
                    data.forEach(item => {
                        const key = item.name; // 'english', 'internship', 'community' mapeado por el servicio
                        if (apiPrerequisites[key]) {
                            apiPrerequisites[key] = {
                                completed: item.status === 'pending' || item.status === 'approved', // Tiene archivo o está aprobado
                                verified: item.status === 'approved',    // Está verificado/aprobado
                                fileUrl: item.archivoUrl // Map fileUrl for opening
                            };
                        }
                    });
                }

                // Convertir al formato de la tarjeta
                setRequirements(prerequisitesToRequirements(apiPrerequisites));

            } catch (error) {
                console.error("Error fetching prerequisites status:", error);
                setRequirements(prerequisitesToRequirements({
                    english: { completed: false, verified: false },
                    internship: { completed: false, verified: false },
                    community: { completed: false, verified: false }
                }));
            }
        };

        fetchStatus();
    }, [user?.id]);

    // Preparar items de información personal
    const personalInfoItems = [
        { icon: <EmailIcon />, label: "Email", value: studentData.email },
        { icon: <LocationIcon />, label: "Ciudad", value: studentData.direccion }, // Mapping ciudad to direccion state
        { icon: <SchoolIcon />, label: "Sede", value: studentData.sede },
        { icon: <AssignmentIcon />, label: "Cédula", value: studentData.cedula },
        { icon: <SchoolIcon />, label: "Carrera", value: studentData.carrera },
        { icon: <AssignmentIcon />, label: "Malla", value: studentData.malla }
    ];

    const handleRequirementAction = (requirementId) => {
        const req = requirements.find(r => r.id === requirementId);
        if (req && req.fileUrl) {
            window.open(req.fileUrl, '_blank');
        } else {
            console.warn("No file URL found for requirement:", requirementId);
            alert("No hay archivo disponible para visualizar.");
        }
    };


    const handleChangePassword = () => setOpenPasswordDialog(true);
    const handlePasswordSubmit = async (passwordData) => {
        try {
            await AuthService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            alert("Contraseña cambiada exitosamente");
        } catch (error) {
            console.error("Error cambiando contraseña:", error);
            alert(error.message || "Error al cambiar la contraseña");
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Perfil
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gestiona tu información personal y configuración
                </Typography>
            </Box>

            {/* Profile Header Card */}
            <ProfileHeader
                studentData={studentData}
                onChangePassword={handleChangePassword}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} sm={6} md={6}>
                    <InfoCardModern
                        title="Información Personal"
                        items={personalInfoItems}
                    />
                </Grid>

                {/* Requirements List */}
                <Grid item xs={12} sm={6} md={6}>
                    <RequirementsCardModern
                        requirements={requirements}
                        onAction={handleRequirementAction}
                    />
                </Grid>
            </Grid>

            {/* Password Change Dialog */}
            <ChangePasswordDialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                onSubmit={handlePasswordSubmit}
            />
        </Box >
    );
}

export default StudentProfile;