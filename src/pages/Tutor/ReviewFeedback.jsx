import React, { useState } from 'react';
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
    Tooltip
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import FeedbackPanel from '../../components/feedbackpanel.mui.component';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock data de avances por revisar
const MOCK_SUBMISSIONS = [
    {
        id: 1,
        student: "Juan Pérez",
        studentId: 1,
        title: "Implementación de sensores DHT22",
        submissionDate: "2026-02-01 14:30",
        fileName: "sensores_iot_v1.zip",
        fileSize: "3.2 MB",
        fileLink: "https://github.com/juan/iot-agricultura",
        comments: "Implementé la lectura de temperatura y humedad con los sensores DHT22. También agregué un sistema de alertas cuando los valores están fuera de rango. El código está en el repositorio junto con el diagrama de conexiones.",
        weekNumber: 8,
        priority: "media",
        status: "pending" // pending, reviewed
    },
    {
        id: 2,
        student: "María García",
        studentId: 2,
        title: "Módulo de autenticación JWT",
        submissionDate: "2026-01-30 16:45",
        fileName: "auth_module.zip",
        fileSize: "1.8 MB",
        fileLink: null,
        comments: "Login y registro funcionando con JWT. Incluí refresh tokens y middleware de validación.",
        weekNumber: 12,
        priority: "alta",
        status: "pending"
    },
    {
        id: 3,
        student: "Ana Martínez",
        studentId: 4,
        title: "Gateway API con Kong",
        submissionDate: "2026-02-02 10:15",
        fileName: "api_gateway.zip",
        fileSize: "2.1 MB",
        fileLink: "https://github.com/ana/ecommerce-gateway",
        comments: "Configuré Kong como API Gateway. Rate limiting y autenticación funcionando correctamente. Toda la documentación está en el README.",
        weekNumber: 10,
        priority: "alta",
        status: "pending"
    },
    {
        id: 4,
        student: "Luis Rodríguez",
        studentId: 5,
        title: "Smart Contracts básicos",
        submissionDate: "2026-01-31 09:20",
        fileName: "blockchain_contracts.zip",
        fileSize: "892 KB",
        fileLink: null,
        comments: "Creé 3 smart contracts en Solidity para registro de pacientes, historiales médicos y prescripciones. Tests unitarios incluidos.",
        weekNumber: 9,
        priority: "media",
        status: "pending"
    }
];

function ReviewFeedback() {
    const location = useLocation();
    const preselectedStudent = location.state?.student;

    const [submissions] = useState(MOCK_SUBMISSIONS);
    const [selectedSubmission, setSelectedSubmission] = useState(
        preselectedStudent
            ? submissions.find(s => s.studentId === preselectedStudent.id)
            : null
    );
    const [view, setView] = useState(selectedSubmission ? 'detail' : 'list'); // 'list' | 'detail'

    const handleSelectSubmission = (submission) => {
        setSelectedSubmission(submission);
        setView('detail');
    };

    const handleBackToList = () => {
        setSelectedSubmission(null);
        setView('list');
    };

    const handleSubmitFeedback = (feedback) => {
        console.log('Feedback enviado:', feedback);
        console.log('Para estudiante:', selectedSubmission.student);

        alert(`Feedback enviado a ${selectedSubmission.student}`);

        // Actualizar estado del submission a "reviewed" (simulado)
        // setSelectedSubmission({ ...selectedSubmission, status: 'reviewed' });

        // Volver a la lista
        setView('list');
        setSelectedSubmission(null);
    };

    const handleCancelFeedback = () => {
        setView('list');
        setSelectedSubmission(null);
    };



    const pendingSubmissions = submissions.filter(s => s.status === 'pending');

    return (
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
            {/* Encabezado */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Revisión y Feedback ✍️
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {view === 'list'
                            ? 'Gestiona las entregas y validaciones pendientes'
                            : `Revisando avance de ${selectedSubmission?.student || 'Estudiante'}`}
                    </Typography>
                </Box>
                {view === 'detail' && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBackToList}
                    >
                        Volver a la Lista
                    </Button>
                )}
            </Box>

            {/* Vista: Lista de Avances (Tabla) */}
            {view === 'list' && (
                <>
                    {pendingSubmissions.length > 0 && (
                        <Alert severity="info" sx={{ mb: 3 }} icon={<AssignmentTurnedInIcon />}>
                            Tienes <strong>{pendingSubmissions.length} avance(s)</strong> pendiente(s) de revisión
                        </Alert>
                    )}

                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="tabla de revisiones">
                            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Estudiante</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actividad / Avance</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Entrega</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.map((submission) => (
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
                                            <Tooltip title="Revisar Avance">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleSelectSubmission(submission)}
                                                    startIcon={<VisibilityIcon />}
                                                    sx={{
                                                        backgroundColor: '#667eea',
                                                        boxShadow: 'none',
                                                        '&:hover': { backgroundColor: '#5a6fd6', boxShadow: 'none' }
                                                    }}
                                                >
                                                    Revisar
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* Vista: Detalle de Feedback */}
            {view === 'detail' && selectedSubmission && (
                <FeedbackPanel
                    submission={selectedSubmission}
                    onSubmit={handleSubmitFeedback}
                    onCancel={handleCancelFeedback}
                />
            )}
        </Box>
    );
}

export default ReviewFeedback;
