import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Button,
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RecentStudentsTable({ evidences }) {
    const navigate = useNavigate();

    const getStatusChip = (status) => {
        const config = {
            aprobado: { label: 'Aprobado', color: 'success' },
            rechazado: { label: 'Rechazado', color: 'error' },
            pendiente: { label: 'Pendiente', color: 'warning' },
            pending: { label: 'Pendiente', color: 'warning' }
        };
        const current = config[status?.toLowerCase()] || config.pendiente;
        return <Chip label={current.label} color={current.color} size="small" variant="outlined" />;
    };

    return (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell><Typography fontWeight="bold">Estudiante</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">Título del Proyecto</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">Semana</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">Estado</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="bold">Acción</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {evidences.map((ev) => {
                        const student = ev.actividad?.propuesta?.estudiante;
                        const studentName = student ? `${student.nombres} ${student.apellidos}` : 'Desconocido';
                        const projectTitle = ev.actividad?.propuesta?.titulo || 'Sin título';

                        return (
                            <TableRow
                                key={ev.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#fafafa' } }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#000A9B', fontSize: '14px' }}>
                                            {student ? student.nombres.charAt(0) : '?'}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight="500">
                                            {studentName}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ maxWidth: 250 }} noWrap>
                                        {projectTitle}
                                    </Typography>
                                </TableCell>
                                <TableCell>Semana {ev.semana}</TableCell>
                                <TableCell>{getStatusChip(ev.estadoRevisionDocente)}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            color: '#000A9B',
                                            borderColor: '#000A9B',
                                            textTransform: 'none',
                                            borderRadius: '20px'
                                        }}
                                        onClick={() => navigate(`/docente-integracion/review/0/${ev.id}`)}
                                    >
                                        Revisar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RecentStudentsTable;
