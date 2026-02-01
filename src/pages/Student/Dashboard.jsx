import { Box, Typography, Grid, Card, CardContent, LinearProgress, Alert, List, ListItem, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";
import StatusBadge from "../../components/common/StatusBadge";
import UpcomingDateCard from "../../components/updata.mui.component";
import UpcomingDates from "../../components/upcommigdates.mui.component";

function StudentDashboard() {
    const user = getDataUser();

    // Datos de ejemplo
    const studentData = {
        currentPhase: "Desarrollo de Tesis",
        progress: 65,
        tutor: "Ing. Milton Palacios",
        nextDeadline: "2026-02-05",
        deadlineTask: "Entrega de avance semanal",
    };

    const prerequisites = {
        english: true,
        internship: true,
        community: false,
    };

    const allPrerequisitesComplete = Object.values(prerequisites).every(v => v);

    // Tareas pendientes
    const tasks = [
        { id: 1, text: 'Completar capítulo de marco teórico', completed: false },
        { id: 2, text: 'Revisar con el tutor el avance del proyecto', completed: false },
        { id: 3, text: 'Subir documentación de prerrequisitos', completed: true },
        { id: 4, text: 'Preparar presentación de propuesta', completed: false },
    ];

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Encabezado con saludo personalizado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ¡Hola, {user?.name || "Estudiante"}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de seguimiento de tu trabajo de titulación
                </Typography>
            </Box>

            {/* Alerta de prerrequisitos */}
            {!allPrerequisitesComplete && (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                    Tienes prerrequisitos pendientes. Completa todos los requisitos para continuar con el proceso.
                </Alert>
            )}

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
