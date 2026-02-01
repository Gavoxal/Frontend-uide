import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Collapse,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FileUpload from '../../components/file.mui.component';
import CommentSection from '../../components/comment.mui.component';
import AlertMui from '../../components/alert.mui.component';

function StudentAvances() {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    // Datos de ejemplo
    const progressData = {
        completedWeeks: 2,
        totalWeeks: 15,
        daysUntilDeadline: 10,
        currentWeek: 3
    };

    // Rúbrica de evaluación
    const rubricData = {
        criteria: [
            {
                name: 'Formato del documento',
                levels: [
                    { name: 'Excelente', description: 'Cumple completamente con el formato establecido' },
                    { name: 'Satisfactorio', description: 'Cumple parcialmente, requiere ajustes menores' },
                    { name: 'Insatisfactorio', description: 'No cumple con los requisitos mínimos' }
                ]
            },
            {
                name: 'Contenido técnico',
                levels: [
                    { name: 'Excelente', description: 'Demuestra dominio completo del tema' },
                    { name: 'Satisfactorio', description: 'Demuestra conocimiento adecuado con algunas carencias' },
                    { name: 'Insatisfactorio', description: 'Carece de fundamento técnico suficiente' }
                ]
            },
            {
                name: 'Avance del proyecto',
                levels: [
                    { name: 'Excelente', description: 'Evidencia progreso significativo y funcional' },
                    { name: 'Satisfactorio', description: 'Muestra avance pero con funcionalidad limitada' },
                    { name: 'Insatisfactorio', description: 'Avance insuficiente o no funcional' }
                ]
            }
        ]
    };

    const weeklySubmissions = [
        {
            id: 1,
            week: 'Semana 1',
            dueDate: 'Enero 06, 2026',
            status: 'Calificado',
            grade: '95/100',
            file: 'avance_semana1.pdf',
            locked: false
        },
        {
            id: 2,
            week: 'Semana 2',
            dueDate: 'Enero 10, 2026',
            status: 'Atrasado',
            grade: '70/100',
            file: 'avance_semana2.pdf',
            locked: false
        },
        {
            id: 3,
            week: 'Semana 3',
            dueDate: 'Enero 20, 2026',
            status: 'Enviado',
            grade: '---',
            file: 'avance_semana3.pdf',
            locked: false
        },
        {
            id: 4,
            week: 'Semana 4',
            dueDate: 'Enero 20, 2026',
            status: 'Pendiente',
            grade: '---',
            file: null,
            locked: false
        },
        {
            id: 5,
            week: 'Semana 5',
            dueDate: 'Enero 20, 2026',
            status: 'Próximo',
            grade: '---',
            file: null,
            locked: true
        },
    ];

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Calificado':
                return { color: 'success', bgColor: '#4caf50' };
            case 'Atrasado':
                return { color: 'error', bgColor: '#f44336' };
            case 'Enviado':
                return { color: 'info', bgColor: '#2196f3' };
            case 'Pendiente':
                return { color: 'default', bgColor: '#757575' };
            case 'Próximo':
                return { color: 'default', bgColor: '#9e9e9e' };
            default:
                return { color: 'default', bgColor: '#9e9e9e' };
        }
    };

    const getStatusDot = (week) => {
        const colors = {
            1: '#4caf50',
            2: '#ff9800',
            3: '#2196f3',
            4: '#757575',
            5: '#9e9e9e'
        };
        return colors[week] || '#9e9e9e';
    };

    const handleUploadProgress = () => {
        setUploadModalOpen(true);
    };

    const handleCloseModal = () => {
        setUploadModalOpen(false);
        setUploadedFile(null);
    };

    const handleFileSelect = (file) => {
        setUploadedFile(file);
    };

    const handleFileRemove = () => {
        setUploadedFile(null);
    };

    const handleSubmitProgress = () => {
        if (!uploadedFile) {
            setAlertState({
                open: true,
                title: 'Archivo Faltante',
                message: 'Por favor, sube el archivo de tu avance antes de enviar.',
                status: 'warning'
            });
            return;
        }

        // Aquí iría la lógica para enviar al backend
        setUploadModalOpen(false);
        setAlertState({
            open: true,
            title: '¡Avance Enviado!',
            message: 'Tu avance semanal ha sido enviado correctamente. Recibirás una calificación pronto.',
            status: 'success'
        });
        setUploadedFile(null);
    };

    const progressPercentage = (progressData.completedWeeks / progressData.totalWeeks) * 100;

    return (
        <>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Mis Avances
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Seguimiento semanal de tu trabajo de titulación
                    </Typography>
                </Box>

                {/* Seguimiento de Avances Section */}
                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                            Seguimiento de Mis Avances
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                            {/* Semanas Completadas Card */}
                            <Card sx={{
                                flex: '1 1 300px',
                                borderRadius: 3,
                                boxShadow: 1,
                                border: '1px solid #e0e0e0'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Semanas Completadas
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                                        {progressData.completedWeeks} / {progressData.totalWeeks}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPercentage}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                backgroundColor: '#4caf50'
                                            }
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Días para la fecha límite Card */}
                            <Card sx={{
                                flex: '1 1 300px',
                                borderRadius: 3,
                                boxShadow: 1,
                                border: '1px solid #e0e0e0'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Días para la fecha límite
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AccessTimeIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                                        <Typography variant="h4" fontWeight="bold" color="#ff9800">
                                            {progressData.daysUntilDeadline} Días
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Semana {progressData.currentWeek} - Avances
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Botón Subir Avance */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={<UploadFileIcon />}
                                onClick={handleUploadProgress}
                                sx={{
                                    backgroundColor: '#FDB913',
                                    color: '#000',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#E5A712'
                                    }
                                }}
                            >
                                Subir avance
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Tabla de Avances Semanales */}
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                            Tabla de Avances Semanales
                        </Typography>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                                            Semana
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                                            Fecha de vencimiento
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }} align="center">
                                            Estatus
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }} align="center">
                                            Calificación
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }} align="center">
                                            Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {weeklySubmissions.map((submission) => (
                                        <TableRow
                                            key={submission.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#fafafa'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            backgroundColor: getStatusDot(submission.id)
                                                        }}
                                                    />
                                                    <Typography variant="body2" fontWeight="500">
                                                        {submission.week}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    {submission.dueDate}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={submission.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getStatusConfig(submission.status).bgColor,
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="500">
                                                    {submission.grade}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    {submission.locked ? (
                                                        <IconButton size="small" disabled>
                                                            <LockIcon sx={{ fontSize: 20 }} />
                                                        </IconButton>
                                                    ) : submission.status === 'Pendiente' || submission.status === 'Atrasado' ? (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{
                                                                textTransform: 'none',
                                                                minWidth: 'auto',
                                                                px: 2,
                                                                fontSize: '0.75rem',
                                                                backgroundColor: '#667eea',
                                                                '&:hover': {
                                                                    backgroundColor: '#5568d3'
                                                                }
                                                            }}
                                                        >
                                                            Editar
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <IconButton size="small" sx={{ color: '#667eea' }}>
                                                                <DownloadIcon sx={{ fontSize: 20 }} />
                                                            </IconButton>
                                                            <IconButton size="small" sx={{ color: '#667eea' }}>
                                                                <ArticleIcon sx={{ fontSize: 20 }} />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>

            {/* Upload Progress Modal */}
            <Dialog
                open={uploadModalOpen}
                onClose={handleCloseModal}
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
                                Subir Avance Semanal
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Semana {progressData.currentWeek} - Fecha límite: <strong>31 de ene de 2026 23:59</strong>
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ py: 3 }}>
                    {/* Información de entrega */}
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2" fontWeight="600" gutterBottom>
                            Instrucciones de entrega
                        </Typography>
                        <Typography variant="caption">
                            Sube el documento con los avances realizados durante esta semana. Asegúrate de incluir toda la evidencia necesaria.
                        </Typography>
                    </Alert>

                    {/* Detalles Accordion */}
                    <Accordion sx={{ mb: 3, boxShadow: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight="600">Detalles</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ pl: 2 }}>
                                <Typography variant="body2" fontWeight="600" gutterBottom>
                                    Tema: Avances de proyecto
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Descripción: Subir la evidencia de los avances realizados
                                </Typography>
                                <Typography variant="body2" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
                                    Entregable:
                                </Typography>
                                <List dense sx={{ pl: 2 }}>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemText
                                            primary="• Documento con formato definido."
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemText
                                            primary="• Link de repositorio del proyecto."
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* Rúbrica Accordion */}
                    <Accordion sx={{ mb: 3, boxShadow: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight="600">Criterios de Evaluación</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer sx={{ mt: 1 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 700, width: '30%' }}>Criterio</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Niveles de Cumplimiento</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rubricData.criteria.map((criterion, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>
                                                    {criterion.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {criterion.levels.map((level, levelIdx) => (
                                                            <Box
                                                                key={levelIdx}
                                                                sx={{
                                                                    p: 1.5,
                                                                    backgroundColor: levelIdx === 0 ? '#e8f5e9' : levelIdx === 1 ? '#fff8e1' : '#ffebee',
                                                                    border: '1px solid',
                                                                    borderColor: levelIdx === 0 ? '#4caf50' : levelIdx === 1 ? '#ffc107' : '#f44336',
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                <Typography variant="caption" fontWeight="700" display="block" gutterBottom>
                                                                    {level.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {level.description}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>

                    {/* File Upload Section */}
                    <Card sx={{ mb: 3, borderRadius: 2, backgroundColor: '#f9fafb' }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                Subir Archivo de Avance
                            </Typography>
                            <FileUpload
                                onFileSelect={handleFileSelect}
                                onRemoveFile={handleFileRemove}
                                uploadedFile={uploadedFile}
                            />
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <CommentSection proposalId="avance-s3" />
                        </CardContent>
                    </Card>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 3, gap: 2 }}>
                    <Button
                        onClick={handleCloseModal}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmitProgress}
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            backgroundColor: '#667eea',
                            '&:hover': {
                                backgroundColor: '#5568d3'
                            }
                        }}
                    >
                        Enviar Avance
                    </Button>
                </DialogActions>
            </Dialog>

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

export default StudentAvances;
