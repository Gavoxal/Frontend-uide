import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Chip,
    Paper,
    Box,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const DefenseList = ({ defenses, onSelectDefense }) => {
    if (!defenses || defenses.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No tiene defensas asignadas.
                </Typography>
            </Box>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'PROGRAMADA': return 'primary';
            case 'REALIZADA': return 'info';
            case 'APROBADA': return 'success';
            case 'RECHAZADA': return 'error';
            case 'PENDIENTE': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'transparent' }}>
            <List sx={{ p: 0 }}>
                {defenses.map((defense, index) => (
                    <React.Fragment key={defense.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem
                            alignItems="flex-start"
                            secondaryAction={
                                <IconButton edge="end" aria-label="details" onClick={() => onSelectDefense(defense)}>
                                    <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                            }
                            sx={{
                                bgcolor: 'background.paper',
                                mb: 1,
                                borderRadius: 2,
                                transition: '0.2s',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 1
                                }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: defense.tipo === 'PUBLICA' ? 'secondary.main' : 'primary.main' }}>
                                    <SchoolIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                        <Typography variant="subtitle1" component="span" fontWeight="600">
                                            {defense.tema}
                                        </Typography>
                                        <Chip
                                            label={defense.tipo}
                                            size="small"
                                            color={defense.tipo === 'PUBLICA' ? 'secondary' : 'primary'}
                                            variant="outlined"
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                        <Chip
                                            label={defense.estado}
                                            size="small"
                                            color={getStatusColor(defense.estado)}
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box component="span" display="flex" flexDirection="column" gap={0.5}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <AssignmentIcon fontSize="small" color="action" />
                                                <Typography variant="body2" component="span">
                                                    {defense.estudiante}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <AssignmentIcon fontSize="small" color="action" />
                                                <Typography variant="body2" component="span">
                                                    Rol: <strong>{defense.rol}</strong>
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <EventIcon fontSize="small" color="action" />
                                                <Typography variant="body2" component="span">
                                                    {defense.fecha ? new Date(defense.fecha).toLocaleDateString() : 'Fecha por definir'}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <AccessTimeIcon fontSize="small" color="action" />
                                                <Typography variant="body2" component="span">
                                                    {defense.hora ? new Date(defense.hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <RoomIcon fontSize="small" color="action" />
                                                <Typography variant="body2" component="span">
                                                    {defense.aula || 'Aula por asignar'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {defense.calificacion && (
                                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                                <CheckCircleOutlineIcon fontSize="small" color="success" />
                                                <Typography variant="body2" component="span" color="success.main" fontWeight="500">
                                                    Calificación: {defense.calificacion}/10
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                }
                            />
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

export default DefenseList;
