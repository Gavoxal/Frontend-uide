import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { getDataUser } from '../../storage/user.model.jsx';
import StudentCard from '../../components/studentcard.mui.component';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { TutorService } from '../../services/tutor.service';
import LinearProgress from '@mui/material/LinearProgress';
import usuarioService from '../../services/usuario.service';

function TutorDashboard() {
    const user = getDataUser();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorName, setTutorName] = useState((user?.nombres && user?.apellidos) ? `${user.nombres} ${user.apellidos}` : (user?.name || "Tutor"));

    // State for student details dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const freshData = await usuarioService.getById(user.id);
                    if (freshData) {
                        const newName = freshData.nombres || freshData.nombre;
                        const newLast = freshData.apellidos || freshData.apellido;
                        if (newName && newLast) {
                            setTutorName(`${newName} ${newLast}`);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [user?.id]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await TutorService.getAssignedStudents();
                // Mapping logic improvement
                const mappedStudents = data.map(s => {
                    let status = 'gray'; // Default: No proposal
                    if (s.propuesta) {
                        if (s.propuesta.estado === 'APROBADA') status = 'green';
                        else if (s.propuesta.estado === 'PENDIENTE') status = 'yellow';
                        else if (s.propuesta.estado === 'RECHAZADA') status = 'red';
                        else status = 'blue'; // Other states like REVISADA/OBSERVACIONES
                    }

                    return {
                        id: s.id,
                        name: `${s.nombres} ${s.apellidos}`,
                        email: s.correo,
                        thesis: s.propuesta?.titulo || 'Sin propuesta',
                        career: s.perfil?.escuela || 'UIDE',
                        status: status,
                        lastActivity: {
                            date: s.propuesta?.fechaPublicacion ? new Date(s.propuesta.fechaPublicacion).toLocaleDateString() : 'N/A',
                            title: 'Última propuesta enviada'
                        },
                        weekNumber: s.actividadResumen?.totalActividadesTutoria || 0,
                        hasProposal: !!s.propuesta
                    };
                });

                setStudents(mappedStudents);
            } catch (error) {
                console.error("Error al cargar dashboard de tutor:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Calculate statistics
    const totalStudents = students.length;
    const pendingReview = students.filter(s => s.status === 'yellow').length; // PENDIENTE
    const delayed = students.filter(s => s.status === 'red').length; // RECHAZADA (or use for delays logic if implemented)
    const onTrack = students.filter(s => s.status === 'green').length; // APROBADA
    const totalProposals = students.filter(s => s.hasProposal).length;

    const handleViewStudent = (student) => {

        setSelectedStudent(student);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudent(null);
    };

    const handlePlanActivity = (student) => {
        navigate('/tutor/planning', { state: { student } });
    };

    const handleReviewStudent = (student) => {
        navigate('/tutor/review', { state: { student } });
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ¡Hola, {tutorName}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de control de tus estudiantes de titulación
                </Typography>
            </Box>

            {/* Estadísticas principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        height: '100%' // Ensure uniform height
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        backgroundColor: '#4caf50',
                        color: 'white',
                        height: '100%' // Ensure uniform height
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                Al Día (Aprobados)
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {onTrack}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        backgroundColor: '#ff9800',
                        color: 'white',
                        height: '100%' // Ensure uniform height
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        backgroundColor: '#f44336',
                        color: 'white',
                        height: '100%' // Ensure uniform height
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                Rechazados
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {delayed}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        onClick={() => navigate('/tutor/proposals')}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 2,
                            background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                            color: 'white',
                            cursor: 'pointer',
                            transition: '0.3s',
                            '&:hover': { transform: 'scale(1.02)' },
                            height: '100%' // Ensure uniform height
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                Propuestas Tesis
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {totalProposals}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={student.id}>
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

            {/* Modal Detalle Estudiante */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#f5f7fa', pb: 2 }}>
                    Detalles del Estudiante
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedStudent && (
                        <Box>
                            <Typography variant="h6" gutterBottom>{selectedStudent.name}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {selectedStudent.email}</Typography>
                            <Typography variant="body1"><strong>Carrera:</strong> {selectedStudent.career}</Typography>
                            <Typography variant="body1"><strong>Tema de Tesis:</strong> {selectedStudent.thesis}</Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}><strong>Última Actividad:</strong> {selectedStudent.lastActivity.title} ({selectedStudent.lastActivity.date})</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TutorDashboard;
