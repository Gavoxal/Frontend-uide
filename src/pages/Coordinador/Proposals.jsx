import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";

function CoordinadorProposals() {
    const navigate = useNavigate();

    // TODO: API - Obtener propuestas de tesis
    // const { data: proposals } = await fetch('/api/coordinador/proposals')
    const [proposals] = useState([
        {
            id: 1,
            studentName: "Jhandry Becerra",
            studentId: "1184523",
            title: "Implementación de Block Chain para seguridad en transacciones",
            status: "pending_review", // pending_review, approved, rejected
            submissionDate: "2025-01-15"
        },
        {
            id: 2,
            studentName: "Eduardo Pardo",
            studentId: "1150373",
            title: "Sistema de gestión de titulación UIDE",
            status: "approved",
            submissionDate: "2025-01-10"
        },
        {
            id: 3,
            studentName: "Fernando Castillo",
            studentId: "1122334",
            title: "Análisis de vulnerabilidades en redes IoT",
            status: "rejected",
            submissionDate: "2025-01-05"
        }
    ]);

    const getStatusChip = (status) => {
        switch (status) {
            case 'approved':
                return <Chip label="Aprobado" color="success" size="small" />;
            case 'rejected':
                return <Chip label="Rechazado" color="error" size="small" />;
            case 'pending_review':
            default:
                return <Chip label="Pendiente Revisión" color="warning" size="small" />;
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Propuestas de Tesis
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Revisión y aprobación de temas de tesis propuestos
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined" elevation={0}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#F4F6F8' }}>
                                <TableRow>
                                    <TableCell><strong>Estudiante</strong></TableCell>
                                    <TableCell><strong>Tema Propuesto</strong></TableCell>
                                    <TableCell><strong>Fecha Envío</strong></TableCell>
                                    <TableCell align="center"><strong>Estado</strong></TableCell>
                                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {proposals.map((proposal) => (
                                    <TableRow key={proposal.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2">{proposal.studentName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{proposal.studentId}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {proposal.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{proposal.submissionDate}</TableCell>
                                        <TableCell align="center">
                                            {getStatusChip(proposal.status)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => {
                                                    // Navegar al detalle (no implementado en esta iteración completa, pero preparado)
                                                    console.log("Ver propuesta", proposal.id);
                                                    // navigate(`/coordinador/proposals/${proposal.id}`); 
                                                }}
                                            >
                                                Revisar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {proposals.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                            No hay propuestas registradas
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CoordinadorProposals;
