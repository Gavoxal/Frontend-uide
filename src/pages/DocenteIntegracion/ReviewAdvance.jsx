import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Chip,
    Divider,
    IconButton,
    Paper,
    LinearProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ActivityService } from '../../services/activity.service';
import { DocenteService } from '../../services/docente.service';

function DocenteReviewAdvance() {
    const location = useLocation();
    const navigate = useNavigate();
    // Student passed via navigation state
    const student = location.state?.student;

    const [advances, setAdvances] = useState([]);
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (!student) return;

        const fetchAdvances = async () => {
            setLoading(true);
            try {
                // Fetch activities for the student's proposal
                const propId = student.propuestaId || student.propuesta?.id;
                if (!propId) return;

                const activities = await ActivityService.getByPropuesta(propId);

                const mappedAdvances = activities
                    .filter(act => act.tipo === 'DOCENCIA') // Solo mostramos actividades de docencia
                    .map((act, index) => {
                        // Buscar la evidencia más reciente
                        const evidence = act.evidencias && act.evidencias.length > 0
                            ? act.evidencias[act.evidencias.length - 1]
                            : null;

                        if (!evidence) return null; // Solo mostrar si hay evidencia para revisar

                        return {
                            id: evidence.id,
                            activityId: act.id,
                            title: `Semana ${evidence.semana || index + 1}: ${act.nombre}`,
                            date: new Date(evidence.fechaEntrega || evidence.createdAt).toLocaleDateString(),
                            status: evidence.calificacionDocente ? 'calificado' : 'pendiente',
                            file: evidence.archivoUrl,
                            description: evidence.contenido, // Comentario del estudiante
                            grade: evidence.calificacionDocente,
                            feedback: evidence.feedbackDocente,
                            tutorGrade: evidence.calificacionTutor,
                            type: act.tipo // DOCENCIA o TUTORIA
                        };
                    }).filter(item => item !== null);

                setAdvances(mappedAdvances);

                // Seleccionar el primero pendiente, o el primero
                const firstPending = mappedAdvances.find(a => a.status === 'pendiente');
                if (firstPending) {
                    handleSelectAdvance(firstPending);
                } else if (mappedAdvances.length > 0) {
                    handleSelectAdvance(mappedAdvances[0]);
                }

            } catch (error) {
                console.error("Error fetching advances:", error);
                setSnackbar({ open: true, message: 'Error cargando avances', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchAdvances();
    }, [student]);

    const handleSelectAdvance = (advance) => {
        setSelectedAdvance(advance);
        setGrade(advance.grade || '');
        setFeedback(advance.feedback || '');
    };

    const handleSubmitReview = async () => {
        if (!selectedAdvance) return;

        setLoading(true);
        try {
            // Usar endpoint de docente
            await DocenteService.gradeEvidencia(selectedAdvance.id, Number(grade), feedback);

            // También actualizar estado a APROBADO (como hace el tutor) si la nota es buena, o RECHAZADO
            // Opcional, dependiendo de la lógica de negocio.
            // await DocenteService.updateEstadoRevision(selectedAdvance.id, Number(grade) >= 7 ? 'APROBADO' : 'RECHAZADO', feedback);

            setSnackbar({ open: true, message: 'Calificación enviada correctamente', severity: 'success' });

            // Actualizar lista local
            const updatedAdvances = advances.map(adv => {
                if (adv.id === selectedAdvance.id) {
                    return { ...adv, status: 'calificado', grade: Number(grade), feedback: feedback };
                }
                return adv;
            });
            setAdvances(updatedAdvances);

        } catch (error) {
            console.error("Error submitting review:", error);
            setSnackbar({ open: true, message: 'Error al enviar calificación', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!student) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No se ha seleccionado ningún estudiante para revisar.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/docente-integracion/advances')}
                    sx={{ mt: 2, bgcolor: '#000A9B' }}
                >
                    Ir a Lista de Avances
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/docente-integracion/advances')}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Revisión de Avances (Docencia)
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Estudiante: <strong>{student.name}</strong> - {student.thesis}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Lista de Avances */}
                <Card sx={{ flex: '1 1 300px', height: 'fit-content' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Entregas Recibidas
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {loading && advances.length === 0 && <LinearProgress />}
                            {advances.length === 0 && !loading && (
                                <Typography color="text.secondary">No hay entregas disponibles.</Typography>
                            )}
                            {advances.map((advance) => (
                                <Paper
                                    key={advance.id}
                                    onClick={() => handleSelectAdvance(advance)}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        border: selectedAdvance?.id === advance.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                        backgroundColor: selectedAdvance?.id === advance.id ? '#f5f9ff' : 'white',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {advance.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {advance.date}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Chip
                                            label={advance.type}
                                            size="small"
                                            variant="outlined"
                                            color={advance.type === 'DOCENCIA' ? 'secondary' : 'default'}
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip
                                            label={advance.status === 'calificado' ? 'Calificado' : 'Pendiente'}
                                            color={advance.status === 'calificado' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                {/* Área de Revisión */}
                <Card sx={{ flex: '2 1 600px' }}>
                    <CardContent sx={{ p: 4 }}>
                        {selectedAdvance ? (
                            <>
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {selectedAdvance.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Entregado el: {selectedAdvance.date}
                                    </Typography>

                                    <Paper sx={{ p: 3, bgcolor: '#f8f9fa', mb: 3 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Comentarios del Estudiante:
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedAdvance.description}
                                        </Typography>
                                    </Paper>

                                    {selectedAdvance.file && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            href={selectedAdvance.file}
                                            target="_blank"
                                            sx={{ mb: 3 }}
                                        >
                                            Descargar Archivo Adjunto
                                        </Button>
                                    )}

                                    {selectedAdvance.tutorGrade && (
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Nota del Tutor: <strong>{selectedAdvance.tutorGrade}</strong>
                                        </Alert>
                                    )}
                                </Box>

                                <Divider sx={{ mb: 4 }} />

                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Evaluación Docente
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            label="Calificación (0-10)"
                                            type="number"
                                            fullWidth
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            inputProps={{ min: 0, max: 10, step: 0.1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Retroalimentación"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            placeholder="Escribe tus observaciones para el estudiante..."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SendIcon />}
                                            fullWidth
                                            size="large"
                                            onClick={handleSubmitReview}
                                            disabled={loading}
                                            sx={{
                                                backgroundColor: '#1976d2',
                                                py: 1.5
                                            }}
                                        >
                                            {loading ? 'Enviando...' : 'Enviar Evaluación'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', opacity: 0.5 }}>
                                <AttachFileIcon sx={{ fontSize: 60, mb: 2 }} />
                                <Typography variant="h6">Selecciona una entrega para revisar</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default DocenteReviewAdvance;
