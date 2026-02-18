import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    TextField,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

// Mock Data
const MOCK_DEFENSES = [
    {
        id: 1,
        studentName: "Juan Pérez",
        thesisTitle: "Sistema de IoT para agricultura inteligente",
        date: "2026-03-15",
        time: "10:00 AM",
        location: "Auditorio A",
        modality: "Presencial",
        documents: [
            { name: "Tesis_Final.pdf", url: "#" },
            { name: "Presentacion.pptx", url: "#" }
        ],
        comments: [
            { id: 1, author: "Dr. Roberto", text: "Excelente presentación, revisar diapositiva 10.", date: "2026-03-10" }
        ]
    },
    {
        id: 2,
        studentName: "María García",
        thesisTitle: "Aplicación móvil de gestión académica",
        date: "2026-03-16",
        time: "14:30 PM",
        location: "Sala Virtual 1",
        modality: "Virtual",
        documents: [
            { name: "Tesis_vFinal.pdf", url: "#" }
        ],
        comments: []
    }
];

function PublicDefense() {
    const [defenses, setDefenses] = useState(MOCK_DEFENSES);
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [selectedDefense, setSelectedDefense] = useState(null);
    const [newComment, setNewComment] = useState('');

    const handleOpenComments = (defense) => {
        setSelectedDefense(defense);
        setOpenCommentDialog(true);
    };

    const handleCloseComments = () => {
        setOpenCommentDialog(false);
        setSelectedDefense(null);
        setNewComment('');
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            author: "Tú",
            text: newComment,
            date: new Date().toISOString().split('T')[0]
        };

        const updatedDefenses = defenses.map(d => {
            if (d.id === selectedDefense.id) {
                return { ...d, comments: [...d.comments, comment] };
            }
            return d;
        });

        setDefenses(updatedDefenses);
        // Actualizar el seleccionado también para que se refleje en el modal abierto
        setSelectedDefense({ ...selectedDefense, comments: [...selectedDefense.comments, comment] });
        setNewComment('');
    };

    const getModalityColor = (modality) => {
        return modality === 'Virtual' ? 'secondary' : 'primary';
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 2 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Defensas Públicas 🎓
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Cronograma de defensas y evaluación de estudiantes.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {defenses.map((defense) => (
                    <Grid size={{ xs: 12 }} key={defense.id}>
                        <Card sx={{ borderRadius: 3, boxShadow: 2, transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
                            <CardContent sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {defense.studentName}
                                            </Typography>
                                            <Chip label={defense.modality} color={getModalityColor(defense.modality)} size="small" variant="outlined" />
                                        </Box>
                                        <Typography variant="body1" fontWeight="500" color="text.primary" gutterBottom>
                                            {defense.thesisTitle}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap', color: 'text.secondary' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <EventIcon fontSize="small" />
                                                <Typography variant="body2">{defense.date}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeIcon fontSize="small" />
                                                <Typography variant="body2">{defense.time}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LocationOnIcon fontSize="small" />
                                                <Typography variant="body2">{defense.location}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, borderLeft: { md: '1px solid #eee' }, pl: { md: 2 } }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Documentos:</Typography>
                                            {defense.documents.map((doc, idx) => (
                                                <Button
                                                    key={idx}
                                                    startIcon={<VisibilityIcon />}
                                                    size="small"
                                                    sx={{ textTransform: 'none', justifyContent: 'flex-start', width: '100%' }}
                                                >
                                                    {doc.name}
                                                </Button>
                                            ))}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            startIcon={<CommentIcon />}
                                            onClick={() => handleOpenComments(defense)}
                                            sx={{ backgroundColor: '#667eea', textTransform: 'none', fontWeight: 600 }}
                                        >
                                            Ver/Añadir Comentarios ({defense.comments.length})
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Modal de Comentarios */}
            <Dialog open={openCommentDialog} onClose={handleCloseComments} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Comentarios y Observaciones
                </DialogTitle>
                <DialogContent dividers>
                    {selectedDefense && (
                        <Box>
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Estudiante</Typography>
                                <Typography variant="body1" fontWeight="600">{selectedDefense.studentName}</Typography>
                            </Box>

                            <List>
                                {selectedDefense.comments.length > 0 ? (
                                    selectedDefense.comments.map((comment) => (
                                        <ListItem key={comment.id} alignItems="flex-start" sx={{ bgcolor: 'white', mb: 1, borderRadius: 1, border: '1px solid #eee' }}>
                                            <ListItemAvatar>
                                                <Avatar>{comment.author.charAt(0)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="subtitle2" fontWeight="bold">{comment.author}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{comment.date}</Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {comment.text}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                        <Typography>No hay comentarios aún.</Typography>
                                    </Box>
                                )}
                            </List>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="Escribe un comentario..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    variant="outlined"
                                />
                                <Button
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    sx={{ backgroundColor: '#667eea', height: 'fit-content', mt: 1 }}
                                >
                                    Enviar
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseComments}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default PublicDefense;
