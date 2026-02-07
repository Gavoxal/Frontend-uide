import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider, TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Paper } from '@mui/material'; // Quitamos Grid de los imports
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';

import TextMui from '../../components/text.mui.component';

function ProposalReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

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
        const mockProposals = [
            {
                id: 1,
                student: "Eduardo Pardo",
                studentId: "1104567890",
                email: "eapardo@uide.edu.ec",
                phone: "0991234567",
                title: "Sistema de Gestión de Tesis Universitaria",
                career: "Ing. Software",
                pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
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
        handleBack();
    };

    const handleBack = () => {
        if (location.pathname.includes('coordinador')) {
            navigate('/coordinador/proposals');
        } else if (location.pathname.includes('docente-integracion')) {
            navigate('/docente-integracion/dashboard');
        } else if (location.pathname.includes('tutor')) {
            navigate('/tutor/dashboard');
        } else {
            navigate(-1);
        }
    };

    if (loading) return <Box p={3}>Cargando...</Box>;
    if (!proposal) return <Box p={3}>Propuesta no encontrada</Box>;

    return (
        // Contenedor Principal: Usa Flex Column para separar Header del contenido
        <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header de Navegación */}
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, bgcolor: '#fff' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    color="inherit"
                >
                    Volver
                </Button>
                <Typography variant="h6" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Revisión: {proposal.title}
                </Typography>
            </Box>

            {/* ÁREA DE CONTENIDO DIVIDIDO (SPLIT VIEW) */}
            {/* Aquí usamos flex: 1 en el padre y en los hijos para forzar 50/50 exacto */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Columna en móvil, Fila en escritorio
                overflow: 'hidden'
            }}>

                {/* LADO IZQUIERDO: PDF */}
                <Box sx={{
                    flex: 1, // Esto fuerza a ocupar el 50%
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: { md: '1px solid #e0e0e0' }, // Borde separador
                    bgcolor: '#f5f5f5',
                    position: 'relative'
                }}>
                    <Box sx={{ p: 1.5, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff' }}>
                        <DescriptionIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary" fontWeight="bold">
                            Documento de Anteproyecto
                        </Typography>
                    </Box>

                    {/* Contenedor Iframe que ocupa todo el espacio restante */}
                    <Box sx={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden' }}>
                        <iframe
                            src={proposal.pdfUrl}
                            title="Visor PDF"
                            width="100%"
                            height="100%"
                            style={{ border: 'none', display: 'block' }}
                        />
                    </Box>
                </Box>

                {/* LADO DERECHO: FORMULARIO */}
                <Box sx={{
                    flex: 1, // Esto fuerza a ocupar el otro 50%
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Importante para que el scroll sea interno
                    bgcolor: '#fff'
                }}>
                    {/* Contenedor con scroll para el formulario */}
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                        <TextMui value="Evaluación de Propuesta" variant="h5" sx={{ mb: 1 }} />
                        <Typography variant="subtitle1" gutterBottom color="text.secondary">
                            Estudiante: <strong>{proposal.student}</strong>
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5, ml: 1, borderLeft: '3px solid #1976d2', pl: 1.5 }}>
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
                                    Decisión del Evaluador
                                </FormLabel>
                                <RadioGroup
                                    value={reviewData.vote}
                                    onChange={(e) => setReviewData({ ...reviewData, vote: e.target.value })}
                                >
                                    <Paper variant="outlined" sx={{ mb: 1, p: 1, borderRadius: 2, borderColor: reviewData.vote === 'approved' ? 'success.main' : 'divider', bgcolor: reviewData.vote === 'approved' ? 'success.light' : 'transparent', opacity: reviewData.vote === 'approved' ? 0.9 : 1 }}>
                                        <FormControlLabel
                                            value="approved"
                                            control={<Radio color="success" />}
                                            label={<Typography fontWeight={reviewData.vote === 'approved' ? 'bold' : 'normal'}>Aprobar Propuesta</Typography>}
                                            sx={{ width: '100%', m: 0 }}
                                        />
                                    </Paper>
                                    <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, borderColor: reviewData.vote === 'rejected' ? 'error.main' : 'divider', bgcolor: reviewData.vote === 'rejected' ? '#ffebee' : 'transparent' }}>
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
                                rows={8} // Altura fija considerable
                                fullWidth
                                placeholder="Describa detalladamente las correcciones necesarias..."
                                variant="outlined"
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                required
                            />

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, pb: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={handleBack}
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
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ProposalReview;