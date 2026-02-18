import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, InputAdornment, TextField } from '@mui/material';
import StudentCard from '../../components/studentcard.mui.component';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { DocenteService } from '../../services/docente.service';
import LinearProgress from '@mui/material/LinearProgress';

function DocenteStudents() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Usar servicio de docente
                const data = await DocenteService.getAssignedStudents();
                const mappedStudents = data.map(s => ({
                    id: s.id,
                    name: `${s.nombres} ${s.apellidos}`,
                    email: s.correo,
                    thesis: s.propuesta?.titulo || 'Sin propuesta',
                    career: s.perfil?.escuela || 'UIDE',
                    status: s.propuesta?.estado === 'APROBADA' ? 'green' : 'yellow',
                    lastActivity: {
                        date: s.propuesta?.fechaPublicacion ? new Date(s.propuesta.fechaPublicacion).toLocaleDateString() : 'N/A',
                        title: 'Última propuesta enviada' // O ajustar si tenemos endpoint de resumen
                    },
                    weekNumber: s.semanaActual || 0 // O ajustar
                }));
                setStudents(mappedStudents);
            } catch (error) {
                console.error("Error al cargar estudiantes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleViewStudent = (student) => {

    };

    const handlePlanActivity = (student) => {
        navigate('/docente-integracion/planning', { state: { student } });
    };

    const handleReviewStudent = (student) => {
        navigate('/docente-integracion/advances', { state: { student } });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.thesis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Estudiantes Asignados (Docencia) 👥
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gestiona el progreso y actividades de tus estudiantes de integración
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

export default DocenteStudents;
