import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import StatsCard from "../../components/common/StatsCard";
import { getDataUser } from "../../storage/user.model.jsx";
import { DashboardService } from "../../services/dashboard.service";

const DirectorDashboard = () => {
    const navigate = useNavigate();
    const user = getDataUser();
    const [loading, setLoading] = React.useState(true);

    // Datos reales para el dashboard
    const [stats, setStats] = React.useState({
        students: 0,
        proposals: 0,
        defenses: 0,
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await DashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido, {user?.name || "Director"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de gestión y administración de titulación
                </Typography>
            </Box>

            {/* Tarjetas de Resumen / Acceso Rápido */}
            <Grid container spacing={3}>

                {/* Gestión de Estudiantes */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box onClick={() => navigate('/director/students')} sx={{ cursor: 'pointer', height: '100%' }}>
                        <StatsCard
                            title="Estudiantes"
                            value={stats.students.toString()}
                            icon={<PeopleIcon fontSize="large" />}
                            color="primary"
                            subtitle="Gestión de Nómina"
                        />
                    </Box>
                </Grid>

                {/* Revisión de Propuestas */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box onClick={() => navigate('/director/proposals')} sx={{ cursor: 'pointer', height: '100%' }}>
                        <StatsCard
                            title="Propuestas"
                            value={stats.proposals.toString()}
                            icon={<AssignmentIcon fontSize="large" />}
                            color="warning"
                            subtitle="Pendientes de Revisión"
                        />
                    </Box>
                </Grid>

                {/* Defensas y Tribunales */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box onClick={() => navigate('/director/defenses')} sx={{ cursor: 'pointer', height: '100%' }}>
                        <StatsCard
                            title="Defensas"
                            value={stats.defenses.toString()}
                            icon={<SchoolIcon fontSize="large" />}
                            color="success"
                            subtitle="Próximas fechas"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DirectorDashboard;
