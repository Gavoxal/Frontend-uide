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
import InfoCard from "../../components/Profile/InfoCard";
import RequirementsCard from "../../components/Profile/RequirementsCard";

function StudentProfile() {
    const user = getDataUser();

    const [studentData, setStudentData] = useState({
        name: user?.nombres + " " + user?.apellidos || user?.nombre || "Cargando...",
        initials: (user?.nombres?.[0] || "") + (user?.apellidos?.[0] || ""),
        email: user?.correo || "",
        cedula: user?.cedula || "No registrada",
        sede: "UIDE - Loja", // Valor por defecto, ajustar si el backend lo devuelve
        carrera: "Ingeniería en Tecnologías de Información", // Valor por defecto
        matla: "ITIL_MAI.2019", // Valor por defecto
        semestre: "8vo Semestre", // Valor por defecto
        status: user?.estado || "Activo",
        telefono: user?.telefono || "No registrado",
        direccion: user?.ciudad || "No registrada",
        ubicacion: "ZAMORA, ECUADOR" // Valor por defecto
    });



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

                        setStudentData(prev => ({
                            ...prev,
                            name: `${freshData.nombres} ${freshData.apellidos}`,
                            initials: `${freshData.nombres?.[0] || ''}${freshData.apellidos?.[0] || ''}`,
                            // Ajustado: correoInstitucional (camelCase)
                            email: freshData.correoInstitucional || freshData.correo,
                            cedula: freshData.cedula || prev.cedula,
                            telefono: freshData.telefono || prev.telefono,
                            // Mapeo de campos de estudiantesperfil
                            sede: profile.sede || prev.sede,
                            carrera: profile.escuela || prev.carrera,
                            matla: profile.mallla || profile.malla || prev.matla,
                            direccion: profile.ciudad || prev.direccion, // Mapear ciudad a dirección
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

    // Cargar requisitos desde prerrequisitos guardados
    const [requirements, setRequirements] = useState(() => {
        const prerequisites = getPrerequisites();
        return prerequisitesToRequirements(prerequisites);
    });

    // Actualizar requisitos cuando se recarga la página o cambian los datos
    useEffect(() => {
        const updateRequirements = () => {
            const prerequisites = getPrerequisites();
            setRequirements(prerequisitesToRequirements(prerequisites));
        };

        // Actualizar al montar
        updateRequirements();

        // Escuchar cambios en localStorage desde otras pestañas
        window.addEventListener('storage', updateRequirements);

        // Limpiar listener al desmontar
        return () => {
            window.removeEventListener('storage', updateRequirements);
        };
    }, []);

    // Preparar items de información personal
    const personalInfoItems = [
        { icon: <EmailIcon color="primary" />, label: "Email", value: studentData.email },
        { icon: <LocationIcon color="primary" />, label: "Dirección", value: studentData.direccion },
        { icon: <SchoolIcon color="primary" />, label: "Sede", value: studentData.sede },
        { icon: <AssignmentIcon color="primary" />, label: "Cédula", value: studentData.cedula },
        { icon: <SchoolIcon color="primary" />, label: "Carrera", value: studentData.carrera },
        { icon: <AssignmentIcon color="primary" />, label: "Matla", value: studentData.matla }
    ];

    // State for password change dialog
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    // Handlers
    const handleChangePassword = () => setOpenPasswordDialog(true);
    const handlePasswordSubmit = (passwordData) => {
        console.log("Cambiar contraseña:", passwordData);
        // TODO: Implement API call to change password
        alert("Contraseña cambiada exitosamente");
    };

    const handleEditPersonalInfo = () => {
        console.log("Editar información personal");
    };

    const handleRequirementAction = (requirementId) => {
        console.log("Abrir requisito:", requirementId);
    };

    const handleRequirementView = (requirementId) => {
        console.log("Visualizar requisito:", requirementId);
    };

    const handleRequirementEdit = (requirementId) => {
        console.log("Editar requisito:", requirementId);
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
                name={studentData.name}
                subtitle={`Estudiante de ${studentData.carrera}`}
                initials={studentData.initials}
                tags={[studentData.semestre, studentData.status]}
                onChangePassword={handleChangePassword}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} sm={6} md={6}>
                    <InfoCard
                        title="Información Personal"
                        items={personalInfoItems}
                        onEdit={handleEditPersonalInfo}
                    />
                </Grid>

                {/* Requirements List */}
                <Grid item xs={12} sm={6} md={6}>
                    <RequirementsCard
                        requirements={requirements}
                        onView={handleRequirementView}
                        onEdit={handleRequirementEdit}
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
        </Box>
    );
}

export default StudentProfile;
