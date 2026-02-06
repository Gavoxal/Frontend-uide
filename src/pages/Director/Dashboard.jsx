import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import StatsCard from "../../components/common/StatsCard";
import { getDataUser } from "../../storage/user.model.jsx";

const DirectorDashboard = () => {
    const navigate = useNavigate();
    const user = getDataUser();

    // Datos simulados para el dashboard
    const stats = {
        students: 120, // Simulando estudiantes activos
        proposals: 15, // Simulando propuestas pendientes
        defenses: 8,   // Simulando defensas programadas
    };

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
                <Grid item xs={12} sm={6} md={4}>
                    <Box onClick={() => navigate('/director/student-load')} sx={{ cursor: 'pointer', height: '100%' }}>
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
                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sm={6} md={4}>
                    <Box onClick={() => navigate('/director/defense')} sx={{ cursor: 'pointer', height: '100%' }}>
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

            {/* Sección Informativa Adicional - Ejemplo: Próximas actividades */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Actividad Reciente
                </Typography>
                <Card>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            No hay actividad reciente registrada en el sistema.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default DirectorDashboard;
