import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Alert,
    Chip,
    Divider,
    CircularProgress,
    Tooltip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUpload from '../../components/file.mui.component.jsx';
import AlertMui from '../../components/alert.mui.component.jsx';
import { ProposalService } from '../../services/proposal.service';
import { EntregableService } from '../../services/entregable.service';
import { downloadFile } from '../../services/api';

function StudentProyecto() {
    console.log("Rendering StudentProyecto with Unlock Logic");

    const [alertState, setAlertState] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    const [loading, setLoading] = useState(true);
    const [unlocked, setUnlocked] = useState(false);
    const [unlockInfo, setUnlockInfo] = useState({ approvedWeeks: 0, requiredWeeks: 16 });
    const [proposalId, setProposalId] = useState(null);

    // Documentos finales (Tesis, Manual, etc.)
    const [documents, setDocuments] = useState({
        TESIS: { current: null, history: [] },
        MANUAL_USUARIO: { current: null, history: [] },
        ARTICULO: { current: null, history: [] }
    });

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        try {
            // 1. Verificar estado de desbloqueo
            const status = await EntregableService.getUnlockStatus();
            setUnlocked(status.unlocked);
            setUnlockInfo({ approvedWeeks: status.approvedWeeks, requiredWeeks: status.requiredWeeks });

            if (status.unlocked) {
                // 2. Obtener propuesta para el ID
                const proposals = await ProposalService.getAll();
                if (proposals && proposals.length > 0) {
                    const pid = proposals[0].id;
                    setProposalId(pid);

                    // 3. Cargar documentos actuales e historial
                    await loadDocuments(pid);
                }
            }
        } catch (error) {
            console.error("Error initializing Proyecto:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDocuments = async (pid) => {
        const history = await EntregableService.getByPropuesta(pid, true);

        const sortedDocs = {
            TESIS: { current: null, history: [] },
            MANUAL_USUARIO: { current: null, history: [] },
            ARTICULO: { current: null, history: [] }
        };

        history.forEach(doc => {
            if (doc.isActive) {
                sortedDocs[doc.tipo].current = doc;
            } else {
                sortedDocs[doc.tipo].history.push(doc);
            }
        });

        setDocuments(sortedDocs);
    };

    const handleFileSelect = async (file, tipo) => {
        try {
            setLoading(true);
            await EntregableService.upload(tipo, proposalId, file);
            await loadDocuments(proposalId);

            setAlertState({
                open: true,
                title: 'Documento Actualizado',
                message: `Se ha subido una nueva versión de: ${tipo.replace('_', ' ')}`,
                status: 'success'
            });
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (doc) => {
        // Los entregables se sirven desde /api/v1/entregables/file/
        const filename = doc.urlArchivo.split('/').pop();
        const dbUrl = `/api/v1/entregables/file/${filename}`;
        downloadFile(dbUrl, `Version_${doc.version}_${doc.tipo}.pdf`);
    };

    const renderDocumentSection = (tipo, title, description) => {
        const doc = documents[tipo].current;
        const history = documents[tipo].history;

        return (
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'visible' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        </Box>
                        {doc && (
                            <Chip
                                label={`V${doc.version}`}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                        )}
                    </Box>

                    {doc ? (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            bgcolor: '#f8fafc',
                            borderRadius: 2,
                            border: '1px solid #e2e8f0'
                        }}>
                            <DescriptionIcon sx={{ color: '#6366f1', fontSize: 32 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" noWrap>Versión Actual</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Subido el: {new Date(doc.fechaSubida).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload(doc)}
                                sx={{ textTransform: 'none' }}
                            >
                                Descargar
                            </Button>
                        </Box>
                    ) : (
                        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                            Aún no has subido este documento.
                        </Alert>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <FileUpload
                            onFileSelect={(file) => handleFileSelect(file, tipo)}
                            uploadedFile={null}
                            placeholder={`Subir ${doc ? 'nueva versión' : 'archivo'}`}
                        />
                    </Box>

                    {history.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Tooltip title="Ver versiones anteriores">
                                <Button
                                    size="small"
                                    startIcon={<HistoryIcon />}
                                    sx={{ textTransform: 'none', color: 'text.secondary' }}
                                    onClick={() => alert("Historial: \n" + history.map(h => `V${h.version} - ${new Date(h.fechaSubida).toLocaleDateString()}`).join('\n'))}
                                >
                                    Historial de versiones ({history.length})
                                </Button>
                            </Tooltip>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    if (loading && !proposalId && unlocked) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="text.secondary">Cargando documentos finales...</Typography>
            </Box>
        );
    }

    if (!unlocked && !loading) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                <Box sx={{
                    mb: 4,
                    p: 6,
                    borderRadius: 4,
                    bgcolor: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <LockIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Sección Bloqueada
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                        Para acceder a la entrega de documentos finales y postulación de defensa, debes haber completado y tener aprobadas las **16 semanas de avances**.
                    </Typography>

                    <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" fontWeight="bold">Progreso de Aprobación</Typography>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                                {unlockInfo.approvedWeeks} / {unlockInfo.requiredWeeks} Semanas
                            </Typography>
                        </Box>
                        <Box sx={{
                            height: 12,
                            bgcolor: '#e2e8f0',
                            borderRadius: 6,
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                left: 0, top: 0, bottom: 0,
                                width: `${(unlockInfo.approvedWeeks / unlockInfo.requiredWeeks) * 100}%`,
                                bgcolor: '#6366f1',
                                borderRadius: 6,
                                transition: 'width 1s ease-in-out'
                            }} />
                        </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        Contacta a tu tutor si crees que hay un error en tu conteo de semanas.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1e293b' }}>
                        Proyecto Final y Entregables
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gestiona las versiones finales de tu tesis y documentos complementarios para la defensa.
                    </Typography>
                </Box>
                <Chip
                    icon={<CheckCircleIcon />}
                    label="Requisitos Completos (16 Semanas)"
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                />
            </Box>

            <Grid container spacing={3}>
                {/* Instrucciones en la parte superior para balancear el layout */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#EEF2FF', border: '1px solid #C7D2FE', mb: 1 }}>
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="#3730A3">
                                    Instrucciones de Versiones
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#4338CA' }}>
                                    Si el tribunal solicita cambios después de la defensa privada, sube el archivo corregido en el apartado correspondiente.
                                    El sistema gestionará automáticamente el control de versiones (V1, V2, etc.).
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, borderLeft: { md: '1px solid #C7D2FE' }, pl: { md: 4 } }}>
                                <ul style={{ paddingLeft: 20, fontSize: '0.85rem', color: '#4338CA', margin: 0 }}>
                                    <li style={{ marginBottom: 4 }}>La versión más reciente será la que revise el comité.</li>
                                    <li style={{ marginBottom: 4 }}>Puedes descargar versiones anteriores desde el historial.</li>
                                    <li>Asegúrate de que los archivos estén en formato PDF o ZIP según corresponda.</li>
                                </ul>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Grid Simétrico de Documentos */}
                <Grid item xs={12}>
                    {renderDocumentSection('TESIS', 'Documento de Tesis (PDF)', 'Archivo principal de tu trabajo de titulación.')}
                </Grid>
                <Grid item xs={12} md={6}>
                    {renderDocumentSection('MANUAL_USUARIO', 'Manual de Usuario / Técnico', 'Documentación sobre el uso y configuración del sistema.')}
                </Grid>
                <Grid item xs={12} md={6}>
                    {renderDocumentSection('ARTICULO', 'Artículo Científicio', 'Resumen técnico para publicación institucional.')}
                </Grid>
            </Grid>

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
        </Box>
    );
}

export default StudentProyecto;
