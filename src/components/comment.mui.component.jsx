import { Box, Typography, TextField, Button, Avatar, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import RateReviewIcon from '@mui/icons-material/RateReview';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { CommentService } from "../services/comment.service";

function CommentSection({ proposalId, revisionComment }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (proposalId) {
            fetchComments();
        }
    }, [proposalId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await CommentService.getByProposal(proposalId);
            if (data) {
                const mappedComments = data.map(c => ({
                    id: c.id,
                    author: `${c.usuario?.nombres} ${c.usuario?.apellidos}`,
                    role: c.usuario?.rol || 'Estudiante',
                    text: c.descripcion,
                    date: new Date(c.createdAt || Date.now()).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    avatar: c.usuario?.nombres?.charAt(0) || '?',
                    isMe: c.usuario?.rol === 'ESTUDIANTE'
                }));
                setComments(mappedComments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() && proposalId) {
            try {
                const result = await CommentService.create({
                    descripcion: newComment,
                    propuestaId: Number(proposalId)
                });

                if (result) {
                    await fetchComments();
                    setNewComment("");
                }
            } catch (error) {
                console.error("Error adding comment:", error);
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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Revisión Oficial del Comité - Diseño Moderno e Integrado */}
            {revisionComment && (
                <Box sx={{
                    mb: 3,
                    p: 2.5,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    border: '1px solid #bae6fd',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        backgroundColor: '#0ea5e9'
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            p: 0.5,
                            borderRadius: '50%',
                            bgcolor: '#38bdf8',
                            color: 'white'
                        }}>
                            <RateReviewIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Typography variant="subtitle2" fontWeight="800" color="#0369a1" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Revisión del Comité
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="#075985" sx={{ lineHeight: 1.7, fontWeight: 500 }}>
                        {revisionComment}
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1 }}>
                <Typography variant="h6" fontWeight="700" sx={{ color: '#1e293b' }}>
                    Hilo de Discusión
                </Typography>
                {loading && <CircularProgress size={18} thickness={6} sx={{ color: '#6366f1' }} />}
            </Box>

            {/* Chat Messages Area */}
            <Box sx={{
                flex: 1,
                mb: 3,
                maxHeight: '450px',
                minHeight: '200px',
                overflowY: 'auto',
                pr: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                '&::-webkit-scrollbar': { width: '5px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '10px' },
                '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' }
            }}>
                {comments.length === 0 && !loading ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 8,
                        bgcolor: '#f8fafc',
                        borderRadius: 4,
                        border: '2px dashed #e2e8f0'
                    }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            Aún no hay comentarios.
                        </Typography>
                    </Box>
                ) : (
                    comments.map((comment, index) => (
                        <Box key={comment.id || index} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: comment.isMe ? 'flex-end' : 'flex-start'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: comment.isMe ? 'row-reverse' : 'row',
                                gap: 1.5,
                                maxWidth: '85%'
                            }}>
                                <Avatar sx={{
                                    width: 36,
                                    height: 36,
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    bgcolor: comment.isMe ? '#4f46e5' : '#f59e0b',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                }}>
                                    {comment.avatar}
                                </Avatar>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: comment.isMe ? 'flex-end' : 'flex-start' }}>
                                    <Box sx={{
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: comment.isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        bgcolor: comment.isMe ? '#4f46e5' : '#ffffff',
                                        color: comment.isMe ? '#ffffff' : '#334155',
                                        boxShadow: comment.isMe
                                            ? '0 10px 15px -3px rgba(79, 70, 229, 0.2)'
                                            : '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                                        border: comment.isMe ? 'none' : '1px solid #f1f5f9'
                                    }}>
                                        {!comment.isMe && (
                                            <Typography variant="caption" fontWeight="800" sx={{ display: 'block', mb: 0.5, color: '#64748b' }}>
                                                {comment.author} <Box component="span" sx={{ fontWeight: 500, opacity: 0.8, ml: 0.5 }}>• {comment.role}</Box>
                                            </Typography>
                                        )}
                                        <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.9rem' }}>
                                            {comment.text}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ mt: 0.5, px: 0.5, color: '#94a3b8', fontSize: '0.7rem', fontWeight: 500 }}>
                                        {comment.date}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {/* Modern Input Bar */}
            <Box sx={{
                p: 0.5,
                bgcolor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:focus-within': {
                    borderColor: '#6366f1',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.12)',
                    transform: 'translateY(-2px)'
                }
            }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Escribe un mensaje aquí..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{
                        ml: 2,
                        '& textarea': {
                            fontSize: '0.9rem',
                            color: '#475569',
                            py: 1.5
                        }
                    }}
                />
                <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || loading}
                    sx={{
                        minWidth: 'auto',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        p: 0,
                        mr: 0.5,
                        bgcolor: '#6366f1',
                        color: 'white',
                        '&:hover': {
                            bgcolor: '#4f46e5',
                            transform: 'scale(1.05)'
                        },
                        '&.Mui-disabled': {
                            bgcolor: '#f1f5f9',
                            color: '#cbd5e1'
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    <SendIcon sx={{ fontSize: 18, ml: 0.4 }} />
                </Button>
            </Box>
        </Box>
    );
}

export default CommentSection;
