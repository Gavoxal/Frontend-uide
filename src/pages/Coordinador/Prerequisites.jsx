import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Alert,
    Grid,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StatsCard from "../../components/common/StatsCard";
import TableRequisitosMui from "../../components/Director/Table.requisitos.mui";
import AlertMui from "../../components/alert.mui.component";
import TooltipMui from '../../components/tooltip.mui.component';
import { PrerequisiteService } from "../../services/prerequisites.service";
import SearchBar from '../../components/SearchBar.component';
import TextMui from "../../components/text.mui.component";
import { apiFetch } from "../../services/api";

function CoordinatorPrerequisites() {
    // Estado para datos reales
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    // Cargar datos al montar
    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const data = await PrerequisiteService.getDashboard();
            setStudents(data);
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (studentId, prerequisiteKey) => {
        // Encontrar el estudiante y el requisito
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const prereq = student[prerequisiteKey];
        // Solo permitir verificar si existe un registro (studentPrereqId)
        if (!prereq || !prereq.studentPrereqId) {
            console.warn("No hay registro para verificar");
            return;
        }

        const newStatus = !prereq.verified;

        // Actualización optimista en UI
        setStudents((prev) =>
            prev.map((s) =>
                s.id === studentId
                    ? {
                        ...s,
                        [prerequisiteKey]: {
                            ...s[prerequisiteKey],
                            verified: newStatus,
                        },
                    }
                    : s
            )
        );

        try {
            // Llamada al backend
            await PrerequisiteService.validate(prereq.studentPrereqId, newStatus);
        } catch (error) {
            console.error("Error validating prerequisite:", error);
            loadDashboard(); // Recargar para volver al estado real
        }
    };

    const handleGrantAccessClick = (student) => {
        setSelectedStudent(student);
        setOpenDialog(true);
    };

    const confirmGrantAccess = async () => {
        if (selectedStudent) {
            try {
                await PrerequisiteService.grantAccess(selectedStudent.id);
                // Actualizar UI
                setStudents((prev) =>
                    prev.map((s) =>
                        s.id === selectedStudent.id ? { ...s, accessGranted: true } : s
                    )
                );
                alert("Acceso habilitado correctamente para " + selectedStudent.name);
            } catch (error) {
                console.error("Error habilitando acceso:", error);
                alert("Error: " + error.message);
            }
        }
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudent(null);
    };

    const handleDownload = (urlArchivo, label) => {
        if (!urlArchivo) {
            setErrorMsg("No hay un archivo disponible para descargar.");
            return;
        }
        // Abrir el archivo directamente en una nueva pestaña
        window.open(urlArchivo, '_blank');
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.cedula.includes(searchTerm);

        const englishVerified = student.english?.verified || false;
        const internshipVerified = student.internship?.verified || false;
        const communityVerified = student.community?.verified || false;

        const allVerified = englishVerified && internshipVerified && communityVerified;

        if (filterStatus === "pending") return matchesSearch && !allVerified;
        if (filterStatus === "approved") return matchesSearch && allVerified;
        return matchesSearch;
    });

    const stats = {
        pending: students.filter(
            (s) => !(s.english?.verified && s.internship?.verified && s.community?.verified)
        ).length,
        approved: students.filter(
            (s) => s.english?.verified && s.internship?.verified && s.community?.verified
        ).length,
    };

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
                <Alert severity="info" sx={{ mb: 3 }}>
                    Los estudiantes deben tener todos los prerrequisitos aprobados antes de iniciar el proceso del Anteproyecto.
                </Alert>

                <TextMui value="Verificación de Prerrequisitos" variant="h4" />
                <TextMui value="Revisa y aprueba los prerrequisitos" variant="body1" />

            </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TooltipMui title="Filtrar pendientes" placement="top">
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
                    </TooltipMui>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TooltipMui title="Filtrar aprobados" placement="top">
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
                    </TooltipMui>
                </Grid>
            </Grid>

            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante, cédula..."
                title="Buscar Estudiantes"
            />
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <TableRequisitosMui
                        students={filteredStudents}
                        onVerify={handleVerify}
                        onGrantAccess={handleGrantAccessClick}
                        onDownload={handleDownload}
                    />
                </CardContent>
            </Card>

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

            <AlertMui
                open={!!errorMsg}
                handleClose={() => setErrorMsg("")}
                title="Error de Archivo"
                message={errorMsg}
                status="error"
                showBtnL={true}
                btnNameL="Aceptar"
                actionBtnL={() => setErrorMsg("")}
            />
        </Box>
    );
}

export default CoordinatorPrerequisites;
