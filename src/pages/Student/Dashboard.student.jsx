import { Box, Typography, Grid, Card, CardContent, LinearProgress, Alert, CardActionArea } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard.jsx"; // Assuming you have this
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const user = getDataUser();
    const navigate = useNavigate();

    // Datos de ejemplo
    const studentData = {
        currentPhase: "Desarrollo de Tesis",
        progress: 15, // Porcentaje basado en semanas (2/15 approx)
        tutor: "Dr. Milton García",
    };

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

            {/* Accesos Directos (Actions) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Box onClick={() => navigate('/student/prerequisites')} sx={{ height: '100%' }}>
                        <StatsCard
                            title="Prerrequisitos"
                            value="Ver Estado"
                            icon={<AssignmentIcon fontSize="large" />}
                            color="info"
                            subtitle="Validación Documental"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box onClick={() => navigate('/student/anteproyecto')} sx={{ height: '100%' }}>
                        <StatsCard
                            title="Propuesta"
                            value="Postular Tema"
                            icon={<EventIcon fontSize="large" />}
                            color="primary"
                            subtitle="Gestión del Anteproyecto"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box onClick={() => navigate('/student/activities')} sx={{ height: '100%' }}>
                        <StatsCard
                            title="Mis Avances"
                            value="Semana 3"
                            icon={<EventNoteIcon fontSize="large" />}
                            color="warning"
                            subtitle="Cargar Evidencias"
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Progreso del Proyecto */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Progreso General (15 Semanas)
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
                        Has completado 2 de 15 semanas.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default StudentDashboard;
