import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUpload from '../../components/file.mui.component.jsx';
import CommentSection from '../../components/comment.mui.component.jsx';
import AlertMui from '../../components/alert.mui.component.jsx';

function StudentProyecto() {
    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    const [anteproyecto, setAnteproyecto] = useState({
        anteproyectoFile: null,
        manualFile: null,
        planPruebasFile: null,
        status: 'draft', // draft, submitted, approved, rejected
        submittedDate: null,
        versions: [] // Historial de versiones del anteproyecto
    });

    const handleFileSelect = (file, type) => {
        const fileData = {
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            file: file,
            date: new Date().toISOString().split('T')[0]
        };

        if (anteproyecto.status !== 'draft' && type === 'anteproyecto') {
            // Versionamiento para anteproyecto en estado 'submitted' o desbloqueado
            handleNewVersion(fileData);
        } else {
            setAnteproyecto(prev => ({
                ...prev,
                [`${type}File`]: fileData
            }));
        }
    };

    const handleNewVersion = (fileData) => {
        setAnteproyecto(prev => {
            const currentFile = prev.anteproyectoFile;
            // Asegurar que solo archivamos si hay un archivo previo
            const newVersions = currentFile ? [...prev.versions, { ...currentFile, version: prev.versions.length + 1 }] : prev.versions;

            return {
                ...prev,
                versions: newVersions,
                anteproyectoFile: { ...fileData, version: newVersions.length + 1 }
            };
        });

        setAlertState({
            open: true,
            title: 'Nueva versión subida',
            message: 'Se ha actualizado tu anteproyecto con una nueva versión.',
            status: 'success'
        });
    };

    const handleSubmit = () => {
        // Validación: al menos el anteproyecto debe estar cargado
        if (!anteproyecto.anteproyectoFile) {
            setAlertState({
                open: true,
                title: 'Documento Faltante',
                message: 'Por favor, sube el documento del proyecto antes de enviar.',
                status: 'warning'
            });
            return;
        }

        setAnteproyecto(prev => ({
            ...prev,
            status: 'submitted',
            submittedDate: new Date().toISOString().split('T')[0]
        }));

        setAlertState({
            open: true,
            title: '¡Proyecto Enviado!',
            message: '¡Proyecto enviado correctamente! El tutor lo revisará pronto y recibirás comentarios.',
            status: 'success'
        });
    };

    const handleClearAll = () => {
        if (confirm('¿Estás seguro de que quieres limpiar todos los archivos?')) {
            setAnteproyecto({
                anteproyectoFile: null,
                manualFile: null,
                planPruebasFile: null,
                status: 'draft',
                submittedDate: null,
            });
        }
    };

    const handleResubmit = () => {
        setAnteproyecto(prev => ({
            ...prev,
            status: 'draft'
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted': return '#ff9800';
            case 'approved': return '#4caf50';
            case 'rejected': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'draft': return 'Borrador';
            case 'submitted': return 'En Revisión';
            case 'approved': return 'Aprobado';
            case 'rejected': return 'Requiere Cambios';
            default: return 'Borrador';
        }
    };

    const renderDocumentCard = (file, title) => {
        if (!file) return null;

        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2.5,
                backgroundColor: '#f9fafb',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                mb: 2,
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderColor: '#667eea',
                }
            }}>
                <DescriptionIcon sx={{ color: '#667eea', fontSize: 36 }} />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
                        {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {file.size}
                    </Typography>
                </Box>
                <Button
                    startIcon={<VisibilityIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#667eea',
                        '&:hover': {
                            backgroundColor: '#eef2ff'
                        }
                    }}
                >
                    Ver
                </Button>
            </Box>
        );
    };

    return (
        <>
            <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
                {/* Encabezado */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Anteproyecto y Avances
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Sube y actualiza los documentos de tu anteproyecto. El sistema guarda un historial de tus versiones.
                    </Typography>
                </Box>

                {/* Status Info */}
                <Card sx={{ mb: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleIcon sx={{ color: '#10B981', fontSize: 24 }} />
                                <Typography variant="body1" fontWeight="500">
                                    Estado: <span style={{ color: '#10B981' }}>Abierto</span>
                                </Typography>
                            </Box>
                            {anteproyecto.status !== 'draft' && (
                                <Chip
                                    label={getStatusLabel(anteproyecto.status)}
                                    sx={{
                                        backgroundColor: getStatusColor(anteproyecto.status),
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Formulario / Anteproyecto enviado */}
                    <Grid item xs={12} md={anteproyecto.status === 'draft' ? 12 : 7}>
                        {anteproyecto.status === 'draft' ? (
                            /* Formulario de carga */
                            <>
                                {/* Información */}
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    Debes subir tu proyecto aprobado y los documentos complementarios. Solo se aceptan archivos en formato PDF.
                                </Alert>

                                {/* Anteproyecto */}
                                <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Proyecto *
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Documento principal del proyecto aprobado por el director
                                        </Typography>
                                        <FileUpload
                                            onFileSelect={(file) => handleFileSelect(file, 'anteproyecto')}
                                            uploadedFile={anteproyecto.anteproyectoFile}
                                            onRemoveFile={() => handleRemoveFile('anteproyecto')}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Manual y Plan de Pruebas */}
                                <Grid container spacing={3}>
                                    {/* Manual de Usuario/Programador */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
                                            <CardContent sx={{ p: 4 }}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Manual de Usuario/Programador
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Documentación técnica del sistema
                                                </Typography>
                                                <FileUpload
                                                    onFileSelect={(file) => handleFileSelect(file, 'manual')}
                                                    uploadedFile={anteproyecto.manualFile}
                                                    onRemoveFile={() => handleRemoveFile('manual')}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Articulo Cientifico */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
                                            <CardContent sx={{ p: 4 }}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Articulo Cientifico
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Documento cientifico del proyecto
                                                </Typography>
                                                <FileUpload
                                                    onFileSelect={(file) => handleFileSelect(file, 'planPruebas')}
                                                    uploadedFile={anteproyecto.planPruebasFile}
                                                    onRemoveFile={() => handleRemoveFile('planPruebas')}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Información adicional */}
                                <Card sx={{ mt: 3, backgroundColor: '#FFF9E6', borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            📋 Requisitos de los documentos:
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                                <li>Formato: PDF únicamente</li>
                                                <li>Tamaño máximo: 10 MB por archivo</li>
                                                <li>El anteproyecto debe estar firmado por el tutor</li>
                                                <li>Los manuales deben seguir el formato institucional</li>
                                            </ul>
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Botones de acción */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 3,
                                    p: 3,
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    boxShadow: 1
                                }}>
                                    <Button
                                        startIcon={<DeleteOutlineIcon />}
                                        onClick={handleClearAll}
                                        sx={{
                                            color: '#EF4444',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: '#FEE2E2',
                                            },
                                        }}
                                    >
                                        Limpiar Todo
                                    </Button>

                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleSubmit}
                                        sx={{
                                            backgroundColor: '#667eea',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: '#5568d3',
                                            },
                                        }}
                                    >
                                        Enviar Documentación
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            /* Vista de documentación enviada */
                            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box>
                                            <Typography variant="h5" fontWeight="700" gutterBottom>
                                                Documentación del Anteproyecto
                                            </Typography>
                                            <Chip
                                                label={getStatusLabel(anteproyecto.status)}
                                                sx={{
                                                    backgroundColor: getStatusColor(anteproyecto.status),
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    mb: 2
                                                }}
                                            />
                                        </Box>
                                        <Button
                                            startIcon={<EditIcon />}
                                            onClick={handleResubmit}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                color: '#667eea',
                                            }}
                                        >
                                            Editar y Reenviar
                                        </Button>
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                                            Fecha de envío
                                        </Typography>
                                        <Typography variant="body1">{anteproyecto.submittedDate}</Typography>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        Anteproyecto Actual
                                    </Typography>

                                    {/* Mostrar version actual si existe */}
                                    {renderDocumentCard(anteproyecto.anteproyectoFile, `Anteproyecto (Versión ${anteproyecto.anteproyectoFile?.version || 1})`)}

                                    {/* Historial de Versiones */}
                                    {anteproyecto.versions && anteproyecto.versions.length > 0 && (
                                        <Box sx={{ mt: 2, mb: 4, pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Historial de Versiones</Typography>
                                            {anteproyecto.versions.map((ver, idx) => (
                                                <Typography key={idx} variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                                    • Versión {ver.version || idx + 1}: {ver.name} ({ver.date})
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 3, mb: 4 }}>
                                        <Typography variant="subtitle2" fontWeight="600" color="primary" gutterBottom>
                                            Subir Nuevo Avance / Versión
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Puedes subir una nueva versión del anteproyecto para actualizar tus avances.
                                        </Typography>
                                        <FileUpload
                                            onFileSelect={(file) => handleFileSelect(file, 'anteproyecto')}
                                            uploadedFile={null}
                                            onRemoveFile={() => { }}
                                            placeholder="Cargar nueva versión del anteproyecto"
                                        />
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        Documentos Complementarios
                                    </Typography>

                                    {/* Permitir editar/subir otros documentos incluso en submitted */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>Manual de Usuario/Programador</Typography>
                                        {anteproyecto.manualFile ? (
                                            renderDocumentCard(anteproyecto.manualFile, 'Manual de Usuario')
                                        ) : (
                                            <FileUpload
                                                onFileSelect={(file) => handleFileSelect(file, 'manual')}
                                                uploadedFile={null}
                                                onRemoveFile={() => { }}
                                                placeholder="Cargar Manual"
                                            />
                                        )}
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>Plan de Pruebas / Artículo</Typography>
                                        {anteproyecto.planPruebasFile ? (
                                            renderDocumentCard(anteproyecto.planPruebasFile, 'Plan de Pruebas')
                                        ) : (
                                            <FileUpload
                                                onFileSelect={(file) => handleFileSelect(file, 'planPruebas')}
                                                uploadedFile={null}
                                                onRemoveFile={() => { }}
                                                placeholder="Cargar Plan de Pruebas"
                                            />
                                        )}
                                    </Box>

                                    {!anteproyecto.manualFile && !anteproyecto.planPruebasFile && (
                                        <Alert severity="warning" sx={{ mt: 2 }}>
                                            Solo se ha enviado el anteproyecto. Se recomienda completar con los documentos complementarios.
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </Grid>

                    {/* Sección de comentarios (solo visible cuando está enviado) */}
                    {anteproyecto.status !== 'draft' && (
                        <Grid item xs={12} md={5}>
                            <Card sx={{ borderRadius: 3, boxShadow: 2, position: 'sticky', top: 20 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <CommentSection proposalId="anteproyecto" />
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
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

export default StudentProyecto;
