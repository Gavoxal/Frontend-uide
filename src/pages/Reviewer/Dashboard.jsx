import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Card, CardContent, Button, Divider } from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import GavelIcon from "@mui/icons-material/Gavel";
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";

function ReviewerDashboard() {
    const user = getDataUser();
    const navigate = useNavigate();

    const stats = {
        proposalsToReview: 8,
        upcomingDefenses: 2,
    };

    const proposals = [
        {
            id: 1,
            student: "Eduardo Pardo",
            title: "Sistema de Gestión de Tesis Universitaria",
            submittedDate: "2026-01-15",
        },
        {
            id: 2,
            student: "Gabriel Serrango",
            title: "Plataforma de Monitoreo de Seguridad con IA",
            submittedDate: "2026-01-16",
        },
        {
            id: 3,
            student: "Fernando Castillo",
            title: "Aplicación Móvil para Gestión de Inventarios",
            submittedDate: "2026-01-18",
        },
    ];

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido, {user?.name || "Revisor"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de revisión de trabajos de titulación
                </Typography>
            </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Propuestas por Revisar"
                        value={stats.proposalsToReview}
                        icon={<RateReviewIcon fontSize="large" />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Defensas Próximas"
                        value={stats.upcomingDefenses}
                        icon={<GavelIcon fontSize="large" />}
                        color="info"
                    />
                </Grid>
            </Grid>

            {/* Propuestas Pendientes */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Propuestas Pendientes de Revisión
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {proposals.map((proposal) => (
                    <Grid item xs={12} key={proposal.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {proposal.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Estudiante: {proposal.student}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Enviado: {new Date(proposal.submittedDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ ml: 2 }}
                                        onClick={() => navigate(`/reviewer/proposals/review/${proposal.id}`)}
                                    >
                                        Revisar
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ReviewerDashboard;
