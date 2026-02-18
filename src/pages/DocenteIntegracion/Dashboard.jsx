import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { getDataUser } from '../../storage/user.model.jsx';
import StudentCard from '../../components/studentcard.mui.component';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { UserService } from '../../services/user.service';
import { DocenteService } from '../../services/docente.service';

function DocenteDashboard() {
    const user = getDataUser();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorName, setTutorName] = useState((user?.nombres && user?.apellidos) ? `${user.nombres} ${user.apellidos}` : (user?.name || "Docente"));

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const freshData = await UserService.getById(user.id);
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
                // Usamos el servicio de Docente para obtener estudiantes
                const data = await DocenteService.getAssignedStudents();

                // Asegurar unicidad por estudiante ID (si un estudiante tiene ultiples propuestas o algo raro)
                const uniqueStudents = Array.from(new Map(data.map(item => [item.id, item])).values());

                const mappedStudents = uniqueStudents.map(s => ({
                    id: s.id,
                    name: `${s.nombres} ${s.apellidos}`,
                    email: s.correo,
                    thesis: s.propuesta?.titulo || 'Sin propuesta',
                    career: s.perfil?.escuela || 'UIDE',
                    status: s.propuesta?.estado === 'APROBADA' ? 'green' : 'yellow',
                    lastActivity: {
                        date: s.propuesta?.fechaPublicacion ? new Date(s.propuesta.fechaPublicacion).toLocaleDateString() : 'N/A',
                        title: 'Última propuesta enviada'
                    },
                    weekNumber: s.semanaActual || 0,
                    propuestaId: s.propuestaId,
                    propuesta: s.propuesta
                }));

                setStudents(mappedStudents);
            } catch (error) {
                console.error("Error al cargar dashboard de docente:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Calcular estadísticas
    const totalStudents = students.length;
    const pendingReview = students.filter(s => s.status === 'yellow').length;
    const delayed = students.filter(s => s.status === 'red').length;
    const onTrack = students.filter(s => s.status === 'green').length;

    const handleViewStudent = (student) => {

        // Navegar a vista de detalles si existiera
    };

    const handlePlanActivity = (student) => {
        navigate('/docente-integracion/planning', { state: { student } });
    };

    const handleReviewStudent = (student) => {
        navigate('/docente-integracion/review', { state: { student } });
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
                    Panel de control - Docente de Integración
                </Typography>
            </Box>

            {/* Estadísticas principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

            {/* Lista de Estudiantes */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Mis Estudiantes Asignados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Lista de estudiantes para gestión de actividades de integración
                </Typography>

                <Grid container spacing={3}>
                    {students.map((student, index) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={student.id || index}>
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

export default DocenteDashboard;
