import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Accordion, AccordionSummary, AccordionDetails, Chip, Button, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

function StudentActivities() {
    // Mock Data for 15 weeks
    const [weeks, setWeeks] = useState(
        Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            title: `Semana ${i + 1}`,
            status: i < 2 ? 'Calificado' : i === 2 ? 'Pendiente' : 'Bloqueado',
            score: i < 2 ? 10 : null,
            feedback: i < 2 ? 'Buen trabajo, sigue así.' : '',
            file: i < 2 ? 'avance_sem' + (i + 1) + '.pdf' : null
        }))
    );

    const handleUpload = (weekId) => {
        alert(`Subiendo evidencia para la Semana ${weekId}`);
        // Logic to update state would go here
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Seguimiento de Avances (15 Semanas)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sube tus evidencias semanales y revisa la retroalimentación de tu tutor (RF-007).
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {weeks.map((week) => (
                        <Accordion key={week.id} disabled={week.status === 'Bloqueado'}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {week.title}
                                    </Typography>
                                    <Chip
                                        label={week.status}
                                        size="small"
                                        color={week.status === 'Calificado' ? 'success' : week.status === 'Pendiente' ? 'warning' : 'default'}
                                        variant={week.status === 'Bloqueado' ? 'outlined' : 'filled'}
                                    />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" gutterBottom>Evidencia Cargada</Typography>
                                        {week.file ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                                <CheckCircleIcon color="success" fontSize="small" />
                                                <Typography variant="body2">{week.file}</Typography>
                                            </Box>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                onClick={() => handleUpload(week.id)}
                                                fullWidth
                                            >
                                                Subir Evidencia (PDF)
                                            </Button>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" gutterBottom>Retroalimentación</Typography>
                                        {week.feedback ? (
                                            <Typography variant="body2" color="text.secondary">
                                                "{week.feedback}"
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                                Sin comentarios aún.
                                            </Typography>
                                        )}
                                        {week.score !== null && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="subtitle2" component="span">Calificación: </Typography>
                                                <Typography variant="subtitle2" component="span" color="primary">{week.score}/10</Typography>
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Resumen de Progreso
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Semanas Completadas</Typography>
                                    <Typography variant="body2" fontWeight="bold">2 / 15</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Promedio Actual</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="primary">10.0</Typography>
                                </Box>
                                <Divider />
                                <Alert severity="info" sx={{ mt: 1 }}>
                                    Recuerda que debes completar las 15 semanas para habilitar la defensa final.
                                </Alert>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentActivities;
