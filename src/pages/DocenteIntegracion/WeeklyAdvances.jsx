import { useState } from 'react';
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
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { weeksData } from './mockWeeks';
import { useNavigate } from 'react-router-dom';

function WeeklyAdvances() {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleReviewClick = (weekId, studentId) => {
        navigate(`/docente-integracion/review/${weekId}/${studentId}`);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'reviewed':
                return <Chip icon={<CheckCircleIcon />} label="Revisado" color="success" size="small" />;
            case 'pending':
                return <Chip icon={<PendingIcon />} label="Pendiente" color="warning" size="small" />;
            default:
                return <Chip label={status} size="small" />;
        }
    };

    // Validación de seguridad para la data
    if (!weeksData || weeksData.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    No se pudieron cargar los datos de las semanas.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ p: 3 }}>
                {weeksData.map((week) => {
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
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: student.status === 'reviewed' ? '#4caf50' : '#ff9800' }}>
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
                                                                <Typography component="span" variant="body2" color="text.primary">
                                                                    {student.tema}
                                                                </Typography>
                                                                {` — Enviado el: ${student.submittedAt}`}
                                                            </>
                                                        }
                                                    />

                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ ml: 2, alignSelf: 'center', bgcolor: '#000A9B' }}
                                                        onClick={() => handleReviewClick(week.id, student.id)}
                                                    >
                                                        Revisar
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
