import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, Divider, Paper, Avatar,
    Chip, List, ListItem, ListItemAvatar, ListItemText, Snackbar,
    Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Grid, useTheme, useMediaQuery, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { apiFetch } from '../../services/api';
import { DefenseService } from '../../services/defense.service';
import { getDataUser } from '../../storage/user.model.jsx';

function DefenseGradingModal({ open, onClose, student, type, onSave }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [observations, setObservations] = useState('');
    const [calificacion, setCalificacion] = useState('');
    const [userRole, setUserRole] = useState('');
    const [juryComments, setJuryComments] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedDocType, setSelectedDocType] = useState('tesis');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (open && student) {
            // Get user role from storage
            const userData = getDataUser();
            setUserRole(userData?.rol || '');

            loadDocument(selectedDocType);
            loadJuryComments();
        }
    }, [open, student, selectedDocType]);

    const loadJuryComments = async () => {
        try {
            const defense = type === 'private' ? student.privateDefense : student.publicDefense;
            if (!defense || !defense.id) return;

            // Fetch comments from jury members for this defense
            const endpoint = type === 'private' ? 'privada' : 'publica';
            const res = await apiFetch(`/api/v1/defensas/${endpoint}/${defense.id}/comentarios`);
            if (res.ok) {
                const data = await res.json();
                setJuryComments(data || []);
            }
        } catch (error) {
            console.error('Error loading jury comments:', error);
            setJuryComments([]);
        }
    };

    const loadDocument = async (docType) => {
        const doc = student.documents[docType];
        if (!doc) {
            setPdfUrl(null);
            return;
        }

        try {
            setLoading(true);
            const fileName = doc.urlArchivo.split('/').pop();
            const res = await apiFetch(`/api/v1/entregables/file/${fileName}`);
            if (!res.ok) throw new Error('Error al cargar documento');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error loading PDF:", error);
            setSnackbar({ open: true, message: 'No se pudo cargar el visor de PDF', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEvaluation = async (status) => {
        if (!observations.trim()) {
            setSnackbar({ open: true, message: "Por favor escribe una observación o calificación.", severity: "warning" });
            return;
        }

        setSubmitting(true);
        try {
            // Determinar ID de evaluación según el tipo (Privada o Pública)
            const defense = type === 'private' ? student.privateDefense : student.publicDefense;

            if (!defense || !defense.id) {
                throw new Error('ID de la defensa no encontrado');
            }

            // Obtener rol del usuario actual del storage
            const userData = getDataUser();
            const userRole = userData?.rol || '';

            // Determinar si es Director/Coordinador o Jurado/Tutor
            const isDirector = userRole === 'DIRECTOR' || userRole === 'COORDINADOR';

            // Validar que haya ingresado una calificación válida (para todos)
            if (!calificacion || parseFloat(calificacion) < 0 || parseFloat(calificacion) > 10) {
                setSnackbar({ open: true, message: "Por favor ingrese una calificación válida entre 0 y 10.", severity: "warning" });
                setSubmitting(false);
                return;
            }

            if (isDirector) {
                // Director/Coordinador: primero califica y luego finaliza
                await DefenseService.calificarDefensa(
                    type === 'private' ? 'PRIVADA' : 'PUBLICA',
                    defense.id,
                    {
                        calificacion: parseFloat(calificacion),
                        comentario: observations
                    }
                );

                // Luego puede aprobar/rechazar la defensa completa
                await DefenseService.finalizeDefense(
                    type === 'private' ? 'PRIVADA' : 'PUBLICA',
                    defense.id,
                    {
                        estado: status,
                        comentarios: observations
                    }
                );
            } else {
                // Jurado/Tutor: solo puede calificar individualmente
                await DefenseService.calificarDefensa(
                    type === 'private' ? 'PRIVADA' : 'PUBLICA',
                    defense.id,
                    {
                        calificacion: parseFloat(calificacion),
                        comentario: observations
                    }
                );
            }


            setSnackbar({ open: true, message: "Defensa calificada exitosamente.", severity: "success" });
            // Cerrar modal primero para evitar parpadeos
            setTimeout(() => {
                onClose();
                // Recargar datos después de cerrar el modal
                if (onSave) onSave();
            }, 1500);
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: "Error al calificar la defensa.", severity: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={true}
            maxWidth="xl"
            PaperProps={{
                sx: { bgcolor: '#f5f7fa' }
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 1.5,
                bgcolor: '#fff',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexShrink: 0,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                zIndex: 10
            }}>
                <IconButton onClick={onClose} color="inherit">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flex: 1, fontWeight: '800', color: '#1a237e' }}>
                    Calificación de Defensa {type === 'private' ? 'Privada' : 'Pública'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {['tesis', 'userManual', 'scientificArticle'].map((docKey) => (
                        <Button
                            key={docKey}
                            size="small"
                            variant={selectedDocType === docKey ? 'contained' : 'outlined'}
                            color={student?.documents[docKey] ? 'primary' : 'inherit'}
                            disabled={!student?.documents[docKey]}
                            onClick={() => setSelectedDocType(docKey)}
                            sx={{ borderRadius: '20px', textTransform: 'none' }}
                        >
                            {docKey === 'tesis' ? 'Tesis' : docKey === 'userManual' ? 'Manual' : 'Artículo'}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* Content Split */}
            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: PDF Viewer (65%) */}
                <Box sx={{
                    flex: 0.65,
                    bgcolor: '#525659',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRight: '1px solid #e0e0e0'
                }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirecton: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                            <CircularProgress color="inherit" sx={{ color: '#fff' }} />
                            <Typography sx={{ color: '#fff' }}>Cargando visor de documentos...</Typography>
                        </Box>
                    ) : pdfUrl ? (
                        <iframe
                            src={`${pdfUrl}#toolbar=0`}
                            title="PDF Viewer"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <Box sx={{
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 1
                        }}>
                            <DescriptionIcon sx={{ fontSize: 60, opacity: 0.3 }} />
                            <Typography sx={{ opacity: 0.5 }}>Documento no disponible para visualización</Typography>
                        </Box>
                    )}
                </Box>

                {/* Right: Details & Grading (35%) */}
                <Box sx={{
                    flex: 0.35,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fff',
                    overflow: 'hidden'
                }}>
                    {/* Student Info Card */}
                    <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', background: 'linear-gradient(to bottom, #fafafa, #ffffff)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.main', boxShadow: '0 4px 10px rgba(25,118,210,0.2)' }}>
                                {student?.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#2c3e50', lineHeight: 1.2 }}>
                                    {student?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {student?.career}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                            Tema de Tesis
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, borderLeft: '4px solid #1a237e' }}>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#444' }}>
                                "{student?.topic}"
                            </Typography>
                        </Box>
                    </Box>

                    {/* Grading Section */}
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Jury Comments Section (for Directors/Coordinators) */}
                        {(userRole === 'DIRECTOR' || userRole === 'COORDINADOR') && juryComments.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" fontWeight="800" gutterBottom>
                                    COMENTARIOS DEL JURADO
                                </Typography>
                                <Box sx={{ maxHeight: 200, overflowY: 'auto', bgcolor: '#f8f9fa', borderRadius: 2, p: 2 }}>
                                    {juryComments.map((comment, idx) => (
                                        <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: idx < juryComments.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" fontWeight="bold" color="primary">
                                                    {comment.nombreJurado || 'Jurado'}
                                                </Typography>
                                                {comment.calificacion && (
                                                    <Chip size="small" label={`${comment.calificacion}/100`} color="primary" />
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {comment.comentario || comment.observaciones || 'Sin comentarios'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Grade Input (for all roles) */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="800" gutterBottom>
                                CALIFICACIÓN (0-10)
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Ingrese calificación numérica"
                                variant="outlined"
                                value={calificacion}
                                onChange={(e) => setCalificacion(e.target.value)}
                                inputProps={{ min: 0, max: 10, step: 0.1 }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#fcfcfc'
                                    }
                                }}
                            />
                        </Box>

                        {/* Observations/Comments Section */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="800" gutterBottom>
                                {userRole === 'DIRECTOR' || userRole === 'COORDINADOR' ? 'OBSERVACIONES FINALES' : 'COMENTARIOS'}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={8}
                                placeholder={
                                    userRole === 'DIRECTOR' || userRole === 'COORDINADOR'
                                        ? "Escriba aquí los comentarios finales de la defensa..."
                                        : "Escriba aquí sus comentarios y observaciones técnicas sobre la defensa..."
                                }
                                variant="outlined"
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#fcfcfc'
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mt: 'auto' }}>
                            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                                Al calificar, se enviará una notificación con el resultado al estudiante.
                            </Alert>
                        </Box>
                    </Box>

                    {/* Actions Area */}
                    <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
                        {userRole === 'DIRECTOR' || userRole === 'COORDINADOR' ? (
                            // Director/Coordinador: Approve/Reject buttons
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    size="large"
                                    startIcon={<CancelIcon />}
                                    onClick={() => handleSaveEvaluation('REPROBADA')}
                                    disabled={submitting}
                                    sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold' }}
                                >
                                    Reprobar
                                </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleSaveEvaluation('APROBADA')}
                                        disabled={submitting}
                                        sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(46,125,50,0.2)' }}
                                    >
                                        Aprobar
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="warning"
                                        onClick={() => handleSaveEvaluation('APROBADA_CON_COMENTARIOS')}
                                        disabled={submitting}
                                        sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold' }}
                                    >
                                        Aprobar con Observaciones
                                    </Button>
                                </Grid>
                            </Grid>
                        ) : (
                            // Tutor/Jurado: Submit Grade button
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<SendIcon />}
                                onClick={() => handleSaveEvaluation('CALIFICADO')}
                                disabled={submitting}
                                sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(25,118,210,0.2)' }}
                            >
                                Enviar Calificación
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}

export default DefenseGradingModal;
