import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import ActivityForm from '../../components/activityform.mui.component';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

// Mock data de estudiantes (Docente Integración context)
const MOCK_STUDENTS = [
    { id: 1, name: "Juan Pérez", thesis: "Sistema de IoT para agricultura" },
    { id: 2, name: "María García", thesis: "App móvil de gestión académica" },
    { id: 3, name: "Carlos López", thesis: "Reconocimiento facial con Deep Learning" },
    { id: 4, name: "Ana Martínez", thesis: "E-commerce con microservicios" },
    { id: 5, name: "Luis Rodríguez", thesis: "Gestión hospitalaria con blockchain" },
    { id: 6, name: "Sofia Hernández", thesis: "Chatbot con NLP" }
];

// Mock data de historial de acuerdos
const MOCK_HISTORY = [
    {
        id: 1,
        assignedDate: "2026-01-27",
        studentName: "Juan Pérez",
        activity: "Implementación de sensores DHT22",
        deadline: "2026-02-03",
        status: "cumplido",
        priority: "alta"
    },
    {
        id: 2,
        assignedDate: "2026-01-27",
        studentName: "María García",
        activity: "Módulo de autenticación JWT",
        deadline: "2026-02-03",
        status: "pendiente",
        priority: "media"
    },
    {
        id: 3,
        assignedDate: "2026-01-20",
        studentName: "Carlos López",
        activity: "Entrenamiento de modelo CNN",
        deadline: "2026-01-27",
        status: "no_cumplido",
        priority: "alta"
    }
];

function DocenteActivityPlanning() {
    const location = useLocation();
    const preselectedStudent = location.state?.student;

    const [tabValue, setTabValue] = useState(0);
    const [history] = useState(MOCK_HISTORY);

    const handleSubmit = (data) => {
        console.log('Actividad creada:', data);
        // Aquí iría la lógica para guardar y notificar
        alert('Actividad asignada y estudiante notificado correctamente');
    };

    const handleDraft = (data) => {
        console.log('Borrador guardado:', data);
        alert('Borrador guardado correctamente');
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

    const getPriorityChip = (priority) => {
        const config = {
            alta: { label: 'Alta', color: '#f44336' },
            media: { label: 'Media', color: '#ff9800' },
            baja: { label: 'Baja', color: '#4caf50' }
        };
        const { label, color } = config[priority];
        return (
            <Chip
                label={label}
                size="small"
                sx={{
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 600
                }}
            />
        );
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Planificación de Actividades 📋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Crea y gestiona tareas semanales para tus estudiantes (Docente Integración)
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="Nueva Actividad" />
                    <Tab label="Historial de Acuerdos" />
                </Tabs>
            </Box>

            {/* Tab 1: Nueva Actividad */}
            {tabValue === 0 && (
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Crear Nueva Actividad
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Define la tarea semanal que el estudiante debe completar. {preselectedStudent && `Actividad para: ${preselectedStudent.name}`}
                        </Typography>

                        <ActivityForm
                            students={MOCK_STUDENTS}
                            onSubmit={handleSubmit}
                            onDraft={handleDraft}
                            initialData={preselectedStudent ? { studentId: preselectedStudent.id } : null}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Tab 2: Historial */}
            {tabValue === 1 && (
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Historial de Acuerdos
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Actividades asignadas en semanas anteriores
                                </Typography>
                            </Box>

                            {/* Estadísticas rápidas */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Chip
                                    label={`${history.filter(h => h.status === 'cumplido').length} Cumplidos`}
                                    sx={{ backgroundColor: '#e8f5e9', color: '#4caf50', fontWeight: 600 }}
                                />
                                <Chip
                                    label={`${history.filter(h => h.status === 'pendiente').length} Pendientes`}
                                    sx={{ backgroundColor: '#fff3e0', color: '#ff9800', fontWeight: 600 }}
                                />
                                <Chip
                                    label={`${history.filter(h => h.status === 'no_cumplido').length} No Cumplidos`}
                                    sx={{ backgroundColor: '#ffebee', color: '#f44336', fontWeight: 600 }}
                                />
                            </Box>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Asignación</strong></TableCell>
                                        <TableCell><strong>Estudiante</strong></TableCell>
                                        <TableCell><strong>Actividad</strong></TableCell>
                                        <TableCell><strong>Fecha Límite</strong></TableCell>
                                        <TableCell><strong>Prioridad</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((item, idx) => (
                                        <TableRow key={item.id || `doc-act-${idx}`} hover>
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
                                            <TableCell>{item.deadline}</TableCell>
                                            <TableCell>{getPriorityChip(item.priority)}</TableCell>
                                            <TableCell>{getStatusChip(item.status)}</TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" color="primary">
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="primary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error">
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
            )}
        </Box>
    );
}

export default DocenteActivityPlanning;
