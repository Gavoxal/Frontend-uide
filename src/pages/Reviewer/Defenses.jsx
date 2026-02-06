import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Chip, Avatar, Button } from '@mui/material';
import TextMui from '../../components/text.mui.component';

// Icons
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

function ReviewerDefenses() {

    // Mock Data
    const [defenses] = useState([
        {
            id: 1,
            student: "Ajila Armijos Cristian Xavier",
            topic: "Aplicación móvil para turismo comunitario en Saraguro",
            type: "Defensa Privada",
            date: "2025-02-10",
            time: "10:00 AM",
            classroom: "Aula B-202",
            role: "Miembro del Tribunal",
            status: "scheduled"
        },
        {
            id: 2,
            student: "Maria Fernanda Lopez",
            topic: "Optimización de Algoritmos Genéticos para Rutas de Entrega",
            type: "Defensa Pública",
            date: "2025-02-15",
            time: "15:00 PM",
            classroom: "Auditorio 1",
            role: "Presidente del Tribunal",
            status: "scheduled"
        }
    ]);

    // Helper: Get Initials
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Calendario de Defensas" variant="h4" />
                <TextMui value="Próximas defensas agendadas donde participas como tribunal" variant="body1" />
            </Box>

            <Grid container spacing={3}>
                {defenses.length > 0 ? (
                    defenses.map((defense) => (
                        <Grid item xs={12} md={6} lg={4} key={defense.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
                                {/* Top Banner */}
                                <Box sx={{
                                    height: 8,
                                    bgcolor: defense.type === 'Defensa Pública' ? '#7b1fa2' : '#1976d2',
                                    width: '100%'
                                }} />

                                <CardContent sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: defense.type === 'Defensa Pública' ? '#7b1fa2' : '#1976d2', mr: 2 }}>
                                            {getInitials(defense.student)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {defense.student}
                                            </Typography>
                                            <Chip
                                                label={defense.type}
                                                size="small"
                                                color={defense.type === 'Defensa Pública' ? "secondary" : "primary"}
                                                variant="outlined"
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary', minHeight: 40 }}>
                                        "{defense.topic}"
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#455a64' }}>
                                            <EventIcon color="action" fontSize="small" />
                                            <Typography variant="body2" fontWeight="500">{defense.date}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#455a64' }}>
                                            <AccessTimeIcon color="action" fontSize="small" />
                                            <Typography variant="body2" fontWeight="500">{defense.time}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#455a64' }}>
                                            <LocationOnIcon color="action" fontSize="small" />
                                            <Typography variant="body2">{defense.classroom}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#455a64', mt: 1, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                            <SchoolIcon color="action" fontSize="small" />
                                            <Typography variant="caption" fontWeight="bold">Rol: {defense.role}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography color="text.secondary" align="center">No tienes defensas programadas próximas.</Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default ReviewerDefenses;
