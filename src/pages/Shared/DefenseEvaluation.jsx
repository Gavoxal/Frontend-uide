import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Chip, Button, CircularProgress } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DefenseGradingModal from '../../components/Director/DefenseGradingModal.mui';
import { DefenseService } from '../../services/defense.service';
import { getDataUser } from '../../storage/user.model.jsx';

function DefenseEvaluation() {
    const [loading, setLoading] = useState(false);
    const [defenses, setDefenses] = useState([]);
    const [openGradingModal, setOpenGradingModal] = useState(false);
    const [selectedDefense, setSelectedDefense] = useState(null);
    const user = getDataUser();

    const fetchMyDefenses = async () => {
        setLoading(true);
        try {
            const data = await DefenseService.getDefensasJurado();

            // Backend retorna un formato plano: { id, tipo, tema, estudiante, fecha, ... }
            const formattedDefenses = data.map(defense => {
                const isPrivate = defense.tipo === 'PRIVADA';

                return {
                    id: defense.propuestaId,
                    name: defense.estudiante || 'N/A',
                    topic: defense.tema || 'Sin título',
                    director: 'N/A',
                    documents: {
                        tesis: defense.entregablesFinales?.find(e => e.tipo === 'TESIS') || null,
                        userManual: defense.entregablesFinales?.find(e => e.tipo === 'MANUAL_USUARIO') || null,
                        scientificArticle: defense.entregablesFinales?.find(e => e.tipo === 'ARTICULO') || null
                    },
                    defenseType: isPrivate ? 'private' : 'public',
                    defenseId: defense.id,
                    defenseDate: defense.fecha ? new Date(defense.fecha).toLocaleDateString('es-EC') : 'N/A',
                    defenseTime: defense.hora ? new Date(defense.hora).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
                    classroom: defense.aula || 'N/A',
                    status: defense.estado || 'PENDIENTE',
                    myRole: defense.rol,
                    myGrade: defense.calificacion || null,
                    myComment: defense.comentario || null,
                    privateDefense: isPrivate ? { id: defense.id, status: 'assigned' } : { id: null, status: 'locked' },
                    publicDefense: !isPrivate ? { id: defense.id, status: 'assigned' } : { id: null, status: 'locked' }
                };
            });

            setDefenses(formattedDefenses);
        } catch (error) {
            console.error('Error fetching defenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDefenses();
    }, []);

    const handleOpenGrading = (defense) => {
        setSelectedDefense(defense);
        setOpenGradingModal(true);
    };

    const handleCloseGrading = () => {
        setOpenGradingModal(false);
        setSelectedDefense(null);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Mis Defensas Asignadas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Evaluación y calificación como miembro del tribunal
                    </Typography>
                </Box>
            </Box>

            {/* Grading Table */}
            <Paper elevation={0} sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
                <Box sx={{ overflowX: 'auto' }}>
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <Box component="thead" sx={{ bgcolor: '#f8fafc' }}>
                            <Box component="tr">
                                {['Estudiante', 'Tema de Tesis', 'Tipo Defensa', 'Mi Calificación', 'Mis Comentarios', 'Fecha/Hora', 'Estado', 'Acciones'].map((head) => (
                                    <Box component="th" key={head} sx={{
                                        p: 2.5, textAlign: 'left',
                                        fontSize: '0.75rem', fontWeight: '800',
                                        color: '#64748b', textTransform: 'uppercase',
                                        letterSpacing: 1, borderBottom: '2px solid #edf2f7'
                                    }}>
                                        {head}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Box component="tbody">
                            {defenses.length > 0 ? defenses.map((defense) => (
                                <Box component="tr" key={`${defense.defenseType}-${defense.id}`} sx={{
                                    '&:hover': { bgcolor: '#fcfcfc' },
                                    transition: 'background 0.2s',
                                    borderBottom: '1px solid #f1f5f9'
                                }}>
                                    <Box component="td" sx={{ p: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: '0.9rem' }}>
                                                {getInitials(defense.name)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="700" color="#1e293b">{defense.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{defense.career}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box component="td" sx={{ p: 2.5, maxWidth: 300 }}>
                                        <Typography variant="caption" sx={{
                                            fontWeight: 500, color: '#475569',
                                            display: '-webkit-box', overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical', WebkitLineClamp: 2
                                        }}>
                                            {defense.topic}
                                        </Typography>
                                    </Box>
                                    <Box component="td" sx={{ p: 2.5 }}>
                                        <Chip
                                            size="small"
                                            label={defense.defenseType === 'private' ? 'Privada' : 'Pública'}
                                            color={defense.defenseType === 'private' ? 'info' : 'success'}
                                            sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}
                                        />
                                    </Box>
                                    <Box component="td" sx={{ p: 2.5 }}>
                                        {defense.myGrade !== null && defense.myGrade !== undefined ? (
                                            <Chip
                                                label={`${defense.myGrade}/10`}
                                                color="primary"
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                Sin calificar
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box component="td" sx={{ p: 2.5, maxWidth: 200 }}>
                                        <Typography variant="caption" sx={{
                                            color: '#475569',
                                            display: '-webkit-box', overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical', WebkitLineClamp: 2
                                        }}>
                                            {defense.myComment || 'Sin comentarios'}
                                        </Typography>
                                    </Box>
                                    <Box component="td" sx={{ p: 2.5 }}>
                                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                            {defense.defenseDate}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {defense.defenseTime} - {defense.classroom}
                                        </Typography>
                                    </Box>
                                    <Box component="td" sx={{ p: 2.5 }}>
                                        <Chip
                                            size="small"
                                            label={defense.status}
                                            color={
                                                defense.status === 'APROBADA' ? 'success' :
                                                    defense.status === 'RECHAZADA' ? 'error' :
                                                        defense.status === 'PROGRAMADA' ? 'warning' : 'default'
                                            }
                                            sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}
                                        />
                                    </Box>
                                    <Box component="td" sx={{ p: 2.5 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleOpenGrading(defense)}
                                            sx={{
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                boxShadow: 'none',
                                                '&:hover': { boxShadow: '0 4px 12px rgba(25,118,210,0.2)' }
                                            }}
                                        >
                                            Calificar
                                        </Button>
                                    </Box>
                                </Box>
                            )) : (
                                <Box component="tr">
                                    <Box component="td" colSpan={8} sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No tienes defensas asignadas en este momento.
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Grading Modal */}
            <DefenseGradingModal
                open={openGradingModal}
                onClose={handleCloseGrading}
                student={selectedDefense}
                type={selectedDefense?.defenseType}
                onSave={fetchMyDefenses}
            />
        </Box>
    );
}

export default DefenseEvaluation;
