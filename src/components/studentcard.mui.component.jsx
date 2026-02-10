import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function StudentCard({ student, onPlan, onReview }) {
    // Determinar color del semáforo
    const getStatusColor = (status) => {
        const colors = {
            green: '#4caf50',
            yellow: '#ff9800',
            red: '#f44336'
        };
        return colors[status] || '#9e9e9e';
    };

    const getStatusText = (status) => {
        const texts = {
            green: 'Al día',
            yellow: 'Pendiente de revisión',
            red: 'Retrasado'
        };
        return texts[status] || 'Sin estado';
    };

    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: 2,
            height: '100%',
            transition: 'all 0.3s',
            '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-4px)'
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                {/* Header con nombre y semáforo */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {student.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {student.career}
                        </Typography>
                    </Box>

                    {/* Semáforo de estado */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: `${getStatusColor(student.status)}15`,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2
                    }}>
                        <FiberManualRecordIcon
                            sx={{
                                fontSize: 16,
                                color: getStatusColor(student.status),
                                animation: student.status === 'yellow' ? 'pulse 2s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.5 }
                                }
                            }}
                        />
                        <Typography variant="caption" fontWeight="600" color={getStatusColor(student.status)}>
                            {getStatusText(student.status)}
                        </Typography>
                    </Box>
                </Box>

                {/* Tema de tesis */}
                <Box sx={{
                    backgroundColor: '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                    mb: 2,
                    borderLeft: `4px solid ${getStatusColor(student.status)}`
                }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Tema de Tesis
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                        {student.thesis}
                    </Typography>
                </Box>

                {/* Último avance */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        Último Avance
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="500">
                            {student.lastActivity?.title || 'Sin actividad reciente'}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {student.lastActivity?.date || 'N/A'}
                    </Typography>
                </Box>

                {/* Semana actual */}
                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={`Semana ${student.weekNumber || 0}/16`}
                        size="small"
                        sx={{
                            backgroundColor: '#667eea',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Box>

                {/* Botones de acción */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AssignmentIcon />}
                        onClick={() => onPlan?.(student)}
                        sx={{ flex: 1 }}
                    >
                        Planificar
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<RateReviewIcon />}
                        onClick={() => onReview?.(student)}
                        sx={{
                            flex: 1,
                            backgroundColor: getStatusColor(student.status),
                            '&:hover': {
                                backgroundColor: getStatusColor(student.status),
                                filter: 'brightness(0.9)'
                            }
                        }}
                    >
                        Revisar
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default StudentCard;
