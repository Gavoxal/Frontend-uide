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
    CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";
import StatusBadge from "../../components/common/StatusBadge";
import FileUpload from "../../components/file.mui.component";
import AlertMui from "../../components/alert.mui.component";
import { PrerequisiteService } from "../../services/prerequisites.service";

function StudentPrerequisites() {
    const user = getDataUser();

    // Estado inicial vacío
    const [prerequisites, setPrerequisites] = useState({
        english: { completed: false, verified: false, file: null, id: null, catalogoId: null },
        internship: { completed: false, verified: false, file: null, id: null, catalogoId: null },
        community: { completed: false, verified: false, file: null, id: null, catalogoId: null }
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
                english: { completed: false, verified: false, file: null, id: null, catalogoId: null },
                internship: { completed: false, verified: false, file: null, id: null, catalogoId: null },
                community: { completed: false, verified: false, file: null, id: null, catalogoId: null }
            };

            if (Array.isArray(data)) {
                data.forEach(item => {
                    // El servicio getByStudent ya debería devolver objetos con la propiedad 'name' mapeada a english/internship/community
                    // o podemos usar Reverse mapping si vienen con nombre original
                    const key = item.name || reverseNameMapping[item.nombre];

                    if (key && newState[key]) {
                        if (!item.id) {
                            console.warn(`[WARNING] item.id (CatalogoID) is missing for key: ${key}`, item);
                        }
                        newState[key] = {
                            completed: !!item.archivoUrl || item.status === 'pending' || item.status === 'approved',
                            verified: item.status === 'approved' || item.cumplido === true,
                            file: item.archivoUrl ? {
                                name: item.archivoUrl.split('/').pop(),
                                url: item.archivoUrl,
                                size: "PDF"
                            } : null,
                            id: item.estudiantePrerequisitoId || null,
                            catalogoId: item.id || null
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
            // Solo guardar si está completado, tiene archivo nuevo (raw) y NO tiene ID (no guardado aun)
            if (item.completed && item.file && item.file.raw && !item.id) {
                try {
                    await PrerequisiteService.upload({
                        id: item.catalogoId, // ID del catálogo para crear la relación
                        nombre: nameMapping[key],
                        descripcion: `Certificado de ${nameMapping[key]}`,
                        archivo: item.file.raw
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

    const handleFileSelect = (field, file) => {
        setPrerequisites((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                completed: true,
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
        if (prerequisites[field].id) return;

        setPrerequisites((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                completed: false,
                file: null,
                id: null
            },
        }));
        setHasChanges(true);
    };

    const totalCompleted = Object.values(prerequisites).filter((p) => p.completed).length;
    const totalVerified = Object.values(prerequisites).filter((p) => p.verified).length;
    const allVerified = totalVerified === 3;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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

                                    {prerequisites.english.file ? (
                                        <Box sx={{
                                            mt: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            backgroundColor: '#FFF',
                                            borderRadius: 2,
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <DescriptionIcon sx={{ color: '#667eea', fontSize: 32 }} />
                                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="600"
                                                    noWrap
                                                    component="a"
                                                    href={prerequisites.english.file.url}
                                                    target="_blank"
                                                    sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
                                                >
                                                    {prerequisites.english.file.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {prerequisites.english.file.size || "PDF"}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                {!prerequisites.english.verified && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleFileRemove("english")}
                                                        color="error"
                                                        title="Eliminar"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    ) : (
                                        !prerequisites.english.verified && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" fontWeight="500" gutterBottom>
                                                    Adjuntar certificado:
                                                </Typography>
                                                <FileUpload
                                                    onFileSelect={(file) => handleFileSelect("english", file)}
                                                    uploadedFile={null}
                                                    onRemoveFile={() => handleFileRemove("english")}
                                                />
                                            </Box>
                                        )
                                    )}
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

                                    {prerequisites.internship.file ? (
                                        <Box sx={{
                                            mt: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            backgroundColor: '#FFF',
                                            borderRadius: 2,
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <DescriptionIcon sx={{ color: '#667eea', fontSize: 32 }} />
                                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="600"
                                                    noWrap
                                                    component="a"
                                                    href={prerequisites.internship.file.url}
                                                    target="_blank"
                                                    sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
                                                >
                                                    {prerequisites.internship.file.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {prerequisites.internship.file.size || "PDF"}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                {!prerequisites.internship.verified && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleFileRemove("internship")}
                                                        color="error"
                                                        title="Eliminar"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    ) : (
                                        !prerequisites.internship.verified && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" fontWeight="500" gutterBottom>
                                                    Adjuntar certificado:
                                                </Typography>
                                                <FileUpload
                                                    onFileSelect={(file) => handleFileSelect("internship", file)}
                                                    uploadedFile={null}
                                                    onRemoveFile={() => handleFileRemove("internship")}
                                                />
                                            </Box>
                                        )
                                    )}
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

                                    {prerequisites.community.file ? (
                                        <Box sx={{
                                            mt: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            backgroundColor: '#FFF',
                                            borderRadius: 2,
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <DescriptionIcon sx={{ color: '#667eea', fontSize: 32 }} />
                                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="600"
                                                    noWrap
                                                    component="a"
                                                    href={prerequisites.community.file.url}
                                                    target="_blank"
                                                    sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
                                                >
                                                    {prerequisites.community.file.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {prerequisites.community.file.size || "PDF"}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                {!prerequisites.community.verified && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleFileRemove("community")}
                                                        color="error"
                                                        title="Eliminar"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    ) : (
                                        !prerequisites.community.verified && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" fontWeight="500" gutterBottom>
                                                    Adjuntar certificado:
                                                </Typography>
                                                <FileUpload
                                                    onFileSelect={(file) => handleFileSelect("community", file)}
                                                    uploadedFile={null}
                                                    onRemoveFile={() => handleFileRemove("community")}
                                                />
                                            </Box>
                                        )
                                    )}
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
