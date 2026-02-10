import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    LinearProgress,
    Chip,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import {
    PlayCircleOutline,
    CheckCircleOutline,
    RadioButtonUnchecked,
    AccessTime,
    UploadFile,
    CheckCircle,
    Grade,
} from '@mui/icons-material';
import CalendarMui from '../../components/calendar.mui.component';
import DetailsModal from '../../components/details.mui.component';
import AlertMui from '../../components/alert.mui.component';

import { useEffect } from 'react';
import { ActivityService } from '../../services/activity.service';
import { ProposalService } from '../../services/proposal.service';
import { UserService } from '../../services/user.service';
import { BitacoraService } from '../../services/bitacora.service';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function StudentAvances() {
    const [selectedProgress, setSelectedProgress] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [weeklyProgress, setWeeklyProgress] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [meetingModalOpen, setMeetingModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [proposal, setProposal] = useState(null);
    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    // Cargar datos reales
    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Obtener la propuesta del estudiante
            const proposals = await ProposalService.getAll();
            if (proposals.length === 0) {
                setWeeklyProgress([]);
                setLoading(false);
                return;
            }

            // Buscar la propuesta activa con la misma lógica que el Docente
            // (APROBADA > PENDIENTE > otras, y por ID más reciente)
            const sorted = [...proposals].sort((a, b) => {
                const statusOrder = { 'APROBADA': 3, 'PENDIENTE': 2, 'RECHAZADA': 1 };
                const orderA = statusOrder[a.estado] || 0;
                const orderB = statusOrder[b.estado] || 0;

                if (orderA !== orderB) return orderB - orderA; // el de mayor orden primero
                return Number(b.id) - Number(a.id); // el de ID mayor primero
            });

            const activeProposal = sorted[0];

            // Extraer tutor de la relación trabajosTitulacion si existe
            if (!activeProposal.tutor && activeProposal.trabajosTitulacion?.length > 0) {
                activeProposal.tutor = activeProposal.trabajosTitulacion[0].tutor;
            }

            setProposal(activeProposal);

            // 2. Obtener actividades de esa propuesta
            const activities = await ActivityService.getByPropuesta(activeProposal.id);
            console.log("DEBUG FRONTEND: Raw activities from backend:", activities);

            // 3. Mapear a la estructura del frontend
            const mapped = activities.map((act, index) => {
                // Obtener la evidencia más reciente si existe
                const evidence = act.evidencias && act.evidencias.length > 0
                    ? act.evidencias[act.evidencias.length - 1]
                    : act.evidencia;

                let currentState = "pending_upload";
                if (evidence) {
                    currentState = (evidence.calificacionTutor !== null || evidence.calificacionDocente !== null) ? "graded" : "pending_tutor_review";
                }

                // CAMPOS DE FECHA DE LA TABLA 'actividades' (Asignación y Entrega Límite)
                const createDate = act.fechaAsignacion || act.createdAt || act.fechaCreacion;
                const dueDate = act.fechaEntrega || act.deadline;

                // FECHAS DE LA TABLA 'evidencia' (Entrega y Calificación)
                const submissionDate = evidence?.fechaEntrega || evidence?.fecha_entrega || evidence?.createdAt;
                const gradingDate = evidence?.fechaCalificacionTutor || evidence?.fecha_calificacion_tutor || evidence?.updatedAt;

                // EXTRAER TUTOR O DOCENTE
                let tutorName = "Tutor Asignado";
                if (act.tipo === 'DOCENCIA') {
                    tutorName = "Docente de Integración";
                } else if (act.tipo === 'TUTORIA') {
                    if (act.propuesta?.trabajosTitulacion?.[0]?.tutor) {
                        const t = act.propuesta.trabajosTitulacion[0].tutor;
                        tutorName = `${t.nombres} ${t.apellidos}`;
                    } else if (activeProposal.tutor) {
                        tutorName = `${activeProposal.tutor.nombres} ${activeProposal.tutor.apellidos}`;
                    } else {
                        tutorName = "Tutor (Académico)";
                    }
                }

                return {
                    id: act.id,
                    // Prioridad Estricta: 
                    // 1. Campo 'semana' directo de la actividad
                    // 2. Campo 'semana' de la evidencia
                    // 3. Fallback: Orden natural (index + 1)
                    weekNumber: (act.semana && Number(act.semana) > 0)
                        ? Number(act.semana)
                        : (evidence?.semana ? Number(evidence.semana) : (index + 1)),
                    rawSemana: act.semana, // Para depuración
                    title: act.nombre,
                    assignmentDate: createDate ? new Date(createDate) : null,
                    dueDate: dueDate ? (function (d) {
                        const parts = String(d).split('T')[0].split('-');
                        if (parts.length === 3) {
                            return new Date(parts[0], parts[1] - 1, parts[2]);
                        }
                        return new Date(d);
                    })(dueDate) : null,

                    tutorAssignment: {
                        description: act.descripcion,
                        requirements: act.requisitos || [],
                        assignedBy: tutorName,
                        assignedDate: createDate ? new Date(createDate) : null,
                    },

                    studentSubmission: evidence ? {
                        id: evidence.id,
                        uploadedFile: evidence.archivoUrl?.split('/').pop() || "archivo",
                        submittedDate: submissionDate ? new Date(submissionDate) : null,
                        comments: evidence.contenido || "",
                        semana: evidence.semana,
                        fileUrl: evidence.archivoUrl
                    } : null,

                    grading: evidence && (evidence.calificacionTutor !== null || evidence.calificacionDocente !== null) ? {
                        score: act.tipo === 'DOCENCIA'
                            ? (evidence.calificacionDocente !== null ? evidence.calificacionDocente : evidence.calificacionTutor)
                            : (evidence.calificacionTutor !== null ? evidence.calificacionTutor : evidence.calificacionDocente),
                        gradedBy: tutorName,
                        gradedDate: gradingDate ? new Date(gradingDate) : null,
                        feedback: act.tipo === 'DOCENCIA'
                            ? (evidence.feedbackDocente || evidence.feedbackTutor || "Sin observaciones")
                            : (evidence.feedbackTutor || evidence.feedbackDocente || "Sin observaciones"),
                        status: (Number(evidence.calificacionTutor) >= 7 || Number(evidence.calificacionDocente) >= 7) ? "approved" : "rejected"
                    } : null,

                    currentState: currentState
                };
            });

            // 4. Obtener reuniones (Bitácora)
            try {
                const meetingsData = await BitacoraService.getReuniones();
                setMeetings(meetingsData || []);
            } catch (meetingError) {
                console.error("Error fetching meetings:", meetingError);
                // No bloqueamos la carga principal si fallan las reuniones
            }

            // 5. Agrupar por semana (1-16)
            const weeks = Array.from({ length: 16 }, (_, i) => ({
                weekNumber: i + 1,
                activities: []
            }));

            mapped.forEach(act => {
                const w = Number(act.weekNumber);
                // Asegurar que esté en rango 1-16
                if (w >= 1 && w <= 16) {
                    weeks[w - 1].activities.push(act);
                } else {
                    console.warn("Actividad con semana fuera de rango (1-16):", act);
                }
            });

            setWeeklyProgress(weeks);
        } catch (error) {
            console.error("Error fetching progress data:", error);
            setAlertState({
                open: true,
                title: 'Error',
                message: 'No se pudo cargar la información de avances.',
                status: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCloseModal = () => {
        setDetailModalOpen(false);
        setSelectedProgress(null);
        setInitialTab(0);
    };

    const handleSubmitProgress = async (uploadedFile, comment = '') => {
        if (!uploadedFile) {
            setAlertState({
                open: true,
                title: 'Archivo Faltante',
                message: 'Por favor, sube el archivo de tu avance antes de enviar.',
                status: 'warning'
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            // Calculamos la semana basada en el progreso actual o la asignada
            formData.append('semana', selectedProgress.weekNumber || (weeklyProgress.length + 1));
            formData.append('contenido', comment || 'Avance semanal');

            await ActivityService.createEvidencia(selectedProgress.id, formData);

            setDetailModalOpen(false);
            setAlertState({
                open: true,
                title: '¡Avance Enviado!',
                message: 'Tu avance semanal ha sido enviado correctamente. Tu tutor lo revisará pronto.',
                status: 'success'
            });

            // Recargar datos
            fetchData();
        } catch (error) {
            setAlertState({
                open: true,
                title: 'Error al enviar',
                message: error.message || 'Hubo un problema al subir tu evidencia.',
                status: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const allActivities = weeklyProgress.flatMap(w => w.activities || []);

    // Cálculos basados en el nuevo formato de semanas
    const isWeekCompleted = (week) => {
        // Una semana se considera completada si no tiene actividades O si todas están calificadas
        if (!week.activities || week.activities.length === 0) return true;
        return week.activities.every(a => a.currentState === 'graded');
    };

    // Calcular cuántas semanas consecutivas se han completado desde la 1
    let consecutiveCompleted = 0;
    for (let i = 0; i < weeklyProgress.length; i++) {
        if (isWeekCompleted(weeklyProgress[i])) {
            // Solo contamos como "completada" si REALMENTE tiene actividades. 
            // Si está vacía es un "paso libre" pero no suma al contador de completadas para el texto "6/16"
            // a menos que el usuario prefiera que cuente. 
            // Según el prompt: "deberian ser 11/16... el se encuentra en la semana 6" 
            // -> implica que las semanas vacías previas cuentan como completadas o el contador es el índice de la semana actual.
            consecutiveCompleted++;
        } else {
            break;
        }
    }

    const progressData = {
        completedWeeks: consecutiveCompleted,
        totalWeeks: 16,
        currentWeek: Math.min(consecutiveCompleted + 1, 16)
    };

    // Convertir avances a eventos del calendario
    const calendarEvents = allActivities
        .filter(progress => progress.tutorAssignment)
        .map(progress => {
            let color = '#9e9e9e';
            let title = progress.title;

            switch (progress.currentState) {
                case 'graded':
                    color = '#4caf50';
                    break;
                case 'pending_tutor_review':
                    color = '#ff9800';
                    break;
                case 'pending_upload':
                    color = '#f44336';
                    break;
                default:
                    color = '#9e9e9e';
            }

            return {
                title: `S${progress.weekNumber}: ${title}`,
                date: progress.dueDate ? new Date(progress.dueDate) : null,
                color: color,
                progressId: progress.id,
                type: 'activity'
            };
        });

    // Agregar reuniones al calendario
    const meetingEvents = meetings.map(meeting => ({
        title: `Reunión: ${meeting.motivo}`,
        date: new Date(meeting.fecha),
        color: '#1976d2', // Azul para reuniones
        meetingId: meeting.id,
        type: 'meeting',
        originalData: meeting // Store full object
    }));

    const allCalendarEvents = [...calendarEvents, ...meetingEvents];

    const getStateConfig = (state, isLocked = false) => {
        if (isLocked) {
            return { label: 'Bloqueado', color: '#9e9e9e', icon: RadioButtonUnchecked };
        }
        switch (state) {
            case 'graded':
                return { label: 'Calificado', color: '#4caf50', icon: CheckCircle };
            case 'pending_tutor_review':
                return { label: 'En Revisión', color: '#ff9800', icon: PlayCircleOutline };
            case 'pending_upload':
                return { label: 'Pendiente de Entrega', color: '#f44336', icon: UploadFile };
            default:
                return { label: 'Desconocido', color: '#9e9e9e', icon: RadioButtonUnchecked };
        }
    };

    const handleEventClick = (event) => {
        if (event.type === 'activity') {
            const progress = weeklyProgress.find(p => p.id === event.progressId);
            if (progress) {
                openDetailModal(progress);
            }
        } else if (event.type === 'meeting') {
            setSelectedMeeting(event.originalData);
            setMeetingModalOpen(true);
        }
    };

    const handleDateClick = (date) => {
        if (!date) return;
        // Buscar avance en esa fecha
        const progress = weeklyProgress.find(p => {
            if (!p.dueDate) return false;
            try {
                return new Date(p.dueDate).toDateString() === date.toDateString();
            } catch (e) {
                return false;
            }
        });
        if (progress && progress.tutorAssignment) {
            openDetailModal(progress);
        }
    };

    const openDetailModal = (progress) => {
        setSelectedProgress(progress);
        setDetailModalOpen(true);

        // Determinar pestaña inicial según el estado
        if (!progress.studentSubmission) {
            setInitialTab(1); // Ir a "Mi Entrega"
        } else if (!progress.grading) {
            setInitialTab(1); // Ir a "Mi Entrega" (estado revisión)
        } else {
            setInitialTab(2); // Ir a "Calificación"
        }
    };

    const progressPercentage = (progressData.completedWeeks / progressData.totalWeeks) * 100;

    return (
        <>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Mis Avances Semanales
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Seguimiento del progreso de tu trabajo de titulación
                    </Typography>
                </Box>

                {/* Calendario */}
                <Box sx={{ mb: 4 }}>
                    <CalendarMui
                        events={allCalendarEvents}
                        onEventClick={handleEventClick}
                        onDateClick={handleDateClick}
                        showViewToggle={false}
                        showAddButton={false}
                    />
                </Box>

                {/* Resumen de Progreso */}
                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                            Resumen de Progreso
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            {/* Semanas Completadas */}
                            <Card sx={{
                                flex: '1 1 300px',
                                borderRadius: 3,
                                boxShadow: 1,
                                border: '1px solid #e0e0e0'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Semanas Completadas
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                                        {progressData.completedWeeks} / {progressData.totalWeeks}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPercentage}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                backgroundColor: '#4caf50'
                                            }
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Semana Actual */}
                            <Card sx={{
                                flex: '1 1 300px',
                                borderRadius: 3,
                                boxShadow: 1,
                                border: '1px solid #e0e0e0'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Semana Actual
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AccessTime sx={{ color: '#000A9B', fontSize: 32 }} />
                                        <Typography variant="h4" fontWeight="bold" color="#000A9B">
                                            Semana {progressData.currentWeek}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Mantén el ritmo de trabajo constante
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </CardContent>
                </Card>

                {/* Lista de Avances Semanales */}
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                            Avances Semanales
                        </Typography>



                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {weeklyProgress.map((week) => (
                                <Box key={week.weekNumber}>
                                    {/* Cabecera de Semana */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        pb: 1,
                                        borderBottom: '2px solid #f0f0f0'
                                    }}>
                                        <Typography variant="h6" fontWeight="700" color={week.activities.length > 0 ? 'text.primary' : 'text.disabled'}>
                                            Semana {week.weekNumber}
                                        </Typography>
                                    </Box>

                                    {/* Lista de actividades de esta semana */}
                                    <Grid container spacing={2}>
                                        {week.activities.length > 0 ? (
                                            week.activities.map((progress) => {
                                                const isLocked = week.weekNumber > progressData.currentWeek;
                                                const stateConfig = getStateConfig(progress.currentState, isLocked);
                                                const StateIcon = stateConfig.icon;

                                                return (
                                                    <Grid item xs={12} md={week.activities.length > 1 ? 6 : 12} key={progress.id}>
                                                        <Card
                                                            sx={{
                                                                borderRadius: 2,
                                                                border: '1px solid #e0e0e0',
                                                                opacity: isLocked ? 0.6 : 1,
                                                                filter: isLocked ? 'grayscale(1)' : 'none',
                                                                '&:hover': {
                                                                    boxShadow: isLocked ? 1 : 3,
                                                                    borderColor: isLocked ? '#e0e0e0' : '#000A9B'
                                                                },
                                                                transition: 'all 0.2s',
                                                                cursor: isLocked ? 'not-allowed' : 'default'
                                                            }}
                                                        >
                                                            <CardContent sx={{ p: 3 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                                    <Box>
                                                                        <Typography variant="subtitle1" fontWeight="600">
                                                                            {progress.title}
                                                                        </Typography>
                                                                        <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                                                                            {progress.tutorAssignment?.assignedBy === "Docente de Integración" ? (
                                                                                <Chip label="Docencia" size="small" color="secondary" variant="outlined" />
                                                                            ) : (
                                                                                <Chip label="Tutoría" size="small" color="primary" variant="outlined" />
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                    <Chip
                                                                        icon={<StateIcon />}
                                                                        label={stateConfig.label}
                                                                        size="small"
                                                                        sx={{ backgroundColor: stateConfig.color, color: 'white', fontWeight: 600 }}
                                                                    />
                                                                </Box>

                                                                {progress.dueDate && (
                                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                                                        Fecha límite: {progress.dueDate.toLocaleDateString()}
                                                                    </Typography>
                                                                )}

                                                                <Stepper
                                                                    activeStep={
                                                                        progress.currentState === 'graded' ? 3 :
                                                                            progress.currentState === 'pending_tutor_review' ? 2 :
                                                                                progress.currentState === 'pending_upload' ? 1 : 0
                                                                    }
                                                                    alternativeLabel
                                                                    sx={{ mb: 2 }}
                                                                >
                                                                    <Step completed={!!progress.tutorAssignment}>
                                                                        <StepLabel>Asignado</StepLabel>
                                                                    </Step>
                                                                    <Step completed={!!progress.studentSubmission}>
                                                                        <StepLabel>Entregado</StepLabel>
                                                                    </Step>
                                                                    <Step completed={!!progress.grading}>
                                                                        <StepLabel>Calificado</StepLabel>
                                                                    </Step>
                                                                </Stepper>

                                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        disabled={isLocked}
                                                                        onClick={() => openDetailModal(progress)}
                                                                        sx={{
                                                                            backgroundColor: isLocked ? '#bdbdbd' : '#000A9B',
                                                                            textTransform: 'none',
                                                                            '&:hover': { backgroundColor: isLocked ? '#bdbdbd' : '#0011cc' }
                                                                        }}
                                                                    >
                                                                        {isLocked ? 'Bloqueado' : (!progress.studentSubmission ? 'Subir Entrega' : 'Ver Detalles')}
                                                                    </Button>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                );
                                            })
                                        ) : (
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', ml: 2 }}>
                                                    Sin actividades asignadas en esta semana
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Modal de Detalle */}
            <DetailsModal
                open={detailModalOpen}
                onClose={handleCloseModal}
                progressData={selectedProgress}
                getStateConfig={getStateConfig}
                onSubmit={handleSubmitProgress}
                initialTab={initialTab}
            />

            {/* Modal de Detalle de Reunión */}
            <Dialog
                open={meetingModalOpen}
                onClose={() => setMeetingModalOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                {selectedMeeting && (
                    <>
                        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
                            Detalle de Reunión
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3 }}>
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Motivo</Typography>
                                    <Typography variant="h6">{selectedMeeting.motivo}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4 }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                                        <Typography variant="body1">
                                            {new Date(selectedMeeting.fecha).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Horario</Typography>
                                        <Typography variant="body1">
                                            {new Date(selectedMeeting.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(selectedMeeting.horaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Modalidad</Typography>
                                    <Chip label={selectedMeeting.modalidad} color="primary" variant="outlined" size="small" />
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Resumen / Observaciones</Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        {selectedMeeting.resumen || "Sin resumen registrado"}
                                    </Typography>
                                </Box>
                                {selectedMeeting.compromisos && Array.isArray(selectedMeeting.compromisos) && selectedMeeting.compromisos.length > 0 && (
                                    <>
                                        <Divider />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Compromisos</Typography>
                                            <List dense>
                                                {selectedMeeting.compromisos.map((c, i) => (
                                                    <ListItem key={i}>
                                                        <ListItemText primary={typeof c === 'string' ? c : c.description || "Compromiso"} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setMeetingModalOpen(false)}>Cerrar</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Alert Component */}
            <AlertMui
                open={alertState.open}
                handleClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                status={alertState.status}
                showBtnL={true}
                btnNameL="Aceptar"
                actionBtnL={() => setAlertState({ ...alertState, open: false })}
            />
        </>
    );
}

export default StudentAvances;
