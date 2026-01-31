import React, { useState } from 'react';
import { Box, Card, CardContent, Chip, MenuItem, Select, FormControl, InputLabel, Grid, Divider, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

import TextMui from '../../components/text.mui.component';
import ButtonMui from '../../components/button.mui.component';
import AlertMui from '../../components/alert.mui.component';
import NotificationMui from '../../components/notification.mui.component';
import StatsCard from '../../components/common/StatsCard';
import InputMui from '../../components/input.mui.component';

function DirectorAssignTutor() {
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTutor, setSelectedTutor] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Mock Data: Anteproyectos (Propuestas Aprobadas) pendientes de tutor
    const [projects, setProjects] = useState([
        {
            id: 101,
            student: 'Ana Torres',
            cedula: '1105001234',
            email: 'ana.torres@uide.edu.ec',
            topic: 'Implementación de IA para optimización de tráfico urbano',
            area: 'Ciencia de Datos',
            status: 'Aprobado',
            tutor: null
        },
        {
            id: 102,
            student: 'Luis Gomez',
            cedula: '1105005678',
            email: 'luis.gomez@uide.edu.ec',
            topic: 'Sistema de gestión documental con Blockchain',
            area: 'Transformación Digital',
            status: 'Tutor Asignado',
            tutor: 'Ing. Carlos Mendez, PhD' // Mocking one assigned for demo
        },
        {
            id: 103,
            student: 'Pedro Perez',
            cedula: '1105009012',
            email: 'pedro.perez@uide.edu.ec',
            topic: 'Aplicación Móvil para Turismo',
            area: 'Desarrollo Software',
            status: 'Aprobado',
            tutor: null
        }
    ]);

    // Mock Tutors List
    const tutors = [
        { id: 1, name: 'Ing. Carlos Mendez, PhD' },
        { id: 2, name: 'Dra. Maria Elena Silva' },
        { id: 3, name: 'Msc. Jorge Ramiro' }
    ];

    const handleAssignClick = (project) => {
        setSelectedProject(project);
        setSelectedTutor(''); // Reset selection
        setOpenAlert(true);
    };

    const confirmAssignment = () => {
        if (!selectedTutor) return;

        const tutorName = tutors.find(t => t.id === selectedTutor)?.name;

        setProjects(prev => prev.map(p =>
            p.id === selectedProject.id ? { ...p, tutor: tutorName, status: 'Tutor Asignado' } : p
        ));

        setSuccessMsg(`Se ha asignado el tutor ${tutorName} al estudiante ${selectedProject.student}.`);
        setOpenAlert(false);
        setSelectedProject(null);
    };

    // Estadísticas
    const stats = {
        assigned: projects.filter(p => p.tutor).length,
        pending: projects.filter(p => !p.tutor).length
    };

    // Lógica de Filtrado
    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.cedula.includes(searchTerm) ||
            project.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === "assigned") return matchesSearch && project.tutor;
        if (filterStatus === "pending") return matchesSearch && !project.tutor;
        return matchesSearch;
    });

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Asignación de Tutores" variant="h4" />
                <TextMui value="Gestión de anteproyectos aprobados" variant="body1" />
            </Box>

            {/* Dashboard Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Filtrar sin tutor" placement="top">
                        <Box
                            onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterStatus === 'assigned' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterStatus === 'pending' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Sin Tutor Asignado"
                                value={stats.pending}
                                icon={<AssignmentLateIcon fontSize="large" />}
                                color="warning"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Filtrar con tutor" placement="top">
                        <Box
                            onClick={() => setFilterStatus(filterStatus === 'assigned' ? 'all' : 'assigned')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterStatus === 'pending' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterStatus === 'assigned' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Con Tutor Asignado"
                                value={stats.assigned}
                                icon={<AssignmentIndIcon fontSize="large" />}
                                color="success"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>

            {successMsg && (
                <Box sx={{ mb: 3 }}>
                    <NotificationMui severity="success" onClose={() => setSuccessMsg('')}>
                        {successMsg}
                    </NotificationMui>
                </Box>
            )}

            <Box sx={{ mb: 4 }}>
                <Card>
                    <CardContent>
                        <InputMui
                            placeholder="Buscar por estudiante, cédula, correo o tema..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<SearchIcon color="action" />}
                        />
                    </CardContent>
                </Card>
            </Box>

            {/* Use alignItems="stretch" on the container to ensure all items in a row same height */}
            <Grid container spacing={3} alignItems="stretch">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        // display: flex on Grid item ensures the Card child can grow to full height
                        <Grid item xs={12} lg={6} xl={4} key={project.id} sx={{ display: 'flex' }}>
                            <Card elevation={3} sx={{ width: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip
                                            label={`ID: ${project.id}`}
                                            size="small"
                                            variant="outlined"
                                            color="default"
                                        />
                                        <Chip
                                            label={project.status}
                                            color={project.tutor ? "success" : "warning"}
                                            size="small"
                                            icon={project.tutor ? <CheckCircleIcon /> : <AssignmentLateIcon />}
                                        />
                                    </Box>

                                    {/* Content section */}
                                    <Box sx={{ mb: 2, flexGrow: 1 }}>
                                        <TextMui value={project.topic} variant="h6" sx={{ fontWeight: 'bold', mb: 2, lineHeight: 1.3 }} />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                                            <SchoolIcon fontSize="small" color="action" />
                                            <TextMui value={project.student} variant="subtitle1" sx={{ fontWeight: 'bold' }} />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 0.5, pl: 0.5 }}>
                                            <BadgeIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                                            <TextMui value={project.cedula} variant="body2" />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1, pl: 0.5 }}>
                                            <EmailIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                                            <TextMui value={project.email} variant="body2" />
                                        </Box>

                                        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', bgcolor: 'primary.50', p: 1, borderRadius: 1 }}>
                                            <DescriptionIcon fontSize="small" />
                                            <TextMui value={project.area} variant="caption" sx={{ fontWeight: 'bold' }} />
                                        </Box>
                                    </Box>

                                    {/* Footer section (Buttons) - pushed to bottom by flexGrow above */}
                                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                                        {project.tutor ? (
                                            <Box sx={{ width: '100%' }}>
                                                <TextMui value="Tutor Asignado:" variant="caption" color="text.secondary" />
                                                <Chip
                                                    label={project.tutor}
                                                    color="primary"
                                                    variant="filled"
                                                    sx={{ width: '100%', mt: 0.5 }}
                                                />
                                            </Box>
                                        ) : (
                                            <ButtonMui
                                                name="Asignar Tutor"
                                                onClick={() => handleAssignClick(project)}
                                                startIcon={<PersonAddIcon />}
                                                backgroundColor="#ed6c02"
                                                fullWidth={true}
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <TextMui value="No se encontraron proyectos" variant="h6" color="text.secondary" />
                        </Box>
                    </Grid>
                )}
            </Grid>

            <AlertMui
                open={openAlert}
                handleClose={() => setOpenAlert(false)}
                title={`Asignar Tutor a: ${selectedProject?.student}`}
                message={
                    <Box sx={{ mt: 2, minWidth: 300 }}>
                        <TextMui value={`Tema: ${selectedProject?.topic}`} variant="body2" sx={{ mb: 2, fontWeight: 'bold' }} />
                        <TextMui value="Seleccione un docente:" variant="caption" color="text.secondary" />

                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <InputLabel id="tutor-select-label">Tutor</InputLabel>
                            <Select
                                labelId="tutor-select-label"
                                value={selectedTutor}
                                label="Tutor"
                                onChange={(e) => setSelectedTutor(e.target.value)}
                            >
                                {tutors.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                }
                status="info"
                showBtnL={true}
                btnNameL="Guardar Asignación"
                actionBtnL={confirmAssignment}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenAlert(false)}
            />
        </Box>
    );
}

export default DirectorAssignTutor;
