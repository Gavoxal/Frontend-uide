import { useState, useEffect } from "react";
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
import FileUpload from "../../components/file.mui.component";
import AlertMui from "../../components/alert.mui.component";
import { getPrerequisites, savePrerequisites } from "../../storage/prerequisites.model";

function StudentPrerequisites() {
    const user = getDataUser();

    // Cargar prerrequisitos desde el almacenamiento
    const [prerequisites, setPrerequisites] = useState(getPrerequisites());

    const [hasChanges, setHasChanges] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    const handleCheck = (field) => {
        // Si hay un archivo cargado, no permitir desmarcar manualmente
        // El usuario debe eliminar el archivo primero
        if (prerequisites[field].file && prerequisites[field].completed) {
            return; // No hacer nada si intenta desmarcar con archivo cargado
        }

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
        // Guardar en localStorage
        const saved = savePrerequisites(prerequisites);

        if (saved) {
            setHasChanges(false);
            setAlertState({
                open: true,
                title: '¡Guardado Exitoso!',
                message: 'Los prerrequisitos han sido guardados correctamente. Los cambios se reflejarán en tu perfil.',
                status: 'success'
            });
        } else {
            setAlertState({
                open: true,
                title: 'Error al Guardar',
                message: 'Hubo un problema al guardar los prerrequisitos. Por favor, intenta nuevamente.',
                status: 'error'
            });
        }
    };

    const handleFileSelect = (field, file) => {
        setPrerequisites((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                completed: true, // Auto-marcar como completado cuando se sube archivo
                file: {
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(2)} KB`,
                    raw: file
                }
            },
        }));
        setHasChanges(true);
    };

    const handleFileRemove = (field) => {
        setPrerequisites((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                completed: false, // Desmarcar cuando se elimina el archivo
                file: null
            },
        }));
        setHasChanges(true);
    };

    const totalCompleted = Object.values(prerequisites).filter((p) => p.completed).length;
    const totalVerified = Object.values(prerequisites).filter((p) => p.verified).length;
    const allVerified = totalVerified === 3;

    return (
        <>
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
                                    p: 2,
                                    mb: 2,
                                    bgcolor: prerequisites.english.verified ? "#E8F5E9" : "#FFF8E1",
                                    borderRadius: 1,
                                    border: 1,
                                    borderColor: prerequisites.english.verified ? "success.main" : "warning.main",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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

                                {!prerequisites.english.verified && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" fontWeight="500" gutterBottom>
                                            Adjuntar certificado:
                                        </Typography>
                                        <FileUpload
                                            onFileSelect={(file) => handleFileSelect("english", file)}
                                            uploadedFile={prerequisites.english.file}
                                            onRemoveFile={() => handleFileRemove("english")}
                                        />
                                    </Box>
                                )}
                            </Box>

                            {/* Prácticas Laborales */}
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    bgcolor: prerequisites.internship.verified ? "#E8F5E9" : "#FFF8E1",
                                    borderRadius: 1,
                                    border: 1,
                                    borderColor: prerequisites.internship.verified ? "success.main" : "warning.main",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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

                                {!prerequisites.internship.verified && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" fontWeight="500" gutterBottom>
                                            Adjuntar certificado:
                                        </Typography>
                                        <FileUpload
                                            onFileSelect={(file) => handleFileSelect("internship", file)}
                                            uploadedFile={prerequisites.internship.file}
                                            onRemoveFile={() => handleFileRemove("internship")}
                                        />
                                    </Box>
                                )}
                            </Box>

                            {/* Vinculación con la Comunidad */}
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    bgcolor: prerequisites.community.verified ? "#E8F5E9" : "#FFF8E1",
                                    borderRadius: 1,
                                    border: 1,
                                    borderColor: prerequisites.community.verified ? "success.main" : "warning.main",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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

                                {!prerequisites.community.verified && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" fontWeight="500" gutterBottom>
                                            Adjuntar certificado:
                                        </Typography>
                                        <FileUpload
                                            onFileSelect={(file) => handleFileSelect("community", file)}
                                            uploadedFile={prerequisites.community.file}
                                            onRemoveFile={() => handleFileRemove("community")}
                                        />
                                    </Box>
                                )}
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

            {/* Alert Component */}
            <AlertMui
                open={alertState.open}
                handleClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                status={alertState.status}
                showBtnL={true}
                btnNameL="Aceptar"
                actionBtnL={() => setAlertState({ ...alertState, open: false })}
            />
        </>
    );
}

export default StudentPrerequisites;
