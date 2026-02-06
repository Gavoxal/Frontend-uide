import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Grid, TextField, Button, IconButton, Divider, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import { weeksData } from './mockWeeks';

function ReviewAdvance() {
    const { weekId, studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [week, setWeek] = useState(null);
    const [grade, setGrade] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Simular búsqueda de datos
        const foundWeek = weeksData.find(w => w.id === parseInt(weekId));
        if (foundWeek) {
            setWeek(foundWeek);
            const foundStudent = foundWeek.students.find(s => s.id === studentId);
            setStudent(foundStudent);
        }
    }, [weekId, studentId]);

    if (!student || !week) return <Typography>Cargando...</Typography>;

    const getFileIcon = (type) => {
        if (type === 'pdf') return <PictureAsPdfIcon sx={{ color: '#F40F02', fontSize: 30 }} />;
        if (type === 'zip') return <InsertDriveFileIcon sx={{ color: '#4CAF50', fontSize: 30 }} />;
        return <InsertDriveFileIcon sx={{ fontSize: 30 }} />;
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F4F6F8' }}>
            {/* Header Personalizado */}
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'white'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: '#000A9B' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" color="#000A9B" fontWeight="bold">
                        Revisión de Avances
                    </Typography>
                </Box>
                <IconButton>
                    <NotificationsNoneIcon />
                </IconButton>
            </Paper>

            <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Panel Izquierdo: Contenido */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h4" fontWeight="bold" color="text.primary">
                                    Semana {week.id}: Integración
                                </Typography>
                                <Chip
                                    label="PENDIENTE"
                                    sx={{
                                        bgcolor: '#FFF9C4',
                                        color: '#FBC02D',
                                        fontWeight: 'bold',
                                        borderRadius: 1
                                    }}
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                                Estudiante: <b>{student.name}</b> • Ene 12 - Ene 19
                            </Typography>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'white', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Resumen del Estudiante
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6 }}>
                                {student.summary || 'El estudiante no ha proporcionado un resumen.'}
                            </Typography>
                        </Paper>

                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            Archivos entregados
                        </Typography>

                        {student.files?.map((file, index) => (
                            <Paper
                                key={index}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderRadius: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: file.type === 'pdf' ? '#FFEBEE' : '#E8F5E9',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getFileIcon(file.type)}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {file.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {file.size}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    startIcon={file.type === 'pdf' ? <VisibilityIcon /> : <DownloadIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {file.type === 'pdf' ? 'Previsualizar' : 'Descargar'}
                                </Button>
                            </Paper>
                        ))}
                    </Box>

                    {/* Panel Derecho: Calificación */}
                    <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0 }}>
                        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'white', borderRadius: 2, position: 'sticky', top: 24 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                ✏️ Panel de Calificación
                            </Typography>

                            <Box sx={{ my: 4, textAlign: 'center' }}>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Calificación (0-10)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                                    <TextField
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        placeholder="0.0"
                                        variant="standard"
                                        inputProps={{
                                            style: { fontSize: 40, textAlign: 'center', width: 80, fontWeight: 'bold', color: '#555' }
                                        }}
                                        InputProps={{ disableUnderline: true }}
                                    />
                                    <Typography variant="h4" color="text.secondary">/10</Typography>
                                </Box>
                            </Box>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Comentarios
                            </Typography>
                            <TextField
                                multiline
                                rows={6}
                                fullWidth
                                placeholder="Escribe tus observaciones aqui..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                variant="outlined"
                                sx={{ mb: 3, bgcolor: '#F9FAFB' }}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                endIcon={<SendIcon />}
                                sx={{ mb: 2, bgcolor: '#C2185B', '&:hover': { bgcolor: '#880E4F' }, borderRadius: 2, py: 1.5 }}
                            >
                                Enviar Comentario
                            </Button>

                            <Button
                                variant="contained"
                                fullWidth
                                endIcon={<SaveIcon />}
                                sx={{ bgcolor: '#000A9B', borderRadius: 2, py: 1.5 }}
                            >
                                Guardar Calificación
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ReviewAdvance;
