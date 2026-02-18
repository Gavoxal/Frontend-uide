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
import UpcomingDateCard from "../../components/updata.mui.component";
import UpcomingDates from "../../components/upcommigdates.mui.component";
import { useUserProgress } from "../../contexts/UserProgressContext";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { UserService } from "../../services/user.service";
import { ProposalService } from "../../services/proposal.service";
import { ActivityService } from "../../services/activity.service";

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

    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [studentData, setStudentData] = useState({
        name: (user?.nombres && user?.apellidos) ? `${user.nombres} ${user.apellidos}` : (user?.name || "Estudiante"),
        currentPhase: "Cargando...",
        progress: 0,
        tutor: "Buscando tutor...",
        nextDeadline: null,
        deadlineTask: "Consultando...",
    });
    const [tasks, setTasks] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Obtener datos frescos del usuario (Nombre correcto)
            if (user?.id) {
                try {
                    const freshUser = await UserService.getById(user.id);
                    if (freshUser) {
                        const firstName = freshUser.nombres || freshUser.nombre || user.nombres || user.name || "";
                        const lastName = freshUser.apellidos || freshUser.apellido || user.apellidos || user.lastName || "";
                        const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : (firstName || lastName || "Estudiante");

                        setStudentData(prev => ({ ...prev, name: fullName }));
                    }
                } catch (e) {
                    console.error("Error fetching user details:", e);
                }
            }


            const proposals = await ProposalService.getAll();


            if (proposals && proposals.length > 0) {
                const activeProposal = proposals[0];


                // EXTRAER TUTOR (Logic from Avances.jsx)
                let tutorName = "Por asignar";
                if (activeProposal.tutor) {
                    tutorName = `${activeProposal.tutor.nombres} ${activeProposal.tutor.apellidos}`;
                } else if (activeProposal.trabajosTitulacion?.[0]?.tutor) {
                    const t = activeProposal.trabajosTitulacion[0].tutor;
                    tutorName = `${t.nombres} ${t.apellidos}`;
                }

                // Fetch activities for this proposal
                const fetchedActivities = await ActivityService.getByPropuesta(activeProposal.id);

                setActivities(fetchedActivities);

                // --- NEW CALCULATION FOR PROGRESS (Sync with Avances.jsx) ---
                const weeks = Array.from({ length: 16 }, (_, i) => ({
                    weekNumber: i + 1,
                    activities: []
                }));

                fetchedActivities.forEach(act => {
                    const w = Number(act.semana);
                    if (w >= 1 && w <= 16) {
                        weeks[w - 1].activities.push(act);
                    }
                });

                const isWeekCompleted = (week) => {
                    if (!week.activities || week.activities.length === 0) return true;
                    return week.activities.every(a => {
                        const evidence = a.evidencias && a.evidencias.length > 0
                            ? a.evidencias[a.evidencias.length - 1]
                            : a.evidencia;
                        return evidence && (evidence.calificacionTutor !== null || evidence.calificacionDocente !== null);
                    });
                };

                let consecutiveCompleted = 0;
                for (let i = 0; i < weeks.length; i++) {
                    if (isWeekCompleted(weeks[i])) {
                        consecutiveCompleted++;
                    } else {
                        break;
                    }
                }

                const progressPercent = Math.round((consecutiveCompleted / 16) * 100);
                // ------------------------------------------------------------

                // --- LOGIC FOR DATES & CURRENT ACTIVITY (Mirrors Avances.jsx) ---
                const now = new Date();

                // Helper to parse dates correctly
                const parseDate = (d) => {
                    if (!d) return null;
                    // Handle ISO strings directly
                    return new Date(d);
                };

                // Sort activities by date/week
                const sortedActivities = fetchedActivities.sort((a, b) => {
                    // Prefer fechaEntrega, fallback to fechaCreacion/createdAt
                    const dateA = a.fechaEntrega || a.fechaCreacion || a.createdAt || new Date();
                    const dateB = b.fechaEntrega || b.fechaCreacion || b.createdAt || new Date();
                    return new Date(dateA) - new Date(dateB);
                });

                // Find next upcoming deadline
                const upcomingActivity = sortedActivities.find(a => {
                    const dueDate = parseDate(a.fechaEntrega);
                    // Filter for future dates
                    return dueDate && dueDate >= now;
                });

                // Find "Current Activity"
                const currentActivity = sortedActivities.find(a => {
                    // Check status on activity first if available
                    if (a.estado && a.estado !== 'ENTREGADO') return true;

                    // Deep check on evidences
                    const mainEvidence = a.evidencias && a.evidencias.length > 0
                        ? a.evidencias[a.evidencias.length - 1]
                        : null;

                    // If no evidence, it's pending
                    if (!mainEvidence) return true;

                    // If evidence exists but not graded/approved, it's current
                    const isApproved = (mainEvidence.calificacionTutor && Number(mainEvidence.calificacionTutor) >= 7) ||
                        (mainEvidence.calificacionDocente && Number(mainEvidence.calificacionDocente) >= 7);
                    return !isApproved;
                }) || sortedActivities[sortedActivities.length - 1]; // Fallback to last activity

                setStudentData(prev => ({
                    ...prev,
                    currentPhase: activeProposal.estado === 'APROBADA' ? "Desarrollo de Tesis" : (activeProposal.estado || "En Revisión"),
                    progress: isNaN(progressPercent) ? 0 : progressPercent,
                    tutor: tutorName,
                    nextDeadline: upcomingActivity?.fechaEntrega || null,
                    deadlineTask: upcomingActivity?.nombre || "Sin tareas pendientes próximas",
                    currentActivity: currentActivity || null
                }));
            } else {
                console.warn("No proposals found for this student.");
                setStudentData(prev => ({
                    ...prev,
                    currentPhase: "Sin Propuesta Registrada",
                    progress: 0,
                    tutor: "N/A",
                    deadlineTask: "Debe iniciar un proceso",
                    currentActivity: null
                }));
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Vista para estudiantes con prerrequisitos aprobados
    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Encabezado con saludo personalizado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ¡Hola, {studentData.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de seguimiento de tu trabajo de titulación
                </Typography>
            </Box>

            {/* Resumen de progreso (Eliminado por solicitud del usuario) */}
            {/* <Box sx={{ mb: 3 }}>
                <ProgressSummaryCard
                    progressSummary={progressSummary}
                    prerequisitesStatus={prerequisitesStatus}
                />
            </Box> */}

            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Left Column: Progress & Current Activity */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {/* Top Stats Cards (Restored - Small & Wide) */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <StatsCard
                                    title="Fase Actual"
                                    value={studentData.currentPhase}
                                    icon={<AssignmentIcon fontSize="large" />}
                                    color="primary"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <StatsCard
                                    title="Tutor Asignado"
                                    value={studentData.tutor}
                                    icon={<PersonIcon fontSize="large" />}
                                    color="info"
                                />
                            </Grid>
                        </Grid>

                        {/* Progreso General Card (Moved from top) */}
                        <Card sx={{
                            borderRadius: 3,
                            boxShadow: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <TrendingUpIcon fontSize="large" />
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Progreso General (16 Semanas)
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {studentData.progress}%
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>



                        {/* Current Weekly Advance Card */}
                        <Card sx={{ borderRadius: 3, boxShadow: 2, borderLeft: '6px solid #667eea' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="overline" color="primary" fontWeight="bold">
                                            ACTIVIDAD ACTUAL
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 1 }}>
                                            {studentData.currentActivity?.nombre || "Sin actividad pendiente"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {studentData.currentActivity?.descripcion || "Descripción no disponible"}
                                        </Typography>

                                        {studentData.currentActivity && (
                                            <Chip
                                                label={studentData.currentActivity.estado || "PENDIENTE"}
                                                color={studentData.currentActivity.estado === 'ENTREGADO' ? "success" : "warning"}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        )}
                                    </Box>
                                    <AssignmentIcon sx={{ fontSize: 60, color: '#e0e0e0' }} />
                                </Box>

                                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/student/progress')}
                                        sx={{
                                            backgroundColor: '#667eea',
                                            fontWeight: 'bold',
                                            '&:hover': { backgroundColor: '#5a6fd6' }
                                        }}
                                    >
                                        Ir a Avances
                                    </Button>
                                    {studentData.nextDeadline && (
                                        <Typography variant="body2" color="error" fontWeight="500">
                                            Vence: {new Date(studentData.nextDeadline).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>

                    </Box>
                </Grid>

                {/* Right Column: Upcoming Dates */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <UpcomingDates activities={activities} />
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentDashboard;
