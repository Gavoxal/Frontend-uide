import { Box, Typography, Grid } from "@mui/material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Work as WorkIcon,
    DateRange as DateRangeIcon
} from "@mui/icons-material";
import { useState } from "react";
import { getDataUser } from "../../storage/user.model.jsx";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import InfoCard from "../../components/Profile/InfoCard";

function TutorProfile() {
    const user = getDataUser();

    // Datos del tutor (mock data)
    const [tutorData] = useState({
        name: user?.name || "Dr. Fernando Rodríguez",
        initials: "FR",
        email: user?.email || "tutor@uide.edu.ec",
        cedula: "1234567890",
        sede: "UIDE - Campus Principal",
        especialidad: "Ingeniería de Software y Machine Learning",
        departamento: "Facultad de Ingeniería",
        titulo: "PhD en Ciencias de la Computación",
        status: "Activo",
        telefono: "+593 987654321",
        direccion: "Quito, Ecuador",
        ubicacion: "PICHINCHA, ECUADOR",
        experiencia: "12 años",
        estudiantesAsignados: 6,
        fechaIngreso: "Enero 2015"
    });

    // Preparar items de información profesional
    const professionalInfoItems = [
        { icon: <EmailIcon color="primary" />, label: "Email", value: tutorData.email },
        { icon: <PhoneIcon color="primary" />, label: "Teléfono", value: tutorData.telefono },
        { icon: <LocationIcon color="primary" />, label: "Dirección", value: tutorData.direccion },
        { icon: <SchoolIcon color="primary" />, label: "Sede", value: tutorData.sede },
        { icon: <AssignmentIcon color="primary" />, label: "Cédula", value: tutorData.cedula },
        { icon: <WorkIcon color="primary" />, label: "Especialidad", value: tutorData.especialidad },
        { icon: <SchoolIcon color="primary" />, label: "Título", value: tutorData.titulo },
        { icon: <WorkIcon color="primary" />, label: "Departamento", value: tutorData.departamento },
        { icon: <DateRangeIcon color="primary" />, label: "Ingreso", value: tutorData.fechaIngreso }
    ];

    // Estadísticas del tutor
    const tutorStats = [
        {
            label: "Estudiantes Asignados",
            value: tutorData.estudiantesAsignados,
            color: "#667eea"
        },
        {
            label: "Años de Experiencia",
            value: tutorData.experiencia,
            color: "#4caf50"
        },
        {
            label: "Estado",
            value: tutorData.status,
            color: "#2196f3"
        }
    ];

    // Handlers
    const handleEditProfile = () => {
        console.log("Editar perfil");
    };

    const handleEditCover = () => {
        console.log("Editar portada");
    };

    const handleEditPersonalInfo = () => {
        console.log("Editar información profesional");
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Perfil del Tutor
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gestiona tu información profesional y configuración
                </Typography>
            </Box>

            {/* Profile Header Card */}
            <ProfileHeader
                studentData={tutorData}
                onEditProfile={handleEditProfile}
                onEditCover={handleEditCover}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Professional Information */}
                <Grid item xs={12} md={8}>
                    <InfoCard
                        title="Información Profesional"
                        items={professionalInfoItems}
                        onEdit={handleEditPersonalInfo}
                    />
                </Grid>

                {/* Estadísticas del Tutor */}
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 3,
                            boxShadow: 2,
                            p: 3
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Estadísticas
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {tutorStats.map((stat, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: `${stat.color}15`,
                                        border: `2px solid ${stat.color}30`
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {stat.label}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" sx={{ color: stat.color }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default TutorProfile;
