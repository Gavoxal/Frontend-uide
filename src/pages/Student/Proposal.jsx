import {
    Box,
    Typography,
    TextField,
    Button,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    Alert,
} from '@mui/material';
import { useState } from 'react';
import FileUpload from '../../components/file.mui.component';
import CommentSection from '../../components/comment.mui.component';
import AlertMui from '../../components/alert.mui.component';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

function ThesisProposal() {
    const [currentTab, setCurrentTab] = useState(0);
    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });
    const [proposals, setProposals] = useState([
        {
            titulo: '',
            areaInvestigacion: '',
            objetivo: '',
            problematica: '',
            alcance: '',
            file: null,
            status: 'draft', // draft, submitted, approved, rejected
            submittedDate: null,
            versions: [] // Para versionamiento futuro si se requiere
        },
        {
            titulo: '',
            areaInvestigacion: '',
            objetivo: '',
            problematica: '',
            alcance: '',
            file: null,
            status: 'draft',
            submittedDate: null,
            versions: []
        },
        {
            titulo: '',
            areaInvestigacion: '',
            objetivo: '',
            problematica: '',
            alcance: '',
            file: null,
            status: 'draft',
            submittedDate: null,
            versions: []
        },
    ]);

    const handleTabChange = (_event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleInputChange = (field, value) => {
        setProposals((prev) => {
            const updated = [...prev];
            updated[currentTab] = { ...updated[currentTab], [field]: value };
            return updated;
        });
    };

    const handleFileSelect = (file) => {
        setProposals((prev) => {
            const updated = [...prev];
            updated[currentTab] = {
                ...updated[currentTab],
                file: {
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(2)} KB`,
                    raw: file
                }
            };
            return updated;
        });
    };

    const handleRemoveFile = () => {
        setProposals((prev) => {
            const updated = [...prev];
            updated[currentTab] = { ...updated[currentTab], file: null };
            return updated;
        });
    };

    const handleClearProposal = () => {
        setProposals((prev) => {
            const updated = [...prev];
            updated[currentTab] = {
                titulo: '',
                areaInvestigacion: '',
                objetivo: '',
                problematica: '',
                alcance: '',
                file: null,
                status: 'draft',
                submittedDate: null,
                versions: []
            };
            return updated;
        });
    };

    const handleSubmit = () => {
        const currentProposal = proposals[currentTab];

        // Validaciones básicas
        if (!currentProposal.titulo || !currentProposal.areaInvestigacion || !currentProposal.objetivo) {
            setAlertState({
                open: true,
                title: 'Campos Incompletos',
                message: 'Por favor completa todos los campos obligatorios (Tema, Área y Objetivo) antes de enviar la propuesta.',
                status: 'warning'
            });
            return;
        }

        setProposals((prev) => {
            const updated = [...prev];
            updated[currentTab] = {
                ...updated[currentTab],
                status: 'submitted',
                submittedDate: new Date().toISOString().split('T')[0]
            };
            return updated;
        });

        setAlertState({
            open: true,
            title: '¡Propuesta Enviada!',
            message: 'Tu propuesta ha sido enviada correctamente. El comité académico la revisará pronto y recibirás comentarios.',
            status: 'success'
        });
    };

    const handleResubmit = () => {
        setProposals((prev) => {
            const updated = [...prev];
            updated[currentTab] = {
                ...updated[currentTab],
                status: 'draft'
            };
            return updated;
        });
    };

    const currentProposal = proposals[currentTab];
    const caracteresObjetivo = currentProposal.objetivo.length;
    const palabrasObjetivo = currentProposal.objetivo.trim().split(/\s+/).filter(word => word.length > 0).length;

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
            case 'approved': return 'Aprobada';
            case 'rejected': return 'Requiere Cambios';
            default: return 'Borrador';
        }
    };

    return (
        <>
            <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Propuesta de Tesis
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Completa los detalles de hasta tres temas de tesis. El Comité Académico los revisará en orden de prioridad.
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
                            <Typography variant="body1" fontWeight="500">
                                Fecha límite: <span style={{ color: '#667eea' }}>15 de Marzo, 2026</span>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    sx={{
                        mb: 3,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            color: 'text.secondary',
                        },
                        '& .Mui-selected': {
                            color: '#667eea !important',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#667eea',
                            height: 3,
                        },
                    }}
                >
                    {proposals.map((proposal, index) => (
                        <Tab
                            key={index}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>{index === 0 ? 'Propuesta 1 (Principal)' : `Propuesta ${index + 1}`}</span>
                                    {proposal.status !== 'draft' && (
                                        <Chip
                                            label={getStatusLabel(proposal.status)}
                                            size="small"
                                            sx={{
                                                backgroundColor: getStatusColor(proposal.status),
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                height: 20
                                            }}
                                        />
                                    )}
                                </Box>
                            }
                        />
                    ))}
                </Tabs>

                <Grid container spacing={3}>
                    {/* Formulario / Propuesta enviada */}
                    <Grid item xs={12} md={currentProposal.status === 'draft' ? 12 : 7}>
                        {currentProposal.status === 'draft' ? (
                            /* Formulario para crear/editar propuesta */
                            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                                <CardContent sx={{ p: 4 }}>
                                    {/* Tema y Área */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                                Tema de la Tesis: *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                placeholder="Ingrese el tema de investigación"
                                                value={currentProposal.titulo}
                                                onChange={(e) => handleInputChange('titulo', e.target.value)}
                                                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F9FAFB' } }}
                                            />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                                                Máximo 200 palabras
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                                Área de Investigación: *
                                            </Typography>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={currentProposal.areaInvestigacion}
                                                    onChange={(e) => handleInputChange('areaInvestigacion', e.target.value)}
                                                    displayEmpty
                                                    sx={{ backgroundColor: '#F9FAFB' }}
                                                >
                                                    <MenuItem value=""><em>Seleccionar área</em></MenuItem>
                                                    <MenuItem value="desarrollo-software">Desarrollo de Software</MenuItem>
                                                    <MenuItem value="inteligencia-artificial">Inteligencia Artificial</MenuItem>
                                                    <MenuItem value="redes-comunicaciones">Redes y Comunicaciones</MenuItem>
                                                    <MenuItem value="seguridad-informatica">Seguridad Informática</MenuItem>
                                                    <MenuItem value="base-datos">Base de Datos</MenuItem>
                                                    <MenuItem value="sistemas-informacion">Sistemas de Información</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>

                                    {/* Objetivo */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                            Objetivo General: *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            placeholder="Describa el objetivo principal de su investigación..."
                                            value={currentProposal.objetivo}
                                            onChange={(e) => handleInputChange('objetivo', e.target.value)}
                                            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F9FAFB' } }}
                                        />
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                                            Mínimo 200 palabras | {palabrasObjetivo} palabras | {caracteresObjetivo} caracteres
                                        </Typography>
                                    </Box>

                                    {/* Problemática y Alcance */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                                Problemática:
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                placeholder="Describa el problema que abordará..."
                                                value={currentProposal.problematica}
                                                onChange={(e) => handleInputChange('problematica', e.target.value)}
                                                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F9FAFB' } }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                                Alcance:
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                placeholder="Defina el alcance de la investigación..."
                                                value={currentProposal.alcance}
                                                onChange={(e) => handleInputChange('alcance', e.target.value)}
                                                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F9FAFB' } }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* File Upload */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                            Documento PDF de la Propuesta:
                                        </Typography>
                                        <FileUpload
                                            uploadedFile={currentProposal.file}
                                            onFileSelect={handleFileSelect}
                                            onRemoveFile={handleRemoveFile}
                                        />
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                            Suba un documento PDF con el detalle completo de su propuesta
                                        </Typography>
                                    </Box>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                        <Button
                                            startIcon={<DeleteOutlineIcon />}
                                            onClick={handleClearProposal}
                                            sx={{
                                                color: '#EF4444',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': { backgroundColor: '#FEE2E2' },
                                            }}
                                        >
                                            Limpiar Propuesta
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
                                                '&:hover': { backgroundColor: '#5568d3' },
                                            }}
                                        >
                                            Enviar Propuesta
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : (
                            /* Propuesta enviada - Vista de card */
                            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box>
                                            <Typography variant="h5" fontWeight="700" gutterBottom>
                                                {currentProposal.titulo}
                                            </Typography>
                                            <Chip
                                                label={getStatusLabel(currentProposal.status)}
                                                sx={{
                                                    backgroundColor: getStatusColor(currentProposal.status),
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

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                                            Fecha de envío
                                        </Typography>
                                        <Typography variant="body1">{currentProposal.submittedDate}</Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                                            Área de Investigación
                                        </Typography>
                                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                            {currentProposal.areaInvestigacion.replace('-', ' ')}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                                            Objetivo General
                                        </Typography>
                                        <Typography variant="body1">{currentProposal.objetivo}</Typography>
                                    </Box>

                                    {currentProposal.problematica && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                                                Problemática
                                            </Typography>
                                            <Typography variant="body1">{currentProposal.problematica}</Typography>
                                        </Box>
                                    )}

                                    {currentProposal.alcance && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                                                Alcance
                                            </Typography>
                                            <Typography variant="body1">{currentProposal.alcance}</Typography>
                                        </Box>
                                    )}

                                    {currentProposal.file && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                                                Documento Adjunto
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                p: 2,
                                                backgroundColor: '#f9fafb',
                                                borderRadius: 2,
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                <DescriptionIcon sx={{ color: '#667eea', fontSize: 32 }} />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {currentProposal.file.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {currentProposal.file.size}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    startIcon={<VisibilityIcon />}
                                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    Ver
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </Grid>

                    {/* Sección de comentarios (solo visible cuando la propuesta está enviada) */}
                    {currentProposal.status !== 'draft' && (
                        <Grid item xs={12} md={5}>
                            <Card sx={{ borderRadius: 3, boxShadow: 2, position: 'sticky', top: 20 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <CommentSection proposalId={currentTab} />
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

export default ThesisProposal;
