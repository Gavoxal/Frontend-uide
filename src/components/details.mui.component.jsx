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

    React.useEffect(() => {
        setCurrentTab(initialTab);
    }, [initialTab]);

    React.useEffect(() => {
        if (!open) {
            setUploadedFile(null);
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
            onSubmit(uploadedFile);
        }
        setUploadedFile(null);
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
                <Tab icon={<CheckCircle />} label="Revisión Tutor" iconPosition="start" sx={{ textTransform: 'none' }} />
                <Tab icon={<Grade />} label="Calificación" iconPosition="start" sx={{ textTransform: 'none' }} />
            </Tabs>

            <DialogContent sx={{ py: 3 }}>
                {/* Pestaña 1: Asignación del Tutor */}
                {currentTab === 0 && progressData.tutorAssignment && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Asignado por <strong>{progressData.tutorAssignment.assignedBy}</strong> el{' '}
                            {progressData.tutorAssignment.assignedDate.toLocaleDateString('es-ES')}
                        </Alert>

                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Descripción
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {progressData.tutorAssignment.description}
                        </Typography>

                        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mt: 3 }}>
                            Requisitos
                        </Typography>
                        <List>
                            {progressData.tutorAssignment.requirements.map((req, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText primary={`• ${req}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Pestaña 2: Mi Entrega */}
                {currentTab === 1 && (
                    <Box>
                        {progressData.studentSubmission ? (
                            <>
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Entregado el {progressData.studentSubmission.submittedDate.toLocaleDateString('es-ES')}
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
                                    <strong>{progressData.dueDate.toLocaleDateString('es-ES')}</strong>
                                </Alert>

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Subir Archivo
                                </Typography>
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    onRemoveFile={handleFileRemove}
                                    uploadedFile={uploadedFile}
                                />
                            </>
                        )}
                    </Box>
                )}

                {/* Pestaña 3: Revisión del Tutor */}
                {currentTab === 2 && (
                    <Box>
                        {progressData.tutorReview ? (
                            <>
                                <Alert
                                    severity={progressData.tutorReview.status === 'approved' ? 'success' : 'warning'}
                                    sx={{ mb: 3 }}
                                >
                                    Revisado el {progressData.tutorReview.reviewDate.toLocaleDateString('es-ES')}
                                </Alert>

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Estado Técnico
                                </Typography>
                                <Chip
                                    label={progressData.tutorReview.technicalScore}
                                    color={progressData.tutorReview.status === 'approved' ? 'success' : 'warning'}
                                    sx={{ mb: 3, fontWeight: 600 }}
                                />

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Feedback del Tutor
                                </Typography>
                                <Typography variant="body1">
                                    {progressData.tutorReview.feedback}
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

                {/* Pestaña 4: Calificación Final */}
                {currentTab === 3 && (
                    <Box>
                        {progressData.integrationGrade ? (
                            <>
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Calificado por <strong>{progressData.integrationGrade.gradedBy}</strong> el{' '}
                                    {progressData.integrationGrade.gradedDate.toLocaleDateString('es-ES')}
                                </Alert>

                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h2" fontWeight="700" color="#4caf50">
                                        {progressData.integrationGrade.score}/100
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        Calificación Final
                                    </Typography>
                                </Box>

                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    Observaciones
                                </Typography>
                                <Typography variant="body1">
                                    {progressData.integrationGrade.feedback}
                                </Typography>
                            </>
                        ) : (
                            <Alert severity="info">
                                {progressData.tutorReview
                                    ? 'El docente de integración está evaluando tu avance según la rúbrica.'
                                    : 'Primero el tutor debe aprobar tu avance antes de la calificación final.'
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
        </Dialog>
    );
}

export default DetailsModal;
