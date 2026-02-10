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
import { DocenteService } from '../../services/docente.service';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


function DocenteActivityPlanning() {
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
            if (preselected?.propuesta?.id || preselected?.propuestaId) {
                const propId = preselected?.propuesta?.id || preselected?.propuestaId;
                const activities = await ActivityService.getByPropuesta(propId);
                // Filtrar solo las actividades de tipo DOCENCIA
                allActivities = activities
                    .filter(a => a.tipo === 'DOCENCIA')
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
                            // Filtrar solo las actividades de tipo DOCENCIA
                            return activities
                                .filter(a => a.tipo === 'DOCENCIA')
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
                    type: a.tipo || 'DOCENCIA', // Default to DOCENCIA
                };
            }));
        } catch (error) {
            console.error("Error loading history:", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            console.log("DEBUG: loadInitialData started");
            setLoading(true);
            try {
                // 1. Cargar lista de estudiantes (para Docente Integración)
                const docenteStudents = await DocenteService.getAssignedStudents();
                console.log("DEBUG: docenteStudents response:", docenteStudents);
                const mappedStudents = docenteStudents.map(s => ({
                    id: s.id,
                    name: `${s.nombres} ${s.apellidos}`,
                    thesis: s.propuesta?.titulo || 'Sin propuesta',
                    propuestaId: s.propuesta?.id || s.propuestaId
                }));
                console.log("DEBUG: mappedStudents:", mappedStudents);
                setStudents(mappedStudents);

                // 2. Cargar historial
                // Si viene preseleccionado, aseguramos que tenga el formato correcto
                let currentPreselected = preselectedStudent;
                if (preselectedStudent && !preselectedStudent.propuestaId && preselectedStudent.propuesta?.id) {
                    currentPreselected = { ...preselectedStudent, propuestaId: preselectedStudent.propuesta.id };
                }

                await loadHistory(mappedStudents, currentPreselected);
            } catch (error) {
                console.error("Error loading initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [preselectedStudent]);

    const handleSubmit = async (formData) => {
        console.log("DEBUG: handleSubmit formData:", formData);
        console.log("DEBUG: current students list:", students);
        setLoading(true);
        try {
            // Encontrar el estudiante para obtener el propuestaId (usar == para comparar string/number)
            const student = students.find(s => String(s.id) === String(formData.studentId));
            console.log("DEBUG: found student:", student);

            if (!student?.propuestaId) {
                console.error("DEBUG: Student without proposal id:", student);
                throw new Error("El estudiante seleccionado no tiene una propuesta activa vinculada.");
            }

            const activityData = {
                nombre: formData.title,
                descripcion: formData.description,
                propuestaId: student.propuestaId,
                tipo: 'DOCENCIA', // IMPORTANTE: Tipo DOCENCIA
                semana: Number(formData.semana),
                fechaEntrega: formData.deadline // Agregamos la fecha de entrega
            };

            console.log("DEBUG FRONTEND: Sending activityData:", activityData);

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
                    message: 'Actividad asignada por Docente correctamente',
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
        setEditingActivity({
            id: activity.id,
            studentId: activity.studentId,
            title: activity.activity,
            description: activity.description,
            semana: activity.semana,
            deadline: activity.deadline === 'Sin fecha' ? new Date() : new Date(activity.deadline),
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

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Planificación Docente 📋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {view === 'history'
                            ? 'Gestiona las actividades de integración asignadas.'
                            : 'Define la nueva tarea de integración.'}
                    </Typography>
                </Box>

                {view === 'history' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setView('create')}
                            sx={{
                                backgroundColor: '#667eea',
                                fontWeight: 600,
                                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                '&:hover': { backgroundColor: '#5a6fd6' }
                            }}
                        >
                            Nueva Actividad
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
                                {editingActivity ? 'Editar Actividad' : 'Crear Nueva Actividad (Docencia)'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Completa el formulario para asignar una actividad.
                                {preselectedStudent && view === 'create' && <strong style={{ color: '#667eea' }}> Asignando a: {preselectedStudent.name}</strong>}
                            </Typography>

                            <ActivityForm
                                students={students}
                                onSubmit={handleSubmit}
                                onDraft={handleDraft}
                                initialData={editingActivity || (preselectedStudent ? { studentId: preselectedStudent.id, studentName: preselectedStudent.name } : null)}
                            />
                        </CardContent>
                    </Card>
                )
            }

            {/* View: History */}
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
                                        Registro de actividades de docencia y cumplimiento
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {/* Stats chips similar to Tutor */}
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
                                            <TableCell><strong>Tipo</strong></TableCell>
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
                                                <TableCell>
                                                    <Chip label={item.type === 'DOCENCIA' ? 'Docencia' : 'Tutoría'}
                                                        size="small"
                                                        color={item.type === 'DOCENCIA' ? 'secondary' : 'default'}
                                                        variant="outlined" />
                                                </TableCell>
                                                <TableCell>{item.deadline}</TableCell>
                                                <TableCell>{getStatusChip(item.status)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" color="primary" onClick={() => handleView(item)}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="primary" onClick={() => handleEdit(item)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
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
                            <Grid item xs={12}>
                                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                    {viewingActivity.activity}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                    <Chip label={viewingActivity.type} color="primary" variant="outlined" size="small" />
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Asignado a: <strong>{viewingActivity.studentName}</strong>
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {viewingActivity.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setViewingActivity(null)} variant="outlined">Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}

export default DocenteActivityPlanning;
