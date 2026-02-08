import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function FeedbackPanel({ submission, onSubmit, onCancel }) {
    const [feedback, setFeedback] = useState({
        observations: ''
    });

    const handleSubmit = () => {
        onSubmit?.(feedback);
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

                    {/* Link eliminado */}
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

                {/* Secciones de Validación y Listo para Calificación eliminadas */}

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
                            backgroundColor: '#667eea',
                            '&:hover': {
                                backgroundColor: '#5a6fd6',
                            }
                        }}
                        startIcon={<CheckCircleIcon />}
                    >
                        Enviar Observaciones
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default FeedbackPanel;
