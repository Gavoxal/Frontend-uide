import { Box, Typography, TextField, Button, Avatar, Divider } from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

function CommentSection({ proposalId }) {
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Director Académico",
            role: "Director",
            text: "La propuesta está bien estructurada, sin embargo necesita más detalle en la metodología.",
            date: "2026-01-28",
            avatar: "D"
        }
    ]);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: comments.length + 1,
                author: "Abel Yangari",
                role: "Estudiante",
                text: newComment,
                date: new Date().toISOString().split('T')[0],
                avatar: "AY"
            };
            setComments([...comments, comment]);
            setNewComment("");
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
                            No hay comentarios aún. Sé el primero en comentar.
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
