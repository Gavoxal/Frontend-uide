import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import ActivityForm from '../../components/activityform.mui.component';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { ActivityService } from '../../services/activity.service';
import { TutorService } from '../../services/tutor.service';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


function ActivityPlanning() {
    const location = useLocation();
    const preselectedStudent = location.state?.student;

    const [view, setView] = useState(preselectedStudent ? 'create' : 'history');
    const [history, setHistory] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'success' });
    const [editingActivity, setEditingActivity] = useState(null);
    const [viewingActivity, setViewingActivity] = useState(null);

    const loadHistory = async (studentList, preselected = null) => {
        try {
            let allActivities = [];
            if (preselected?.propuesta?.id) {
                const activities = await ActivityService.getByPropuesta(preselected.propuesta.id);
                // Filtrar solo las actividades de tipo TUTORIA
                allActivities = activities
                    .filter(a => a.tipo === 'TUTORIA')
                    .map(a => ({
                        ...a,
                        studentName: preselected.name,
                        studentId: preselected.id
                    }));
            } else {
                // Fetch activities for all students who have a proposal
                const historyPromises = studentList
                    .filter(s => s.propuestaId)
                    .map(async (s) => {
                        try {
                            const activities = await ActivityService.getByPropuesta(s.propuestaId);
                            // Filtrar solo las actividades de tipo TUTORIA
                            return activities
                                .filter(a => a.tipo === 'TUTORIA')
                                .map(a => ({
                                    ...a,
                                    studentName: s.name,
                                    studentId: s.id
                                }));
                        } catch (e) {
                            return [];
                        }
                    });
                const results = await Promise.all(historyPromises);
                allActivities = results.flat();
            }

            allActivities.sort((a, b) => {
                const dateA = a.createdAt || a.fechaAsignacion || a.fecha_asignacion || a.fechaCreacion || a.fecha_creacion || 0;
                const dateB = b.createdAt || b.fechaAsignacion || b.fecha_asignacion || b.fechaCreacion || b.fecha_creacion || 0;
                return new Date(dateB) - new Date(dateA);
            });

            setHistory(allActivities.map(a => {
                // Extremely greedy date mapping
                const createDate = a.createdAt || a.fechaAsignacion || a.fecha_asignacion || a.fechaCreacion || a.fecha_creacion;
                const deliveryDate = a.fechaEntrega || a.fecha_entrega || a.fechaVencimiento || a.fecha_vencimiento || a.deadline;

                const formatDate = (dateValue) => {
                    if (!dateValue) return null;
                    const d = new Date(dateValue);
                    return isNaN(d.getTime()) ? null : d.toLocaleDateString();
                };

                return {
                    id: a.id,
                    assignedDate: formatDate(createDate) || 'N/A',
                    studentName: a.studentName,
                    studentId: a.studentId,
                    activity: a.nombre,
                    description: a.descripcion,
                    deadline: formatDate(deliveryDate) || 'Sin fecha',
                    status: (a.evidencias && a.evidencias.length > 0 && (a.estado === 'NO_ENTREGADO' || !a.estado))
                        ? 'entregado'
                        : (a.estado?.toLowerCase() || 'pendiente'),
                    semana: a.semana || '?',
                    priority: 'media'
                };
            }));
        } catch (error) {
            console.error("Error loading history:", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                // 1. Cargar lista de estudiantes
                const tutorStudents = await TutorService.getAssignedStudents();
                const mappedStudents = tutorStudents.map(s => ({
                    id: s.id,
                    name: `${s.nombres} ${s.apellidos}`,
                    thesis: s.propuesta?.titulo || 'Sin propuesta',
                    propuestaId: s.propuesta?.id
                }));
                setStudents(mappedStudents);

                // 2. Cargar historial (específico o general)
                await loadHistory(mappedStudents, preselectedStudent);
            } catch (error) {
                console.error("Error loading initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [preselectedStudent]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            // Encontrar el estudiante para obtener el propuestaId (usar String() para evitar fallos de tipo)
            const student = students.find(s => String(s.id) === String(formData.studentId));
            if (!student?.propuestaId) {
                throw new Error("El estudiante seleccionado no tiene una propuesta activa vinculada.");
            }

            const activityData = {
                nombre: formData.title,
                descripcion: formData.description,
                propuestaId: student.propuestaId,
                tipo: 'TUTORIA',
                semana: Number(formData.semana),
                fechaEntrega: formData.deadline // Agregamos la fecha de entrega
            };

            if (editingActivity) {
                await ActivityService.update(editingActivity.id, activityData);
                setAlertState({
                    open: true,
                    message: 'Actividad actualizada correctamente',
                    severity: 'success'
                });
            } else {
                await ActivityService.create(activityData);
                setAlertState({
                    open: true,
                    message: 'Actividad asignada y estudiante notificado correctamente',
                    severity: 'success'
                });
            }

            // Recargar historial antes de cambiar la vista
            await loadHistory(students, preselectedStudent);
            setView('history');
            setEditingActivity(null);
        } catch (error) {
            setAlertState({
                open: true,
                message: error.response?.data?.message || error.message || 'Error al crear la actividad',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDraft = (data) => {
        console.log('Borrador guardado:', data);
        setAlertState({ open: true, message: 'Borrador guardado localmente (simulado)', severity: 'info' });
        setView('history');
    };

    const getStatusIcon = (status) => {
        const icons = {
            cumplido: <CheckCircleIcon sx={{ color: '#4caf50' }} />,
            no_cumplido: <CancelIcon sx={{ color: '#f44336' }} />,
            pendiente: <PendingIcon sx={{ color: '#ff9800' }} />,
            entregado: <CheckCircleIcon sx={{ color: '#2196f3' }} />,
            no_entregado: <CancelIcon sx={{ color: '#9e9e9e' }} />
        };
        return icons[status] || icons.pendiente;
    };

    const getStatusChip = (status) => {
        const config = {
            cumplido: { label: 'Cumplido', color: '#4caf50' },
            no_cumplido: { label: 'No Cumplido', color: '#f44336' },
            pendiente: { label: 'Pendiente', color: '#ff9800' },
            entregado: { label: 'Entregado', color: '#2196f3' },
            no_entregado: { label: 'Sin Entregar', color: '#9e9e9e' }
        };
        const statusConfig = config[status] || config.pendiente;
        const { label, color } = statusConfig;
        return (
            <Chip
                icon={getStatusIcon(status)}
                label={label}
                size="small"
                sx={{
                    backgroundColor: `${color}15`,
                    color: color,
                    fontWeight: 600
                }}
            />
        );
    };

    const handleEdit = (activity) => {
        // Map history item to form structure
        // Need to parse date string back to Date object if needed
        // activity.deadline is formatted string, so we might want original object or parse it
        // Simpler: just pass what we have
        setEditingActivity({
            id: activity.id,
            studentId: activity.studentId,
            title: activity.activity,
            description: activity.description,
            semana: activity.semana,
            deadline: activity.deadline === 'Sin fecha' ? new Date() : new Date(activity.deadline), // Simple parse, might need adjustment
            resources: []
        });
        setView('create');
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.')) {
            setLoading(true);
            try {
                await ActivityService.delete(id);
                setAlertState({ open: true, message: 'Actividad eliminada correctamente', severity: 'success' });
                await loadHistory(students, preselectedStudent);
            } catch (error) {
                setAlertState({ open: true, message: 'Error al eliminar la actividad', severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleView = (activity) => {
        setViewingActivity(activity);
    };



    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
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
            {/* Header with Navigation */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Planificación de Actividades 📋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {view === 'history'
                            ? 'Gestiona y supervisa las tareas asignadas a tus estudiantes.'
                            : 'Define la nueva tarea o acuerdo.'}
                    </Typography>
                </Box>

                {view === 'history' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {preselectedStudent && (
                            <Chip
                                label={`Semanas Asignadas: ${history.filter(h => h.studentId === preselectedStudent.id).length} / 16`}
                                color={history.filter(h => h.studentId === preselectedStudent.id).length >= 16 ? 'error' : 'primary'}
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                            />
                        )}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setView('create')}
                            disabled={preselectedStudent && history.filter(h => h.studentId === preselectedStudent.id).length >= 16}
                            sx={{
                                backgroundColor: '#667eea',
                                fontWeight: 600,
                                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                '&:hover': { backgroundColor: '#5a6fd6' }
                            }}
                        >
                            {preselectedStudent && history.filter(h => h.studentId === preselectedStudent.id).length >= 16
                                ? 'Límite Semanal Alcanzado'
                                : 'Nueva Actividad'
                            }
                        </Button>
                    </Box>
                ) : (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            setView('history');
                            setEditingActivity(null);
                        }}
                        sx={{ fontWeight: 600 }}
                    >
                        Volver al Historial
                    </Button>
                )}
            </Box>

            {/* View: Create Activity */}
            {
                view === 'create' && (
                    <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {editingActivity ? 'Editar Actividad' : 'Crear Nueva Actividad/Acuerdo'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Completa el formulario para asignar una actividad.
                                {preselectedStudent && view === 'create' && <strong style={{ color: '#667eea' }}> Asignando a: {preselectedStudent.name}</strong>}
                            </Typography>

                            <ActivityForm
                                students={students}
                                onSubmit={handleSubmit}
                                onDraft={handleDraft}
                                initialData={editingActivity || (preselectedStudent ? { studentId: preselectedStudent.id } : null)}
                            />
                        </CardContent>
                    </Card>
                )
            }

            {/* View: History (Main View) */}
            {
                view === 'history' && (
                    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Historial de Actividades
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Registro de actividades y su estado de cumplimiento
                                    </Typography>
                                </Box>

                                {/* Estadísticas rápidas */}
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Chip
                                        label={`${history.filter(h => h.status === 'cumplido' || h.status === 'aprobado' || h.status === 'entregado').length} Cumplidos/Entregados`}
                                        sx={{ backgroundColor: '#e8f5e9', color: '#4caf50', fontWeight: 600 }}
                                    />
                                    <Chip
                                        label={`${history.filter(h => h.status === 'pendiente' || h.status === 'en_progreso').length} Pendientes`}
                                        sx={{ backgroundColor: '#fff3e0', color: '#ff9800', fontWeight: 600 }}
                                    />
                                    <Chip
                                        label={`${history.filter(h => h.status === 'no_cumplido' || h.status === 'retrasado').length} Incumplidos`}
                                        sx={{ backgroundColor: '#ffebee', color: '#f44336', fontWeight: 600 }}
                                    />
                                </Box>
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Fecha</strong></TableCell>
                                            <TableCell><strong>Estudiante</strong></TableCell>
                                            <TableCell><strong>Actividad</strong></TableCell>
                                            <TableCell><strong>Semana</strong></TableCell>
                                            <TableCell><strong>Límite</strong></TableCell>
                                            <TableCell><strong>Estado</strong></TableCell>
                                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {history.map((item, idx) => (
                                            <TableRow key={item.id || `act-${idx}`} hover>
                                                <TableCell>{item.assignedDate}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {item.studentName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {item.activity}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.semana === '?' ? 'N/A' : `Sem. ${item.semana}`}
                                                        size="small"
                                                        variant="outlined"
                                                        color={item.semana === '?' ? 'default' : 'primary'}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.deadline}</TableCell>
                                                <TableCell>{getStatusChip(item.status)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleView(item)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )
            }
            {/* Dialog de Visualización */}
            <Dialog open={!!viewingActivity} onClose={() => setViewingActivity(null)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#f5f5f5', pb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Detalle de Actividad
                        </Typography>
                        {viewingActivity && getStatusChip(viewingActivity.status)}
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {viewingActivity && (
                        <Grid container spacing={3} sx={{ mt: 0 }}>
                            {/* Header Section */}
                            <Grid item xs={12}>
                                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                    {viewingActivity.activity}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Asignado a: <strong>{viewingActivity.studentName}</strong>
                                </Typography>
                            </Grid>

                            {/* Dates Section */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        FECHA DE ASIGNACIÓN
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {viewingActivity.assignedDate}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        FECHA LÍMITE
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" color={new Date(viewingActivity.deadline) < new Date() ? 'error' : 'text.primary'}>
                                        {viewingActivity.deadline}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Description Section */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
                                    DESCRIPCIÓN DE LA ACTIVIDAD
                                </Typography>
                                <Box sx={{
                                    p: 3,
                                    bgcolor: '#ffffff',
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                    minHeight: '100px'
                                }}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {viewingActivity.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setViewingActivity(null)} variant="outlined" color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}

export default ActivityPlanning;
