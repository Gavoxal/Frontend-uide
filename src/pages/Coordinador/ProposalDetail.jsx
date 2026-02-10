import { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Grid,
    Divider,
    TextField,
    Avatar
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";

function CoordinadorProposalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState("");

    // TODO: API - Obtener detalle de la propuesta
    // const { data: proposal } = await fetch(`/api/coordinador/proposals/${id}`)
    const [proposal] = useState({
        id: id,
        title: "Implementación de Block Chain para seguridad en transacciones",
        studentName: "Jhandry Becerra",
        studentId: "1184523",
        email: "jbecerra@uide.edu.ec",
        career: "Tecnologías de la Información",
        status: "pending_review",
        submissionDate: "2025-01-15",
        description: "El presente proyecto tiene como objetivo desarrollar un sistema de seguridad transaccional utilizando tecnología blockchain para garantizar la integridad y no repudio de los datos financieros...",
        objectives: [
            "Analizar las vulnerabilidades actuales en sistemas transaccionales tradicionales.",
            "Diseñar una arquitectura basada en blockchain para el registro de transacciones.",
            "Implementar un prototipo funcional y realizar pruebas de carga y seguridad."
        ],
        documentUrl: "propuesta_tesis_v1.pdf"
    });

    const handleApprove = () => {
        // TODO: API - Aprobar propuesta

        navigate('/coordinador/proposals');
    };

    const handleReject = () => {
        // TODO: API - Rechazar propuesta

        navigate('/coordinador/proposals');
    };

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/coordinador/proposals')}
                sx={{ mb: 3 }}
            >
                Volver a Propuestas
            </Button>

            <Grid container spacing={3}>
                {/* Columna Izquierda: Información de la Propuesta */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                <Typography variant="h5" fontWeight="bold">
                                    {proposal.title}
                                </Typography>
                                <Chip
                                    label={proposal.status === 'pending_review' ? 'Pendiente Revisión' : proposal.status}
                                    color="warning"
                                />
                            </Box>

                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                                Descripción
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                {proposal.description}
                            </Typography>

                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                                Objetivos
                            </Typography>
                            <ul>
                                {proposal.objectives.map((obj, index) => (
                                    <li key={index}>
                                        <Typography variant="body2" color="text.secondary">{obj}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Área de Feedback */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Evaluación
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Comentarios y Observaciones"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Escribe aquí tus observaciones para el estudiante..."
                                sx={{ mb: 3 }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={handleReject}
                                >
                                    Rechazar Propuesta
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleApprove}
                                >
                                    Aprobar Propuesta
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Columna Derecha: Información del Estudiante y Documentos */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Estudiante
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                                    {proposal.studentName.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {proposal.studentName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {proposal.studentId}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2">
                                <strong>Carrera:</strong> {proposal.career}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Email:</strong> {proposal.email}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Fecha Envío:</strong> {proposal.submissionDate}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Documentos Adjuntos
                            </Typography>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                sx={{ justifyContent: 'flex-start', mb: 1 }}
                            >
                                {proposal.documentUrl}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CoordinadorProposalDetail;
