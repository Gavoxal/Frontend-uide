import { Box, Typography, Grid, Card, CardContent, LinearProgress, Alert } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";
import StatusBadge from "../../components/common/StatusBadge";

function StudentDashboard() {
    const user = getDataUser();

    // Datos de ejemplo
    const studentData = {
        currentPhase: "Desarrollo de Tesis",
        progress: 65,
        tutor: "Dr. Milton García",
        nextDeadline: "2026-02-05",
        deadlineTask: "Entrega de avance semanal",
    };

    const prerequisites = {
        english: true,
        internship: true,
        community: false,
    };

    const allPrerequisitesComplete = Object.values(prerequisites).every(v => v);

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido, {user?.name || "Estudiante"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de seguimiento de tu trabajo de titulación
                </Typography>
            </Box>

            {/* Alerta de prerrequisitos */}
            {!allPrerequisitesComplete && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Tienes prerrequisitos pendientes. Completa todos los requisitos para continuar con el proceso.
                </Alert>
            )}

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
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
                    <StatsCard
                        title="Próxima Entrega"
                        value={new Date(studentData.nextDeadline).toLocaleDateString()}
                        icon={<EventIcon fontSize="large" />}
                        color="warning"
                        subtitle={studentData.deadlineTask}
                    />
                </Grid>
            </Grid>

            {/* Progreso del Proyecto */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Progreso del Proyecto
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={studentData.progress}
                            sx={{ flex: 1, height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {studentData.progress}%
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        Continúa trabajando para alcanzar el 100%
                    </Typography>
                </CardContent>
            </Card>

            {/* Checklist de Prerrequisitos */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Prerrequisitos
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body1">Inglés</Typography>
                            <StatusBadge status={prerequisites.english ? "approved" : "pending"} />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body1">Prácticas Laborales</Typography>
                            <StatusBadge status={prerequisites.internship ? "approved" : "pending"} />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body1">Vinculación con la Comunidad</Typography>
                            <StatusBadge status={prerequisites.community ? "approved" : "pending"} />
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default StudentDashboard;
