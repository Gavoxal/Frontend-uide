import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Accordion, AccordionSummary, AccordionDetails, Chip, Button, Divider, CircularProgress, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ProposalService } from '../../services/proposal.service';
import { ActivityService } from '../../services/activity.service';

function StudentActivities() {
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Obtener la propuesta aprobada del estudiante
            const proposals = await ProposalService.getAll();
            const approvedProposal = proposals.find(p => p.estado === 'APROBADA');

            if (!approvedProposal) {
                setError("Aún no tienes una propuesta aprobada para realizar el seguimiento de actividades.");
                setLoading(false);
                return;
            }

            // 2. Obtener las actividades de esa propuesta
            const activities = await ActivityService.getByPropuesta(approvedProposal.id);

            // Mapear al formato de la vista (15 semanas o según vengan)
            const mappedWeeks = activities.map((act, index) => ({
                id: act.id,
                title: act.nombre || `Actividad ${index + 1}`,
                status: (act.evidencias?.length > 0 && act.evidencias[0].estado !== 'NO_ENTREGADO')
                    ? (act.evidencias[0].calificacionTutor !== null ? 'Calificado' : 'Pendiente')
                    : (act.fechaEntrega && new Date(act.fechaEntrega) < new Date() ? 'No Entregado' : 'Sin Entregar'),
                score: act.evidencias?.length > 0 ? act.evidencias[0].calificacionTutor : null,
                feedback: act.evidencias?.length > 0 ? act.evidencias[0].feedbackTutor : '',
                file: act.evidencias?.length > 0 ? act.evidencias[0].archivoUrl?.split('/').pop() : null
            }));

            // Si no hay actividades creadas aún, mostrar algo coherente
            if (mappedWeeks.length === 0) {
                // Generar slots vacíos informativos si se desea, o dejar vacío
            }

            setWeeks(mappedWeeks);
        } catch (err) {
            console.error("Error fetching activities:", err);
            setError("Error al cargar las actividades. Por favor, intenta de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = (activityId) => {
        // En una implementación real, esto abriría un diálogo para subir el archivo
        alert(`Iniciando subida para la actividad ${activityId}`);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Seguimiento de Avances
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sube tus evidencias y revisa la retroalimentación de tu tutor.
                </Typography>
            </Box>

            {error && (
                <Alert severity="warning" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    {weeks.length > 0 ? (
                        weeks.map((week) => (
                            <Accordion key={week.id}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {week.title}
                                        </Typography>
                                        <Chip
                                            label={week.status}
                                            size="small"
                                            color={week.status === 'Calificado' ? 'success' : week.status === 'Pendiente' ? 'warning' : week.status === 'No Entregado' ? 'error' : 'default'}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="subtitle2" gutterBottom>Evidencia Cargada</Typography>
                                            {week.file ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                    <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{week.file}</Typography>
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
                                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        ))
                    ) : (
                        !error && (
                            <Card sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No hay actividades programadas actualmente.</Typography>
                            </Card>
                        )
                    )}
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Resumen de Progreso
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Actividades Entregadas</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {weeks.filter(w => w.file).length} / {weeks.length}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Promedio de Notas</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                        {weeks.filter(w => w.score !== null).length > 0
                                            ? (weeks.reduce((acc, curr) => acc + (curr.score || 0), 0) / weeks.filter(w => w.score !== null).length).toFixed(1)
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Alert severity="info" sx={{ mt: 1 }}>
                                    Recuerda mantenerte al día con tus entregas para evitar retrasos en tu titulación.
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
