import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    Divider,
    Tabs,
    Tab,
    Alert,
    List,
    ListItem,
    ListItemText,
    Button,
    Chip,
    Grid,
    TextField,
} from '@mui/material';
import {
    Assignment,
    UploadFile,
    CheckCircle,
    Grade,
    Close,
    Download,
} from '@mui/icons-material';
import FileUpload from './file.mui.component';

/**
 * Componente modal reutilizable para mostrar detalles de avances semanales
 * 
 * @param {boolean} open - Estado de apertura del modal
 * @param {function} onClose - Función para cerrar el modal
 * @param {object} progressData - Datos del avance a mostrar
 * @param {function} getStateConfig - Función para obtener configuración del estado
 * @param {function} onSubmit - Función callback al enviar (opcional)
 * @param {number} initialTab - Pestaña inicial a mostrar (0-3)
 */
function DetailsModal({
    open = false,
    onClose,
    progressData = null,
    getStateConfig,
    onSubmit,
    initialTab = 0
}) {
    const [currentTab, setCurrentTab] = useState(initialTab);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [comment, setComment] = useState('');

    React.useEffect(() => {
        setCurrentTab(initialTab);
    }, [initialTab]);

    React.useEffect(() => {
        if (!open) {
            setUploadedFile(null);
            setComment('');
        }
    }, [open]);

    const handleFileSelect = (file) => {
        setUploadedFile(file);
    };

    const handleFileRemove = () => {
        setUploadedFile(null);
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(uploadedFile, comment);
        }
        setUploadedFile(null);
        setComment('');
    };

    if (!progressData) return null;

    const stateConfig = getStateConfig ? getStateConfig(progressData.currentState) : {};

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                            Semana {progressData.weekNumber}: {progressData.title}
                        </Typography>
                        {stateConfig.icon && (
                            <Chip
                                icon={React.createElement(stateConfig.icon)}
                                label={stateConfig.label}
                                size="small"
                                sx={{
                                    backgroundColor: stateConfig.color,
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                        )}
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider />

            {/* Pestañas */}
            <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
            >
                <Tab icon={<Assignment />} label="Asignación" iconPosition="start" sx={{ textTransform: 'none' }} />
                <Tab icon={<UploadFile />} label="Mi Entrega" iconPosition="start" sx={{ textTransform: 'none' }} />
                <Tab icon={<Grade />} label="Calificación" iconPosition="start" sx={{ textTransform: 'none' }} />
            </Tabs>
            <DialogContent sx={{ p: 3 }}>
                {/* Pestaña 1: Asignación del Tutor */}
                {currentTab === 0 && progressData.tutorAssignment && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Asignado por <strong>{progressData.tutorAssignment.assignedBy}</strong> el{' '}
                            {progressData.tutorAssignment.assignedDate?.toLocaleDateString ? progressData.tutorAssignment.assignedDate.toLocaleDateString('es-ES') : 'N/A'}
                        </Alert>

                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Descripción
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {progressData.tutorAssignment.description}
                        </Typography>
                    </Box>
                )}

                {/* Pestaña 2: Mi Entrega */}
                {currentTab === 1 && (
                    <Box>
                        {progressData.studentSubmission ? (
                            <>
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Entregado el {progressData.studentSubmission.submittedDate?.toLocaleDateString ? progressData.studentSubmission.submittedDate.toLocaleDateString('es-ES') : 'N/A'}
                                </Alert>

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Archivo Enviado
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                    mb: 3
                                }}>
                                    <Typography variant="body1">
                                        📄 {progressData.studentSubmission.uploadedFile}
                                    </Typography>
                                    <Button
                                        startIcon={<Download />}
                                        size="small"
                                        sx={{ mt: 1, textTransform: 'none' }}
                                    >
                                        Descargar
                                    </Button>
                                </Box>

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Comentarios
                                </Typography>
                                <Typography variant="body1">
                                    {progressData.studentSubmission.comments}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    Aún no has entregado este avance. Fecha límite:{' '}
                                    <strong>{progressData.dueDate?.toLocaleDateString ? progressData.dueDate.toLocaleDateString('es-ES') : 'Sin fecha'}</strong>
                                </Alert>

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Subir Archivo
                                </Typography>
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    onRemoveFile={handleFileRemove}
                                    uploadedFile={uploadedFile}
                                />

                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        Comentarios Adicionales
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Describe brevemente los cambios o el trabajo realizado..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        variant="outlined"
                                        sx={{ bgcolor: 'white' }}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                )}

                {/* Pestaña 3: Calificación/Revisión */}
                {currentTab === 2 && (
                    <Box>
                        {progressData.grading ? (
                            <>
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Calificado por <strong>{progressData.grading.gradedBy}</strong> el{' '}
                                    {progressData.grading.gradedDate?.toLocaleDateString ? progressData.grading.gradedDate.toLocaleDateString('es-ES') : 'N/A'}
                                </Alert>

                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h2" fontWeight="700" color="#4caf50">
                                        {progressData.grading.score}/10
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        Calificación Final
                                    </Typography>
                                </Box>

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Observaciones
                                </Typography>
                                <Typography variant="body1">
                                    {progressData.grading.feedback}
                                </Typography>
                            </>
                        ) : (
                            <Alert severity="info">
                                {progressData.studentSubmission
                                    ? 'Tu tutor está revisando tu entrega. Recibirás feedback pronto.'
                                    : 'Primero debes entregar tu avance para que el tutor pueda revisarlo.'
                                }
                            </Alert>
                        )}
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3
                    }}
                >
                    Cerrar
                </Button>
                {!progressData.studentSubmission && currentTab === 1 && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        startIcon={<UploadFile />}
                        disabled={!uploadedFile}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            backgroundColor: '#000A9B',
                            '&:hover': {
                                backgroundColor: '#0011cc'
                            }
                        }}
                    >
                        Enviar Avance
                    </Button>
                )}
            </DialogActions>
        </Dialog >
    );
}

export default DetailsModal;
