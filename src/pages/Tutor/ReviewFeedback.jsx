import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Divider,
    Alert
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import FeedbackPanel from '../../components/feedbackpanel.mui.component';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

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
            ? submissions.find(s => s.studentId === preselectedStudent.id) || submissions[0]
            : submissions[0]
    );

    const handleSelectSubmission = (submission) => {
        setSelectedSubmission(submission);
    };

    const handleSubmitFeedback = (feedback) => {
        console.log('Feedback enviado:', feedback);
        console.log('Para estudiante:', selectedSubmission.student);

        let message = `Feedback enviado a ${selectedSubmission.student}`;

        if (feedback.readyForGrading) {
            message += '\n\n✅ Se ha notificado a la Ing. Lorena que el avance está listo para calificación.';
        }

        if (feedback.validationStatus === 'correcciones') {
            message += '\n\n⚠️ El estudiante recibirá una notificación para realizar las correcciones solicitadas.';
        }

        alert(message);

        // Actualizar estado del submission a "reviewed"
        setSelectedSubmission({ ...selectedSubmission, status: 'reviewed' });
    };

    const handleCancelFeedback = () => {
        console.log('Feedback cancelado');
    };

    const getPriorityColor = (priority) => {
        const colors = {
            alta: '#f44336',
            media: '#ff9800',
            baja: '#4caf50'
        };
        return colors[priority];
    };

    const pendingSubmissions = submissions.filter(s => s.status === 'pending');

    return (
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Revisión y Feedback ✍️
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Valida avances de estudiantes y autoriza calificación
                </Typography>
            </Box>

            {/* Alerta de pendientes */}
            {pendingSubmissions.length > 0 && (
                <Alert severity="info" sx={{ mb: 3 }} icon={<AssignmentTurnedInIcon />}>
                    Tienes <strong>{pendingSubmissions.length} avance(s)</strong> pendiente(s) de revisión
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Sidebar - Lista de avances */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Avances por Revisar
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Selecciona un avance para revisar
                                </Typography>
                            </Box>

                            <List sx={{ p: 0 }}>
                                {submissions.map((submission, index) => (
                                    <React.Fragment key={submission.id}>
                                        <ListItemButton
                                            selected={selectedSubmission?.id === submission.id}
                                            onClick={() => handleSelectSubmission(submission)}
                                            sx={{
                                                py: 2,
                                                px: 3,
                                                '&.Mui-selected': {
                                                    backgroundColor: '#f5f5f5',
                                                    borderLeft: '4px solid #667eea'
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                                        <Typography variant="subtitle2" fontWeight="600">
                                                            {submission.student}
                                                        </Typography>
                                                        <Chip
                                                            label={submission.priority}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getPriorityColor(submission.priority),
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                fontSize: '0.65rem',
                                                                height: 18
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            {submission.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {submission.submissionDate}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItemButton>
                                        {index < submissions.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Panel principal - Feedback */}
                <Grid item xs={12} md={8}>
                    {selectedSubmission ? (
                        <FeedbackPanel
                            submission={selectedSubmission}
                            onSubmit={handleSubmitFeedback}
                            onCancel={handleCancelFeedback}
                        />
                    ) : (
                        <Card sx={{ borderRadius: 3, boxShadow: 2, p: 6, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Selecciona un avance de la lista para comenzar la revisión
                            </Typography>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}

export default ReviewFeedback;
