import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Chip,
    Stepper,
    Step,
    StepLabel,
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

function StudentAvances() {
    const [selectedProgress, setSelectedProgress] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState(0);
    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    // Datos de ejemplo - En producción vendrían del backend
    const progressData = {
        completedWeeks: 2,
        totalWeeks: 15,
        currentWeek: 3
    };

    // Estructura unificada de avances semanales
    const weeklyProgress = [
        {
            id: 1,
            weekNumber: 1,
            title: "Autenticación de Usuarios",
            assignmentDate: new Date(2026, 0, 20),
            dueDate: new Date(2026, 0, 27),

            tutorAssignment: {
                description: "Implementar sistema de autenticación completo con JWT",
                requirements: [
                    "Login con email y contraseña",
                    "Registro de usuarios",
                    "Implementar JWT para sesiones",
                    "Recuperación de contraseña"
                ],
                assignedBy: "Ing. Carlos Pérez",
                assignedDate: new Date(2026, 0, 20),
            },

            studentSubmission: {
                uploadedFile: "avance_semana1.pdf",
                submittedDate: new Date(2026, 0, 26),
                comments: "Implementación completa con pruebas unitarias incluidas",
            },

            tutorReview: {
                status: "approved",
                feedback: "Excelente trabajo. La implementación es sólida y las pruebas son adecuadas.",
                reviewDate: new Date(2026, 0, 27),
                technicalScore: "Cumple",
            },

            integrationGrade: {
                score: 95,
                gradedBy: "Ing. Lorena García",
                gradedDate: new Date(2026, 0, 28),
                feedback: "Muy buen trabajo, cumple con todos los criterios de la rúbrica.",
            },

            currentState: "graded"
        },
        {
            id: 2,
            weekNumber: 2,
            title: "Dashboard y Gestión de Perfiles",
            assignmentDate: new Date(2026, 0, 27),
            dueDate: new Date(2026, 1, 3),

            tutorAssignment: {
                description: "Crear dashboard principal y sistema de perfiles de usuario",
                requirements: [
                    "Dashboard con estadísticas básicas",
                    "Página de perfil de usuario",
                    "Edición de perfil",
                    "Carga de imagen de perfil"
                ],
                assignedBy: "Ing. Carlos Pérez",
                assignedDate: new Date(2026, 0, 27),
            },

            studentSubmission: {
                uploadedFile: "avance_semana2.pdf",
                submittedDate: new Date(2026, 1, 2),
                comments: "Dashboard implementado con gráficos interactivos",
            },

            tutorReview: {
                status: "approved",
                feedback: "Buen trabajo. Considera mejorar la responsividad en móviles.",
                reviewDate: new Date(2026, 1, 3),
                technicalScore: "Cumple pero falta",
            },

            integrationGrade: null,
            currentState: "pending_integration_grade"
        },
        {
            id: 3,
            weekNumber: 3,
            title: "Sistema de Reportes",
            assignmentDate: new Date(2026, 1, 3),
            dueDate: new Date(2026, 1, 10),

            tutorAssignment: {
                description: "Implementar módulo de generación de reportes",
                requirements: [
                    "Reportes en PDF",
                    "Filtros por fecha",
                    "Exportación a Excel",
                    "Gráficos estadísticos"
                ],
                assignedBy: "Ing. Carlos Pérez",
                assignedDate: new Date(2026, 1, 3),
            },

            studentSubmission: {
                uploadedFile: "avance_semana3.pdf",
                submittedDate: new Date(2026, 1, 9),
                comments: "Implementación con librería jsPDF",
            },

            tutorReview: null,
            integrationGrade: null,
            currentState: "pending_tutor_review"
        },
        {
            id: 4,
            weekNumber: 4,
            title: "API REST y Endpoints",
            assignmentDate: new Date(2026, 1, 10),
            dueDate: new Date(2026, 1, 17),

            tutorAssignment: {
                description: "Desarrollar API REST para el backend del sistema",
                requirements: [
                    "CRUD completo para entidades principales",
                    "Validación de datos con Zod",
                    "Documentación con Swagger",
                    "Manejo de errores estándar"
                ],
                assignedBy: "Ing. Carlos Pérez",
                assignedDate: new Date(2026, 1, 10),
            },

            studentSubmission: null,
            tutorReview: null,
            integrationGrade: null,
            currentState: "pending_upload"
        },
        {
            id: 5,
            weekNumber: 5,
            title: "Optimización y Testing",
            assignmentDate: new Date(2026, 1, 17),
            dueDate: new Date(2026, 1, 24),

            tutorAssignment: null,
            studentSubmission: null,
            tutorReview: null,
            integrationGrade: null,
            currentState: "pending_assignment"
        }
    ];

    // Convertir avances a eventos del calendario
    const calendarEvents = weeklyProgress
        .filter(progress => progress.tutorAssignment)
        .map(progress => {
            let color = '#9e9e9e';
            let title = progress.title;

            switch (progress.currentState) {
                case 'graded':
                    color = '#4caf50';
                    break;
                case 'pending_integration_grade':
                    color = '#2196f3';
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
                date: progress.dueDate,
                color: color,
                progressId: progress.id
            };
        });

    const getStateConfig = (state) => {
        switch (state) {
            case 'graded':
                return { label: 'Calificado', color: '#4caf50', icon: CheckCircle };
            case 'pending_integration_grade':
                return { label: 'Esperando Calificación', color: '#2196f3', icon: Grade };
            case 'pending_tutor_review':
                return { label: 'En Revisión', color: '#ff9800', icon: PlayCircleOutline };
            case 'pending_upload':
                return { label: 'Pendiente de Entrega', color: '#f44336', icon: UploadFile };
            case 'pending_assignment':
                return { label: 'Sin Asignar', color: '#9e9e9e', icon: RadioButtonUnchecked };
            default:
                return { label: 'Desconocido', color: '#9e9e9e', icon: RadioButtonUnchecked };
        }
    };

    const handleEventClick = (event) => {
        const progress = weeklyProgress.find(p => p.id === event.progressId);
        if (progress) {
            openDetailModal(progress);
        }
    };

    const handleDateClick = (date) => {
        // Buscar avance en esa fecha
        const progress = weeklyProgress.find(p =>
            p.dueDate.toDateString() === date.toDateString()
        );
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
        } else if (!progress.tutorReview) {
            setInitialTab(2); // Ir a "Revisión del Tutor"
        } else if (!progress.integrationGrade) {
            setInitialTab(3); // Ir a "Calificación Final"
        } else {
            setInitialTab(0); // Mostrar asignación
        }
    };

    const handleCloseModal = () => {
        setDetailModalOpen(false);
        setSelectedProgress(null);
        setInitialTab(0);
    };

    const handleSubmitProgress = (uploadedFile) => {
        if (!uploadedFile) {
            setAlertState({
                open: true,
                title: 'Archivo Faltante',
                message: 'Por favor, sube el archivo de tu avance antes de enviar.',
                status: 'warning'
            });
            return;
        }

        // Aquí iría la lógica para enviar al backend
        console.log('Enviando avance:', uploadedFile);

        setDetailModalOpen(false);
        setAlertState({
            open: true,
            title: '¡Avance Enviado!',
            message: 'Tu avance semanal ha sido enviado correctamente. Tu tutor lo revisará pronto.',
            status: 'success'
        });
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
                        events={calendarEvents}
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

                {/* Lista de Avances con Timeline */}
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                            Avances Semanales
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {weeklyProgress.map((progress) => {
                                const stateConfig = getStateConfig(progress.currentState);
                                const StateIcon = stateConfig.icon;

                                return (
                                    <Card
                                        key={progress.id}
                                        sx={{
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0',
                                            '&:hover': {
                                                boxShadow: 3,
                                                borderColor: '#000A9B'
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Header del avance */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="600">
                                                        Semana {progress.weekNumber}: {progress.title || 'Sin asignar'}
                                                    </Typography>
                                                    {progress.dueDate && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Fecha límite: {progress.dueDate.toLocaleDateString('es-ES', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Chip
                                                    icon={<StateIcon />}
                                                    label={stateConfig.label}
                                                    sx={{
                                                        backgroundColor: stateConfig.color,
                                                        color: 'white',
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </Box>

                                            {/* Timeline horizontal */}
                                            {progress.tutorAssignment && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Stepper activeStep={
                                                        progress.currentState === 'graded' ? 4 :
                                                            progress.currentState === 'pending_integration_grade' ? 3 :
                                                                progress.currentState === 'pending_tutor_review' ? 2 :
                                                                    progress.currentState === 'pending_upload' ? 1 : 0
                                                    } alternativeLabel>
                                                        <Step completed={!!progress.tutorAssignment}>
                                                            <StepLabel>Asignado</StepLabel>
                                                        </Step>
                                                        <Step completed={!!progress.studentSubmission}>
                                                            <StepLabel>Entregado</StepLabel>
                                                        </Step>
                                                        <Step completed={!!progress.tutorReview}>
                                                            <StepLabel>Revisado</StepLabel>
                                                        </Step>
                                                        <Step completed={!!progress.integrationGrade}>
                                                            <StepLabel>Calificado</StepLabel>
                                                        </Step>
                                                    </Stepper>
                                                </Box>
                                            )}

                                            {/* Botón de acción */}
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                {progress.tutorAssignment ? (
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => openDetailModal(progress)}
                                                        sx={{
                                                            backgroundColor: '#000A9B',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                backgroundColor: '#0011cc'
                                                            }
                                                        }}
                                                    >
                                                        {!progress.studentSubmission ? 'Subir Entrega' : 'Ver Detalles'}
                                                    </Button>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                        El tutor aún no ha asignado esta semana
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
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
