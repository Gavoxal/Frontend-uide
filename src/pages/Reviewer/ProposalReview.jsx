import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider, TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Paper, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';

import TextMui from '../../components/text.mui.component';

function ReviewerProposalReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data Fetching (Simulated)
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [reviewData, setReviewData] = useState({
        vote: 'pending',
        comment: ''
    });

    useEffect(() => {
        // Simular fetch de datos
        // En un caso real, usaríamos un servicio para obtener la info por ID
        const mockProposals = [
            {
                id: 1,
                student: "Eduardo Pardo",
                studentId: "1104567890",
                email: "eapardo@uide.edu.ec",
                phone: "0991234567",
                title: "Sistema de Gestión de Tesis Universitaria",
                career: "Ing. Software",
                pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // PDF de prueba
            },
            {
                id: 2,
                student: "Gabriel Serrango",
                studentId: "1104567891",
                email: "gaserrango@uide.edu.ec",
                phone: "0991234568",
                title: "Plataforma de Monitoreo de Seguridad con IA",
                career: "Ing. TI",
                pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
            {
                id: 3,
                student: "Fernando Castillo",
                studentId: "1104567892",
                email: "fcastillo@uide.edu.ec",
                phone: "0991234569",
                title: "Aplicación Móvil para Gestión de Inventarios",
                career: "Sistemas",
                pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
        ];

        const found = mockProposals.find(p => p.id === parseInt(id));
        setProposal(found);
        setLoading(false);
    }, [id]);

    const handleSave = () => {
        if (reviewData.vote === 'pending') {
            alert("Por favor, seleccione una opción: Aprobar o Rechazar.");
            return;
        }
        if (!reviewData.comment || reviewData.comment.trim().length < 5) {
            alert("Por favor, ingrese un comentario de al menos 5 caracteres.");
            return;
        }

        console.log("Guardando revisión:", { id, ...reviewData });
        alert("Evaluación guardada correctamente");
        navigate('/reviewer/proposals');
    };

    if (loading) return <Box p={3}>Cargando...</Box>;
    if (!proposal) return <Box p={3}>Propuesta no encontrada</Box>;

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header de Navegación */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/reviewer/proposals')}
                    color="inherit"
                >
                    Volver
                </Button>
                <Typography variant="h6" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Revisión: {proposal.title}
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
                {/* Panel Izquierdo: Visualizador PDF */}
                <Grid item xs={12} md={7} sx={{ height: '100%' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            bgcolor: '#f5f5f5'
                        }}
                    >
                        <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">Documento de Anteproyecto</Typography>
                        </Box>
                        {/* Iframe para PDF */}
                        <Box sx={{ flex: 1, width: '100%', height: '100%' }}>
                            <iframe
                                src={proposal.pdfUrl}
                                title="Visor PDF"
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Panel Derecho: Formulario de Evaluación */}
                <Grid item xs={12} md={5} sx={{ height: '100%', overflowY: 'auto' }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <TextMui value="Formulario de Evaluación" variant="h5" sx={{ mb: 1 }} />
                        <Typography variant="subtitle1" gutterBottom color="text.secondary">
                            Estudiante: <strong>{proposal.student}</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5, ml: 1, borderLeft: '3px solid #e0e0e0', pl: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">
                                Cédula: <strong>{proposal.studentId}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Carrera: <strong>{proposal.career}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Email: {proposal.email} | Tel: {proposal.phone}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Voto */}
                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                                    Decisión del Revisor
                                </FormLabel>
                                <RadioGroup
                                    value={reviewData.vote}
                                    onChange={(e) => setReviewData({ ...reviewData, vote: e.target.value })}
                                >
                                    <Paper variant="outlined" sx={{ mb: 1, p: 1, borderRadius: 2, borderColor: reviewData.vote === 'approved' ? 'success.main' : 'divider' }}>
                                        <FormControlLabel
                                            value="approved"
                                            control={<Radio color="success" />}
                                            label={<Typography fontWeight={reviewData.vote === 'approved' ? 'bold' : 'normal'}>Aprobar Propuesta</Typography>}
                                            sx={{ width: '100%', m: 0 }}
                                        />
                                    </Paper>
                                    <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, borderColor: reviewData.vote === 'rejected' ? 'error.main' : 'divider' }}>
                                        <FormControlLabel
                                            value="rejected"
                                            control={<Radio color="error" />}
                                            label={<Typography fontWeight={reviewData.vote === 'rejected' ? 'bold' : 'normal'}>Rechazar (Requiere Cambios)</Typography>}
                                            sx={{ width: '100%', m: 0 }}
                                        />
                                    </Paper>
                                </RadioGroup>
                            </FormControl>

                            {/* Comentarios */}
                            <TextField
                                label="Observaciones Técnicas y Metodológicas"
                                multiline
                                rows={8}
                                fullWidth
                                placeholder="Describa detalladamente las correcciones necesarias o los puntos fuertes de la propuesta..."
                                variant="outlined"
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                required
                            />

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => navigate('/reviewer/proposals')}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    size="large"
                                >
                                    Guardar Evaluación
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ReviewerProposalReview;
