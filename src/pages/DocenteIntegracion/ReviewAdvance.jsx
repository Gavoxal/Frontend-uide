import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, TextField, Button, IconButton, Divider, Chip, CircularProgress, Alert, Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import { ActivityService } from '../../services/activity.service';

function ReviewAdvance() {
    const { studentId: evidenciaId } = useParams();
    const navigate = useNavigate();
    const [evidencia, setEvidencia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [grade, setGrade] = useState('');
    const [comment, setComment] = useState('');
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await ActivityService.getById(evidenciaId);
            setEvidencia(data);
            setGrade(data.calificacionDocente || '');
            setComment(data.feedbackDocente || '');
        } catch (error) {
            console.error("Error loading evidence:", error);
            setAlert({ open: true, message: 'Error al cargar la evidencia', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (evidenciaId) loadData();
    }, [evidenciaId]);

    const getFileIcon = (url) => {
        if (!url) return <InsertDriveFileIcon sx={{ fontSize: 30 }} />;
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.endsWith('.pdf')) return <PictureAsPdfIcon sx={{ color: '#F40F02', fontSize: 30 }} />;
        if (lowerUrl.endsWith('.zip') || lowerUrl.endsWith('.rar')) return <InsertDriveFileIcon sx={{ color: '#4CAF50', fontSize: 30 }} />;
        return <InsertDriveFileIcon sx={{ fontSize: 30 }} />;
    };

    const handleSave = async () => {
        if (!grade || isNaN(grade) || grade < 0 || grade > 10) {
            setAlert({ open: true, message: 'Por favor ingresa una calificación válida (0-10)', severity: 'warning' });
            return;
        }

        setSaving(true);
        try {
            await ActivityService.gradeEvidenciaDocente(evidenciaId, {
                grade: Number(grade),
                comment: comment
            });
            setAlert({ open: true, message: 'Evaluación guardada correctamente', severity: 'success' });
            loadData();
        } catch (error) {
            console.error("Error saving evaluation:", error);
            setAlert({ open: true, message: 'Error al guardar la evaluación', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    if (!evidencia) return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error">Evidencia no encontrada</Typography>
            <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Volver</Button>
        </Box>
    );

    const student = evidencia.actividad?.propuesta?.estudiante;
    const studentName = student ? `${student.nombres} ${student.apellidos}` : 'Estudiante';
    const fileName = evidencia.archivoUrl ? evidencia.archivoUrl.split('/').pop() : 'documento';

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F4F6F8' }}>
            <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: '#000A9B' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" color="#000A9B" fontWeight="bold">
                        Revisión de Avances
                    </Typography>
                </Box>
                <IconButton><NotificationsNoneIcon /></IconButton>
            </Paper>

            <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h4" fontWeight="bold">
                                    Semana {evidencia.semana}: {evidencia.actividad?.nombre || 'Entrega'}
                                </Typography>
                                <Chip
                                    label={evidencia.estadoRevisionDocente || 'PENDIENTE'}
                                    color={evidencia.estadoRevisionDocente === 'APROBADO' ? 'success' : 'warning'}
                                    sx={{ fontWeight: 'bold', borderRadius: 1 }}
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                                Estudiante: <b>{studentName}</b>
                            </Typography>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Contenido de la Entrega</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                                {evidencia.contenido || 'Sin descripción.'}
                            </Typography>
                        </Paper>

                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>Archivo entregado</Typography>
                        {evidencia.archivoUrl ? (
                            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {getFileIcon(evidencia.archivoUrl)}
                                    <Typography variant="subtitle1" fontWeight="bold">{fileName}</Typography>
                                </Box>
                                <Button
                                    component="a"
                                    href={evidencia.archivoUrl}
                                    target="_blank"
                                    startIcon={<DownloadIcon />}
                                >
                                    Abrir
                                </Button>
                            </Paper>
                        ) : (
                            <Typography variant="body2" color="gray">No hay archivo.</Typography>
                        )}

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>Historial de Observaciones</Typography>
                            {evidencia.comentarios?.length > 0 ? (
                                evidencia.comentarios.map((c, i) => (
                                    <Paper key={i} sx={{ p: 2, mb: 1, bgcolor: '#f5f5f5' }}>
                                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {c.usuario?.nombres} ({c.usuario?.rol})
                                        </Typography>
                                        <Typography variant="body2">{c.descripcion}</Typography>
                                    </Paper>
                                ))
                            ) : (
                                <Typography variant="body2" color="gray">Sin observaciones.</Typography>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">✏️ Evaluación</Typography>
                            <Box sx={{ my: 3, textAlign: 'center' }}>
                                <TextField
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    type="number"
                                    label="Nota (0-10)"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                {evidencia.calificacionTutor && (
                                    <Typography variant="caption" display="block">
                                        Nota Tutor: {evidencia.calificacionTutor}
                                    </Typography>
                                )}
                            </Box>
                            <TextField
                                multiline rows={4} fullWidth
                                label="Observaciones Técnicas"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSave}
                                disabled={saving}
                                startIcon={<SaveIcon />}
                                sx={{ bgcolor: '#000A9B' }}
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            </Box>

            <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
                <Alert severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default ReviewAdvance;
