import { Box, Typography, TextField, Button, Avatar, Divider, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { CommentService } from "../services/comment.service";

function CommentSection({ proposal }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    // Cargar comentarios iniciales desde la prop o recargar si es necesario
    useEffect(() => {
        if (proposal?.comentarios) {
            const mapped = proposal.comentarios.map(c => ({
                id: c.id,
                author: `${c.usuario?.nombres} ${c.usuario?.apellidos}`,
                role: c.usuario?.rol || 'Estudiante',
                text: c.descripcion,
                date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Reciente',
                avatar: (c.usuario?.nombres?.[0] || 'U') + (c.usuario?.apellidos?.[0] || '')
            }));
            setComments(mapped);
        }
    }, [proposal]);

    const handleAddComment = async () => {
        if (newComment.trim() && proposal?.id) {
            setLoading(true);
            try {
                const result = await CommentService.create({
                    descripcion: newComment,
                    propuestaId: proposal.id
                });

                // Obtener datos del usuario local para el comentario optimista
                // (En una app real, el backend devuelve el objeto completo con relaciones)
                const authorData = JSON.parse(localStorage.getItem('user') || '{}');

                const comment = {
                    id: result.id,
                    author: `${authorData.nombres} ${authorData.apellidos}` || "Tú",
                    role: authorData.rol || "Estudiante",
                    text: newComment,
                    date: new Date().toLocaleDateString(),
                    avatar: (authorData.nombres?.[0] || 'U') + (authorData.apellidos?.[0] || '')
                };

                setComments([...comments, comment]);
                setNewComment("");
            } catch (error) {
                console.error("Error al enviar comentario:", error);
                alert("No se pudo enviar el comentario: " + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Comentarios y Revisiones
            </Typography>

            {/* Comentario de Revisión Final (Director) */}
            {proposal?.comentarioRevision && (
                <Alert severity="info" sx={{ mb: 3, borderLeft: '4px solid #3b82f6' }}>
                    <Typography variant="subtitle2" fontWeight="bold">Observación de Revisión (Director):</Typography>
                    <Typography variant="body2">{proposal.comentarioRevision}</Typography>
                </Alert>
            )}

            {/* Lista de comentarios */}
            <Box sx={{ mb: 3 }}>
                {comments.length === 0 ? (
                    <Box sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: '#f9fafb',
                        borderRadius: 2
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            No hay comentarios adicionales aún.
                        </Typography>
                    </Box>
                ) : (
                    comments.map((comment, index) => (
                        <Box key={comment.id}>
                            <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: comment.role === 'Director' ? '#667eea' : '#ffa726',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {comment.avatar}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="subtitle2" fontWeight="600">
                                            {comment.author}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            • {comment.role} • {comment.date}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.primary">
                                        {comment.text}
                                    </Typography>
                                </Box>
                            </Box>
                            {index < comments.length - 1 && <Divider />}
                        </Box>
                    ))
                )}
            </Box>

            {/* Campo para nuevo comentario */}
            <Box sx={{
                p: 2,
                backgroundColor: '#f9fafb',
                borderRadius: 2,
                border: '1px solid #e5e7eb'
            }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Escribe tu comentario o pregunta..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                        },
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        sx={{
                            backgroundColor: '#667eea',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#5568d3',
                            },
                        }}
                    >
                        Enviar Comentario
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default CommentSection;
