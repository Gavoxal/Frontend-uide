import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Alert,
    CircularProgress,
    Paper,
    LinearProgress
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { DefenseService } from '../../services/defense.service';
import { ProposalService } from '../../services/proposal.service';
import { useUserProgress } from '../../contexts/UserProgressContext';

const StudentDefense = () => {
    const { defenseUnlocked, completedWeeks, finalDocuments, isLoadingProgress } = useUserProgress();
    const [loading, setLoading] = useState(true);
    const [defense, setDefense] = useState(null);
    const [proposal, setProposal] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoadingProgress) return;
        if (!defenseUnlocked) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Obtener propuesta del estudiante
                const proposals = await ProposalService.getAll();
                const myProposal = proposals[0]; // Asumimos la primera/única propuesta activa

                if (!myProposal) {
                    setError("No tienes una propuesta aprobada actualmente.");
                    setLoading(false);
                    return;
                }
                setProposal(myProposal);

                // 2. Intentar buscar defensa (Privada o Pública)
                try {
                    const privDef = await DefenseService.getPrivateDefense(myProposal.id);
                    if (privDef) {
                        setDefense({ ...privDef, tipo: 'PRIVADA' });
                    }
                } catch (e) {
                    try {
                        const pubDef = await DefenseService.getPublicDefense(myProposal.id);
                        if (pubDef) {
                            setDefense({ ...pubDef, tipo: 'PÚBLICA' });
                        }
                    } catch (e2) {
                        console.log("No defense found");
                    }
                }

            } catch (err) {
                console.error("Error fetching student defense data:", err);
                setError("Error al cargar la información de defensa.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [defenseUnlocked, isLoadingProgress]);

    // UI Bloqueada si no se cumplen requisitos
    if (completedWeeks < 16 && !isLoadingProgress) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                <Box sx={{
                    mb: 4,
                    p: { xs: 3, md: 6 },
                    borderRadius: 4,
                    bgcolor: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <LockIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1e293b' }}>
                        Sección Bloqueada
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                        Para acceder a la Defensa debes completar y tener aprobadas las **16 semanas de avances**.
                    </Typography>

                    {/* Progreso de Semanas */}
                    <Box sx={{ width: '100%', maxWidth: 400, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" fontWeight="bold">Semanas Aprobadas</Typography>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                                {completedWeeks} / 16
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(completedWeeks / 16) * 100}
                            sx={{ height: 10, borderRadius: 5, bgcolor: '#e2e8f0' }}
                        />
                    </Box>

                    <Alert severity="info" sx={{ borderRadius: 2, width: '100%', maxWidth: 500 }}>
                        Una vez que tu tutor apruebe las 16 semanas, esta sección se desbloqueará automáticamente.
                    </Alert>
                </Box>
            </Box>
        );
    }

    if (loading || isLoadingProgress) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" variant="outlined">{error}</Alert>
            </Box>
        );
    }

    if (!defense) {
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Mi Defensa
                </Typography>
                <Card sx={{ borderRadius: 3, textAlign: 'center', p: 4, bgcolor: '#f8f9fa' }}>
                    <CalendarMonthIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Aún no tienes una defensa programada.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Tu director o coordinador ha sido notificado de que has completado todos tus requisitos.
                        Pronto programarán la fecha de tu defensa privada.
                    </Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                Mi Defensa 🎓
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Detalles de tu defensa de titulación.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>

                {/* Detalles Principales */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Chip
                                    label={`Defensa ${defense.tipo}`}
                                    color={defense.tipo === 'PÚBLICA' ? 'secondary' : 'primary'}
                                    sx={{ fontWeight: 'bold' }}
                                />
                                <Chip
                                    label={defense.estado}
                                    color={defense.estado === 'APROBADA' ? 'success' : 'default'}
                                    variant="outlined"
                                />
                            </Box>

                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {proposal?.titulo || "Título de Tesis no disponible"}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'action.selected', color: 'primary.main' }}>
                                            <EventIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">FECHA</Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {defense.fechaDefensa ? new Date(defense.fechaDefensa).toLocaleDateString() : 'Por definir'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'action.selected', color: 'primary.main' }}>
                                            <AccessTimeIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">HORA</Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {defense.horaDefensa ? new Date(defense.horaDefensa).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Por definir'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'action.selected', color: 'primary.main' }}>
                                            <LocationOnIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">LUGAR /ENLACE</Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {defense.aula || 'Por asignar'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Comité / Tribunal */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <VerifiedUserIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">
                                    Tribunal Asignado
                                </Typography>
                            </Box>

                            <List>
                                {defense.participantes && defense.participantes.length > 0 ? (
                                    defense.participantes.map((part, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <PersonIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            {part.usuario?.nombres} {part.usuario?.apellidos}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" color="text.secondary" component="span">
                                                            {part.rol || part.tipoParticipante}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {index < defense.participantes.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No hay miembros asignados aún.
                                    </Typography>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Resultado (si existe) */}
                {defense.calificacion && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SchoolIcon color="success" fontSize="large" />
                                <Box>
                                    <Typography variant="h6" color="success.main" fontWeight="bold">
                                        Defensa Finalizada
                                    </Typography>
                                    <Typography variant="body1">
                                        Calificación Final: <strong>{defense.calificacion}/10</strong>
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                )}

            </Grid>
        </Box>
    );
};

export default StudentDefense;
