import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, InputAdornment, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextMui from '../../components/text.mui.component';
import InputMui from '../../components/input.mui.component';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ReviewerProposals() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Mock Data
    const [proposals] = useState([
        {
            id: 1,
            student: "Eduardo Pardo",
            studentId: "1104567890",
            email: "eapardo@uide.edu.ec",
            phone: "0991234567",
            title: "Sistema de Gestión de Tesis Universitaria",
            career: "Ing. Software",
            date: "2026-01-15",
            status: "pending", // pending, reviewed
            pdfUrl: "#",
            director: "Ing. Wilson"
        },
        {
            id: 2,
            student: "Gabriel Serrango",
            studentId: "1104567891",
            email: "gaserrango@uide.edu.ec",
            phone: "0991234568",
            title: "Plataforma de Monitoreo de Seguridad con IA",
            career: "Ing. TI",
            date: "2026-01-16",
            status: "reviewed",
            reviewDate: "2026-01-20",
            vote: "approved",
            pdfUrl: "#",
            director: "Ing. Lorena"
        },
        {
            id: 3,
            student: "Fernando Castillo",
            studentId: "1104567892",
            email: "fcastillo@uide.edu.ec",
            phone: "0991234569",
            title: "Aplicación Móvil para Gestión de Inventarios",
            career: "Sistemas",
            date: "2026-01-18",
            status: "pending",
            pdfUrl: "#",
            director: "Ing. Gabriel"
        },
    ]);

    const handleNavigateToReview = (id) => {
        navigate(`/reviewer/proposals/review/${id}`);
    };

    const filteredProposals = proposals.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Revisión de Propuestas" variant="h4" />
                <TextMui value="Evalúa y comenta las propuestas de tesis asignadas" variant="body1" />
            </Box>

            {/* Buscador */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <InputMui
                        placeholder="Buscar por título o estudiante..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startIcon={<SearchIcon color="action" />}
                    />
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {filteredProposals.map((proposal) => (
                    <Grid item xs={12} key={proposal.id}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {proposal.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Estudiante: <strong>{proposal.student}</strong>
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5, ml: 1, borderLeft: '3px solid #e0e0e0', pl: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Cédula: {proposal.studentId}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Carrera: {proposal.career}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Email: {proposal.email} | Tel: {proposal.phone}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                                            <Chip
                                                label={proposal.status === 'pending' ? "Pendiente de Revisión" : "Revisado"}
                                                color={proposal.status === 'pending' ? "warning" : "success"}
                                                size="small"
                                            />
                                            {proposal.status === 'reviewed' && (
                                                <Chip
                                                    label={proposal.vote === 'approved' ? "Voto: A Favor" : "Voto: En Contra"}
                                                    variant="outlined"
                                                    color={proposal.vote === 'approved' ? "success" : "error"}
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        {proposal.status === 'pending' ? (
                                            <Button
                                                variant="contained"
                                                startIcon={<RateReviewIcon />}
                                                onClick={() => handleNavigateToReview(proposal.id)}
                                                color="primary"
                                                sx={{ minWidth: 150 }}
                                            >
                                                Evaluar
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleNavigateToReview(proposal.id)}
                                                color="success"
                                                sx={{ minWidth: 150 }}
                                            >
                                                Ver Detalles
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ReviewerProposals;
