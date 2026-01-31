import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Alert,
    Grid,
    Tooltip,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import StatsCard from "../../components/common/StatsCard";
import TableRequisitosMui from "../../components/Director/Table.requisitos.mui";
import AlertMui from "../../components/alert.mui.component";
import TextMui from "../../components/text.mui.component";
import InputMui from "../../components/input.mui.component";

function DirectorPrerequisites() {
    // Datos de ejemplo - en producción vendrían de una API
    const [students, setStudents] = useState([
        {
            id: 2,
            name: "Gabriel Serrango",
            cedula: "0987654321",
            cycle: 7,
            english: { completed: true, verified: false },
            internship: { completed: true, verified: false },
            community: { completed: true, verified: true },
            accessGranted: false,
        },
        {
            id: 3,
            name: "Ana García",
            cedula: "5566778899",
            cycle: 8,
            english: { completed: true, verified: true },
            internship: { completed: true, verified: true },
            community: { completed: true, verified: true },
            accessGranted: true,
        },
        {
            id: 4,
            name: "Eduardo Pardo",
            cedula: "1234567890",
            cycle: 7,
            english: { completed: true, verified: true },
            internship: { completed: true, verified: true },
            community: { completed: true, verified: true },
            accessGranted: false,
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

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

    const handleGrantAccessClick = (student) => {
        setSelectedStudent(student);
        setOpenDialog(true);
    };

    const confirmGrantAccess = () => {
        if (selectedStudent) {
            setStudents((prev) =>
                prev.map((s) =>
                    s.id === selectedStudent.id ? { ...s, accessGranted: true } : s
                )
            );
        }
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudent(null);
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.cedula.includes(searchTerm);
        const allVerified = student.english.verified &&
            student.internship.verified &&
            student.community.verified;

        if (filterStatus === "pending") return matchesSearch && !allVerified;
        if (filterStatus === "approved") return matchesSearch && allVerified;
        return matchesSearch;
    });

    const stats = {
        pending: students.filter(
            (s) => !s.english.verified || !s.internship.verified || !s.community.verified
        ).length,
        approved: students.filter(
            (s) => s.english.verified && s.internship.verified && s.community.verified
        ).length,
    };

    // Mensaje personalizado para la alerta
    const alertMessage = (
        <span>
            Está a punto de habilitar a <strong>{selectedStudent?.name}</strong> para iniciar su proceso del Anteproyecto.
            <br /><br />
            <TextMui
                value="Esta acción es irreversible y permitirá al estudiante acceder a la plataforma."
                variant="caption" />
        </span>
    );

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                {/* Información */}
                <Alert severity="info" sx={{ mb: 3 }}>
                    Los estudiantes deben tener todos los prerrequisitos aprobados antes de iniciar el proceso del Anteproyecto.
                </Alert>

                <TextMui value="Verificación de Prerrequisitos" variant="h4" />
                <TextMui value="Revisa y aprueba los prerrequisitos de los estudiantes" variant="body1" />

            </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>

                    <Tooltip title="Filtrar pendientes" placement="top">
                        <Box
                            onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterStatus === 'approved' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterStatus === 'pending' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Pendientes de Verificación"
                                value={stats.pending}
                                icon={<HourglassEmptyIcon fontSize="large" />}
                                color="warning"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Filtrar aprobados" placement="top">
                        <Box
                            onClick={() => setFilterStatus(filterStatus === 'approved' ? 'all' : 'approved')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterStatus === 'pending' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterStatus === 'approved' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Aprobados Completamente"
                                value={stats.approved}
                                icon={<CheckCircleIcon fontSize="large" />}
                                color="success"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>

            {/* Filtro y Tabla */}
            <Card>
                <CardContent>
                    <Box sx={{ mb: 3 }}>
                        <InputMui
                            placeholder="Buscar por nombre o cédula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<SearchIcon color="action" />}
                        />
                    </Box>

                    <TableRequisitosMui
                        students={filteredStudents}
                        onVerify={handleVerify}
                        onGrantAccess={handleGrantAccessClick}
                    />

                </CardContent>
            </Card>

            {/* Alerta de Confirmación */}
            {/* Nota: AlertMui ya usa componentes internamente si está bien hecho, aquí solo lo invocamos */}
            <AlertMui
                open={openDialog}
                handleClose={handleCloseDialog}
                title="¿Confirmar acceso a propuesta de tesis?"
                message={alertMessage}
                status="warning"
                showBtnL={true}
                btnNameL="Confirmar"
                actionBtnL={confirmGrantAccess}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={handleCloseDialog}
            />
        </Box>
    );
}

export default DirectorPrerequisites;
