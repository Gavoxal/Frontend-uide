import { useState, useEffect } from 'react';
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Chip,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useNavigate } from 'react-router-dom';
import { ActivityService } from '../../services/activity.service';

function WeeklyAdvances() {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await ActivityService.getAllEvidencias();

            // Agrupar por semana
            const grouped = data.reduce((acc, ev) => {
                const weekNum = ev.semana || 0;
                if (!acc[weekNum]) {
                    acc[weekNum] = {
                        id: weekNum,
                        label: `Semana ${weekNum}`,
                        students: []
                    };
                }

                acc[weekNum].students.push({
                    id: ev.id, // ID de la evidencia
                    name: ev.actividad?.propuesta?.estudiante
                        ? `${ev.actividad.propuesta.estudiante.nombres} ${ev.actividad.propuesta.estudiante.apellidos}`
                        : 'Estudiante Desconocido',
                    tema: ev.actividad?.propuesta?.titulo || ev.actividad?.nombre || 'Sin título',
                    status: ev.estadoRevisionDocente?.toLowerCase() || 'pending',
                    submittedAt: ev.fechaEntrega?.split('T')[0] || 'N/A'
                });
                return acc;
            }, {});

            const sortedWeeks = Object.values(grouped).sort((a, b) => b.id - a.id);
            setWeeks(sortedWeeks);
        } catch (error) {
            console.error("Error loading weekly advances:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleReviewClick = (evidenciaId) => {
        navigate(`/docente-integracion/review/0/${evidenciaId}`); // weekId is 0 because we have evidenciaId specifically
    };

    const getStatusChip = (status) => {
        const config = {
            aprobado: { icon: <CheckCircleIcon />, label: 'Aprobado', color: 'success' },
            rechazado: { icon: <PendingIcon />, label: 'Rechazado', color: 'error' },
            pendiente: { icon: <PendingIcon />, label: 'Pendiente', color: 'warning' },
            pending: { icon: <PendingIcon />, label: 'Pendiente', color: 'warning' }
        };
        const current = config[status] || config.pendiente;
        return <Chip icon={current.icon} label={current.label} color={current.color} size="small" />;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (weeks.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No se han encontrado entregas de avances todavía.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Avances Semanales 📅
                </Typography>
                {weeks.map((week) => {
                    const pendingCount = week.students.filter(s => s.status === 'pending').length;

                    return (
                        <Accordion
                            key={week.id}
                            expanded={expanded === `panel${week.id}`}
                            onChange={handleChange(`panel${week.id}`)}
                            sx={{ mb: 2, borderRadius: '8px !important', boxShadow: 2 }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: 'rgba(0, 10, 155, 0.05)',
                                    '&.Mui-expanded': { borderBottom: '1px solid rgba(0,0,0,0.1)' }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {week.label}
                                    </Typography>

                                    {pendingCount > 0 && (
                                        <Chip
                                            label={`${pendingCount} pendientes`}
                                            color="error"
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    )}
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    {week.students.length === 0 ? (
                                        <ListItem>
                                            <ListItemText primary="No hay envíos esta semana" sx={{ fontStyle: 'italic', color: 'gray' }} />
                                        </ListItem>
                                    ) : (
                                        week.students.map((student, index) => (
                                            <Box key={student.id}>
                                                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: student.status === 'aprobado' ? '#4caf50' : '#ff9800' }}>
                                                            <AssignmentIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
                                                                    {student.name}
                                                                </Typography>
                                                                {getStatusChip(student.status)}
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <>
                                                                <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block', mt: 0.5 }}>
                                                                    {student.tema}
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    Enviado el: {student.submittedAt}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />

                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ ml: 2, alignSelf: 'center', bgcolor: '#000A9B', textTransform: 'none' }}
                                                        onClick={() => handleReviewClick(student.id)}
                                                    >
                                                        Revisar Avance
                                                    </Button>
                                                </ListItem>
                                                {index < week.students.length - 1 && <Divider variant="inset" component="li" />}
                                            </Box>
                                        ))
                                    )}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        </Box>
    );
}

export default WeeklyAdvances;
