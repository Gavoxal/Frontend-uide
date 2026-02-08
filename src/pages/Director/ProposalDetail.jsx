import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Stack,
    Chip
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

function ProposalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);

    const studentInfo = {
        name: "Ana Torres",
        career: "Ingeniería de Software",
        period: "SEM LOJA OCT 2025 – FEB 2026",
    };

    const [proposals, setProposals] = useState([
        {
            id: 1,
            topic: "Implementación de IA para optimización de tráfico urbano en Loja",
            area: "Ciencia de Datos e Inteligencia Artificial",
            description: "Uso de redes neuronales para analizar flujo vehicular.",
            file: "propuesta_1.pdf",
            status: 'pending',
<<<<<<< HEAD
            observation: ''
=======
            observation: '',
            reviews: [
                { id: 101, reviewer: "Ing. Carlos Mendoza", vote: true, comment: "El alcance técnico es adecuado y la problemática es relevante." },
                { id: 102, reviewer: "Dra. Elena Yépez", vote: true, comment: "Buena fundamentación teórica, aprobado." },
                { id: 103, reviewer: "Msc. Juan Pablo", vote: false, comment: "Se debe delimitar mejor el área geográfica de estudio." }
            ]
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
        },
        {
            id: 2,
            topic: "Sistema de gestión documental con Blockchain",
            area: "Gestión de la Información y Transformación Digital",
            description: "Aseguramiento de documentos universitarios.",
            file: "propuesta_2.pdf",
            status: 'pending',
<<<<<<< HEAD
            observation: ''
=======
            observation: '',
            reviews: [
                { id: 201, reviewer: "Ing. Carlos Mendoza", vote: false, comment: "La tecnología Blockchain parece excesiva para este problema." },
                { id: 202, reviewer: "Dra. Elena Yépez", vote: false, comment: "No queda claro el modelo de costos." }
            ]
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
        },
        {
            id: 3,
            topic: "Aplicación móvil para turismo comunitario",
            area: "Programación y Desarrollo de Software",
            description: "Promoción de rutas turísticas en Saraguro.",
            file: "propuesta_3.pdf",
            status: 'pending',
<<<<<<< HEAD
            observation: ''
=======
            observation: '',
            reviews: [] // Sin revisiones aún
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
        }
    ]);

    const handleStatusChange = (propId, newStatus) => {
        setProposals(prev => prev.map(p => {
            if (p.id === propId) {
                return { ...p, status: newStatus };
            } else {
                if (newStatus === 'approved' || newStatus === 'approved_with_obs') {
                    return { ...p, status: 'rejected' };
                }
                return p;
            }
        }));
    };

    const handleObservationChange = (propId, value) => {
        setProposals(prev => prev.map(p =>
            p.id === propId ? { ...p, observation: value } : p
        ));
    };

    const handleSaveClick = () => {
        setOpenAlert(true);
    };

    const confirmSave = () => {
        console.log("Guardando decisión:", proposals);
        setOpenAlert(false);
        navigate('/director/proposals');
    };

    const canSave = proposals.some(p => p.status === 'approved' || p.status === 'approved_with_obs');

<<<<<<< HEAD
=======
    // Helper para contar votos
    const getVoteSummary = (reviews) => {
        if (!reviews || reviews.length === 0) return { favor: 0, contra: 0, total: 0 };
        const favor = reviews.filter(r => r.vote).length;
        return { favor, contra: reviews.length - favor, total: reviews.length };
    };

>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value={`Revisión de Propuestas: ${studentInfo.name}`} variant="h4" />
                <TextMui value={`${studentInfo.career} - ${studentInfo.period}`} variant="h6" />
                <NotificationMui severity="info" sx={{ mt: 2 }}>
<<<<<<< HEAD
                    Seleccione <strong>UNA</strong> propuesta para aprobar. Utilice los botones para definir el estado de cada una.
=======
                    Revise el <strong>Feedback del Tribunal</strong> antes de tomar una decisión final. Seleccione una propuesta para aprobar.
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                </NotificationMui>
            </Box>

            <Grid container spacing={3} direction="column">
<<<<<<< HEAD
                {proposals.map((prop) => (
                    <Grid item xs={12} key={prop.id}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                border: (prop.status === 'approved' || prop.status === 'approved_with_obs') ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                                backgroundColor: (prop.status === 'approved' || prop.status === 'approved_with_obs') ? '#f1f8e9' : 'white',
                                transition: '0.3s'
                            }}
                        >
                            <Grid container spacing={4}>
                                {/* Columna Izquierda (50%) */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Chip label={`Propuesta ${prop.id}`} color="primary" size="small" />
                                        <Chip label={prop.area} variant="outlined" size="small" />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <TextMui value={prop.topic} variant="h6" />
                                        <TextMui value={prop.description} variant="body2" />
                                    </Box>

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
                                            {/* Usamos TextMui en lugar de Typography */}
                                            <TextMui value={prop.file} variant="body2" />
                                        </Box>
                                        <Box sx={{ width: '150px' }}>
                                            <ButtonMui
                                                name="Descargar"
                                                startIcon={<DownloadIcon />}
                                                onClick={() => { console.log(`Descargando ${prop.file}`) }}
                                                backgroundColor="#0288d1"
                                            />
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Columna Derecha (50%) - Botones y Observaciones */}
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', borderLeft: { xs: 'none', md: '1px solid #eee' }, pl: { md: 3 } }}>
                                    <TextMui value="Definir Estado:" variant="subtitle2" />

                                    <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
                                        {/* Usando ButtonMui con variante y colores específicos */}
                                        <Box sx={{ width: '33%' }}>
                                            <ButtonMui
                                                name="Aprobar"
                                                variant={prop.status === 'approved' ? "contained" : "outlined"}
                                                // backgroundColor - ButtonMui aplica bg color si es contained. Si es outlined, usa color prop? 
                                                // ButtonMui props: backgroundColor, color.
                                                // Requerimos que ButtonMui maneje bien el outlined.
                                                // Por ahora pasamos los colores que definimos.
                                                backgroundColor={prop.status === 'approved' ? "#2e7d32" : "transparent"}
                                                color={prop.status === 'approved' ? "white" : "#2e7d32"}
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleStatusChange(prop.id, 'approved')}
                                            />
                                        </Box>
                                        <Box sx={{ width: '33%' }}>
                                            <ButtonMui
                                                name="Observar"
                                                variant={prop.status === 'approved_with_obs' ? "contained" : "outlined"}
                                                backgroundColor={prop.status === 'approved_with_obs' ? "#ed6c02" : "transparent"}
                                                color={prop.status === 'approved_with_obs' ? "white" : "#ed6c02"}
                                                startIcon={<WarningIcon />}
                                                onClick={() => handleStatusChange(prop.id, 'approved_with_obs')}
                                            />
                                        </Box>
                                        <Box sx={{ width: '33%' }}>
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

                                    {prop.status === 'approved' && (
                                        <AlertMui status="success" message="Propuesta Aprobada sin observaciones." />
                                    )}

                                    {prop.status === 'approved_with_obs' && (
                                        <Box sx={{ width: '100%', flexGrow: 1 }}>
                                            {/* TextMui no tiene prop color directa, usamos un wrapper o asumimos default, pero el usuario pidió componentes */}
                                            {/* TextMui es <Typography variant={variant}>{value}</Typography>. No pasa sx. */}
                                            {/* Voy a usar TextMui para el label y InputMui para el area. */}
                                            <TextMui value="Observaciones para el estudiante (Aceptada con condiciones):" variant="caption" />

                                            <InputMui
                                                multiline={true}
                                                rows={6}
                                                placeholder="Ej: Se aprueba el tema pero debe delimitar mejor el alcance en..."
                                                value={prop.observation}
                                                onChange={(e) => handleObservationChange(prop.id, e.target.value)}
                                            // InputMui no tiene props de color para el borde, usa default.
                                            />
                                        </Box>
                                    )}

                                    {prop.status === 'rejected' && (
                                        <Box sx={{ width: '100%', flexGrow: 1 }}>
                                            <TextMui value="Motivo del rechazo:" variant="caption" />
                                            <InputMui
                                                multiline={true}
                                                rows={6}
                                                placeholder="Ej: El tema no se alinea con las líneas de investigación..."
                                                value={prop.observation}
                                                onChange={(e) => handleObservationChange(prop.id, e.target.value)}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Layout de botones corregido */}
=======
                {proposals.map((prop) => {
                    const votes = getVoteSummary(prop.reviews);

                    return (
                        <Grid item xs={12} key={prop.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    border: (prop.status === 'approved' || prop.status === 'approved_with_obs') ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                                    backgroundColor: (prop.status === 'approved' || prop.status === 'approved_with_obs') ? '#f1f8e9' : 'white',
                                    transition: '0.3s'
                                }}
                            >
                                <Grid container spacing={4}>
                                    {/* Columna Izquierda (50%) */}
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Chip label={`Propuesta ${prop.id}`} color="primary" size="small" />
                                            <Chip label={prop.area} variant="outlined" size="small" />
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <TextMui value={prop.topic} variant="h6" />
                                            <TextMui value={prop.description} variant="body2" />
                                        </Box>

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
                                            <Box sx={{ width: '150px' }}>
                                                <ButtonMui
                                                    name="Descargar"
                                                    startIcon={<DownloadIcon />}
                                                    onClick={() => { console.log(`Descargando ${prop.file}`) }}
                                                    backgroundColor="#0288d1"
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Columna Derecha (50%) - Feedback y Decisión */}
                                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', borderLeft: { xs: 'none', md: '1px solid #eee' }, pl: { md: 3 } }}>

                                        {/* Sección Feedback del Tribunal */}
                                        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <TextMui value="Feedback del Tribunal" variant="subtitle1" />
                                                <Stack direction="row" spacing={1}>
                                                    <Chip icon={<CheckCircleIcon />} label={`${votes.favor} Favor`} color="success" size="small" variant="outlined" />
                                                    <Chip icon={<CancelIcon />} label={`${votes.contra} Contra`} color="error" size="small" variant="outlined" />
                                                </Stack>
                                            </Box>

                                            {prop.reviews && prop.reviews.length > 0 ? (
                                                <Stack spacing={1} sx={{ mt: 1 }}>
                                                    {prop.reviews.map(review => (
                                                        <Box key={review.id} sx={{ p: 1, textOverflow: 'ellipsis', bgcolor: 'white', borderRadius: 1, border: '1px solid #eee' }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <TextMui value={review.reviewer} variant="caption" />
                                                                {review.vote ?
                                                                    <CheckCircleIcon color="success" fontSize="small" /> :
                                                                    <CancelIcon color="error" fontSize="small" />
                                                                }
                                                            </Box>
                                                            <TextMui value={review.comment} variant="body2" />
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <TextMui value="Aún no hay revisiones registradas." variant="caption" />
                                            )}
                                        </Box>

                                        <TextMui value="Decisión Final del Director:" variant="subtitle2" />

                                        <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
                                            <Box sx={{ width: '33%' }}>
                                                <ButtonMui
                                                    name="Aprobar"
                                                    variant={prop.status === 'approved' ? "contained" : "outlined"}
                                                    backgroundColor={prop.status === 'approved' ? "#2e7d32" : "transparent"}
                                                    color={prop.status === 'approved' ? "white" : "#2e7d32"}
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => handleStatusChange(prop.id, 'approved')}
                                                />
                                            </Box>
                                            <Box sx={{ width: '33%' }}>
                                                <ButtonMui
                                                    name="Observar"
                                                    variant={prop.status === 'approved_with_obs' ? "contained" : "outlined"}
                                                    backgroundColor={prop.status === 'approved_with_obs' ? "#ed6c02" : "transparent"}
                                                    color={prop.status === 'approved_with_obs' ? "white" : "#ed6c02"}
                                                    startIcon={<WarningIcon />}
                                                    onClick={() => handleStatusChange(prop.id, 'approved_with_obs')}
                                                />
                                            </Box>
                                            <Box sx={{ width: '33%' }}>
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

                                        {prop.status === 'approved' && (
                                            <AlertMui status="success" message="Propuesta Aprobada sin observaciones." />
                                        )}

                                        {prop.status === 'approved_with_obs' && (
                                            <Box sx={{ width: '100%', flexGrow: 1 }}>
                                                <TextMui value="Observaciones Finales (Condicionada):" variant="caption" />
                                                <InputMui
                                                    multiline={true}
                                                    rows={4}
                                                    placeholder="Ej: Se aprueba el tema pero debe..."
                                                    value={prop.observation}
                                                    onChange={(e) => handleObservationChange(prop.id, e.target.value)}
                                                />
                                            </Box>
                                        )}

                                        {prop.status === 'rejected' && (
                                            <Box sx={{ width: '100%', flexGrow: 1 }}>
                                                <TextMui value="Motivo del rechazo final:" variant="caption" />
                                                <InputMui
                                                    multiline={true}
                                                    rows={4}
                                                    placeholder="Ej: El tema no es viable..."
                                                    value={prop.observation}
                                                    onChange={(e) => handleObservationChange(prop.id, e.target.value)}
                                                />
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Box sx={{ width: '200px' }}>
                    <ButtonMui
                        name="Volver"
                        onClick={() => navigate('/director/proposals')}
                        startIcon={<ArrowBackIcon />}
<<<<<<< HEAD
                        backgroundColor="red" // El usuario puso red
=======
                        backgroundColor="red"
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                    />
                </Box>
                <Box sx={{ width: '200px' }}>
                    <ButtonMui
                        name="Guardar Decisión"
                        onClick={handleSaveClick}
                        backgroundColor={canSave ? "#2e7d32" : "green"}
                        disabled={!canSave}
                    />
                </Box>
            </Box>

            <AlertMui
                open={openAlert}
                handleClose={() => setOpenAlert(false)}
                title="Confirmar Decisión"
<<<<<<< HEAD
                message="¿Está seguro de guardar estos cambios? Se notificará al estudiante."
=======
                message="¿Está seguro de guardar estos cambios? Se notificará al estudiante y al tribunal."
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                status="warning"
                showBtnL={true}
                btnNameL="Confirmar y Guardar"
                actionBtnL={confirmSave}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenAlert(false)}
            />
        </Box>
    );
}

export default ProposalDetail;
