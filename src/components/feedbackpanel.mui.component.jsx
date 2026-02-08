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
        observations: submission?.tutorComments || '',
        rating: submission?.grade || ''
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

                {/* Calificación */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Calificación (0 - 10)
                    </Typography>
                    <TextField
                        type="number"
                        fullWidth
                        placeholder="10"
                        inputProps={{ min: 0, max: 10 }}
                        value={feedback.rating}
                        onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
                        sx={{
                            backgroundColor: 'white'
                        }}
                    />
                </Box>

                {/* Historial de Observaciones Técnicas */}
                {submission?.historicalComments?.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                            Historial de Observaciones Técnicas
                        </Typography>
                        <Box sx={{ maxHeight: 200, overflowY: 'auto', p: 1, backgroundColor: '#f0f2f5', borderRadius: 2 }}>
                            {submission.historicalComments.map((c, i) => (
                                <Box key={i} sx={{ mb: 1, p: 1.5, backgroundColor: 'white', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {c.usuario?.rol || 'Usuario'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {c.usuario ? `${c.usuario.nombres} ${c.usuario.apellidos}` : ''}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.4 }}>
                                        {c.descripcion}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Observaciones Técnicas (Nuevo Feedback) */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Nueva Observación Técnica
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
                        disabled={!feedback.observations.trim() || !feedback.rating}
                        sx={{
                            backgroundColor: '#667eea',
                            '&:hover': {
                                backgroundColor: '#5a6fd6',
                            }
                        }}
                        startIcon={<CheckCircleIcon />}
                    >
                        Enviar Evaluación
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default FeedbackPanel;
