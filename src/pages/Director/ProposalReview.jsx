import React, { useState, useEffect } from 'react';
import { Box, Grid, Chip, Card, CardContent, CircularProgress } from '@mui/material';
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

import { ProposalService } from '../../services/proposal.service';

function ProposalReview() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [proposals, setProposals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Headers actualizados para vista agrupada
    const headers = ['Estudiante', 'Malla', 'Período', 'Propuestas', 'Estado'];

    useEffect(() => {
        loadProposals();
    }, []);

    const loadProposals = async () => {
        setLoading(true);
        try {
            const data = await ProposalService.getAll();
            console.log("ProposalReview data received:", data);

            if (!data || data.length === 0) {
                console.warn("No data received from ProposalService.getAll()");
                setProposals([]);
                return;
            }

            // Agrupar por estudiante de forma robusta
            const grouped = data.reduce((acc, curr) => {
                const student = curr.estudiante;
                // Intentar obtener una clave única del estudiante: ID, Cédula o Nombre completo
                const studentKey = curr.fkEstudiante || student?.id || student?.cedula || (student ? `${student.nombres} ${student.apellidos}` : null) || `temp-${curr.id}`;

                if (!acc[studentKey]) {
                    const perfil = student?.estudiantePerfil;
                    // El ID preferido para navegación es el del estudiante, fallback al de la propuesta
                    const navId = curr.fkEstudiante || student?.id || curr.id;

                    acc[studentKey] = {
                        studentId: navId,
                        studentObj: student || {
                            id: navId,
                            nombres: 'Estudiante',
                            apellidos: !student ? `(Propuesta ${curr.id})` : '',
                            cedula: student?.cedula || 'N/A'
                        },
                        malla: curr.malla || perfil?.malla || 'N/A',
                        period: perfil?.periodoLectivo || '-',
                        proposals: []
                    };
                }
                acc[studentKey].proposals.push(curr);
                return acc;
            }, {});

            console.log("Grouped proposals:", grouped);

            const formatted = Object.values(grouped).map(group => {
                const totalProposals = group.proposals.length;
                // Determine overall status
                const hasApproved = group.proposals.some(p => p.estado === 'APROBADA');
                const hasRejected = group.proposals.some(p => p.estado === 'RECHAZADA');

                // Map specific status for display
                const displayStatus = group.proposals.every(p => p.estado === 'PENDIENTE') ? 'Pendiente' :
                    hasApproved ? 'Finalizado' : 'En Revisión';

                return {
                    id: group.studentObj.id || group.studentId, // ID para navegación
                    student: `${group.studentObj.nombres} ${group.studentObj.apellidos}`,
                    malla: group.malla,
                    period: group.period,
                    // Lista de títulos para mostrar en la tabla
                    propuestas: (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {group.proposals.map((p, idx) => (
                                <Box key={p.id} sx={{ fontSize: '0.8rem', borderLeft: '2px solid #ccc', pl: 1 }}>
                                    {idx + 1}. {p.titulo}
                                </Box>
                            ))}
                            <Chip
                                label={`${totalProposals}/3 Enviadas`}
                                size="small"
                                color={totalProposals === 3 ? "success" : "warning"}
                                variant="outlined"
                                sx={{ mt: 1, width: 'fit-content' }}
                            />
                        </Box>
                    ),
                    status: displayStatus
                };
            });

            setProposals(formatted);
        } catch (error) {
            console.error("Error loading proposals", error);
        } finally {
            setLoading(false);
        }
    };

    const mapStatus = (status) => {
        // No longer used directly in row, but logic moved to grouping
        return status;
    };

    // Lógica de Filtrado
    const filteredProposals = proposals.filter((p) => {
        const studentName = p.student.toLowerCase();
        const matchesSearch = studentName.includes(searchTerm.toLowerCase());

        if (filterStatus === "pending") return matchesSearch && p.status === 'Pendiente';
        if (filterStatus === "reviewed") return matchesSearch && p.status !== 'Pendiente';
        return matchesSearch;
    });

    // Estadísticas
    const stats = {
        pending: proposals.filter(p => p.status === 'Pendiente').length,
        reviewed: proposals.filter(p => p.status !== 'Pendiente').length
    };

    const handleReview = (proposal) => {
        navigate(`/director/proposals/detail/${proposal.id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Revisión de Propuestas de Tesis" variant="h4" />
                <TextMui value="Gestión y aprobación de propuestas de titulación" variant="body1" />
            </Box>

            {/* Dashboard Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
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
                placeholder="Buscar por estudiante o título..."
                title="Buscar Propuestas"
            />
            <Card>
                <CardContent>
                    <TableMui
                        headers={headers}
                        data={filteredProposals.map(({ id, ...rest }) => rest)}
                        actions={(row, index) => {
                            const original = filteredProposals[index];
                            return (
                                <Box sx={{ minWidth: 120 }}>
                                    <ButtonMui
                                        name={original.status !== 'Pendiente' ? "Ver Detalle" : "Revisar"}
                                        onClick={() => handleReview(original)}
                                        startIcon={original.status !== 'Pendiente' ? <CheckCircleIcon /> : <AssignmentIcon />}
                                        backgroundColor={original.status !== 'Pendiente' ? "#2e7d32" : "#1976d2"}
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
