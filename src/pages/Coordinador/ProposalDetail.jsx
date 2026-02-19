import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/constants';
import {
    Box,
    Grid,
    Paper,
    Stack,
    Chip,
    CircularProgress,
    Typography,
    Button,
    Card,
    TextField,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import SaveIcon from '@mui/icons-material/Save';

import ButtonMui from '../../components/button.mui.component';
import AlertMui from '../../components/alert.mui.component';
import CommentSection from '../../components/comment.mui.component';
import { getDataUser, getActiveRole } from '../../storage/user.model.jsx';

import { ProposalService } from '../../services/proposal.service';

function CoordinatorProposalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [proposals, setProposals] = useState([]);
    const [studentInfo, setStudentInfo] = useState({ name: '', career: '', period: '' });
    const [pendingChanges, setPendingChanges] = useState({});

    const dataUser = getDataUser();
    const activeRole = getActiveRole();
    const normalizedRole = (activeRole || dataUser?.rol || "").toLowerCase();
    const isAuthority = normalizedRole === 'director' || normalizedRole === 'admin' || normalizedRole === 'coordinador';

    useEffect(() => {
        loadStudentProposals();
    }, [id]);

    const loadStudentProposals = async () => {
        if (!id || id === 'undefined') {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await ProposalService.getByStudent(id);
            if (data.length > 0) {
                const student = data[0].estudiante;

                setStudentInfo({
                    name: student ? `${student.nombres} ${student.apellidos}` : 'N/A',
                    career: (student?.estudiantePerfil?.escuela) || data[0].carrera || 'Sin Datos',
                    period: (student?.estudiantePerfil?.periodoLectivo) || '-'
                });

                const mapped = data.map(p => ({
                    id: p.id,
                    topic: p.titulo,
                    area: p.areaConocimiento?.nombre || 'General',
                    description: p.problematica || p.objetivos || 'Sin descripción',
                    file: p.archivoUrl ? p.archivoUrl.split('/').pop() : 'No adjunto',
                    fileUrl: p.archivoUrl,
                    status: mapApiStatusToUi(p.estado),
                    observation: p.comentarioRevision || '',
                    reviews: p.votacionesTutor?.map(v => ({
                        tutor: `${v.tutor?.nombres} ${v.tutor?.apellidos}`,
                        priority: v.prioridad,
                        justification: v.justificacion
                    })) || []
                }));
                setProposals(mapped);
            }
        } catch (error) {
            console.error("Error loading proposals", error);
        } finally {
            setLoading(false);
        }
    };

    const mapApiStatusToUi = (apiStatus) => {
        const map = {
            'PENDIENTE': 'pending',
            'APROBADA': 'approved',
            'RECHAZADA': 'rejected',
            'APROBADA_CON_COMENTARIOS': 'approved_with_obs'
        };
        return map[apiStatus] || 'pending';
    };

    const mapUiStatusToApi = (uiStatus) => {
        const map = {
            'pending': 'PENDIENTE',
            'approved': 'APROBADA',
            'rejected': 'RECHAZADA',
            'approved_with_obs': 'APROBADA_CON_COMENTARIOS'
        };
        return map[uiStatus] || 'PENDIENTE';
    };

    const handleStatusChange = (propId, newStatus) => {
        setProposals(prev => prev.map(p => {
            if (p.id === propId) {
                return { ...p, status: newStatus };
            }
            return p;
        }));

        setPendingChanges(prev => ({
            ...prev,
            [propId]: { ...prev[propId], status: newStatus }
        }));
    };

    const handleObservationChange = (propId, value) => {
        setProposals(prev => prev.map(p =>
            p.id === propId ? { ...p, observation: value } : p
        ));

        setPendingChanges(prev => ({
            ...prev,
            [propId]: { ...prev[propId], observation: value }
        }));
    };

    const handleSaveClick = () => {
        setOpenAlert(true);
    };

    const confirmSave = async () => {
        setOpenAlert(false);
        setLoading(true);
        try {
            const promises = Object.keys(pendingChanges).map(async (propId) => {
                const change = pendingChanges[propId];
                const currentProp = proposals.find(p => p.id === Number(propId));
                const finalStatus = change.status ? mapUiStatusToApi(change.status) : mapUiStatusToApi(currentProp.status);
                const finalObs = change.observation !== undefined ? change.observation : currentProp.observation;

                if (finalStatus !== 'PENDIENTE' || finalObs) {
                    await ProposalService.updateStatus(propId, finalStatus, finalObs);
                }
            });

            await Promise.all(promises);
            navigate('/coordinador/proposals');
        } catch (error) {
            console.error("Error saving changes", error);
            alert("Error al guardar cambios. Ver consola.");
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = Object.keys(pendingChanges).length > 0;

    const handleDownload = async (fileUrl, fileName = 'propuesta.pdf') => {
        if (!fileUrl) return;
        const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_BASE_URL.replace('/api/v1', '')}${fileUrl}`;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (!response.ok) {
                throw new Error(`Error al descargar: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'propuesta.pdf');
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("No se pudo descargar el archivo.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'approved_with_obs': return 'warning';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved': return 'APROBADA';
            case 'rejected': return 'RECHAZADA';
            case 'approved_with_obs': return 'OBSERVADA';
            default: return 'PENDIENTE';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '98%', margin: '0 auto', p: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/coordinador/proposals')}
                            sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                            Volver
                        </Button>
                    </Stack>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {studentInfo.name}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 'normal' }}>
                        {studentInfo.career} • {studentInfo.period}
                    </Typography>
                </Box>
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    zIndex: 1
                }} />
            </Paper>

            <Grid container spacing={4}>
                {proposals.map((prop, index) => (
                    <Grid size={{ xs: 12 }} key={prop.id}>
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                border: (prop.status === 'approved') ? '2px solid #2e7d32' : '1px solid rgba(0,0,0,0.08)',
                                overflow: 'visible',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-2px)' }
                            }}
                        >
                            <Box sx={{ p: 4 }}>
                                <Grid container spacing={4}>
                                    <Grid size={{ xs: 12 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <Chip
                                                label={`Propuesta ${index + 1}`}
                                                color="primary"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                            <Chip
                                                label={prop.area}
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={getStatusLabel(prop.status)}
                                                color={getStatusColor(prop.status)}
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Stack>

                                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#1a1a1a' }}>
                                            {prop.topic}
                                        </Typography>

                                        <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                                            {prop.description}
                                        </Typography>

                                        {prop.fileUrl && (
                                            <Paper variant="outlined" sx={{ p: 2, mt: 3, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8f9fa' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 1 }}>
                                                        <AttachFileIcon color="primary" />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="600">Documento Adjunto</Typography>
                                                        <Typography variant="caption" color="text.secondary">{prop.file}</Typography>
                                                    </Box>
                                                </Box>
                                                <ButtonMui
                                                    name="Descargar"
                                                    size="small"
                                                    startIcon={<DownloadIcon />}
                                                    onClick={() => handleDownload(prop.fileUrl, prop.file)}
                                                    backgroundColor="#0288d1"
                                                />
                                            </Paper>
                                        )}

                                        {prop.reviews && prop.reviews.length > 0 && (
                                            <Box sx={{ mt: 4 }}>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2, fontWeight: 'bold' }}>
                                                    Evaluación de Tutores
                                                </Typography>
                                                <Stack spacing={2}>
                                                    {prop.reviews.map((rev, idx) => (
                                                        <Paper key={idx} elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                                                <Typography variant="subtitle2" fontWeight="bold">{rev.tutor}</Typography>
                                                                <Chip
                                                                    label={`Prioridad: ${rev.priority}`}
                                                                    size="small"
                                                                    color={rev.priority === 1 ? "success" : "default"}
                                                                />
                                                            </Stack>
                                                            <Typography variant="body2" color="text.secondary">
                                                                "{rev.justification || 'Sin comentarios adicionales.'}"
                                                            </Typography>
                                                        </Paper>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Box sx={{
                                                    p: 3,
                                                    bgcolor: '#f8f9fa',
                                                    borderRadius: 3,
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    height: '100%'
                                                }}>
                                                    {isAuthority && (
                                                        <>
                                                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                                                                Dictamen
                                                            </Typography>

                                                            <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                                                                <Button
                                                                    variant={prop.status === 'approved' ? "contained" : "outlined"}
                                                                    color="success"
                                                                    startIcon={<CheckCircleIcon />}
                                                                    onClick={() => handleStatusChange(prop.id, 'approved')}
                                                                    fullWidth
                                                                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                                                >
                                                                    Aprobar
                                                                </Button>
                                                                <Button
                                                                    variant={prop.status === 'approved_with_obs' ? "contained" : "outlined"}
                                                                    color="warning"
                                                                    startIcon={<WarningIcon />}
                                                                    onClick={() => handleStatusChange(prop.id, 'approved_with_obs')}
                                                                    fullWidth
                                                                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                                                >
                                                                    Observar
                                                                </Button>
                                                                <Button
                                                                    variant={prop.status === 'rejected' ? "contained" : "outlined"}
                                                                    color="error"
                                                                    startIcon={<CancelIcon />}
                                                                    onClick={() => handleStatusChange(prop.id, 'rejected')}
                                                                    fullWidth
                                                                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                                                >
                                                                    Rechazar
                                                                </Button>
                                                            </Stack>

                                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                                {prop.status === 'rejected' ? "Motivo del rechazo:" : "Observaciones Oficiales:"}
                                                            </Typography>
                                                            <TextField
                                                                multiline
                                                                rows={4}
                                                                fullWidth
                                                                placeholder="Escribe aquí las observaciones oficiales..."
                                                                value={prop.observation}
                                                                onChange={(e) => handleObservationChange(prop.id, e.target.value)}
                                                                variant="outlined"
                                                                sx={{ bgcolor: 'white' }}
                                                            />

                                                            {prop.status === 'approved' && (
                                                                <Alert severity="success" sx={{ mt: 2, fontSize: '0.85rem' }}>
                                                                    Propuesta definitiva.
                                                                </Alert>
                                                            )}
                                                        </>
                                                    )}
                                                    {!isAuthority && (
                                                        <Box sx={{ py: 4, textAlign: 'center' }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Solo los coordinadores y directores pueden emitir un dictamen.
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Box sx={{
                                                    p: 3,
                                                    bgcolor: '#ffffff',
                                                    borderRadius: 3,
                                                    border: '1px solid #e0e0e0',
                                                    height: '100%',
                                                    minHeight: '400px'
                                                }}>
                                                    <CommentSection proposalId={prop.id} />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper
                elevation={6}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    bgcolor: 'white',
                    zIndex: 1000,
                    borderTop: '1px solid #e0e0e0',
                    display: hasChanges ? 'block' : 'none'
                }}
            >
                <Box sx={{ maxWidth: '98%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold" color="text.secondary">
                        Tienes cambios pendientes de guardar
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => navigate('/coordinador/proposals')}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveClick}
                            sx={{ px: 4 }}
                        >
                            Guardar Cambios
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {hasChanges && <Box sx={{ height: 100 }} />}

            <AlertMui
                open={openAlert}
                handleClose={() => setOpenAlert(false)}
                title="Confirmar Envío"
                message="¿Está seguro de enviar estas revisiones?"
                status="warning"
                showBtnL={true}
                btnNameL="Confirmar y Enviar"
                actionBtnL={confirmSave}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenAlert(false)}
            />
        </Box >
    );
}

export default CoordinatorProposalDetail;
