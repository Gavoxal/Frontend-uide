import React, { useState, useEffect } from 'react';
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
    Typography,
    CircularProgress
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

import { ProposalService } from '../../services/proposal.service';
import { TutoringService } from '../../services/tutoring.service';

function DirectorAssignTutor() {

    const [openAlert, setOpenAlert] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTutor, setSelectedTutor] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const [projects, setProjects] = useState([]);
    const [tutors, setTutors] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Cargar propuestas (solo aprobadas o con tutor)
            const proposalsData = await ProposalService.getAll();
            const mappedProjects = proposalsData
                .filter(p => p.estado === 'APROBADA' || p.estado === 'APROBADA_CON_COMENTARIOS' || p.trabajosTitulacion?.length > 0)
                .map(p => {
                    const active = (p.trabajosTitulacion && p.trabajosTitulacion.length > 0)
                        ? (p.trabajosTitulacion.find(a => a.estadoAsignacion === 'ACTIVO') || p.trabajosTitulacion[0])
                        : null;

                    return {
                        id: p.id,
                        student: p.estudiante ? `${p.estudiante.nombres} ${p.estudiante.apellidos}` : 'Estudiante Desconocido',
                        cedula: p.estudiante?.cedula || 'N/A',
                        email: p.estudiante?.correoInstitucional || 'N/A',
                        topic: p.titulo,
                        area: p.areaConocimiento?.nombre || 'General',
                        status: active ? 'Tutor Asignado' : 'Aprobado',
                        tutor: active?.tutor ? `${active.tutor.nombres} ${active.tutor.apellidos}` : null,
                        career: p.estudiante?.estudiantePerfil?.escuela || 'N/A',
                        malla: p.estudiante?.estudiantePerfil?.malla || 'N/A'
                    };
                });
            setProjects(mappedProjects);

            // Cargar tutores
            const tutorsData = await TutoringService.getTutorsStats();
            setTutors(tutorsData.map(t => ({
                id: t.id,
                name: `${t.nombres} ${t.apellidos}`
            })));

        } catch (error) {
            console.error("Error loading data:", error);
            setErrorMsg("Error al cargar los datos de asignación.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssignClick = (project) => {
        setSelectedProject(project);
        setSelectedTutor('');
        setOpenAlert(true);
    };

    const confirmAssignment = async () => {
        if (!selectedTutor || !selectedProject) return;

        try {
            await TutoringService.assignTutor({
                propuestaId: selectedProject.id,
                tutorId: selectedTutor,
                observaciones: "Asignación inicial de tutor académico."
            });

            const tutorName = tutors.find(t => t.id === selectedTutor)?.name;
            setSuccessMsg(`Se ha asignado el tutor ${tutorName} al estudiante ${selectedProject.student}.`);

            // Recargar datos para reflejar el cambio
            fetchData();

            setOpenAlert(false);
            setSelectedProject(null);
        } catch (error) {
            console.error("Error assigning tutor:", error);
            setErrorMsg(error.message || "Error al realizar la asignación.");
        }
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

            {errorMsg && (
                <Box sx={{ mb: 3 }}>
                    <NotificationMui severity="error" onClose={() => setErrorMsg('')}>
                        {errorMsg}
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <CircularProgress sx={{ color: '#667eea' }} />
                                </TableCell>
                            </TableRow>
                        ) : filteredProjects.length > 0 ? (
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
                                        <ButtonMui
                                            name={project.tutor ? "ASIGNADO" : "ASIGNAR"}
                                            onClick={() => handleAssignClick(project)}
                                            startIcon={project.tutor ? <CheckCircleIcon /> : <PersonAddIcon />}
                                            backgroundColor={project.tutor ? "#9e9e9e" : "#ed6c02"}
                                            size="small"
                                            disabled={!!project.tutor}
                                        />
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
