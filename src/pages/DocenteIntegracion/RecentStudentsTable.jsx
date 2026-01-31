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
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RecentStudentsTable({ students }) {
    const navigate = useNavigate();

    return (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, bgcolor: '#E0E0E0' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography fontWeight="bold">Estudiantes</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">ID</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Tema</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Fecha</Typography></TableCell>
                            <TableCell align="right"><Typography fontWeight="bold">Action</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </Box>

            <Table sx={{ minWidth: 650 }}>
                <TableBody>
                    {students.map((student) => (
                        <TableRow
                            key={student.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#880E4F' }}>{student.name.charAt(0)}</Avatar>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            {student.name.split(' ')[0]}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {student.name.split(' ').slice(1).join(' ')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>{student.cedula}</TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                                    {student.tema}
                                </Typography>
                            </TableCell>
                            <TableCell>{student.fecha}</TableCell>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        bgcolor: '#000A9B',
                                        textTransform: 'none',
                                        borderRadius: 1
                                    }}
                                    onClick={() => navigate(`/docente-integracion/review/${student.weekId}/${student.id}`)}
                                >
                                    Revisar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RecentStudentsTable;
