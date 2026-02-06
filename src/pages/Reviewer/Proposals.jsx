import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Divider,
    Avatar,
    Paper,
    Chip
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AlertMui from '../../components/alert.mui.component';

// Custom Project Components
import TextMui from '../../components/text.mui.component';
import ButtonMui from '../../components/button.mui.component';
import InputMui from '../../components/input.mui.component';

const MOCK_PROPOSALS = [
    {
        id: 1,
        studentName: "Eduardo Pardo",
        studentId: "123456",
        titulo: 'Sistema de Gestión de Tesis Universitaria',
        areaInvestigacion: 'Desarrollo de Software',
        objetivo: 'Desarrollar una plataforma web integral para la gestión, seguimiento y evaluación de trabajos de titulación en la UIDE, optimizando los procesos administrativos y académicos.',
        problematica: 'Actualmente el proceso de tesis se maneja mediante correos y documentos dispersos, lo que dificulta el seguimiento y causa retrasos en las aprobaciones.',
        alcance: 'El sistema incluirá módulos para estudiantes, tutores, revisores y directores. Permitirá subida de archivos, calificación en línea y generación de reportes.',
        file: { name: 'propuesta_eduardo_v1.pdf', size: '2.4 MB' },
        submittedDate: '2026-01-15',
        comments: [
            { author: 'Revisor', text: 'El alcance parece un poco amplio para un solo semestre.', date: '2026-01-16' },
            { author: 'Eduardo Pardo', text: 'Podríamos limitar el módulo de directores para una segunda fase.', date: '2026-01-17' }
        ]
    },
    {
        id: 2,
        studentName: "Gabriel Serrango",
        studentId: "789012",
        titulo: 'Plataforma de Monitoreo de Seguridad con IA',
        areaInvestigacion: 'Inteligencia Artificial',
        objetivo: 'Implementar un sistema de visión por computador capaz de detectar comportamientos anómalos en tiempo real utilizando cámaras de seguridad existentes.',
        problematica: 'La vigilancia manual es ineficiente y propensa a errores humanos. Se requiere un sistema automatizado que alerte solo cuando sea necesario.',
        alcance: 'Prototipo funcional que procese video de 2 cámaras simultáneamente y envíe alertas a un dashboard web.',
        file: { name: 'propuesta_gabriel_final.pdf', size: '3.1 MB' },
        submittedDate: '2026-01-16',
        comments: []
    }
];

function ReviewerProposals() {
    const [proposals, setProposals] = useState(MOCK_PROPOSALS);
    const [newComments, setNewComments] = useState({});
    const [alertState, setAlertState] = useState({ open: false, title: '', message: '', status: 'info' });

    const handleCommentChange = (id, value) => {
        setNewComments(prev => ({ ...prev, [id]: value }));
    };

    const handleSendComment = (id, studentName) => {
        const text = newComments[id];
        if (!text || text.trim() === "") return;

        // Mock adding comment
        const updatedProposals = proposals.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    comments: [...(p.comments || []), { author: 'Usted (Revisor)', text: text, date: new Date().toISOString().split('T')[0] }]
                };
            }
            return p;
        });
        setProposals(updatedProposals);
        setNewComments(prev => ({ ...prev, [id]: '' }));

        setAlertState({
            open: true,
            title: 'Comentario Publicado',
            message: `Tu comentario ha sido agregado a la discusión con ${studentName}.`,
            status: 'success'
        });
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <TextMui
                    value="Foro de Revisión de Propuestas"
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                />
                <TextMui
                    value="Espacio de discusión y retroalimentación con los estudiantes"
                    variant="body1"
                    color="text.secondary"
                />
            </Box>

            <Grid container spacing={3}>
                {proposals.map((proposal) => (
                    <Grid item xs={12} key={proposal.id}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                {/* Header: Student Info (No Status) */}
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                                        {proposal.studentName.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <TextMui
                                            value={proposal.studentName}
                                            variant="h6"
                                            fontWeight="bold"
                                        />
                                        <TextMui
                                            value={`Enviado el: ${proposal.submittedDate}`}
                                            variant="body2"
                                            color="text.secondary"
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* Proposal Content */}
                                <Box sx={{ mb: 3 }}>
                                    <TextMui
                                        value={proposal.titulo}
                                        variant="h5"
                                        fontWeight="bold"
                                        color="primary"
                                        gutterBottom
                                    />

                                    <Grid container spacing={4} sx={{ mt: 1 }}>
                                        <Grid item xs={12} md={8}>
                                            <Box sx={{ mb: 3 }}>
                                                <TextMui
                                                    value="Objetivo General"
                                                    variant="subtitle2"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                />
                                                <TextMui
                                                    value={proposal.objetivo}
                                                    variant="body1"
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>
                                            <Box sx={{ mb: 3 }}>
                                                <TextMui
                                                    value="Problemática"
                                                    variant="subtitle2"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                />
                                                <TextMui
                                                    value={proposal.problematica}
                                                    variant="body1"
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                                <TextMui
                                                    value="Detalles"
                                                    variant="subtitle2"
                                                    fontWeight="bold"
                                                    gutterBottom
                                                />
                                                <Chip label={proposal.areaInvestigacion} variant="outlined" sx={{ mb: 2, width: '100%' }} />

                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    p: 1.5,
                                                    backgroundColor: 'white',
                                                    borderRadius: 1,
                                                    border: '1px solid #e0e0e0',
                                                    cursor: 'pointer',
                                                    '&:hover': { borderColor: '#1976d2' }
                                                }}>
                                                    <DescriptionIcon color="primary" />
                                                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                        <TextMui value={proposal.file.name} variant="body2" noWrap fontWeight="500" />
                                                        <TextMui value={proposal.file.size} variant="caption" color="text.secondary" />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Forum / Discussion Section */}
                                <Paper elevation={0} sx={{ backgroundColor: '#f5f7fa', p: 3, borderRadius: 2, border: '1px solid #eef2f6' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                        <ForumIcon color="primary" />
                                        <TextMui
                                            value="Foro de Discusión"
                                            variant="h6"
                                            fontWeight="bold"
                                            color="primary"
                                        />
                                    </Box>

                                    {/* History */}
                                    {proposal.comments && proposal.comments.length > 0 && (
                                        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {proposal.comments.map((comment, index) => (
                                                <Box key={index} sx={{
                                                    display: 'flex',
                                                    gap: 2,
                                                    alignItems: 'flex-start',
                                                    flexDirection: comment.author.includes('Revisor') || comment.author.includes('Usted') ? 'row-reverse' : 'row'
                                                }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: comment.author.includes('Revisor') ? '#1976d2' : '#ed6c02' }}>
                                                        <PersonIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{
                                                        backgroundColor: 'white',
                                                        p: 2,
                                                        borderRadius: 2,
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                        maxWidth: '80%'
                                                    }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, gap: 2 }}>
                                                            <TextMui value={comment.author} variant="caption" fontWeight="bold" />
                                                            <TextMui value={comment.date} variant="caption" color="text.secondary" />
                                                        </Box>
                                                        <TextMui value={comment.text} variant="body2" />
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    {/* Input Area */}
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 2 }}>
                                        <Avatar sx={{ bgcolor: '#1976d2' }}>R</Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <InputMui
                                                multiline={true}
                                                rows={2}
                                                placeholder="Escribe un comentario..."
                                                value={newComments[proposal.id] || ''}
                                                onChange={(e) => handleCommentChange(proposal.id, e.target.value)}
                                                sx={{ backgroundColor: 'white', mb: 1 }}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Box sx={{ width: '150px' }}>
                                                    <ButtonMui
                                                        name="Responder"
                                                        onClick={() => handleSendComment(proposal.id, proposal.studentName)}
                                                        endIcon={<SendIcon />}
                                                        backgroundColor="#1976d2"
                                                        size="small"
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <AlertMui
                open={alertState.open}
                handleClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                status={alertState.status}
            />
        </Box>
    );
}

export default ReviewerProposals;
