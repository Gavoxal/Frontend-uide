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

// Mock data de estudiantes
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
    },
    {
        id: 4,
        assignedDate: "2026-01-27",
        studentName: "Ana Martínez",
        activity: "Implementación de Gateway API",
        deadline: "2026-02-03",
        status: "cumplido",
        priority: "media"
    },
    {
        id: 5,
        assignedDate: "2026-01-27",
        studentName: "Luis Rodríguez",
        activity: "Smart Contracts en Solidity",
        deadline: "2026-02-03",
        status: "pendiente",
        priority: "alta"
    }
];

function ActivityPlanning() {
    const location = useLocation();
    const preselectedStudent = location.state?.student;

    // View state: 'history' | 'create'
    // If student is passed in state, defaults to create to jump right in
    const [view, setView] = useState(preselectedStudent ? 'create' : 'history');
    const [history] = useState(MOCK_HISTORY);

    const handleSubmit = (data) => {
        console.log('Actividad creada:', data);
        alert('Actividad asignada y estudiante notificado correctamente');
        setView('history');
    };

    const handleDraft = (data) => {
        console.log('Borrador guardado:', data);
        alert('Borrador guardado correctamente');
        setView('history');
    };

    const getStatusIcon = (status) => {
        const icons = {
            cumplido: <CheckCircleIcon sx={{ color: '#4caf50' }} />,
            no_cumplido: <CancelIcon sx={{ color: '#f44336' }} />,
            pendiente: <PendingIcon sx={{ color: '#ff9800' }} />
        };
        return icons[status];
    };

    const getStatusChip = (status) => {
        const config = {
            cumplido: { label: 'Cumplido', color: '#4caf50' },
            no_cumplido: { label: 'No Cumplido', color: '#f44336' },
            pendiente: { label: 'Pendiente', color: '#ff9800' }
        };
        const { label, color } = config[status];
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



    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
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
                ) : (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => setView('history')}
                        sx={{ fontWeight: 600 }}
                    >
                        Volver al Historial
                    </Button>
                )}
            </Box>

            {/* View: Create Activity */}
            {view === 'create' && (
                <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Crear Nueva Actividad/Acuerdo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Completa el formulario para asignar una actividad.
                            {preselectedStudent && view === 'create' && <strong style={{ color: '#667eea' }}> Asignando a: {preselectedStudent.name}</strong>}
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

            {/* View: History (Main View) */}
            {view === 'history' && (
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
                                    label={`${history.filter(h => h.status === 'cumplido').length} Cumplidos`}
                                    sx={{ backgroundColor: '#e8f5e9', color: '#4caf50', fontWeight: 600 }}
                                />
                                <Chip
                                    label={`${history.filter(h => h.status === 'pendiente').length} Pendientes`}
                                    sx={{ backgroundColor: '#fff3e0', color: '#ff9800', fontWeight: 600 }}
                                />
                                <Chip
                                    label={`${history.filter(h => h.status === 'no_cumplido').length} Incumplidos`}
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
                                        <TableCell><strong>Límite</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((item) => (
                                        <TableRow key={item.id} hover>
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

export default ActivityPlanning;
