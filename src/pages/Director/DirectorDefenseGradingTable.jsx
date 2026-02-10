import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Chip, Button, Tabs, Tab, CircularProgress } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';
import DefenseGradingModal from '../../components/Director/DefenseGradingModal.mui';
import { DefenseService } from '../../services/defense.service';

/**
 * Página de calificación de defensas para el Director
 * Muestra estudiantes asignados con sus calificaciones y comentarios
 */
function DirectorDefenseGradingTable() {
    const [tabValue, setTabValue] = useState(0); // 0: Privada, 1: Pública
    const [loading, setLoading] = useState(false);
    const [studentsReady, setStudentsReady] = useState([]);
    const [openGradingModal, setOpenGradingModal] = useState(false);
    const [gradingStudent, setGradingStudent] = useState(null);

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const fetchProposals = async () => {
        setLoading(true);
        try {
            const data = await DefenseService.getProposalsForDefense();
            // Filtrar solo las propuestas aprobadas o aprobadas con comentarios
            const filteredProposals = data.filter(p =>
                p.estado === 'APROBADA' || p.estado === 'APROBADA_CON_COMENTARIOS'
            ).map(p => ({
                id: p.id,
                name: `${p.estudiante.nombres} ${p.estudiante.apellidos}`,
                email: p.estudiante.correoInstitucional,
                topic: p.titulo,
                director: p.trabajosTitulacion?.[0]?.tutor ? `${p.trabajosTitulacion[0].tutor.nombres} ${p.trabajosTitulacion[0].tutor.apellidos}` : 'No asignado',
                career: p.carrera || p.estudiante.estudiantePerfil?.escuela || 'N/A',
                documents: {
                    tesis: p.entregablesFinales?.find(e => e.tipo === 'TESIS' && e.isActive) || null,
                    userManual: p.entregablesFinales?.find(e => e.tipo === 'MANUAL_USUARIO' && e.isActive) || null,
                    scientificArticle: p.entregablesFinales?.find(e => e.tipo === 'ARTICULO' && e.isActive) || null
                },
                privateDefense: {
                    id: p.defensaPrivada?.id || null,
                    status: (p.defensaPrivada?.estado === 'PROGRAMADA' || p.defensaPrivada?.estado === 'APROBADA') ? 'assigned' : (p.defensaPrivada?.estado?.toLowerCase() || 'pending'),
                    myEvaluation: p.defensaPrivada?.myEvaluation || null
                },
                publicDefense: {
                    id: p.defensaPublica?.id || null,
                    status: (p.defensaPublica?.estado === 'PROGRAMADA' || p.defensaPublica?.estado === 'APROBADA') ? 'assigned' : (p.defensaPublica?.estado?.toLowerCase() || 'locked'),
                    myEvaluation: p.defensaPublica?.myEvaluation || null
                }
            }));
            setStudentsReady(filteredProposals);
        } catch (error) {
            console.error("Error fetching proposals for defense:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenGrading = (student) => {
        setGradingStudent(student);
        setOpenGradingModal(true);
    };

    const handleCloseGrading = () => {
        setOpenGradingModal(false);
        setGradingStudent(null);
    };

    // Filtrar estudiantes basado en el tipo de defensa actual
    const filteredStudents = studentsReady.filter(student => {
        const defense = tabValue === 0 ? student.privateDefense : student.publicDefense;
        return defense && (defense.status === 'assigned' || defense.status === 'approved');
    });

    return (
        <Box sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="900" sx={{ color: '#1a237e', mb: 1 }}>
                    Panel de Evaluación y Registro de Notas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Gestión de calificaciones y comentarios para defensas asignadas
                </Typography>
            </Box>

            {/* Pestañas */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                    bgcolor: '#f1f5f9',
                    p: 0.8,
                    borderRadius: '16px',
                    display: 'inline-flex',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="transparent"
                        sx={{
                            '& .MuiTabs-flexContainer': { gap: 1 },
                            '& .MuiTab-root': {
                                borderRadius: '12px',
                                minHeight: '48px',
                                px: 4,
                                transition: 'all 0.3s',
                                fontWeight: 700,
                                color: '#64748b',
                                '&.Mui-selected': {
                                    bgcolor: 'white',
                                    color: '#1e3a8a',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                            }
                        }}
                    >
                        <Tab label="Defensa Privada" icon={<LockIcon sx={{ mr: 1 }} />} iconPosition="start" />
                        <Tab label="Defensa Pública" icon={<SchoolIcon sx={{ mr: 1 }} />} iconPosition="start" />
                    </Tabs>
                </Box>
            </Box>

            {/* Tabla */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
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
                                    {['Estudiante', 'Tema de Tesis', 'Director / Tutor', 'Mi Calificación', 'Mis Comentarios', 'Documentación', 'Acciones'].map((head) => (
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
                                {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                                    const defense = tabValue === 0 ? student.privateDefense : student.publicDefense;
                                    const docsSize = [student.documents.tesis, student.documents.userManual, student.documents.scientificArticle].filter(Boolean).length;

                                    // Extraer calificación y comentarios del usuario actual
                                    const myEvaluation = defense.myEvaluation || {};
                                    const myGrade = myEvaluation.calificacion || 'N/A';
                                    const myComment = myEvaluation.comentario || 'Sin comentarios';

                                    return (
                                        <Box component="tr" key={student.id} sx={{
                                            '&:hover': { bgcolor: '#fcfcfc' },
                                            transition: 'background 0.2s',
                                            borderBottom: '1px solid #f1f5f9'
                                        }}>
                                            <Box component="td" sx={{ p: 2.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: '0.9rem' }}>
                                                        {getInitials(student.name)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="700" color="#1e293b">{student.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{student.career}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box component="td" sx={{ p: 2.5, maxWidth: 250 }}>
                                                <Typography variant="caption" sx={{
                                                    fontWeight: 500, color: '#475569',
                                                    display: '-webkit-box', overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical', WebkitLineClamp: 2
                                                }}>
                                                    {student.topic}
                                                </Typography>
                                            </Box>
                                            <Box component="td" sx={{ p: 2.5 }}>
                                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>{student.director}</Typography>
                                            </Box>
                                            <Box component="td" sx={{ p: 2.5 }}>
                                                {myGrade !== 'N/A' ? (
                                                    <Chip
                                                        label={`${myGrade}/10`}
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
                                                    {myComment}
                                                </Typography>
                                            </Box>
                                            <Box component="td" sx={{ p: 2.5 }}>
                                                <Chip
                                                    size="small"
                                                    label={`${docsSize}/3 Documentos`}
                                                    color={docsSize === 3 ? "success" : "warning"}
                                                    sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}
                                                />
                                            </Box>
                                            <Box component="td" sx={{ p: 2.5 }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleOpenGrading(student)}
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
                                    );
                                }) : (
                                    <Box component="tr">
                                        <Box component="td" colSpan={7} sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No se encontraron defensas asignadas para calificar.
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Modal de Calificación */}
            <DefenseGradingModal
                open={openGradingModal}
                onClose={handleCloseGrading}
                student={gradingStudent}
                type={tabValue === 0 ? 'private' : 'public'}
                onSave={fetchProposals}
            />
        </Box>
    );
}

export default DirectorDefenseGradingTable;
