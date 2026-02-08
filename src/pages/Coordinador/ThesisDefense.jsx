import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Chip, Avatar, Tooltip, Tabs, Tab } from '@mui/material';
import TextMui from '../../components/text.mui.component';
import TribunalAssignment from '../../components/Director/TribunalAssignment.mui';
import StatsCard from '../../components/common/StatsCard';
import InputMui from '../../components/input.mui.component';
import AlertMui from '../../components/alert.mui.component';
import NotificationMui from '../../components/notification.mui.component';

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

function CoordinatorThesisDefense() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [tabValue, setTabValue] = useState(0); // 0: Privada, 1: Pública
    const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [pendingAssignmentData, setPendingAssignmentData] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Mock Data Completo con lógica Multi-Etapa
    const [studentsReady, setStudentsReady] = useState([
        {
            id: 1,
            name: 'Abad Montesdeoca Nicole Belen',
            email: 'niabadmo@uide.edu.ec',
            topic: 'Implementación de IA para optimización de tráfico urbano en Loja',
            director: 'Ing. Wilson',
            career: 'Ing. Tecnologías de la Información', // Agregado
            campus: 'UIDE - Loja', // Agregado
            documents: { programmerManual: true, userManual: true, scientificArticle: true },
            privateDefense: {
                status: 'pending', // pending, assigned, approved
                date: null,
                time: null,
                classroom: null,
                tribunal: []
            },
            publicDefense: {
                status: 'locked', // locked, pending, assigned, approved
                date: null,
                time: null,
                classroom: null,
                tribunal: []
            }
        },
        {
            id: 2,
            name: 'Acacho Yangari Daddy Abel',
            email: 'daacachoya@uide.edu.ec',
            topic: 'Sistema de gestión documental con Blockchain para la UIDE',
            director: 'Ing. Lorena',
            career: 'Ing. Tecnologías de la Información',
            campus: 'UIDE - Loja',
            documents: { programmerManual: true, userManual: false, scientificArticle: false },
            privateDefense: {
                status: 'pending',
                date: null,
                time: null,
                classroom: null,
                tribunal: []
            },
            publicDefense: {
                status: 'locked',
                date: null,
                time: null,
                classroom: null,
                tribunal: []
            }
        },
        {
            id: 3,
            name: 'Ajila Armijos Cristian Xavier',
            email: 'crajilaar@uide.edu.ec',
            topic: 'Aplicación móvil para turismo comunitario en Saraguro',
            director: 'Ing. Gabriel',
            career: 'Sistemas de Información',
            campus: 'UIDE - Loja',
            documents: { programmerManual: true, userManual: true, scientificArticle: true },
            privateDefense: {
                status: 'approved', // Ya aprobó la privada
                date: '2025-01-15',
                time: '10:00',
                classroom: 'B-202',
                tribunal: ['Ing. A', 'Ing. B']
            },
            publicDefense: {
                status: 'pending', // Ahora espera pública
                date: null,
                time: null,
                classroom: null,
                tribunal: []
            }
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleCardClick = (student) => {
        // Bloquear click si no está habilitado para la pestaña actual (aunque el filtrado ya maneja esto)
        setSelectedStudent(student);
    };

    const handleCloseAssignment = () => {
        setSelectedStudent(null);
    };

    // Paso 1: Recibir datos del componente hijo y pedir confirmación
    const handleAssignmentRequest = (assignmentData) => {
        setPendingAssignmentData(assignmentData);
        setOpenConfirmAlert(true);
    };

    // Paso 2: Confirmar y Guardar
    const confirmSaveAssignment = () => {
        if (!selectedStudent || !pendingAssignmentData) return;

        const updatedStudents = studentsReady.map(s => {
            if (s.id === selectedStudent.id) {
                const stageKey = tabValue === 0 ? 'privateDefense' : 'publicDefense';
                return {
                    ...s,
                    [stageKey]: {
                        ...s[stageKey],
                        ...pendingAssignmentData,
                        status: 'assigned'
                    }
                };
            }
            return s;
        });

        setStudentsReady(updatedStudents);
        setOpenConfirmAlert(false);
        setSelectedStudent(null);
        setPendingAssignmentData(null);
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
            return matchesSearch && student.privateDefense.status !== 'approved';
        }

        // Pestaña Pública: Mostrar SOLO los que YA aprobaron privada (que desbloquea la pública)
        if (tabValue === 1) {
            return matchesSearch && student.privateDefense.status === 'approved';
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
        const allDocsReady = student.documents.programmerManual && student.documents.userManual && student.documents.scientificArticle;

        // Para defensa pública, los documentos ya debieron estar listos en la privada, pero verificamos igual.
        const isReadyForAssign = tabValue === 0 ? allDocsReady : true;

        return (
            <Card
                onClick={() => onClick(student)}
                elevation={isSelected ? 8 : 3}
                sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s',
                    border: isSelected ? '2px solid #1976d2' : '1px solid transparent',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    backgroundColor: isSelected ? '#f5f9ff' : 'white',
                    filter: isSelected ? 'none' : (selectedStudent ? 'grayscale(0.4) opacity(0.8)' : 'none'),
                    '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-3px)',
                        filter: 'none'
                    }
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            sx={{ width: 50, height: 50, bgcolor: tabValue === 0 ? '#1976d2' : '#7b1fa2', mr: 2 }}
                            src={student.photoUrl || ''}
                        >
                            {getInitials(student.name)}
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle1" fontWeight="bold" noWrap title={student.name}>
                                {student.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon fontSize="inherit" color="action" sx={{ fontSize: '0.8rem' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {student.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 1.5 }} />

                    <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                            Tema de Tesis
                        </Typography>
                        <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            height: '40px',
                            lineHeight: '1.2'
                        }} title={student.topic}>
                            {student.topic}
                        </Typography>
                    </Box>

                    {/* Información de Defensa si está asignada */}
                    {defenseData.status === 'assigned' ? (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #90caf9' }}>
                            <Typography variant="caption" fontWeight="bold" color="primary" sx={{ display: 'block' }}>
                                <EventIcon fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                Defensa Programada ({tabValue === 0 ? 'Privada' : 'Pública'}):
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                📅 {defenseData.date} | 🕒 {defenseData.time}
                            </Typography>
                            <Typography variant="caption" display="block">
                                🏫 {defenseData.classroom}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1, border: '1px dashed #ffb74d' }}>
                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                                <HourglassEmptyIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                Pendiente de Asignación
                            </Typography>
                        </Box>
                    )}

                    {/* Document Indicators (Solo relevante en Privada para habilitar) */}
                    {tabValue === 0 && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                <Box title="Manual de Programador" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: student.documents.programmerManual ? 'green' : 'gray' }}>
                                    <ArticleIcon fontSize="inherit" /> M. Prog.
                                    {student.documents.programmerManual ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                                </Box>
                                <Box title="Manual de Usuario" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: student.documents.userManual ? 'green' : 'gray' }}>
                                    <DescriptionIcon fontSize="inherit" /> M. Usu.
                                    {student.documents.userManual ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Chip
                            label={defenseData.status === 'assigned' ? "Defensa Asignada" : (isReadyForAssign ? "Habilitado" : "Doc. Pendiente")}
                            color={defenseData.status === 'assigned' ? "primary" : (isReadyForAssign ? "success" : "warning")}
                            size="small"
                        />
                    </Box>

                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Designación de Tribunal" variant="h4" />
                <TextMui value="Programación de defensas Privadas y Públicas (Vista Coordinador)" variant="body1" />
            </Box>

            {/* Pestañas de Navegación */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="defense tabs" centered>
                    <Tab label="Defensa Privada" icon={<LockIcon />} iconPosition="start" />
                    <Tab label="Defensa Pública" icon={<SchoolIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            {/* Estadísticas / Filtros */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Pendientes en esta etapa"
                        value={currentStats.pending}
                        icon={<HourglassEmptyIcon fontSize="large" />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Asignadas en esta etapa"
                        value={currentStats.assigned}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success"
                    />
                </Grid>
            </Grid>

            {/* Buscador */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <InputMui
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startIcon={<SearchIcon color="action" />}
                    />
                </CardContent>
            </Card>

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
                            <TextMui value={`Estudiante: ${selectedStudent?.name}`} variant="body2" sx={{ fontWeight: 'bold' }} />
                            <TextMui value={`Carrera: ${selectedStudent?.career}`} variant="caption" display="block" />
                            <Divider sx={{ my: 1 }} />
                            <TextMui value={`Fecha: ${pendingAssignmentData?.date} | Hora: ${pendingAssignmentData?.time}`} variant="body2" />
                            <TextMui value={`Aula: ${pendingAssignmentData?.classroom}`} variant="body2" />
                            <TextMui value={`Tribunal Asignado: ${pendingAssignmentData?.tribunal?.length || 0} docentes`} variant="caption" />
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
        </Box>
    );
}

export default CoordinatorThesisDefense;
