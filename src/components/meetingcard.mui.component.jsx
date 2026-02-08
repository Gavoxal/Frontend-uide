import React from 'react';
import { Card, CardContent, Box, Typography, Chip, IconButton, Divider, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import VideocamIcon from '@mui/icons-material/Videocam';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

function MeetingCard({ meeting, onView, onEdit, onExportPdf }) {
    const getModalityIcon = (modality) => {
        return modality === 'virtual' ? <VideocamIcon /> : <MeetingRoomIcon />;
    };

    const getModalityColor = (modality) => {
        return modality === 'virtual' ? '#2196f3' : '#4caf50';
    };

    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: 2,
            transition: 'all 0.3s',
            '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                {/* Header con fecha y modalidad */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <EventIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="h6" fontWeight="bold">
                                {meeting.date}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {meeting.startTime} - {meeting.endTime}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Chip de modalidad */}
                    <Chip
                        icon={getModalityIcon(meeting.modality)}
                        label={meeting.modality === 'virtual' ? 'Virtual' : 'Presencial'}
                        size="small"
                        sx={{
                            backgroundColor: `${getModalityColor(meeting.modality)}15`,
                            color: getModalityColor(meeting.modality),
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                                color: getModalityColor(meeting.modality)
                            }
                        }}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Estudiante */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ fontSize: 20, color: '#667eea' }} />
                    <Typography variant="body2" fontWeight="600">
                        {meeting.studentName}
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {/* Columna Izquierda: Resumen */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                Resumen
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {meeting.summary}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Columna Derecha: Compromisos y Asistencia */}
                    <Grid item xs={12} md={6} sx={{ borderLeft: { md: '1px solid #eee' }, pl: { md: 2 } }}>
                        {meeting.commitments && meeting.commitments.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                    Compromisos ({meeting.commitments.length})
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    {meeting.commitments.slice(0, 3).map((commitment, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <Box sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: '#667eea',
                                                mt: 0.7,
                                                flexShrink: 0
                                            }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {commitment}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {meeting.commitments.length > 3 && (
                                        <Typography variant="caption" color="primary" sx={{ ml: 2 }}>
                                            +{meeting.commitments.length - 3} más
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {/* Asistencia */}
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={meeting.attended ? 'Estudiante asistió' : 'No asistió'}
                                size="small"
                                sx={{
                                    backgroundColor: meeting.attended ? '#e8f5e9' : '#ffebee',
                                    color: meeting.attended ? '#4caf50' : '#f44336',
                                    fontWeight: 600
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Botones de acción */}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton
                        size="small"
                        onClick={() => onView?.(meeting)}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#e0e0e0'
                            }
                        }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => onEdit?.(meeting)}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#e0e0e0'
                            }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => onExportPdf?.(meeting)}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#e0e0e0'
                            }
                        }}
                    >
                        <PictureAsPdfIcon fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}

export default MeetingCard;
