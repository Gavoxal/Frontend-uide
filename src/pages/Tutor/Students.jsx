import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, InputAdornment, TextField } from '@mui/material';
import StudentCard from '../../components/studentcard.mui.component';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

// Mock data (mismo que en Dashboard por ahora, idealmente vendría de un servicio/contexto compartido)
const MOCK_STUDENTS = [
    {
        id: 1,
        name: "Juan Pérez",
        email: "juan@uide.edu.ec",
        thesis: "Sistema de IoT para agricultura inteligente",
        career: "Ingeniería de Software",
        status: "green",
        lastActivity: { date: "Hace 2 días", title: "Implementación de sensores DHT22" },
        weekNumber: 8
    },
    {
        id: 2,
        name: "María García",
        email: "maria@uide.edu.ec",
        thesis: "Aplicación móvil de gestión académica con React Native",
        career: "Ingeniería de Software",
        status: "yellow",
        lastActivity: { date: "Hace 5 días", title: "Módulo de autenticación" },
        weekNumber: 12
    },
    {
        id: 3,
        name: "Carlos López",
        email: "carlos@uide.edu.ec",
        thesis: "Sistema de reconocimiento facial con Deep Learning",
        career: "Ingeniería de Software",
        status: "red",
        lastActivity: { date: "Hace 10 días", title: "Entrenamiento de modelo CNN" },
        weekNumber: 6
    },
    {
        id: 4,
        name: "Ana Martínez",
        email: "ana@uide.edu.ec",
        thesis: "Plataforma de e-commerce con microservicios",
        career: "Ingeniería de Software",
        status: "green",
        lastActivity: { date: "Hace 1 día", title: "Implementación de gateway API" },
        weekNumber: 10
    },
    {
        id: 5,
        name: "Luis Rodríguez",
        email: "luis@uide.edu.ec",
        thesis: "Sistema de gestión hospitalaria con blockchain",
        career: "Ingeniería de Software",
        status: "yellow",
        lastActivity: { date: "Hace 4 días", title: "Smart contracts en Solidity" },
        weekNumber: 9
    },
    {
        id: 6,
        name: "Sofia Hernández",
        email: "sofia@uide.edu.ec",
        thesis: "Chatbot inteligente con NLP para atención al cliente",
        career: "Ingeniería de Software",
        status: "green",
        lastActivity: { date: "Hace 3 días", title: "Integración con RASA Framework" },
        weekNumber: 11
    }
];

function TutorStudents() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [students] = useState(MOCK_STUDENTS);

    const handleViewStudent = (student) => {
        console.log('Ver detalles de:', student.name);
    };

    const handlePlanActivity = (student) => {
        navigate('/tutor/planning', { state: { student } });
    };

    const handleReviewStudent = (student) => {
        navigate('/tutor/review', { state: { student } });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.thesis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Estudiantes Asignados 👥
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gestiona el progreso y actividades de tus estudiantes
                    </Typography>
                </Box>

                <TextField
                    placeholder="Buscar estudiante..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 300, backgroundColor: 'white' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {filteredStudents.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredStudents.map((student) => (
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
            ) : (
                <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" color="text.secondary">
                        No se encontraron estudiantes que coincidan con tu búsqueda.
                    </Typography>
                </Card>
            )}
        </Box>
    );
}

export default TutorStudents;
