import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Stack,
    Chip,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';

import TextMui from '../../components/text.mui.component';
import ButtonMui from '../../components/button.mui.component';
import AlertMui from '../../components/alert.mui.component';
import NotificationMui from '../../components/notification.mui.component';
import InputMui from '../../components/input.mui.component';

import { ProposalService } from '../../services/proposal.service';

function ProposalDetail() {
    const { id } = useParams(); // This is now STUDENT ID
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [proposals, setProposals] = useState([]);
    const [studentInfo, setStudentInfo] = useState({ name: '', career: '', period: '' });
    const [pendingChanges, setPendingChanges] = useState({});

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
                    career: data[0].carrera || 'N/A',
                    period: student?.estudiantePerfil?.periodoLectivo || '-'
                });

                // Map API data to component structure
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
            navigate('/director/proposals');
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
        const baseUrl = window.location.origin.includes('localhost') ? 'http://localhost:3000' : '';
        const fullUrl = `${baseUrl}${fileUrl}`;
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
            alert("No se pudo descargar el archivo. Es posible que el servidor no responda o la sesión haya expirado.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: '400px', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value={`Revisión de Propuestas: ${studentInfo.name}`} variant="h4" />
                <TextMui value={`${studentInfo.career} - ${studentInfo.period}`} variant="h6" color="textSecondary" />
                <NotificationMui severity="info" sx={{ mt: 2 }}>
                    Aquí puede revisar las 3 propuestas enviadas por el estudiante. Seleccione <strong>Aprobar</strong> solo en la propuesta definitiva. Al aprobar una, se notificará automáticamente al estudiante.
                </NotificationMui>
            </Box>

            <Grid container spacing={3} direction="column">
                {proposals.map((prop, index) => (
                    <Grid item xs={12} key={prop.id}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                border: (prop.status === 'approved' || prop.status === 'approved_with_obs') ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                                backgroundColor: (prop.status === 'approved' || prop.status === 'approved_with_obs') ? '#f1f8e9' : 'white',
                                transition: '0.3s',
                                borderRadius: 2
                            }}
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={7}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Chip label={`Opción ${index + 1}`} color="primary" size="small" />
                                        <Chip label={prop.area} variant="outlined" size="small" />
                                        <Chip
                                            label={prop.status.toUpperCase()}
                                            color={prop.status === 'approved' ? "success" : prop.status === 'rejected' ? "error" : "default"}
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <TextMui value={prop.topic} variant="h6" sx={{ fontWeight: 'bold', mb: 1 }} />
                                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                            <TextMui value={prop.description} variant="body2" />
                                        </Box>
                                    </Box>

                                    {prop.reviews && prop.reviews.length > 0 && (
                                        <Box sx={{ mt: 2, mb: 2 }}>
                                            <TextMui value="Votación y Comentarios de Tutores:" variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }} />
                                            <Stack spacing={1}>
                                                {prop.reviews.map((rev, idx) => (
                                                    <Box key={idx} sx={{ p: 1.5, borderLeft: '3px solid #1a237e', bgcolor: '#e8eaf6', borderRadius: '0 4px 4px 0' }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                            <TextMui value={rev.tutor} variant="caption" sx={{ fontWeight: 'bold' }} />
                                                            <Chip
                                                                label={`Prioridad: ${rev.priority}`}
                                                                size="small"
                                                                color={rev.priority === 1 ? "success" : "default"}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                        <TextMui value={rev.justification || 'Sin comentarios adicionales.'} variant="body2" sx={{ fontStyle: 'italic' }} />
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {prop.fileUrl && (
                                        <Box sx={{
                                            mt: 2,
                                            p: 2,
                                            border: '1px dashed #bdbdbd',
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: '#fafafa'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AttachFileIcon color="action" />
                                                <TextMui value={prop.file} variant="body2" />
                                            </Box>
                                            <Box sx={{ width: '180px' }}>
                                                <ButtonMui
                                                    name="Descargar PDF"
                                                    startIcon={<DownloadIcon />}
                                                    onClick={() => handleDownload(prop.fileUrl, prop.file)}
                                                    backgroundColor="#0288d1"
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', borderLeft: { xs: 'none', md: '1px solid #eee' }, pl: { md: 3 } }}>

                                    <TextMui value="Decisión del Director:" variant="subtitle2" sx={{ mb: 1 }} />

                                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <ButtonMui
                                                name="Aprobar"
                                                variant={prop.status === 'approved' ? "contained" : "outlined"}
                                                backgroundColor={prop.status === 'approved' ? "#2e7d32" : "transparent"}
                                                color={prop.status === 'approved' ? "white" : "#2e7d32"}
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleStatusChange(prop.id, 'approved')}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <ButtonMui
                                                name="Observar"
                                                variant={prop.status === 'approved_with_obs' ? "contained" : "outlined"}
                                                backgroundColor={prop.status === 'approved_with_obs' ? "#ed6c02" : "transparent"}
                                                color={prop.status === 'approved_with_obs' ? "white" : "#ed6c02"}
                                                startIcon={<WarningIcon />}
                                                onClick={() => handleStatusChange(prop.id, 'approved_with_obs')}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <ButtonMui
                                                name="Rechazar"
                                                variant={prop.status === 'rejected' ? "contained" : "outlined"}
                                                backgroundColor={prop.status === 'rejected' ? "#d32f2f" : "transparent"}
                                                color={prop.status === 'rejected' ? "white" : "#d32f2f"}
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleStatusChange(prop.id, 'rejected')}
                                            />
                                        </Box>
                                    </Stack>

                                    <Box sx={{ width: '100%', flexGrow: 1 }}>
                                        <TextMui value={prop.status === 'rejected' ? "Motivo del rechazo:" : "Observaciones / Sugerencias:"} variant="caption" sx={{ fontWeight: 'bold' }} />
                                        <InputMui
                                            multiline={true}
                                            rows={4}
                                            placeholder="Ingrese sus comentarios aquí..."
                                            value={prop.observation}
                                            onChange={(e) => handleObservationChange(prop.id, e.target.value)}
                                        />
                                    </Box>

                                    {prop.status === 'approved' && (
                                        <AlertMui status="success" message="Esta será la propuesta oficial." sx={{ mt: 1 }} />
                                    )}

                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
                <Box sx={{ width: '150px' }}>
                    <ButtonMui
                        name="Cancelar"
                        onClick={() => navigate('/director/proposals')}
                        startIcon={<ArrowBackIcon />}
                        backgroundColor="#757575"
                    />
                </Box>
                <Box sx={{ width: '220px' }}>
                    <ButtonMui
                        name="Enviar Revisiones"
                        onClick={handleSaveClick}
                        backgroundColor={hasChanges ? "#1976d2" : "#bdbdbd"}
                        disabled={!hasChanges}
                    />
                </Box>
            </Box>

            <AlertMui
                open={openAlert}
                handleClose={() => setOpenAlert(false)}
                title="Confirmar Envío"
                message="¿Está seguro de enviar estas revisiones? Los estudiantes recibirán una notificación con sus sugerencias o aprobación."
                status="warning"
                showBtnL={true}
                btnNameL="Confirmar y Enviar"
                actionBtnL={confirmSave}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenAlert(false)}
            />
        </Box>
    );
}

export default ProposalDetail;
