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
    LinearProgress,
    Stack
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';
import { DefenseService } from '../../services/defense.service';
import { ProposalService } from '../../services/proposal.service';
import { useUserProgress } from '../../contexts/UserProgressContext';

const DefenseCard = ({ title, defense, proposalTitle }) => {
    if (!defense) {
        return (
            <Card sx={{ borderRadius: 3, textAlign: 'center', p: 4, bgcolor: '#f8f9fa', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                <CalendarMonthIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2, mx: 'auto' }} />
                <Typography variant="h6" color="text.secondary" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Esta defensa aún no ha sido programada.
                </Typography>
            </Card>
        );
    }

    const isPublic = title.includes("Pública");

    return (
        <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        {title}
                    </Typography>
                    <Chip
                        label={defense.estado}
                        color={defense.estado === 'APROBADA' ? 'success' : defense.estado === 'PROGRAMADA' ? 'primary' : 'default'}
                        size="small"
                        variant="filled"
                    />
                </Box>

                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EventIcon fontSize="small" color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">FECHA</Typography>
                            <Typography variant="body2" fontWeight="600">
                                {defense.fechaDefensa ? new Date(defense.fechaDefensa).toLocaleDateString() : 'Por definir'}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">HORA</Typography>
                            <Typography variant="body2" fontWeight="600">
                                {defense.horaDefensa ? new Date(defense.horaDefensa).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Por definir'}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">LUGAR / VIRTUAL</Typography>
                            <Typography variant="body2" fontWeight="600">
                                {defense.aula || 'Por asignar'}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedUserIcon fontSize="small" color="primary" /> Tribunal
                </Typography>
                <List dense>
                    {defense.participantes && defense.participantes.length > 0 ? (
                        defense.participantes.map((part, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                        <PersonIcon sx={{ fontSize: 16 }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="body2" fontWeight="500">{part.usuario?.nombres} {part.usuario?.apellidos}</Typography>}
                                    secondary={<Typography variant="caption" color="text.secondary">{part.rol || part.tipoParticipante}</Typography>}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Miembros por asignar
                        </Typography>
                    )}
                </List>
            </CardContent>

            {defense.calificacion && (
                <Box sx={{ p: 2, bgcolor: defense.calificacion >= 7 ? '#e8f5e9' : '#fff3e0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <SchoolIcon color={defense.calificacion >= 7 ? 'success' : 'warning'} fontSize="small" />
                        <Typography variant="body2" fontWeight="bold">
                            Nota: {defense.calificacion}/10
                        </Typography>
                    </Box>
                </Box>
            )}
        </Card>
    );
};

const StudentDefense = () => {
    const { defenseUnlocked, completedWeeks, isLoadingProgress } = useUserProgress();
    const [loading, setLoading] = useState(true);
    const [privateDefense, setPrivateDefense] = useState(null);
    const [publicDefense, setPublicDefense] = useState(null);
    const [proposal, setProposal] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoadingProgress) return;

        // El usuario puede ver la sección si está desbloqueada o si ya hay defensas
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Obtener propuesta del estudiante
                const proposals = await ProposalService.getAll();
                const myProposal = proposals[0];

                if (!myProposal) {
                    setError("No tienes una propuesta aprobada actualmente.");
                    setLoading(false);
                    return;
                }
                setProposal(myProposal);

                // 2. Fetch both defenses
                const [privRes, pubRes] = await Promise.all([
                    DefenseService.getPrivateDefense(myProposal.id).catch(() => null),
                    DefenseService.getPublicDefense(myProposal.id).catch(() => null)
                ]);

                setPrivateDefense(privRes);
                setPublicDefense(pubRes);

            } catch (err) {
                console.error("Error fetching student defense data:", err);
                setError("Ocurrió un error al cargar la información.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoadingProgress]);

    if (loading || isLoadingProgress) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Mostrar bloqueo si no hay defensas y no está desbloqueado
    if (completedWeeks < 16 && !privateDefense && !publicDefense) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                <Box sx={{
                    mb: 4, p: { xs: 3, md: 6 }, borderRadius: 4, bgcolor: '#f8fafc', border: '2px dashed #cbd5e1',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <LockIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">Sección Bloqueada</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                        Completa las **16 semanas de avances** para habilitar la programación de tus defensas.
                    </Typography>
                    <Box sx={{ width: '100%', maxWidth: 400, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" fontWeight="bold">Semanas Aprobadas</Typography>
                            <Typography variant="body2" color="primary" fontWeight="bold">{completedWeeks} / 16</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={(completedWeeks / 16) * 100} sx={{ height: 10, borderRadius: 5 }} />
                    </Box>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Una vez aprobadas las 16 semanas, tu director podrá programar tus evaluaciones.
                    </Alert>
                </Box>
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

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                    Mi Proceso de Defensa 🎓
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    {proposal?.titulo || "Título de Tesis"}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <DefenseCard
                        title="Defensa Privada"
                        defense={privateDefense}
                        proposalTitle={proposal?.titulo}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DefenseCard
                        title="Defensa Pública"
                        defense={publicDefense}
                        proposalTitle={proposal?.titulo}
                    />
                </Grid>
            </Grid>

            {(!privateDefense && !publicDefense) && (
                <Box sx={{ mt: 4 }}>
                    <Alert severity="warning" variant="filled" sx={{ borderRadius: 3 }}>
                        <Typography variant="body1" fontWeight="bold">Aviso</Typography>
                        Has cumplido los requisitos, pero tu Director aún no ha programado las fechas. Se te notificará por correo una vez se definan.
                    </Alert>
                </Box>
            )}
        </Box>
    );
};

export default StudentDefense;
