import { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Avatar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChecklistIcon from "@mui/icons-material/Checklist";
import StatsCard from "../../components/common/StatsCard";
import PrerequisiteChecksPanel from "../../components/Coordinador/PrerequisiteChecksPanel";
import { getDataUser } from "../../storage/user.model.jsx";

const CoordinadorDashboard = () => {
    const navigate = useNavigate();
    const user = getDataUser();

    // TODO: API - Obtener estadísticas del coordinador
    // const { data: stats } = await fetch('/api/coordinador/stats')
    const stats = {
        nominacionesPendientes: 12,
        revisionPrerrequisitos: 5,
        proyectosActivos: 45,
    };

    // TODO: API - Obtener lista de estudiantes
    // const { data: students } = await fetch('/api/coordinador/students')
    const [students] = useState([
        {
            id: 1984523,
            name: "Jhandry Becerra",
            avatar: "JB",
            theme: "Block Chain Security",
            date: "Dic 15",
            action: "Revisar"
        },
        {
            id: 1984523,
            name: "Jhandry Becerra",
            avatar: "JB",
            theme: "Block Chain Security",
            date: "Dic 15",
            action: "Revisar"
        },
        {
            id: 1984523,
            name: "Jhandry Becerra",
            avatar: "JB",
            theme: "Block Chain Security",
            date: "Dic 15",
            action: "Revisar"
        },
        {
            id: 1984523,
            name: "Jhandry Becerra",
            avatar: "JB",
            theme: "Block Chain Security",
            date: "Dic 15",
            action: "Revisar"
        },
        {
            id: 1984523,
            name: "Jhandry Becerra",
            avatar: "JB",
            theme: "Block Chain Security",
            date: "Dic 15",
            action: "Revisar"
        },
    ]);

    // TODO: API - Obtener estudiantes con prerrequisitos pendientes
    // const { data: prerequisiteChecks } = await fetch('/api/coordinador/prerequisite-checks')
    const [prerequisiteChecks] = useState([
        {
            id: 1150373791,
            name: "Eduardo Pardo",
            description: "Tecnologías de la Información",
            status: "pending"
        },
        {
            id: 1150373792,
            name: "Gabriel Sarango",
            description: "Tecnologías de la Información",
            status: "pending"
        },
        {
            id: 1150373793,
            name: "Fernando Castillo",
            description: "Tecnologías de la Información",
            status: "pending"
        },
    ]);

    const handleViewDetails = (student) => {
        navigate(`/coordinador/prerequisites`);
    };

    const handleApprove = (student) => {
        // TODO: API - Aprobar prerrequisitos del estudiante
        // await fetch(`/api/coordinador/students/${student.id}/approve-prerequisites`, { method: 'POST' })
        console.log('Aprobar prerrequisitos:', student);
    };

    const handleReviewStudent = (student) => {
        // TODO: API - Navegar a revisión de estudiante
        navigate(`/coordinador/students/${student.id}`);
    };

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido/a, {user?.name || "Darío"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Estamos felices de tenerte activo hoy, (fecha)
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Columna Principal */}
                <Grid item xs={12} lg={8}>
                    {/* Tarjetas de Estadísticas */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <StatsCard
                                title="Nominaciones Pendientes"
                                value={stats.nominacionesPendientes.toString()}
                                icon={<PeopleIcon fontSize="large" />}
                                color="info"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <StatsCard
                                title="Revisión de Prerrequisitos"
                                value={stats.revisionPrerrequisitos.toString()}
                                icon={<ChecklistIcon fontSize="large" />}
                                color="warning"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <StatsCard
                                title="Proyectos Activos"
                                value={stats.proyectosActivos.toString()}
                                icon={<AssignmentIcon fontSize="large" />}
                                color="success"
                                subtitle="Ver progreso"
                            />
                        </Grid>
                    </Grid>

                    {/* Tabla de Estudiantes */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Estudiantes
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#F4F6F8' }}>
                                            <TableCell><strong>Estudiantes</strong></TableCell>
                                            <TableCell><strong>ID</strong></TableCell>
                                            <TableCell><strong>Tema</strong></TableCell>
                                            <TableCell><strong>Fecha</strong></TableCell>
                                            <TableCell align="center"><strong>Action</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {students.map((student, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{ bgcolor: '#C2185B', width: 32, height: 32 }}>
                                                            {student.avatar}
                                                        </Avatar>
                                                        <Typography variant="body2">
                                                            {student.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{student.id}</TableCell>
                                                <TableCell>{student.theme}</TableCell>
                                                <TableCell>{student.date}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleReviewStudent(student)}
                                                    >
                                                        {student.action}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Panel Lateral - Prerrequisitos Checks */}
                <Grid item xs={12} lg={4}>
                    <PrerequisiteChecksPanel
                        students={prerequisiteChecks}
                        onViewDetails={handleViewDetails}
                        onApprove={handleApprove}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default CoordinadorDashboard;
