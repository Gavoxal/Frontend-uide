import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Divider, Paper, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import { getDataUser } from '../../storage/user.model';
import { ProposalService } from '../../services/proposal.service';

function ProposalReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user = getDataUser();
    const userRole = user?.role;

    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);

    const fetchProposal = async () => {
        try {
            setLoading(true);
            const data = await ProposalService.getById(id);
            if (data) {
                // Fix PDF URL
                let pdfUrl = data.archivoUrl || data.archivo_url || "";
                if (pdfUrl && !pdfUrl.startsWith('http')) {
                    pdfUrl = `http://localhost:3000${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
                }

                setProposal({
                    id: data.id,
                    student: data.estudiante ? `${data.estudiante.nombres} ${data.estudiante.apellidos}` : "Estudiante",
                    studentId: data.estudiante?.cedula || "N/A",
                    email: data.estudiante?.correoInstitucional || data.estudiante?.correo || "N/A",
                    title: data.titulo,
                    career: data.estudiante?.estudiantePerfil?.carrera || data.estudiante?.estudiantePerfil?.escuela || "N/A",
                    pdfUrl: pdfUrl,
                    status: data.estado
                });
                setComments(data.comentarios || []);
            }
        } catch (err) {
            console.error("Error loading proposal:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProposal();
    }, [id]);

    const handleSaveEvaluation = async (status) => {
        if (!newComment.trim()) {
            alert("Por favor escribe un comentario.");
            return;
        }

        setSubmitting(true);
        try {
            await ProposalService.updateStatus(id, status, newComment);
            setNewComment('');
            fetchProposal(); // Refresh to show new comment
            alert("Evaluación guardada.");
        } catch (err) {
            console.error(err);
            alert("Error al guardar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        // Simple history back or specific route logic if needed
        navigate(-1);
    };

    if (loading) return <Box p={3}>Cargando...</Box>;
    if (!proposal) return <Box p={3}>Propuesta no encontrada.</Box>;

    const isDirector = userRole === 'director' || userRole === 'admin';

    return (
        <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} color="inherit">
                    Volver
                </Button>
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bold' }}>
                    Revisión de Propuesta
                </Typography>
                <Chip
                    label={proposal.status}
                    color={proposal.status === 'APROBADA' ? 'success' : proposal.status === 'PENDIENTE' ? 'warning' : 'primary'}
                    variant="outlined"
                />
            </Box>

            {/* Content Split */}
            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: PDF Viewer (60%) */}
                <Box sx={{ flex: 0.6, bgcolor: '#333', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0' }}>
                    {proposal.pdfUrl ? (
                        <iframe
                            src={proposal.pdfUrl}
                            title="PDF Viewer"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <Box sx={{ color: '#fff', p: 4, textAlign: 'center' }}>No PDF Available</Box>
                    )}
                </Box>

                {/* Right: Details & Comments (40%) */}
                <Box sx={{ flex: 0.4, display: 'flex', flexDirection: 'column', bgcolor: '#fff', overflow: 'hidden' }}>
                    {/* Info Card */}
                    <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
                            {proposal.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                {proposal.student.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight="bold">{proposal.student}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block">{proposal.career}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Comments Feed */}
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {comments.length === 0 && (
                            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                                No hay comentarios aún. Sé el primero.
                            </Typography>
                        )}
                        {comments.map((comment, index) => (
                            <Paper key={index} elevation={0} sx={{ p: 2, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" fontWeight="bold" color="primary.main">
                                        {comment.usuario?.nombres} {comment.usuario?.apellidos}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {/* TODO: Date format */}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.primary">
                                    {comment.descripcion}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>

                    {/* Action Area */}
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            placeholder="Escribe tu observación..."
                            variant="outlined"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                * Esto notificará al estudiante
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {isDirector ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleSaveEvaluation('RECHAZADA')}
                                            disabled={submitting}
                                        >
                                            Rechazar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleSaveEvaluation('APROBADA')}
                                            disabled={submitting}
                                        >
                                            Aprobar
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        onClick={() => handleSaveEvaluation('APROBADA_CON_COMENTARIOS')}
                                        disabled={submitting}
                                    >
                                        Enviar Comentario
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ProposalReview;