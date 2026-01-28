import { Box, Typography, Grid } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WarningIcon from "@mui/icons-material/Warning";
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";
import StudentCard from "../../components/common/StudentCard";

function DirectorDashboard() {
    const user = getDataUser();

    // Datos de ejemplo - en producción vendrían de una API
    const stats = {
        totalStudents: 45,
        approved: 30,
        pending: 12,
        delayed: 3,
    };

    const recentStudents = [
        {
            name: "Eduardo Pardo",
            cedula: "1234567890",
            email: "epardo@example.com",
            cycle: 8,
            phase: "Desarrollo",
            status: "in-progress",
        },
        {
            name: "Gabriel Serrango",
            cedula: "0987654321",
            email: "gserrango@example.com",
            cycle: 7,
            phase: "Anteproyecto",
            status: "pending",
        },
        {
            name: "Fernando Castillo",
            cedula: "1122334455",
            email: "fcastillo@example.com",
            cycle: 8,
            phase: "Defensa",
            status: "completed",
        },
    ];

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="#000A9B">
                    Bienvenido, {user?.name || "Director"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de administración de trabajos de titulación
                </Typography>
            </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Total Estudiantes"
                        value={stats.totalStudents}
                        icon={<PeopleIcon fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Aprobados"
                        value={stats.approved}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Pendientes"
                        value={stats.pending}
                        icon={<HourglassEmptyIcon fontSize="large" />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Atrasados"
                        value={stats.delayed}
                        icon={<WarningIcon fontSize="large" />}
                        color="error"
                        subtitle="Requieren atención"
                    />
                </Grid>
            </Grid>

            {/* Estudiantes Recientes */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Actividad Reciente
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {recentStudents.map((student, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <StudentCard student={student} onClick={() => console.log("Ver estudiante", student.name)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default DirectorDashboard;
