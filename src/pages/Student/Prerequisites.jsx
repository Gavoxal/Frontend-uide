import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
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
import AlertMui from "../../components/alert.mui.component";
import { PrerequisiteService } from "../../services/prerequisites.service";

function StudentPrerequisites() {
    const user = getDataUser();

    // Estado inicial vacío
    const [prerequisites, setPrerequisites] = useState({
        english: { completed: false, verified: false, id: null, catalogoId: null },
        internship: { completed: false, verified: false, id: null, catalogoId: null },
        community: { completed: false, verified: false, id: null, catalogoId: null }
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    // Mapeo inverso para cargar datos
    const reverseNameMapping = {
        "CERTIFICADO_INGLES": "english",
        "PRACTICAS_PREPROFESIONALES": "internship",
        "VINCULACION": "community"
    };

    const nameMapping = {
        english: "CERTIFICADO_INGLES",
        internship: "PRACTICAS_PREPROFESIONALES",
        community: "VINCULACION"
    };

    const viewNameMapping = {
        english: "Certificado de Inglés",
        internship: "Certificado de Prácticas",
        community: "Certificado de Vinculación"
    };

    // Cargar datos del API
    const fetchPrerequisites = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // Usar getByStudent que devuelve la lista con mapeo (english, internship, community)
            const data = await PrerequisiteService.getByStudent(user.id);
            console.log("Prerequisites Data:", data);

            // Mapear respuesta del API al estado local
            const newState = {
                english: { completed: false, verified: false, id: null, catalogoId: null },
                internship: { completed: false, verified: false, id: null, catalogoId: null },
                community: { completed: false, verified: false, id: null, catalogoId: null }
            };

            if (Array.isArray(data)) {
                data.forEach(item => {
                    // item.name ya viene mapeado (english, internship, community) por el servicio
                    const key = item.name;

                    if (newState[key]) {
                        newState[key] = {
                            completed: item.status === 'pending' || item.status === 'approved',
                            verified: item.status === 'approved',
                            id: item.estudiantePrerequisitoId || null, // ID del registro estudiante_prerequisito
                            catalogoId: item.id // ID del catálogo
                        };
                    }
                });
            }

            setPrerequisites(newState);
        } catch (error) {
            console.error("Error cargando prerrequisitos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrerequisites();
    }, [user?.id]);

    const handleCheck = (field) => {
        // Si ya está guardado en BD (tiene ID), no permitir desmarcar fácilmente (o requerir borrado)
        if (prerequisites[field].id) {
            return;
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

    const handleSave = async () => {
        let successCount = 0;
        let errorOccurred = false;

        const promises = Object.keys(prerequisites).map(async (key) => {
            const item = prerequisites[key];
            // Guardar si está completado y NO tiene ID (es nuevo)
            if (item.completed && !item.id) {
                if (!item.catalogoId) {
                    console.error(`Missing catalogoId for ${key}. Current item state:`, item);
                    throw new Error(`No se pudo identificar el ID para ${viewNameMapping[key] || key}. Intenta recargar la página.`);
                }
                try {
                    await PrerequisiteService.upload({
                        id: item.catalogoId,
                        nombre: nameMapping[key],
                        descripcion: `Certificado de ${nameMapping[key]}`
                    });
                    successCount++;
                } catch (error) {
                    console.error(`Error guardando ${key}:`, error);
                    errorOccurred = true;
                }
            }
        });

        await Promise.all(promises);

        if (!errorOccurred && successCount > 0) {
            await fetchPrerequisites(); // Recargar datos reales del backend
            setHasChanges(false);
            setAlertState({
                open: true,
                title: '¡Guardado Exitoso!',
                message: '¡Guardado Exitoso! Tus documentos han sido enviados correctamente para revisión.',
                status: 'success'
            });
        } else if (successCount === 0 && !errorOccurred) {
            setAlertState({
                open: true,
                title: 'Sin Cambios Nuevos',
                message: 'No hay documentos nuevos para subir.',
                status: 'info'
            });
        } else {
            setAlertState({
                open: true,
                title: 'Error Parcial o Total',
                message: 'Hubo un problema al subir algunos archivos. Verifique la consola.',
                status: 'error'
            });
        }
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

                        <Grid container spacing={3} sx={{ mt: 3 }}>
                            {/* Inglés */}
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        p: 2,
                                        height: '100%',
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
                                                        Inglés
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Nivel B1+
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
                                </Box>
                            </Grid>

                            {/* Prácticas Laborales */}
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        p: 2,
                                        height: '100%',
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
                                                        Prácticas
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Min. 240 horas
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
                                </Box>
                            </Grid>

                            {/* Vinculación con la Comunidad */}
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        p: 2,
                                        height: '100%',
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
                                                        Vinculación
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Proyecto completo
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
                            </Grid>
                        </Grid>

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
