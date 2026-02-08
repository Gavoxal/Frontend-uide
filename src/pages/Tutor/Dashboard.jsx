import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { getDataUser } from '../../storage/user.model.jsx';
import StudentCard from '../../components/studentcard.mui.component';

import { useNavigate } from 'react-router-dom';

// Mock data de estudiantes asignados
const MOCK_STUDENTS = [
    {
        id: 1,
        name: "Juan Pérez",
        email: "juan@uide.edu.ec",
        thesis: "Sistema de IoT para agricultura inteligente",
        career: "Ingeniería de Software",
        status: "green",
        lastActivity: {
            date: "Hace 2 días",
            title: "Implementación de sensores DHT22"
        },
        weekNumber: 8
    },
    {
        id: 2,
        name: "María García",
        email: "maria@uide.edu.ec",
        thesis: "Aplicación móvil de gestión académica con React Native",
        career: "Ingeniería de Software",
        status: "yellow",
        lastActivity: {
            date: "Hace 5 días",
            title: "Módulo de autenticación"
        },
        weekNumber: 12
    },
    {
        id: 3,
        name: "Carlos López",
        email: "carlos@uide.edu.ec",
        thesis: "Sistema de reconocimiento facial con Deep Learning",
        career: "Ingeniería de Software",
        status: "red",
        lastActivity: {
            date: "Hace 10 días",
            title: "Entrenamiento de modelo CNN"
        },
        weekNumber: 6
    },
    {
        id: 4,
        name: "Ana Martínez",
        email: "ana@uide.edu.ec",
        thesis: "Plataforma de e-commerce con microservicios",
        career: "Ingeniería de Software",
        status: "green",
        lastActivity: {
            date: "Hace 1 día",
            title: "Implementación de gateway API"
        },
        weekNumber: 10
    },
    {
        id: 5,
        name: "Luis Rodríguez",
        email: "luis@uide.edu.ec",
        thesis: "Sistema de gestión hospitalaria con blockchain",
        career: "Ingeniería de Software",
        status: "yellow",
        lastActivity: {
            date: "Hace 4 días",
            title: "Smart contracts en Solidity"
        },
        weekNumber: 9
    },
    {
        id: 6,
        name: "Sofia Hernández",
        email: "sofia@uide.edu.ec",
        thesis: "Chatbot inteligente con NLP para atención al cliente",
        career: "Ingeniería de Software",
        status: "green",
        lastActivity: {
            date: "Hace 3 días",
            title: "Integración con RASA Framework"
        },
        weekNumber: 11
    }
];

function TutorDashboard() {
    const user = getDataUser();
    const navigate = useNavigate();
    const [students] = useState(MOCK_STUDENTS);

    // Calcular estadísticas
    const totalStudents = students.length;
    const pendingReview = students.filter(s => s.status === 'yellow').length;
    const delayed = students.filter(s => s.status === 'red').length;
    const onTrack = students.filter(s => s.status === 'green').length;



    const handleViewStudent = (student) => {
        console.log('Ver detalles de:', student.name);
        // Navegar a vista de detalles
    };

    const handlePlanActivity = (student) => {
        navigate('/tutor/planning', { state: { student } });
    };

    const handleReviewStudent = (student) => {
        navigate('/tutor/review', { state: { student } });
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ¡Hola, {user?.name || "Tutor"}! 👨‍🏫
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de control de tus estudiantes de titulación
                </Typography>
            </Box>

            {/* Estadísticas principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                Total Estudiantes
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {totalStudents}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        backgroundColor: '#4caf50',
                        color: 'white'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                Al Día
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {onTrack}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        backgroundColor: '#ff9800',
                        color: 'white'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                Por Revisar
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {pendingReview}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        backgroundColor: '#f44336',
                        color: 'white'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                Retrasados
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {delayed}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Sección de Alertas */}
            {/* Sección de Alertas eliminada */}

            {/* Lista de Estudiantes */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Mis Estudiantes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Lista de estudiantes asignados para este ciclo académico
                </Typography>

                <Grid container spacing={3}>
                    {students.map((student) => (
                        <Grid item xs={12} md={6} lg={4} key={student.id}>
                            <StudentCard
                                student={student}
                                onView={handleViewStudent}
                                onPlan={handlePlanActivity}
                                onReview={handleReviewStudent}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default TutorDashboard;
