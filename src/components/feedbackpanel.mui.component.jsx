import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton,
    MenuItem
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function FeedbackPanel({ submission, onSubmit, onCancel, hideRating = false, sectionTitle = "Avance del Estudiante", statusOptions = [] }) {
    const [feedback, setFeedback] = useState({
        observations: submission?.tutorComments || '',
        rating: submission?.grade || '',
        status: submission?.status || (statusOptions.length > 0 ? statusOptions[0].value : '')
    });

    const handleSubmit = () => {
        onSubmit?.(feedback);
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
            {/* Panel Izquierdo - Información */}
            <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {sectionTitle}
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
                        {hideRating ? 'Título de Propuesta' : 'Actividad'}
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
                        {hideRating ? 'Documento Asociado' : 'Archivo del Estudiante'}
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
                            disabled={!submission?.fileLink}
                            onClick={() => {
                                if (submission?.fileLink) {
                                    // Si es una ruta relativa de API, asegurar que sea absoluta o correcta
                                    // Asumiendo que fileLink es "/api/v1/..."
                                    const url = submission.fileLink.startsWith('http')
                                        ? submission.fileLink
                                        : `${window.location.origin}${submission.fileLink}`;
                                    window.open(url, '_blank');
                                }
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Paper>
                </Box>

                {/* Comentarios del estudiante */}
                <Box>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        {hideRating ? 'Descripción de la Propuesta' : 'Comentarios del Estudiante'}
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

                {/* Estado/Decisión (Si hay opciones) */}
                {statusOptions.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                            Decisión / Estado
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            value={feedback.status}
                            onChange={(e) => setFeedback({ ...feedback, status: e.target.value })}
                            sx={{ backgroundColor: 'white' }}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                )}

                {/* Calificación - Condicional (Solo si NO se oculta) */}
                {!hideRating && (
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
                )}

                {/* Historial de Observaciones */}
                {submission?.historicalComments?.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                            Historial de Observaciones
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
                        {hideRating ? 'Comentarios / Aprobación' : 'Nueva Observación Técnica'}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        placeholder="Escribe tus comentarios..."
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
                        disabled={
                            !feedback.observations.trim() ||
                            (!hideRating && !feedback.rating) ||
                            (statusOptions.length > 0 && !feedback.status)
                        }
                        sx={{
                            backgroundColor: '#667eea',
                            '&:hover': {
                                backgroundColor: '#5a6fd6',
                            }
                        }}
                        startIcon={<CheckCircleIcon />}
                    >
                        {hideRating ? 'Enviar Evaluación' : 'Enviar Evaluación'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default FeedbackPanel;
