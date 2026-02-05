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

    // Datos del estudiante basados en la imagen de la cédula
    const [studentData] = useState({
        name: "Acacho Yangari Daddy Abel",
        initials: "AY",
        email: "oaaacachoya@uide.edu.ec",
        cedula: "1900714773",
        sede: "UIDE - Loja",
        carrera: "Ingeniería en Tecnologías de Información",
        matla: "ITIL_MAI.2019",
        semestre: "8vo Semestre",
        status: "Activo",
        telefono: "+593 986288316",
        direccion: "Loja",
        ubicacion: "ZAMORA, ECUADOR"
    });

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
        { icon: <PhoneIcon color="primary" />, label: "Teléfono", value: studentData.telefono },
        { icon: <LocationIcon color="primary" />, label: "Dirección", value: studentData.direccion },
        { icon: <SchoolIcon color="primary" />, label: "Sede", value: studentData.sede },
        { icon: <AssignmentIcon color="primary" />, label: "Cédula", value: studentData.cedula },
        { icon: <SchoolIcon color="primary" />, label: "Carrera", value: studentData.carrera },
        { icon: <AssignmentIcon color="primary" />, label: "Matla", value: studentData.matla }
    ];

    // Handlers
    const handleEditProfile = () => {
        console.log("Editar perfil");
    };

    const handleEditCover = () => {
        console.log("Editar portada");
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
                studentData={studentData}
                onEditProfile={handleEditProfile}
                onEditCover={handleEditCover}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={8}>
                    <InfoCard
                        title="Información Personal"
                        items={personalInfoItems}
                        onEdit={handleEditPersonalInfo}
                    />
                </Grid>

                {/* Requirements List */}
                <Grid item xs={12} md={4}>
                    <RequirementsCard
                        requirements={requirements}
                        onView={handleRequirementView}
                        onEdit={handleRequirementEdit}
                        onAction={handleRequirementAction}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentProfile;
