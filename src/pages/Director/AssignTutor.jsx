import React, { useState } from 'react';
import {
    Box,
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

import TextMui from '../../components/text.mui.component';
import ButtonMui from '../../components/button.mui.component';
import AlertMui from '../../components/alert.mui.component';
import TooltipMui from '../../components/tooltip.mui.component';
import SearchBar from '../../components/SearchBar.component';
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

    const [projects, setProjects] = useState([
        {
            id: 101,
            student: 'Ana Torres',
            cedula: '1105001234',
            email: 'ana.torres@uide.edu.ec',
            topic: 'Implementación de IA para optimización de tráfico urbano',
            area: 'Ciencia de Datos',
            status: 'Aprobado',
            tutor: null,
            career: 'Ingeniería de Software',
            malla: 'Malla 2020'
        },
        {
            id: 102,
            student: 'Luis Gomez',
            cedula: '1105005678',
            email: 'luis.gomez@uide.edu.ec',
            topic: 'Sistema de gestión documental con Blockchain y seguridad distribuida avanzada empresarial',
            area: 'Transformación Digital',
            status: 'Tutor Asignado',
            tutor: 'Ing. Carlos Mendez, PhD',
            career: 'Tecnologías de la Información',
            malla: 'Malla 2019'
        },
        {
            id: 103,
            student: 'Pedro Perez',
            cedula: '1105009012',
            email: 'pedro.perez@uide.edu.ec',
            topic: 'Aplicación Móvil para Turismo',
            area: 'Desarrollo Software',
            status: 'Aprobado',
            tutor: null,
            career: 'Ingeniería de Software',
            malla: 'Malla 2020'
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
        setSelectedTutor('');
        setOpenAlert(true);
    };

    const confirmAssignment = () => {
        if (!selectedTutor) return;

        const tutorName = tutors.find(t => t.id === selectedTutor)?.name;

        setProjects(prev =>
            prev.map(p =>
                p.id === selectedProject.id
                    ? { ...p, tutor: tutorName, status: 'Tutor Asignado' }
                    : p
            )
        );

        setSuccessMsg(`Se ha asignado el tutor ${tutorName} al estudiante ${selectedProject.student}.`);
        setOpenAlert(false);
        setSelectedProject(null);
    };

    const stats = {
        assigned: projects.filter(p => p.tutor).length,
        pending: projects.filter(p => !p.tutor).length
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <TooltipMui title="Filtrar sin tutor">
                        <Box onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')} sx={{ cursor: 'pointer' }}>
                            <StatsCard
                                title="Sin Tutor Asignado"
                                value={stats.pending}
                                icon={<AssignmentLateIcon fontSize="large" />}
                                color="warning"
                            />
                        </Box>
                    </TooltipMui>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TooltipMui title="Filtrar con tutor">
                        <Box onClick={() => setFilterStatus(filterStatus === 'assigned' ? 'all' : 'assigned')} sx={{ cursor: 'pointer' }}>
                            <StatsCard
                                title="Con Tutor Asignado"
                                value={stats.assigned}
                                icon={<AssignmentIndIcon fontSize="large" />}
                                color="success"
                            />
                        </Box>
                    </TooltipMui>
                </Grid>
            </Grid>

            {successMsg && (
                <Box sx={{ mb: 3 }}>
                    <NotificationMui severity="success" onClose={() => setSuccessMsg('')}>
                        {successMsg}
                    </NotificationMui>
                </Box>
            )}

            {/* BARRA DE BÚSQUEDA */}
            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante, cédula, correo o tema..."
                title="Buscar Propuestas"
            />

            {/* TABLA DE PROPUESTAS */}
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estudiante</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', minWidth: 250 }}>Tema de Propuesta</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Carrera</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Área</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <TableRow
                                    key={project.id}
                                    sx={{
                                        '&:hover': { bgcolor: '#f9f9f9' },
                                        height: 80 // Altura uniforme para todas las filas
                                    }}
                                >
                                    <TableCell>
                                        <Chip label={project.id} size="small" variant="outlined" />
                                    </TableCell>

                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {project.student}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {project.cedula}
                                            </Typography>
                                            <br />
                                            <Typography variant="caption" color="text.secondary">
                                                {project.email}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <TooltipMui title={project.topic} arrow placement="top">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    lineHeight: 1.4
                                                }}
                                            >
                                                {project.topic}
                                            </Typography>
                                        </TooltipMui>
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="caption" display="block">
                                            {project.career}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {project.malla}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={project.area}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={project.status}
                                            color={project.tutor ? "success" : "warning"}
                                            size="small"
                                            icon={project.tutor ? <CheckCircleIcon /> : <AssignmentLateIcon />}
                                        />
                                        {project.tutor && (
                                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                {project.tutor}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {!project.tutor && (
                                            <ButtonMui
                                                name="Asignar"
                                                onClick={() => handleAssignClick(project)}
                                                startIcon={<PersonAddIcon />}
                                                backgroundColor="#ed6c02"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        No se encontraron proyectos
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <AlertMui
                open={openAlert}
                handleClose={() => setOpenAlert(false)}
                title="Asignar Tutor"
                message={
                    <Box sx={{ mt: 2, minWidth: 350 }}>
                        <FormControl fullWidth>
                            <InputLabel>Tutor</InputLabel>
                            <Select
                                value={selectedTutor}
                                label="Tutor"
                                onChange={(e) => setSelectedTutor(e.target.value)}
                            >
                                {tutors.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>
                                        {t.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                }
                status="info"
                showBtnL={true}
                btnNameL="Confirmar"
                actionBtnL={confirmAssignment}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenAlert(false)}
            />
        </Box>
    );
}

export default DirectorAssignTutor;
