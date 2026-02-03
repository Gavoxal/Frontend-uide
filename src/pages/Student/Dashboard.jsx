import { Box, Typography, Grid, Card, CardContent, LinearProgress, Alert, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button, Paper, Chip } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";
import StatusBadge from "../../components/common/StatusBadge";
import UpcomingDateCard from "../../components/updata.mui.component";
import UpcomingDates from "../../components/upcommigdates.mui.component";
import { useUserProgress } from "../../contexts/UserProgressContext";
import AccessAlert, { ProgressSummaryCard } from "../../components/AccessAlert";
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
    const user = getDataUser();
    const navigate = useNavigate();
    const {
        prerequisitesStatus,
        completedWeeks,
        shouldShowPrerequisitesAlert,
        getProgressSummary
    } = useUserProgress();

    const progressSummary = getProgressSummary();

    // Datos de ejemplo
    const studentData = {
        currentPhase: "Desarrollo de Tesis",
        progress: 65,
        tutor: "Ing. Milton Palacios",
        nextDeadline: "2026-02-05",
        deadlineTask: "Entrega de avance semanal",
    };

    // Tareas pendientes
    const tasks = [
        { id: 1, text: 'Completar capítulo de marco teórico', completed: false },
        { id: 2, text: 'Revisar con el tutor el avance del proyecto', completed: false },
        { id: 3, text: 'Subir documentación de prerrequisitos', completed: true },
        { id: 4, text: 'Preparar presentación de propuesta', completed: false },
    ];

    // Vista para estudiantes nuevos (sin prerrequisitos aprobados)
    if (shouldShowPrerequisitesAlert()) {
        return (
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Encabezado */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        ¡Bienvenido, {user?.name || "Estudiante"}! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Estás a un paso de comenzar tu trabajo de titulación
                    </Typography>
                </Box>

                {/* Alerta de acceso restringido */}
                <AccessAlert
                    prerequisitesStatus={prerequisitesStatus}
                    completedWeeks={completedWeeks}
                />

                {/* Tarjeta de primeros pasos */}
                <Card sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    mb: 3
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <RocketLaunchIcon sx={{ fontSize: 48 }} />
                            <Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    ¡Comienza tu Trayectoria!
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Completa estos pasos para desbloquear todas las funcionalidades
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CheckCircleOutlineIcon sx={{ fontSize: 32, color: 'white' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="600">
                                            1. Completa tus Prerrequisitos
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                            Sube la documentación requerida (certificados, comprobantes, etc.)
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label="Pendiente"
                                        sx={{
                                            backgroundColor: '#ff9800',
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                            </Paper>

                            <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PlayArrowIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.5)' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ opacity: 0.7 }}>
                                            2. Espera la Aprobación del Director
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>
                                            Tu documentación será revisada por el director de carrera
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label="Bloqueado"
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                            </Paper>

                            <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PlayArrowIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.5)' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ opacity: 0.7 }}>
                                            3. ¡Comienza tu Trabajo de Titulación!
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>
                                            Accede a propuestas, avances semanales y toda la plataforma
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label="Bloqueado"
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => navigate('/student/prerequisites')}
                            sx={{
                                mt: 3,
                                backgroundColor: 'white',
                                color: '#667eea',
                                fontWeight: 700,
                                py: 1.5,
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4
                                },
                                transition: 'all 0.3s'
                            }}
                        >
                            Ir a Completar Prerrequisitos
                        </Button>
                    </CardContent>
                </Card>

                {/* Información adicional */}
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📚 ¿Necesitas ayuda?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Si tienes dudas sobre los prerrequisitos o necesitas soporte, contacta con:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ color: '#667eea' }} />
                                <Typography variant="body2">
                                    <strong>Director de Carrera:</strong> direccion@uide.edu.ec
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EventIcon sx={{ color: '#667eea' }} />
                                <Typography variant="body2">
                                    <strong>Horario de atención:</strong> Lunes a Viernes, 08:00 - 17:00
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    // Vista para estudiantes con prerrequisitos aprobados
    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Encabezado con saludo personalizado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ¡Hola, {user?.name || "Estudiante"}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de seguimiento de tu trabajo de titulación
                </Typography>
            </Box>

            {/* Resumen de progreso */}
            <Box sx={{ mb: 3 }}>
                <ProgressSummaryCard
                    progressSummary={progressSummary}
                    prerequisitesStatus={prerequisitesStatus}
                />
            </Box>

            {/* Estadísticas principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Fase Actual"
                        value={studentData.currentPhase}
                        icon={<AssignmentIcon fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Tutor Asignado"
                        value={studentData.tutor}
                        icon={<PersonIcon fontSize="large" />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TrendingUpIcon fontSize="large" />
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Progreso General
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {studentData.progress}%
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Cards superiores: Progreso y Próxima Fecha */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Progreso del Proyecto */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Progreso del Proyecto
                            </Typography>
                            <Box sx={{ mt: 3, mb: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={studentData.progress}
                                        sx={{
                                            flex: 1,
                                            height: 12,
                                            borderRadius: 6,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 6,
                                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                            }
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                                        {studentData.progress}%
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Estás en buen camino. Continúa trabajando para alcanzar el 100%
                            </Typography>

                            {/* Milestones */}
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                    Hitos del Proyecto
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: '#4caf50'
                                        }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Propuesta aprobada
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: '#667eea'
                                        }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            En desarrollo
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: '#e0e0e0'
                                        }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Defensa final
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Próxima Fecha Importante */}
                <Grid item xs={12} md={6}>
                    <UpcomingDateCard />
                </Grid>
            </Grid>

            {/* Sección inferior: Tareas y Fechas */}
            <Grid container spacing={3}>
                {/* Lista de Tareas */}
                <Grid item xs={12} lg={7}>
                    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Tareas Pendientes
                            </Typography>
                            <List sx={{ mt: 2 }}>
                                {tasks.map((task) => (
                                    <ListItem
                                        key={task.id}
                                        sx={{
                                            px: 0,
                                            py: 1,
                                            borderBottom: '1px solid #f0f0f0',
                                            '&:last-child': {
                                                borderBottom: 'none'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={task.completed}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={task.text}
                                            sx={{
                                                '& .MuiListItemText-primary': {
                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                    color: task.completed ? 'text.secondary' : 'text.primary',
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Próximas Fechas */}
                <Grid item xs={12} lg={5}>
                    <UpcomingDates />
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentDashboard;
