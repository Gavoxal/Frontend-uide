import { useState } from "react";
import {
    Box,
    Typography,
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
    Checkbox,
    Alert,
    Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import StatusBadge from "../../components/common/StatusBadge";
import StatsCard from "../../components/common/StatsCard";

function DirectorPrerequisites() {
    // Datos de ejemplo - en producción vendrían de una API
    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Eduardo Pardo",
            cedula: "1234567890",
            cycle: 7,
            english: { completed: true, verified: true },
            internship: { completed: true, verified: true },
            community: { completed: false, verified: false },
        },
        {
            id: 2,
            name: "Gabriel Serrango",
            cedula: "0987654321",
            cycle: 7,
            english: { completed: true, verified: false },
            internship: { completed: true, verified: false },
            community: { completed: true, verified: true },
        },
        {
            id: 3,
            name: "Ana García",
            cedula: "5566778899",
            cycle: 8,
            english: { completed: true, verified: true },
            internship: { completed: true, verified: true },
            community: { completed: true, verified: true },
        },
    ]);

    const handleVerify = (studentId, prerequisite) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === studentId
                    ? {
                        ...student,
                        [prerequisite]: {
                            ...student[prerequisite],
                            verified: !student[prerequisite].verified,
                        },
                    }
                    : student
            )
        );
    };

    const stats = {
        pending: students.filter(
            (s) => !s.english.verified || !s.internship.verified || !s.community.verified
        ).length,
        approved: students.filter(
            (s) => s.english.verified && s.internship.verified && s.community.verified
        ).length,
    };

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Verificación de Prerrequisitos
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Revisa y aprueba los prerrequisitos de los estudiantes
                </Typography>
            </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Pendientes de Verificación"
                        value={stats.pending}
                        icon={<HourglassEmptyIcon fontSize="large" />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Aprobados Completamente"
                        value={stats.approved}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success"
                    />
                </Grid>
            </Grid>

            {/* Información */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Los estudiantes deben tener todos los prerrequisitos aprobados antes de iniciar el proceso de
                titulación.
            </Alert>

            {/* Tabla de estudiantes */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#F4F6F8" }}>
                                    <TableCell><strong>Estudiante</strong></TableCell>
                                    <TableCell><strong>Cédula</strong></TableCell>
                                    <TableCell><strong>Ciclo</strong></TableCell>
                                    <TableCell align="center"><strong>Inglés</strong></TableCell>
                                    <TableCell align="center"><strong>Prácticas</strong></TableCell>
                                    <TableCell align="center"><strong>Vinculación</strong></TableCell>
                                    <TableCell align="center"><strong>Estado</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => {
                                    const allVerified =
                                        student.english.verified &&
                                        student.internship.verified &&
                                        student.community.verified;

                                    return (
                                        <TableRow key={student.id} hover>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.cedula}</TableCell>
                                            <TableCell>{student.cycle}°</TableCell>

                                            {/* Inglés */}
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={student.english.verified}
                                                        onChange={() => handleVerify(student.id, "english")}
                                                        disabled={!student.english.completed}
                                                        color="success"
                                                    />
                                                    {student.english.completed ? (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {student.english.verified ? "Verificado" : "Completado"}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="caption" color="error">
                                                            Pendiente
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>

                                            {/* Prácticas */}
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={student.internship.verified}
                                                        onChange={() => handleVerify(student.id, "internship")}
                                                        disabled={!student.internship.completed}
                                                        color="success"
                                                    />
                                                    {student.internship.completed ? (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {student.internship.verified ? "Verificado" : "Completado"}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="caption" color="error">
                                                            Pendiente
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>

                                            {/* Vinculación */}
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={student.community.verified}
                                                        onChange={() => handleVerify(student.id, "community")}
                                                        disabled={!student.community.completed}
                                                        color="success"
                                                    />
                                                    {student.community.completed ? (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {student.community.verified ? "Verificado" : "Completado"}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="caption" color="error">
                                                            Pendiente
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>

                                            {/* Estado General */}
                                            <TableCell align="center">
                                                <StatusBadge status={allVerified ? "approved" : "pending"} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}

export default DirectorPrerequisites;
