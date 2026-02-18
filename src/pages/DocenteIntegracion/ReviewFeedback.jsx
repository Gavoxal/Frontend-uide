import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    IconButton,
    LinearProgress,
    Snackbar
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import FeedbackPanel from '../../components/feedbackpanel.mui.component';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ActivityService } from '../../services/activity.service';
import { DocenteService } from '../../services/docente.service';

function DocenteReviewFeedback() {
    const location = useLocation();
    const navigate = useNavigate();
    const preselectedStudent = location.state?.student;

    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [view, setView] = useState('list');
    const [loading, setLoading] = useState(true);
    const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'success' });

    const loadSubmissions = async (studentList, preselected = null) => {
        try {
            let allSubmissions = [];

            if (preselected?.propuestaId || preselected?.propuesta?.id) {
                const propId = preselected.propuestaId || preselected.propuesta.id;
                const activities = await ActivityService.getByPropuesta(propId);

                // Filtrar solo actividades de DOCENCIA
                allSubmissions = activities
                    .filter(a => a.tipo === 'DOCENCIA')
                    .flatMap(a => {
                        if (!a.evidencias || a.evidencias.length === 0) {
                            return [{
                                id: `pending-${a.id}`,
                                activityId: a.id,
                                student: preselected.name,
                                studentId: preselected.id,
                                title: a.nombre,
                                submissionDate: 'Pendiente',
                                fileName: '-',
                                fileSize: '-',
                                fileLink: null,
                                comments: 'Sin entrega aún',
                                weekNumber: a.semana || 0,
                                status: 'no_submission',
                                grade: null,
                                feedback: '',
                                historicalComments: []
                            }];
                        }
                        return a.evidencias.map(e => ({
                            id: e.id,
                            activityId: a.id,
                            student: preselected.name,
                            studentId: preselected.id,
                            title: a.nombre,
                            submissionDate: e.fechaEntrega?.split('T')[0] || 'N/A',
                            fileName: e.archivoUrl?.split('/').pop() || 'archivo.bin',
                            fileSize: 'N/A',
                            fileLink: e.archivoUrl,
                            comments: e.contenido || 'Sin comentarios adicionales',
                            weekNumber: e.semana || a.semana || 0,
                            status: e.calificacionDocente !== null ? 'reviewed' : 'pending',
                            grade: e.calificacionDocente,
                            feedback: e.feedbackDocente || '',
                            historicalComments: e.comentarios || []
                        }));
                    });
            } else {
                // Fetch for all students
                const submissionPromises = studentList
                    .filter(s => s.propuestaId)
                    .map(async (s) => {
                        try {
                            const activities = await ActivityService.getByPropuesta(s.propuestaId);

                            // Filtrar solo actividades de DOCENCIA
                            return activities
                                .filter(a => a.tipo === 'DOCENCIA')
                                .flatMap(a => {
                                    if (!a.evidencias || a.evidencias.length === 0) {
                                        return [{
                                            id: `pending-${a.id}`,
                                            activityId: a.id,
                                            student: s.name,
                                            studentId: s.id,
                                            title: a.nombre,
                                            submissionDate: 'Pendiente',
                                            fileName: '-',
                                            fileSize: '-',
                                            fileLink: null,
                                            comments: 'Sin entrega aún',
                                            weekNumber: a.semana || 0,
                                            status: 'no_submission',
                                            grade: null,
                                            feedback: '',
                                            historicalComments: []
                                        }];
                                    }
                                    return a.evidencias.map(e => ({
                                        id: e.id,
                                        activityId: a.id,
                                        student: s.name,
                                        studentId: s.id,
                                        title: a.nombre,
                                        submissionDate: e.fechaEntrega?.split('T')[0] || 'N/A',
                                        fileName: e.archivoUrl?.split('/').pop() || 'archivo.bin',
                                        fileSize: 'N/A',
                                        fileLink: e.archivoUrl,
                                        comments: e.contenido || 'Sin comentarios adicionales',
                                        weekNumber: e.semana || a.semana || 0,
                                        status: e.calificacionDocente !== null ? 'reviewed' : 'pending',
                                        grade: e.calificacionDocente,
                                        feedback: e.feedbackDocente || '',
                                        historicalComments: e.comentarios || []
                                    }));
                                });
                        } catch (e) {
                            return [];
                        }
                    });
                const results = await Promise.all(submissionPromises);
                allSubmissions = results.flat();
            }

            allSubmissions.sort((a, b) => {
                const dateA = a.submissionDate || 0;
                const dateB = b.submissionDate || 0;
                return new Date(dateB) - new Date(dateA);
            });

            setSubmissions(allSubmissions);
        } catch (error) {
            console.error("Error loading submissions (Docente):", error);
        }
    };

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const docenteStudents = await DocenteService.getAssignedStudents();
            const mappedStudents = docenteStudents.map(s => ({
                id: s.id,
                name: `${s.nombres} ${s.apellidos}`,
                propuestaId: s.propuestaId || s.propuesta?.id
            }));

            await loadSubmissions(mappedStudents, preselectedStudent);
        } catch (error) {
            console.error("Error in DocenteReviewFeedback loadInitialData:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, [preselectedStudent]);

    const handleSelectSubmission = (submission) => {
        setSelectedSubmission(submission);
        setView('detail');
    };

    const handleSubmitFeedback = async (feedbackData) => {
        setLoading(true);
        try {
            await ActivityService.gradeEvidenciaDocente(selectedSubmission.id, {
                calificacion: Number(feedbackData.rating),
                feedback: feedbackData.observations
            });

            setAlertState({
                open: true,
                message: `Evaluación enviada correctamente para ${selectedSubmission.student}`,
                severity: 'success'
            });

            setView('list');
            setSelectedSubmission(null);
            await loadInitialData();
        } catch (error) {
            setAlertState({
                open: true,
                message: error.message || 'Error al enviar evaluación',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelFeedback = () => {
        setView('list');
        setSelectedSubmission(null);
    };

    const pendingSubmissions = submissions.filter(s => s.status === 'pending');

    return (
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
            {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setAlertState(prev => ({ ...prev, open: false }))} severity={alertState.severity} sx={{ width: '100%' }}>
                    {alertState.message}
                </Alert>
            </Snackbar>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Revisión de Avances
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {view === 'list'
                            ? 'Gestión de integración y validaciones de docencia'
                            : `Revisando avance de ${selectedSubmission?.student || 'Estudiante'}`}
                    </Typography>
                </Box>
                {view === 'detail' && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancelFeedback}
                    >
                        Volver a la Lista
                    </Button>
                )}
            </Box>

            {view === 'list' && (
                <>
                    {pendingSubmissions.length > 0 && (
                        <Alert severity="info" sx={{ mb: 3 }} icon={<AssignmentTurnedInIcon />}>
                            Tienes <strong>{pendingSubmissions.length} avance(s)</strong> de docencia pendientes de revisión
                        </Alert>
                    )}

                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="tabla de revisiones docente">
                            <TableHead sx={{ backgroundColor: 'rgba(0, 10, 155, 0.05)' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Estudiante</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actividad / Avance</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Entrega</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                            <Typography color="text.secondary">No hay entregas de docencia disponibles para revisar.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    submissions.map((submission) => (
                                        <TableRow
                                            key={submission.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Typography variant="subtitle2" fontWeight="600">
                                                    {submission.student}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Semana {submission.weekNumber}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="500">
                                                    {submission.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 1,
                                                    maxWidth: 300
                                                }}>
                                                    {submission.comments}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {submission.submissionDate}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {submission.status === 'reviewed' ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                        <Chip label="Revisado" color="success" size="small" variant="outlined" />
                                                        <Tooltip title="Ver Detalles">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleSelectSubmission(submission)}
                                                                color="primary"
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                ) : submission.status === 'no_submission' ? (
                                                    <Chip label="Sin entrega" size="small" sx={{ opacity: 0.6 }} />
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleSelectSubmission(submission)}
                                                        startIcon={<AssignmentTurnedInIcon />}
                                                        sx={{
                                                            backgroundColor: '#000A9B',
                                                            '&:hover': { backgroundColor: '#00076b' }
                                                        }}
                                                    >
                                                        Revisar
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {view === 'detail' && selectedSubmission && (
                <FeedbackPanel
                    submission={selectedSubmission}
                    onSubmit={handleSubmitFeedback}
                    onCancel={handleCancelFeedback}
                    feedbackTitle="Evaluación Docente"
                    sectionTitle="Avance de Docencia"
                />
            )}
        </Box>
    );
}

export default DocenteReviewFeedback;
