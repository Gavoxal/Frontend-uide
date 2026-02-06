import React, { useState } from "react";
import { Box, Typography, Grid, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkIcon from '@mui/icons-material/Work';

// Import Components
import ProfileHeader from "../../components/Profile/ProfileHeader";
import InfoCard from "../../components/Profile/InfoCard";

function ReviewerProfile() {
    // Mock user data
    const [user] = useState({
        name: "PhD. Laura Méndez",
        email: "laura.mendez@uide.edu.ec",
        role: "Docente Revisor",
        phone: "0987654321",
        location: "Campus UIDE - Quito",
        department: "Facultad de Ingeniería",
        specialty: "Inteligencia Artificial y Data Science"
    });

    const handleEditProfile = () => {
        alert("Editar Perfil - Funcionalidad pendiente");
    };

    const handleEditCover = () => {
        alert("Cambiar Portada - Funcionalidad pendiente");
    };

    return (
        <Box maxWidth="lg" sx={{ mx: "auto", pb: 4 }}>
            {/* Profile Header Card */}
            <ProfileHeader
                name={user.name}
                subtitle={user.role}
                initials="LM"
                tags={[user.department, user.specialty]}
                onEditProfile={handleEditProfile}
                onEditCover={handleEditCover}
            />

            <Grid container spacing={3}>
                {/* Left Column: Personal Info */}
                <Grid item xs={12} md={4}>
                    <InfoCard
                        title="Información de Contacto"
                        items={[
                            { icon: <EmailIcon color="action" />, label: "Correo Institucional", value: user.email },
                            { icon: <PhoneIcon color="action" />, label: "Teléfono", value: user.phone },
                            { icon: <LocationOnIcon color="action" />, label: "Ubicación", value: user.location }
                        ]}
                    />

                    <Box mt={3}>
                        <InfoCard
                            title="Detalles Académicos"
                            items={[
                                { icon: <WorkIcon color="action" />, label: "Departamento", value: user.department },
                                { icon: <SchoolIcon color="action" />, label: "Especialidad", value: user.specialty }
                            ]}
                        />
                    </Box>
                </Grid>

                {/* Right Column: Stats & Activity */}
                <Grid item xs={12} md={8}>
                    {/* Stats Row */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h4" fontWeight="bold">5</Typography>
                                <Typography variant="body2">Propuestas Revisadas</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 2, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h4" fontWeight="bold">3</Typography>
                                <Typography variant="body2">Defensas Asignadas</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h4" fontWeight="bold">Active</Typography>
                                <Typography variant="body2">Estado Actual</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <InfoCard
                        title="Actividad Reciente"
                        items={[
                            {
                                icon: <AssignmentIcon color="primary" />,
                                label: "Revisión Completada",
                                value: "Propuesta: Sistema de Gestión - Eduardo Pardo (Hace 2 días)"
                            },
                            {
                                icon: <SchoolIcon color="secondary" />,
                                label: "Defensa Asignada",
                                value: "Tribunal: Maria Fernanda Lopez - 15 Feb 2025"
                            }
                        ]}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ReviewerProfile;
