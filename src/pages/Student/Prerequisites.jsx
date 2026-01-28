import { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Grid,
    Alert,
    Checkbox,
    FormControlLabel,
    Button,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";
import StatusBadge from "../../components/common/StatusBadge";

function StudentPrerequisites() {
    const user = getDataUser();

    // Estado de requisitos del estudiante
    const [prerequisites, setPrerequisites] = useState({
        english: { completed: false, verified: false },
        internship: { completed: false, verified: false },
        community: { completed: false, verified: false },
    });

    const [hasChanges, setHasChanges] = useState(false);

    const handleCheck = (field) => {
        setPrerequisites((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                completed: !prev[field].completed,
            },
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        // Aquí se enviarían los datos al backend
        console.log("Guardando prerrequisitos:", prerequisites);
        setHasChanges(false);
        // Mostrar mensaje de éxito
    };

    const totalCompleted = Object.values(prerequisites).filter((p) => p.completed).length;
    const totalVerified = Object.values(prerequisites).filter((p) => p.verified).length;
    const allVerified = totalVerified === 3;

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Mis Prerrequisitos
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Marca los requisitos que hayas completado para que el director los verifique
                </Typography>
            </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Completados"
                        value={`${totalCompleted}/3`}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Verificados"
                        value={`${totalVerified}/3`}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Pendientes"
                        value={`${3 - totalVerified}/3`}
                        icon={<HourglassEmptyIcon fontSize="large" />}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Alerta */}
            {!allVerified && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Debes completar y que se verifiquen todos los prerrequisitos antes de poder iniciar el proceso de
                    titulación.
                </Alert>
            )}

            {allVerified && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    ¡Felicidades! Todos tus prerrequisitos han sido verificados. Ya puedes iniciar el proceso de
                    titulación.
                </Alert>
            )}

            {/* Formulario de Prerrequisitos */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Checklist de Prerrequisitos
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        {/* Inglés */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                mb: 2,
                                bgcolor: prerequisites.english.verified ? "#E8F5E9" : "#FFF8E1",
                                borderRadius: 1,
                                border: 1,
                                borderColor: prerequisites.english.verified ? "success.main" : "warning.main",
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={prerequisites.english.completed}
                                        onChange={() => handleCheck("english")}
                                        disabled={prerequisites.english.verified}
                                        color="success"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Inglés Aprobado
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Nivel B1 o superior requerido
                                        </Typography>
                                    </Box>
                                }
                            />
                            <StatusBadge
                                status={prerequisites.english.verified ? "approved" : prerequisites.english.completed ? "in-progress" : "pending"}
                                label={
                                    prerequisites.english.verified
                                        ? "Verificado"
                                        : prerequisites.english.completed
                                            ? "En revisión"
                                            : "Pendiente"
                                }
                            />
                        </Box>

                        {/* Prácticas Laborales */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                mb: 2,
                                bgcolor: prerequisites.internship.verified ? "#E8F5E9" : "#FFF8E1",
                                borderRadius: 1,
                                border: 1,
                                borderColor: prerequisites.internship.verified ? "success.main" : "warning.main",
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={prerequisites.internship.completed}
                                        onChange={() => handleCheck("internship")}
                                        disabled={prerequisites.internship.verified}
                                        color="success"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Prácticas Laborales Aprobadas
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Mínimo 240 horas requeridas
                                        </Typography>
                                    </Box>
                                }
                            />
                            <StatusBadge
                                status={prerequisites.internship.verified ? "approved" : prerequisites.internship.completed ? "in-progress" : "pending"}
                                label={
                                    prerequisites.internship.verified
                                        ? "Verificado"
                                        : prerequisites.internship.completed
                                            ? "En revisión"
                                            : "Pendiente"
                                }
                            />
                        </Box>

                        {/* Vinculación con la Comunidad */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                mb: 2,
                                bgcolor: prerequisites.community.verified ? "#E8F5E9" : "#FFF8E1",
                                borderRadius: 1,
                                border: 1,
                                borderColor: prerequisites.community.verified ? "success.main" : "warning.main",
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={prerequisites.community.completed}
                                        onChange={() => handleCheck("community")}
                                        disabled={prerequisites.community.verified}
                                        color="success"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Vinculación con la Comunidad Aprobada
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Proyecto comunitario completado
                                        </Typography>
                                    </Box>
                                }
                            />
                            <StatusBadge
                                status={prerequisites.community.verified ? "approved" : prerequisites.community.completed ? "in-progress" : "pending"}
                                label={
                                    prerequisites.community.verified
                                        ? "Verificado"
                                        : prerequisites.community.completed
                                            ? "En revisión"
                                            : "Pendiente"
                                }
                            />
                        </Box>
                    </Box>

                    {hasChanges && (
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                size="large"
                            >
                                Guardar Cambios
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default StudentPrerequisites;
