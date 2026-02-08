import React, { useState } from 'react';
import { Box, Grid, Chip, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import ButtonMui from '../../components/button.mui.component';
import TableMui from '../../components/table.mui.component';
import TooltipMui from '../../components/tooltip.mui.component';
import SearchBar from '../../components/SearchBar.component';
import TextMui from '../../components/text.mui.component';
import StatsCard from '../../components/common/StatsCard';

function ProposalReview() {
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
        navigate(`/director/proposals/detail/${student.id}`);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Revisión de Propuestas de Tesis" variant="h4" />
                <TextMui value="Gestión y aprobación de propuestas de titulación" variant="body1" />
            </Box>

            {/* Dashboard Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <TooltipMui title="Filtrar pendientes" placement="top">
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
                    </TooltipMui>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TooltipMui title="Filtrar revisados" placement="top">
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
                    </TooltipMui>
                </Grid>
            </Grid>

            {/* Filtros y Tabla */}
            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante..."
                title="Buscar Propuestas"
            />
            <Card>
                <CardContent>
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
                </CardContent>
            </Card>
        </Box>
    );
}

export default ProposalReview;
