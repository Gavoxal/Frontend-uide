import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Chip, Avatar, Tooltip, Tabs, Tab } from '@mui/material';
import SearchBar from '../../components/SearchBar.component';
import TextMui from '../../components/text.mui.component';
import TribunalAssignment from '../../components/Director/TribunalAssignment.mui';
import StatsCard from '../../components/common/StatsCard';
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
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function CoordinatorThesisDefense() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [pendingAssignmentData, setPendingAssignmentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [studentsReady, setStudentsReady] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [openGradingModal, setOpenGradingModal] = useState(false);
    const [gradingStudent, setGradingStudent] = useState(null);

    const fetchProposals = async () => {
        setLoading(true);
        try {
            const data = await DefenseService.getProposalsForDefense();
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
                    tesis: p.entregablesFinales?.find(e => (e.tipo === 'TESIS' || e.tipo === 'tesis') && (e.isActive || e.is_active)) || null,
                    userManual: p.entregablesFinales?.find(e => (e.tipo === 'MANUAL_USUARIO' || e.tipo === 'manual_usuario') && (e.isActive || e.is_active)) || null,
                    scientificArticle: p.entregablesFinales?.find(e => (e.tipo === 'ARTICULO' || e.tipo === 'articulo') && (e.isActive || e.is_active)) || null
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

    const handleAssignmentRequest = (assignmentData) => {
        setPendingAssignmentData(assignmentData);
        setOpenConfirmAlert(true);
        setSelectedStudent(null);
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
            setErrorMsg("No se pudo descargar el archivo.");
        }
    };

    const confirmSaveAssignment = async () => {
        const studentToSave = selectedStudent || pendingAssignmentData?.student;
        if (!studentToSave || !pendingAssignmentData) return;

        setLoading(true);
        try {
            const isPrivate = tabValue === 0;
            const scheduleFunc = isPrivate ? DefenseService.schedulePrivate : DefenseService.schedulePublic;

            const defenseRes = await scheduleFunc(studentToSave.id, {
                fechaDefensa: pendingAssignmentData.date,
                horaDefensa: pendingAssignmentData.time,
                aula: pendingAssignmentData.classroom
            });

            const participantes = [
                { usuarioId: pendingAssignmentData.president, tipoParticipante: pendingAssignmentData.presidentRole || 'COMITE', rol: 'PRESIDENTE' },
                { usuarioId: pendingAssignmentData.vocal1, tipoParticipante: pendingAssignmentData.vocal1Role || 'COMITE', rol: 'JURADO_1' },
                { usuarioId: pendingAssignmentData.vocal2, tipoParticipante: pendingAssignmentData.vocal2Role || 'COMITE', rol: 'JURADO_2' }
            ].filter(p => p.usuarioId);

            await DefenseService.assignParticipants(defenseRes.id, isPrivate ? 'privada' : 'publica', participantes);

            setSuccessMsg(`Defensa ${isPrivate ? 'Privada' : 'Pública'} programada y tribunal asignado exitosamente.`);
            fetchProposals();
        } catch (error) {
            console.error("Error saving defense assignment:", error);
            setErrorMsg("Error al guardar la asignación.");
        } finally {
            setLoading(false);
            setOpenConfirmAlert(false);
            setSelectedStudent(null);
            setPendingAssignmentData(null);
        }
    };

    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
        return name.slice(0, 2).toUpperCase();
    };

    const filteredStudents = studentsReady.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (tabValue === 0) {
            const isApproved = student.privateDefense.estado === 'APROBADA' ||
                (student.privateDefense.calificacion !== null && Number(student.privateDefense.calificacion) >= 7);
            return matchesSearch && !isApproved;
        }
        if (tabValue === 1) {
            const isApproved = student.privateDefense.estado === 'APROBADA' ||
                (student.privateDefense.calificacion !== null && Number(student.privateDefense.calificacion) >= 7);
            return matchesSearch && isApproved;
        }
        return false;
    });

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

    const ThesisDefenseCard = ({ student, isSelected, onClick }) => {
        const defenseData = tabValue === 0 ? student.privateDefense : student.publicDefense;
        const docs = student.documents;
        const allDocsReady = docs.tesis && docs.userManual && docs.scientificArticle;
        const isReadyForAssign = tabValue === 0 ? allDocsReady : true;

        return (
            <Card
                onClick={() => onClick(student)}
                elevation={isSelected ? 12 : 2}
                sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.4s',
                    borderRadius: '20px',
                    position: 'relative',
                    border: isSelected ? '2.5px solid #1976d2' : '1px solid rgba(0,0,0,0.06)',
                    background: isSelected ? '#f0f7ff' : '#ffffff',
                    '&:hover': { transform: 'translateY(-10px)' }
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 55, height: 55,
                                bgcolor: tabValue === 0 ? '#1976d2' : '#7b1fa2',
                                mr: 2, fontWeight: 'bold'
                            }}
                            src={student.photoUrl || ''}
                        >
                            {getInitials(student.name)}
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle1" fontWeight="800" noWrap sx={{ color: '#2c3e50' }}>
                                {student.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon fontSize="inherit" color="primary" sx={{ fontSize: '0.9rem' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {student.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" fontWeight="800" color="primary" display="block">TEMA</Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#444' }}>"{student.topic}"</Typography>
                    </Box>

                    {['assigned', 'approved', 'failed'].includes(defenseData.status) ? (
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: '#e3f2fd', borderRadius: '12px', border: '1px solid #90caf9' }}>
                            <Typography variant="caption" fontWeight="800" color="primary.main">DEFENSA PROGRAMADA:</Typography>
                            <Typography variant="caption" display="block">📅 {defenseData.date} | 🕒 {defenseData.time}</Typography>
                            <Typography variant="caption" display="block">🏫 {defenseData.classroom}</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: '#fff8e1', borderRadius: '12px', border: '1px dashed #ffb74d', textAlign: 'center' }}>
                            <Typography variant="caption" color="warning.dark" fontWeight="700">PENDIENTE</Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Grid container spacing={1}>
                            {[{ icon: <ArticleIcon />, label: 'Tesis', doc: docs.tesis },
                            { icon: <DescriptionIcon />, label: 'Man.', doc: docs.userManual },
                            { icon: <SchoolIcon />, label: 'Art.', doc: docs.scientificArticle }].map((item, idx) => (
                                <Grid item xs={4} key={idx} sx={{ textAlign: 'center' }}>
                                    <Box onClick={(e) => { e.stopPropagation(); if (item.doc) handleDownload(item.doc.urlArchivo, item.label); }}
                                        sx={{ color: item.doc ? 'success.main' : 'text.disabled', cursor: item.doc ? 'pointer' : 'default' }}>
                                        {item.icon}
                                        <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem' }}>{item.label}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <Box sx={{ mb: 4, p: 4, borderRadius: '24px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <DashboardCustomizeIcon sx={{ fontSize: 35 }} />
                    <Typography variant="h3" fontWeight="900">Gestión de Defensas</Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.8 }}></Typography>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ bgcolor: '#f1f5f9', borderRadius: '16px', p: 0.5 }}>
                    <Tab label="Defensa Privada" icon={<LockIcon />} iconPosition="start" />
                    <Tab label="Defensa Pública" icon={<SchoolIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={6}><StatsCard title="Pendientes" value={currentStats.pending} icon={<HourglassEmptyIcon />} color="warning" /></Grid>
                <Grid item xs={6}><StatsCard title="Programadas" value={currentStats.assigned} icon={<AssignmentIndIcon />} color="success" /></Grid>
            </Grid>

            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar estudiante..." title="" />

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
                            <ThesisDefenseCard student={student} isSelected={selectedStudent?.id === student.id} onClick={handleCardClick} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12} textAlign="center"><Typography color="text.secondary">No hay estudiantes en esta fase.</Typography></Grid>
                )}
            </Grid>

            {selectedStudent && (
                <TribunalAssignment
                    student={selectedStudent}
                    type={tabValue === 0 ? 'private' : 'public'}
                    currentUser={getDataUser()}
                    onClose={handleCloseAssignment}
                    onSave={handleAssignmentRequest}
                />
            )}

            <AlertMui
                open={openConfirmAlert}
                handleClose={() => setOpenConfirmAlert(false)}
                title="Confirmar Programación"
                message="Se enviará una notificación oficial a los involucrados. ¿Proceder?"
                status="warning"
                showBtnL={true}
                btnNameL="Confirmar"
                actionBtnL={confirmSaveAssignment}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenConfirmAlert(false)}
            />

            <AlertMui open={!!successMsg} handleClose={() => setSuccessMsg("")} title="Éxito" message={successMsg} status="success" showBtnL={true} btnNameL="Aceptar" actionBtnL={() => setSuccessMsg("")} />
            <AlertMui open={!!errorMsg} handleClose={() => setErrorMsg("")} title="Error" message={errorMsg} status="error" actionBtnL={() => setErrorMsg("")} />
        </Box>
    );
}

export default CoordinatorThesisDefense;
