import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Chip, Avatar, Tooltip, Tabs, Tab, Paper, Button } from '@mui/material';
import SearchBar from '../../components/SearchBar.component';
import TextMui from '../../components/text.mui.component';
import TribunalAssignment from '../../components/Director/TribunalAssignment.mui';
import StatsCard from '../../components/common/StatsCard';
import InputMui from '../../components/input.mui.component';
import AlertMui from '../../components/alert.mui.component';
import NotificationMui from '../../components/notification.mui.component';
import DefenseGradingModal from '../../components/Director/DefenseGradingModal.mui';
import { DefenseService } from '../../services/defense.service';
import { apiFetch } from '../../services/api';
import { getDataUser } from '../../storage/user.model.jsx';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function ThesisDefense() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [tabValue, setTabValue] = useState(0); // 0: Privada, 1: Pública
    const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [pendingAssignmentData, setPendingAssignmentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [studentsReady, setStudentsReady] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Nueva vista de calificación
    const [openGradingModal, setOpenGradingModal] = useState(false);
    const [gradingStudent, setGradingStudent] = useState(null);

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
                campus: p.estudiante.estudiantePerfil?.sede || 'UIDE',
                documents: {
                    tesis: p.entregablesFinales?.find(e => e.tipo === 'TESIS' && e.isActive) || null,
                    userManual: p.entregablesFinales?.find(e => e.tipo === 'MANUAL_USUARIO' && e.isActive) || null,
                    scientificArticle: p.entregablesFinales?.find(e => e.tipo === 'ARTICULO' && e.isActive) || null
                },
                privateDefense: {
                    id: p.defensaPrivada?.id || null,
                    estado: p.defensaPrivada?.estado || 'PENDIENTE',
                    status: (p.defensaPrivada?.estado === 'APROBADA') ? 'approved' :
                        (p.defensaPrivada?.estado === 'RECHAZADA') ? 'failed' :
                            (p.defensaPrivada?.estado === 'PROGRAMADA' ? 'assigned' : 'pending'),
                    date: p.defensaPrivada?.fechaDefensa ? p.defensaPrivada.fechaDefensa.split('T')[0] : null,
                    time: p.defensaPrivada?.horaDefensa ? new Date(p.defensaPrivada.horaDefensa).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
                    classroom: p.defensaPrivada?.aula || null,
                    calificacion: p.defensaPrivada?.calificacion || null,
                    tribunal: p.defensaPrivada?.participantes || []
                },
                publicDefense: {
                    id: p.defensaPublica?.id || null,
                    estado: p.defensaPublica?.estado || 'LOCKED',
                    status: (p.defensaPublica?.estado === 'APROBADA') ? 'approved' :
                        (p.defensaPublica?.estado === 'RECHAZADA') ? 'failed' :
                            (p.defensaPublica?.estado === 'PROGRAMADA' ? 'assigned' :
                                (p.defensaPrivada?.estado === 'APROBADA' || (Number(p.defensaPrivada?.calificacion) >= 7) ? 'pending' : 'locked')),
                    date: p.defensaPublica?.fechaDefensa ? p.defensaPublica.fechaDefensa.split('T')[0] : null,
                    time: p.defensaPublica?.horaDefensa ? new Date(p.defensaPublica.horaDefensa).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
                    classroom: p.defensaPublica?.aula || null,
                    calificacion: p.defensaPublica?.calificacion || null,
                    tribunal: p.defensaPublica?.participantes || []
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

    const handleCardClick = (student) => {
        // Validación de documentos para defensa privada
        if (tabValue === 0) {
            const docs = student.documents;
            const allDocsReady = docs.tesis && docs.userManual && docs.scientificArticle;
            const isAssigned = student.privateDefense.status === 'assigned';
            const isFailed = student.privateDefense.status === 'failed';

            if (!allDocsReady && !isAssigned && !isFailed) {
                setErrorMsg("El estudiante debe subir todos los documentos (Tesis, Manual de Usuario y Artículo Científico) antes de asignar la defensa.");
                return;
            }
        }
        setSelectedStudent(student);
    };

    const handleCloseAssignment = () => {
        setSelectedStudent(null);
    };

    const handleOpenGrading = (student) => {
        setGradingStudent(student);
        setOpenGradingModal(true);
    };

    const handleCloseGrading = () => {
        setOpenGradingModal(false);
        setGradingStudent(null);
    };

    // Paso 1: Recibir datos del componente hijo y pedir confirmación
    const handleAssignmentRequest = (assignmentData) => {
        setPendingAssignmentData(assignmentData);
        setOpenConfirmAlert(true);
        setSelectedStudent(null); // Cerrar el modal de asignación para mostrar la alerta de confirmación
    };

    const handleDownload = async (urlArchivo, fileName) => {
        try {
            const fileNameFromUrl = urlArchivo.split('/').pop();
            const res = await apiFetch(`/api/v1/entregables/file/${fileNameFromUrl}`);
            if (!res.ok) throw new Error('Error al descargar archivo');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || fileNameFromUrl;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading file:", error);
            setErrorMsg("No se pudo descargar el archivo. Por favor intente más tarde.");
        }
    };

    // Paso 2: Confirmar y Guardar Real
    const confirmSaveAssignment = async () => {
        const studentToSave = selectedStudent || pendingAssignmentData?.student;
        if (!studentToSave || !pendingAssignmentData) return;

        setLoading(true);
        try {
            const isPrivate = tabValue === 0;
            const scheduleFunc = isPrivate ? DefenseService.schedulePrivate : DefenseService.schedulePublic;

            // 1. Programar la defensa
            const defenseRes = await scheduleFunc(studentToSave.id, {
                fechaDefensa: pendingAssignmentData.date,
                horaDefensa: pendingAssignmentData.time,
                aula: pendingAssignmentData.classroom
            });

            // 2. Asignar participantes (Tribunal)
            const participantes = [
                { usuarioId: pendingAssignmentData.president, tipoParticipante: pendingAssignmentData.presidentRole || 'COMITE', rol: 'PRESIDENTE' },
                { usuarioId: pendingAssignmentData.vocal1, tipoParticipante: pendingAssignmentData.vocal1Role || 'COMITE', rol: 'JURADO_1' },
                { usuarioId: pendingAssignmentData.vocal2, tipoParticipante: pendingAssignmentData.vocal2Role || 'COMITE', rol: 'JURADO_2' }
            ].filter(p => p.usuarioId); // Solo si se seleccionó alguien

            await DefenseService.assignParticipants(defenseRes.id, isPrivate ? 'privada' : 'publica', participantes);

            setSuccessMsg(`Defensa ${isPrivate ? 'Privada' : 'Pública'} programada y tribunal asignado exitosamente.`);
            fetchProposals();
        } catch (error) {
            console.error("Error saving defense assignment:", error);
            setErrorMsg("Error al guardar la asignación. Verifique los datos.");
        } finally {
            setLoading(false);
            setOpenConfirmAlert(false);
            setSelectedStudent(null);
            setPendingAssignmentData(null);
        }
    };

    // Helper: Get Initials
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
        return name.slice(0, 2).toUpperCase();
    };

    // Filtros por Pestaña
    const filteredStudents = studentsReady.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Pestaña Privada: Mostrar todos los que NO han aprobado privada aún.
        if (tabValue === 0) {
            const isApproved = student.privateDefense.estado === 'APROBADA' ||
                (student.privateDefense.calificacion !== null && Number(student.privateDefense.calificacion) >= 7);
            return matchesSearch && !isApproved;
        }

        // Pestaña Pública: Mostrar SOLO los que YA aprobaron privada (estado APROBADA o nota >= 7)
        if (tabValue === 1) {
            const isApproved = student.privateDefense.estado === 'APROBADA' ||
                (student.privateDefense.calificacion !== null && Number(student.privateDefense.calificacion) >= 7);
            return matchesSearch && isApproved;
        }

        return false;
    });

    // Estadísticas Dinámicas según Pestaña
    const currentStats = {
        pending: filteredStudents.filter(s => {
            const defense = tabValue === 0 ? s.privateDefense : s.publicDefense;
            return defense.status === 'pending';
        }).length,
        assigned: filteredStudents.filter(s => {
            const defense = tabValue === 0 ? s.privateDefense : s.publicDefense;
            return defense.status === 'assigned';
        }).length
    };


    // Componente interno ThesisDefenseCard
    const ThesisDefenseCard = ({ student, isSelected, onClick }) => {
        const defenseData = tabValue === 0 ? student.privateDefense : student.publicDefense;
        const docs = student.documents;
        const allDocsReady = docs.tesis && docs.userManual && docs.scientificArticle;

        // Para defensa pública, los documentos ya debieron estar listos en la privada, pero verificamos igual.
        const isReadyForAssign = tabValue === 0 ? allDocsReady : true;

        return (
            <Card
                onClick={() => onClick(student)}
                elevation={isSelected ? 12 : 2}
                sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'visible',
                    border: isSelected ? '2.5px solid #1976d2' : '1px solid rgba(0,0,0,0.06)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    background: isSelected
                        ? 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)'
                        : '#ffffff',
                    '&::before': isSelected ? {
                        content: '""',
                        position: 'absolute',
                        top: -10, right: -10,
                        width: 30, height: 30,
                        backgroundColor: '#1976d2',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(25,118,210,0.3)',
                        zIndex: 2,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    } : {},
                    '&:hover': {
                        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                        transform: isSelected ? 'scale(1.03) translateY(-5px)' : 'translateY(-10px)',
                    }
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                sx={{
                                    width: 55, height: 55,
                                    bgcolor: tabValue === 0 ? '#1976d2' : '#7b1fa2',
                                    mr: 2,
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                                src={student.photoUrl || ''}
                            >
                                {getInitials(student.name)}
                            </Avatar>
                        </Box>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle1" fontWeight="800" noWrap title={student.name} sx={{ color: '#2c3e50' }}>
                                {student.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon fontSize="inherit" color="primary" sx={{ fontSize: '0.9rem' }} />
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 500 }}>
                                    {student.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 1.5 }} />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" fontWeight="800" color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, display: 'block' }}>
                            Tema de Tesis
                        </Typography>
                        <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            height: '42px',
                            lineHeight: '1.3',
                            color: '#444',
                            fontWeight: 500,
                            fontStyle: 'italic'
                        }} title={student.topic}>
                            "{student.topic}"
                        </Typography>
                    </Box>

                    {/* Información de Defensa si está asignada or evaluated */}
                    {['assigned', 'approved', 'failed'].includes(defenseData.status) ? (
                        <Box sx={{
                            mt: 1, p: 1.5,
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            borderRadius: '12px',
                            border: '1px solid #90caf9',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <Typography variant="caption" fontWeight="800" color="primary.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <EventIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                DEFENSA PROGRAMADA:
                            </Typography>
                            <Grid container spacing={0.5}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#1565c0' }}>
                                        📅 {defenseData.date}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#1565c0' }}>
                                        🕒 {defenseData.time}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#1565c0', display: 'block' }}>
                                        🏫 {defenseData.classroom}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {defenseData.calificacion !== null && (
                                <Box sx={{ mt: 1.5, textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1565c0', display: 'block', mb: 0.5 }}>
                                        Calificación Final:
                                    </Typography>
                                    <Chip
                                        label={`${defenseData.calificacion}/10`}
                                        color="success"
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Tribunal y Calificaciones (Si hay tribunal asignado) */}
                            {defenseData.tribunal && defenseData.tribunal.length > 0 && (
                                <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ display: 'block', mb: 0.5, fontSize: '0.6rem', textTransform: 'uppercase' }}>
                                        Tribunal / Calificaciones:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        {defenseData.tribunal.map((p, idx) => (
                                            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#444', fontWeight: 500, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {p.usuario.nombres} {p.usuario.apellidos}
                                                </Typography>
                                                {p.calificacion ? (
                                                    <Chip
                                                        size="small"
                                                        label={p.calificacion}
                                                        sx={{ height: 16, fontSize: '0.6rem', fontWeight: 'bold', bgcolor: 'rgba(76, 175, 80, 0.1)', color: 'success.main' }}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" sx={{ fontSize: '0.55rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                        Pendiente
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box sx={{
                            mt: 1, p: 1.5,
                            bgcolor: '#fff8e1',
                            borderRadius: '12px',
                            border: '1px dashed #ffb74d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                <HourglassEmptyIcon fontSize="inherit" sx={{ mr: 1 }} />
                                PENDIENTE DE ASIGNACIÓN
                            </Typography>
                        </Box>
                    )}

                    {/* Document Indicators */}
                    <Box sx={{
                        mt: 2, p: 1.5,
                        bgcolor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <Typography variant="caption" fontWeight="800" sx={{ display: 'block', mb: 1, textAlign: 'center', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Documentación Final
                        </Typography>
                        <Grid container spacing={1}>
                            {[
                                { icon: <ArticleIcon />, label: 'Tesis', doc: docs.tesis, key: 'tesis' },
                                { icon: <DescriptionIcon />, label: 'Manual', doc: docs.userManual, key: 'manual' },
                                { icon: <SchoolIcon />, label: 'Artíc.', doc: docs.scientificArticle, key: 'articulo' }
                            ].map((item, idx) => (
                                <Grid item xs={4} key={idx}>
                                    <Tooltip title={item.doc ? `Ver ${item.label}` : `${item.label} no disponible`}>
                                        <Box
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.doc) handleDownload(item.doc.urlArchivo, `${item.label}_${student.name.replace(/\s+/g, '_')}.pdf`);
                                            }}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                cursor: item.doc ? 'pointer' : 'default',
                                                transition: 'all 0.2s',
                                                p: 0.5,
                                                borderRadius: '8px',
                                                bgcolor: item.doc ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0,0,0,0.03)',
                                                color: item.doc ? 'success.main' : 'text.disabled',
                                                '&:hover': {
                                                    transform: item.doc ? 'scale(1.1)' : 'none',
                                                    bgcolor: item.doc ? 'rgba(76, 175, 80, 0.15)' : 'rgba(0,0,0,0.03)'
                                                }
                                            }}
                                        >
                                            {React.cloneElement(item.icon, { sx: { fontSize: '1.2rem' } })}
                                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, mt: 0.3 }}>{item.label}</Typography>
                                            <Box sx={{ mt: 0.5 }}>
                                                {item.doc
                                                    ? <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                                                    : <CancelIcon sx={{ fontSize: 14, color: 'error.light', opacity: 0.5 }} />
                                                }
                                            </Box>
                                        </Box>
                                    </Tooltip>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                        <Chip
                            label={
                                defenseData.status === 'approved' ? "Aprobada" :
                                    defenseData.status === 'failed' ? "Reprobada (Programar)" :
                                        defenseData.status === 'assigned' ? "Programada" :
                                            (isReadyForAssign ? "Habilitado" : "Doc. Pendiente")
                            }
                            color={
                                defenseData.status === 'approved' ? "success" :
                                    defenseData.status === 'failed' ? "error" :
                                        defenseData.status === 'assigned' ? "primary" :
                                            (isReadyForAssign ? "success" : "warning")
                            }
                            variant={(defenseData.status === 'assigned' || defenseData.status === 'failed' || defenseData.status === 'approved') ? "filled" : "outlined"}
                            sx={{
                                fontWeight: 800,
                                borderRadius: '8px',
                                textTransform: 'uppercase',
                                fontSize: '0.65rem',
                                px: 1,
                                boxShadow: (defenseData.status === 'assigned' || defenseData.status === 'failed' || defenseData.status === 'approved') ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                            }}
                        />
                    </Box>

                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            {/* Header Moderno con Gradiente */}
            <Box sx={{
                mb: 4,
                p: 4,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(59,130,246,0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <DashboardCustomizeIcon sx={{ fontSize: 35, opacity: 0.9 }} />
                        <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -1 }}>
                            Gestión de Defensas
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, maxWidth: '600px' }}>
                        Programación de tribunales y organización de sustentaciones para estudiantes de titulación.
                    </Typography>
                </Box>
                {/* Elemento Decorativo */}
                <Box sx={{
                    position: 'absolute', top: -50, right: -50,
                    width: 250, height: 250,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(30px)'
                }} />
            </Box>

            {/* Pestañas de Navegación Modernas */}
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

            {/* Estadísticas / Filtros */}
            {/* Estadísticas / Filtros */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6}>
                    <Box sx={{
                        p: 3, borderRadius: '20px', bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 3
                    }}>
                        <Box sx={{ p: 2, borderRadius: '15px', bgcolor: '#fff7ed', color: '#f59e0b' }}>
                            <HourglassEmptyIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="900" color="#1e293b">{currentStats.pending}</Typography>
                            <Typography variant="body2" color="#64748b" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Estudiantes Pendientes
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{
                        p: 3, borderRadius: '20px', bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 3
                    }}>
                        <Box sx={{ p: 2, borderRadius: '15px', bgcolor: '#f0fdf4', color: '#22c55e' }}>
                            <AssignmentIndIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="900" color="#1e293b">{currentStats.assigned}</Typography>
                            <Typography variant="body2" color="#64748b" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Defensas Programadas
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>


            {/* Buscador Moderno */}
            <Box sx={{
                mb: 4, bgcolor: 'white', p: 1, borderRadius: '18px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9'
            }}>
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar estudiante por nombre o tema..."
                    title=""
                />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
                                    <ThesisDefenseCard
                                        student={student}
                                        isSelected={selectedStudent?.id === student.id}
                                        onClick={handleCardClick}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        {tabValue === 0
                                            ? "No hay estudiantes pendientes de Defensa Privada."
                                            : "No hay estudiantes habilitados para Defensa Pública (Deben aprobar la Privada primero)."}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>



            {/* Dialog de Asignación (Componente existente) */}
            {selectedStudent && (
                <TribunalAssignment
                    student={selectedStudent}
                    type={tabValue === 0 ? 'private' : 'public'}
                    currentUser={getDataUser()}
                    onClose={handleCloseAssignment}
                    onSave={handleAssignmentRequest} // Cambiado para interceptar y mostrar alerta
                />
            )}

            {/* Alerta de Confirmación de Notificación */}
            <AlertMui
                open={openConfirmAlert}
                handleClose={() => setOpenConfirmAlert(false)}
                title={`Confirmación de Defensa ${tabValue === 0 ? 'Privada' : 'Pública'}`}
                message={
                    <Box sx={{ mt: 2, minWidth: 350 }}>
                        <NotificationMui severity="info" sx={{ mb: 2 }}>
                            Se enviará una <strong>notificación oficial por correo</strong> al estudiante y a los miembros del tribunal.
                        </NotificationMui>

                        <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, mb: 2, border: '1px solid #eee' }}>
                            <TextMui value="Detalles de la Asignación:" variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }} />
                            <TextMui value={`Estudiante: ${selectedStudent?.name || pendingAssignmentData?.student?.name}`} variant="body2" sx={{ fontWeight: 'bold' }} />
                            <TextMui value={`Carrera: ${selectedStudent?.career || pendingAssignmentData?.student?.career}`} variant="caption" display="block" />
                            <Divider sx={{ my: 1 }} />
                            <TextMui value={`Fecha: ${pendingAssignmentData?.date} | Hora: ${pendingAssignmentData?.time}`} variant="body2" />
                            <TextMui value={`Aula: ${pendingAssignmentData?.classroom}`} variant="body2" />
                            <TextMui value={`Tribunal Asignado: ${[pendingAssignmentData?.president, pendingAssignmentData?.vocal1, pendingAssignmentData?.vocal2].filter(Boolean).length} docentes`} variant="caption" />
                        </Box>

                        <TextMui value="¿Desea proceder con la asignación y el envío de notificaciones?" variant="body2" />
                    </Box>
                }
                status="warning"
                showBtnL={true}
                btnNameL="Confirmar y Notificar"
                actionBtnL={confirmSaveAssignment}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenConfirmAlert(false)}
            />

            {/* Alertas de Éxito y Error */}
            <AlertMui
                open={!!successMsg}
                handleClose={() => setSuccessMsg("")}
                title="Éxito"
                message={successMsg}
                status="success"
                showBtnL={true}
                btnNameL="Aceptar"
                actionBtnL={() => setSuccessMsg("")}
            />

            <AlertMui
                open={!!errorMsg}
                handleClose={() => setErrorMsg("")}
                title="Atención"
                message={errorMsg}
                status="error"
                actionBtnL={() => setErrorMsg("")}
            />

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

export default ThesisDefense;
