import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Checkbox,
    Divider,
    Chip,
    IconButton,
    Link
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function FeedbackPanel({ submission, onSubmit, onCancel }) {
    const [feedback, setFeedback] = useState({
        observations: '',
        validationStatus: 'aprobado', // aprobado, correcciones, no_cumplido
        readyForGrading: false
    });

    const handleSubmit = () => {
        onSubmit?.(feedback);
    };

    const getValidationIcon = (status) => {
        const icons = {
            aprobado: <CheckCircleIcon sx={{ color: '#4caf50' }} />,
            correcciones: <WarningIcon sx={{ color: '#ff9800' }} />,
            no_cumplido: <CancelIcon sx={{ color: '#f44336' }} />
        };
        return icons[status];
    };

    const getValidationColor = (status) => {
        const colors = {
            aprobado: '#4caf50',
            correcciones: '#ff9800',
            no_cumplido: '#f44336'
        };
        return colors[status];
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
            {/* Panel Izquierdo - Información del Avance */}
            <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Avance del Estudiante
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Info del estudiante */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Estudiante
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                        {submission?.student || 'No especificado'}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Actividad
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                        {submission?.title || 'Sin título'}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Fecha de Entrega
                    </Typography>
                    <Typography variant="body2">
                        {submission?.submissionDate || 'N/A'}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Archivo/Link */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Archivo del Estudiante
                    </Typography>
                    <Paper sx={{
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box>
                            <Typography variant="body2" fontWeight="500">
                                {submission?.fileName || 'documento.zip'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {submission?.fileSize || '2.5 MB'}
                            </Typography>
                        </Box>
                        <IconButton
                            color="primary"
                            onClick={() => {
                                // Lógica de descarga
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Paper>

                    {submission?.fileLink && (
                        <Box sx={{ mt: 1 }}>
                            <Link href={submission.fileLink} target="_blank" rel="noopener">
                                Abrir enlace del repositorio
                            </Link>
                        </Box>
                    )}
                </Box>

                {/* Comentarios del estudiante */}
                <Box>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Comentarios del Estudiante
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                        <Typography variant="body2" color="text.secondary">
                            {submission?.comments || 'Sin comentarios adicionales'}
                        </Typography>
                    </Paper>
                </Box>
            </Paper>

            {/* Panel Derecho - Feedback del Tutor */}
            <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: 2, backgroundColor: '#fafafa' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Feedback del Tutor
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Observaciones Técnicas */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Observaciones Técnicas
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        placeholder="Escribe tus comentarios, correcciones, felicitaciones o sugerencias..."
                        value={feedback.observations}
                        onChange={(e) => setFeedback({ ...feedback, observations: e.target.value })}
                        sx={{
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#667eea',
                                },
                            },
                        }}
                    />
                </Box>

                {/* Estado de Validación */}
                <Box sx={{ mb: 3 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            <Typography variant="subtitle2" fontWeight="600">
                                Estado de Validación
                            </Typography>
                        </FormLabel>
                        <RadioGroup
                            value={feedback.validationStatus}
                            onChange={(e) => setFeedback({ ...feedback, validationStatus: e.target.value })}
                        >
                            <FormControlLabel
                                value="aprobado"
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ color: '#4caf50' }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="600">
                                                Aprobado (Visto Bueno)
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                El avance es sólido y cumple con lo solicitado
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value="correcciones"
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <WarningIcon sx={{ color: '#ff9800' }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="600">
                                                Requiere Correcciones
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                El estudiante debe volver a subir con ajustes
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value="no_cumplido"
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CancelIcon sx={{ color: '#f44336' }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="600">
                                                No Cumplido
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                No se presentó lo solicitado
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Check de "Listo para Calificación" */}
                <Paper sx={{
                    p: 2,
                    backgroundColor: feedback.readyForGrading ? '#e8f5e9' : 'white',
                    border: `2px solid ${feedback.readyForGrading ? '#4caf50' : '#e0e0e0'}`,
                    transition: 'all 0.3s'
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={feedback.readyForGrading}
                                onChange={(e) => setFeedback({ ...feedback, readyForGrading: e.target.checked })}
                                disabled={feedback.validationStatus !== 'aprobado'}
                            />
                        }
                        label={
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <NotificationsActiveIcon sx={{ fontSize: 20 }} />
                                    <Typography variant="body2" fontWeight="600">
                                        Listo para Calificación
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    Al marcar esto, se notificará automáticamente a la Ing. Lorena (Coordinadora de Integración)
                                </Typography>
                            </Box>
                        }
                    />
                </Paper>

                {/* Botones de acción */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!feedback.observations.trim()}
                        sx={{
                            backgroundColor: getValidationColor(feedback.validationStatus),
                            '&:hover': {
                                backgroundColor: getValidationColor(feedback.validationStatus),
                                filter: 'brightness(0.9)'
                            }
                        }}
                        startIcon={getValidationIcon(feedback.validationStatus)}
                    >
                        Enviar Feedback
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default FeedbackPanel;
