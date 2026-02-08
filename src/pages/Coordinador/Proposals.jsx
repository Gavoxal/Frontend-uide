<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SearchIcon from '@mui/icons-material/Search';

import ButtonMui from '../../components/button.mui.component';
import TableMui from '../../components/table.mui.component';
import TextMui from '../../components/text.mui.component';
import StatsCard from '../../components/common/StatsCard';
import InputMui from '../../components/input.mui.component';

function CoordinatorProposals() {
    const navigate = useNavigate();

    // Headers actualizados según requerimiento
    const headers = ['Estudiante', 'Malla', 'Período Lectivo', 'Fecha Envío', 'Propuestas', 'Estado'];
    const periodo = "SEM LOJA OCT 2025 – FEB 2026";

    // Mock Data con estados variados para demos
    const [students, setStudents] = useState([
        {
            id: 1,
            student: 'Ana Torres',
            malla: 'ITIL_MALLA 2019',
            period: periodo,
            date: '2025-01-28',
            count: '3/3',
            status: 'Pendiente'
        },
        {
            id: 2,
            student: 'Luis Gomez',
            malla: 'SINL_MALLA 2023',
            period: periodo,
            date: '2025-01-29',
            count: '3/3',
            status: 'Revisado' // Mocking one reviewed
        },
        {
            id: 3,
            student: 'Carla Diaz',
            malla: 'ITIL_MALLA 2023',
            period: periodo,
            date: '2025-01-30',
            count: '3/3',
            status: 'Pendiente'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Lógica de Filtrado
    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.student.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === "pending") return matchesSearch && student.status === 'Pendiente';
        if (filterStatus === "reviewed") return matchesSearch && student.status === 'Revisado';
        return matchesSearch;
    });

    // Estadísticas
    const stats = {
        pending: students.filter(s => s.status === 'Pendiente').length,
        reviewed: students.filter(s => s.status === 'Revisado').length
    };

    const handleReview = (student) => {
        navigate(`/coordinador/proposals/detail/${student.id}`);
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
    };

    return (
        <Box>
<<<<<<< HEAD
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
=======
            <Box sx={{ mb: 4 }}>
                <TextMui value="Revisión de Propuestas de Tesis" variant="h4" />
                <TextMui value="Gestión y aprobación de propuestas de titulación (Vista Coordinador)" variant="body1" />
            </Box>

            {/* Dashboard Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Filtrar pendientes" placement="top">
                        <Box
                            onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterStatus === 'reviewed' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterStatus === 'pending' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Pendientes de Revisión"
                                value={stats.pending}
                                icon={<HourglassEmptyIcon fontSize="large" />}
                                color="warning"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Filtrar revisados" placement="top">
                        <Box
                            onClick={() => setFilterStatus(filterStatus === 'reviewed' ? 'all' : 'reviewed')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterStatus === 'pending' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterStatus === 'reviewed' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Propuestas Revisadas"
                                value={stats.reviewed}
                                icon={<CheckCircleIcon fontSize="large" />}
                                color="success"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>

            {/* Filtros y Tabla */}
            <Card>
                <CardContent>
                    <Box sx={{ mb: 3 }}>
                        <InputMui
                            placeholder="Buscar por nombre de estudiante..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<SearchIcon color="action" />}
                        />
                    </Box>

                    <TableMui
                        headers={headers}
                        data={filteredStudents.map(({ id, ...rest }) => rest)}
                        actions={(row, index) => {
                            // Recover original student object from filteredStudents using index
                            // NOTE: index matches filteredStudents array, so safe to use filteredStudents[index]
                            const originalStudent = filteredStudents[index];
                            return (
                                <Box sx={{ minWidth: 120 }}>
                                    <ButtonMui
                                        name={originalStudent.status === 'Revisado' ? "Ver Detalle" : "Revisar"}
                                        onClick={() => handleReview(originalStudent)}
                                        startIcon={originalStudent.status === 'Revisado' ? <CheckCircleIcon /> : <AssignmentIcon />}
                                        backgroundColor={originalStudent.status === 'Revisado' ? "#2e7d32" : "#1976d2"}
                                    />
                                </Box>
                            );
                        }}
                    />
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                </CardContent>
            </Card>
        </Box>
    );
}

<<<<<<< HEAD
export default CoordinadorProposals;
=======
export default CoordinatorProposals;
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
