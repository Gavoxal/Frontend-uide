import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tooltip, Avatar, Chip, TextField, InputAdornment, Menu, MenuItem
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';

function SharedProposalList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Determine base path for navigation
    const getBasePath = () => {
        if (location.pathname.includes('docente-integracion')) return '/docente-integracion';
        if (location.pathname.includes('tutor')) return '/tutor';
        if (location.pathname.includes('coordinador')) return '/coordinador';
        if (location.pathname.includes('director')) return '/director';
        return '';
    };

    const basePath = getBasePath();

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const { ProposalService } = await import('../../services/proposal.service');
            const data = await ProposalService.getAll();

            // Map backend data to frontend structure
            // Map backend data to frontend structure
            const mappedProposals = data.map(p => {
                 // Debug log

                // Try to find career in proposal, then in profile (escuela), then N/A
                const career = p.carrera || p.estudiante?.estudiantePerfil?.escuela || "N/A";

                return {
                    id: p.id,
                    student: p.estudiante ? `${p.estudiante.nombres} ${p.estudiante.apellidos}` : "Desconocido",
                    studentId: p.estudiante?.cedula || "N/A",
                    email: p.estudiante?.correoInstitucional || "N/A",
                    title: p.titulo,
                    career: career,
                    date: p.fechaPublicacion ? p.fechaPublicacion.split('T')[0] : (p.createdAt?.split('T')[0] || "N/A"),
                    status: p.estado === 'PENDIENTE' ? 'pending' : 'reviewed',
                    originalStatus: p.estado,
                    pdfUrl: p.archivoUrl || "#",
                };
            });

            setProposals(mappedProposals);
        } catch (error) {
            console.error("Error fetching proposals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleNavigateToReview = (id) => {
        navigate(`${basePath}/proposals/review/${id}`);
    };

    // Filter handlers
    const handleFilterClick = (event) => {
        setAnchorElFilter(event.currentTarget);
    };

    const handleFilterClose = (filter) => {
        if (filter) setStatusFilter(filter);
        setAnchorElFilter(null);
    };

    const filteredProposals = proposals.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.student.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'pending' && p.originalStatus === 'PENDIENTE') ||
            (statusFilter === 'approved' && p.originalStatus === 'APROBADA') ||
            (statusFilter === 'rejected' && p.originalStatus === 'RECHAZADA') ||
            (statusFilter === 'comments' && p.originalStatus === 'APROBADA_CON_COMENTARIOS');

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDIENTE': return 'warning';
            case 'APROBADA': return 'success';
            case 'RECHAZADA': return 'error';
            case 'APROBADA_CON_COMENTARIOS': return 'info';
            case 'REVISADA': return 'info';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDIENTE': return 'Pendiente';
            case 'APROBADA': return 'Aprobada';
            case 'RECHAZADA': return 'Rechazada';
            case 'APROBADA_CON_COMENTARIOS': return 'Con Observaciones';
            case 'REVISADA': return 'Revisada';
            default: return status;
        }
    };

    return (
        <Box sx={{ p: 3, width: '100%', boxSizing: 'border-box' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom >
                        Foro de Propuestas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Revisa y comenta las propuestas de titulación.
                    </Typography>
                </Box>
                <Button
                    startIcon={<RefreshIcon />}
                    size="small"
                    onClick={fetchProposals}
                >
                    Actualizar
                </Button>
            </Box>

            {/* Filters */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar por estudiante, título..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 500 }}
                />
                <Button
                    startIcon={<FilterListIcon />}
                    color="inherit"
                    size="small"
                    onClick={handleFilterClick}
                >
                    Filtros {statusFilter !== 'all' && `(${getStatusLabel(statusFilter === 'comments' ? 'APROBADA_CON_COMENTARIOS' : statusFilter.toUpperCase())})`}
                </Button>
                <Menu
                    anchorEl={anchorElFilter}
                    open={Boolean(anchorElFilter)}
                    onClose={() => handleFilterClose(null)}
                >
                    <MenuItem onClick={() => handleFilterClose('all')}>Todos</MenuItem>
                    <MenuItem onClick={() => handleFilterClose('pending')}>Pendientes</MenuItem>
                    <MenuItem onClick={() => handleFilterClose('approved')}>Aprobadas</MenuItem>
                    <MenuItem onClick={() => handleFilterClose('comments')}>Con Observaciones</MenuItem>
                    <MenuItem onClick={() => handleFilterClose('rejected')}>Rechazadas</MenuItem>
                </Menu>
            </Paper>

            {/* Content */}
            {loading ? (
                <Typography textAlign="center" py={4}>Cargando propuestas...</Typography>
            ) : filteredProposals.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed #e0e0e0' }} elevation={0}>
                    <Typography color="text.secondary">No se encontraron propuestas.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Estudiante / Carrera</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Propuesta</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProposals.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.main', fontSize: '0.875rem' }}>
                                                {row.student.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{row.student}</Typography>
                                                <Typography variant="caption" display="block" color="text.secondary">{row.career}</Typography>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ opacity: 0.8 }}>{row.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 350 }}>
                                        <Tooltip title={row.title}>
                                            <Typography variant="body2" fontWeight="medium" sx={{
                                                display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2
                                            }}>
                                                {row.title}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusLabel(row.originalStatus)}
                                            color={getStatusColor(row.originalStatus)}
                                            size="small"
                                            variant={row.originalStatus === 'PENDIENTE' ? 'filled' : 'outlined'}
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{row.date}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant={row.status === 'pending' ? "contained" : "outlined"}
                                            size="small"
                                            onClick={() => handleNavigateToReview(row.id)}
                                            startIcon={row.status === 'pending' ? <RateReviewIcon /> : <VisibilityIcon />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {row.status === 'pending' ? "Revisar" : "Ver"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default SharedProposalList;
