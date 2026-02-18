import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Chip,
    Avatar,
    InputAdornment,
    TextField,
    IconButton,
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DocenteService } from '../../services/docente.service';
import { ActivityService } from '../../services/activity.service';

const Grades = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCell, setEditingCell] = useState(null); // { studentId, weekIndex, evidenceId }
    const [editValue, setEditValue] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const data = await DocenteService.getAssignedStudentsGrades();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching grades:", error);
            setSnackbar({ open: true, message: 'Error al cargar las calificaciones', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (studentId, weekIndex, evidenceId, currentGrade) => {
        setEditingCell({ studentId, weekIndex, evidenceId });
        setEditValue(currentGrade !== null ? currentGrade : '');
    };

    const handleSave = async (studentId, weekIndex) => {
        if (!editingCell?.evidenceId) {
            setEditingCell(null);
            return;
        }

        const evidenceId = editingCell.evidenceId;

        const gradeValue = editValue === '' ? null : parseFloat(editValue);

        if (gradeValue !== null && (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 10)) {
            setSnackbar({ open: true, message: 'La nota debe ser un número entre 0 y 10', severity: 'error' });
            return;
        }

        try {
            await ActivityService.gradeEvidenciaDocente(evidenceId, {
                calificacion: gradeValue,
                feedback: 'Calificación actualizada desde el panel de notas (Docente)'
            });

            // Actualizar estado local
            const newStudents = [...students];
            const updatedStudentIndex = newStudents.findIndex(s => s.studentId === studentId);
            const updatedStudent = { ...newStudents[updatedStudentIndex] };

            // Clonar notas y buscar la evidencia específica
            const newNotas = [...updatedStudent.notas];
            const weekNotas = { ...newNotas[weekIndex] };

            if (weekNotas.evidences) {
                weekNotas.evidences = weekNotas.evidences.map(ev =>
                    ev.id === evidenceId ? { ...ev, grade: gradeValue } : ev
                );
                // Actualizar el grade principal (por si se usa en algun lado)
                weekNotas.grade = weekNotas.evidences[0].grade;
            } else {
                weekNotas.grade = gradeValue;
            }

            newNotas[weekIndex] = weekNotas;
            updatedStudent.notas = newNotas;

            // Recalcular promedio basado en todas las evidencias
            const allEvidences = updatedStudent.notas.flatMap(n => n.evidences || (n.grade !== null ? [{ grade: n.grade }] : []));
            const validGrades = allEvidences.filter(e => e.grade !== null).map(e => e.grade);

            const sum = validGrades.reduce((a, b) => a + b, 0);
            updatedStudent.promedio = validGrades.length > 0 ? parseFloat((sum / validGrades.length).toFixed(2)) : 0;

            newStudents[updatedStudentIndex] = updatedStudent;
            setStudents(newStudents);
            setSnackbar({ open: true, message: 'Nota actualizada correctamente', severity: 'success' });
        } catch (error) {
            console.error("Error saving grade:", error);
            setSnackbar({ open: true, message: 'Error al guardar la nota', severity: 'error' });
        } finally {
            setEditingCell(null);
        }
    };

    const filteredStudents = students.filter(s =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.cedula.includes(searchTerm)
    );

    const getGradeColor = (grade) => {
        if (grade === null) return 'text.disabled';
        if (grade >= 7) return 'success.main';
        return 'error.main';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Control de Calificaciones
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Registro semanal de avances (60%) y promedio final de docencia.
                    </Typography>
                </Box>
                <TextField
                    placeholder="Buscar estudiante..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300 }}
                />
            </Box>

            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                {loading && <LinearProgress />}
                <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Box} sx={{ maxHeight: '70vh' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', minWidth: 200, zIndex: 10 }}>Estudiante</TableCell>
                                    {[...Array(16)].map((_, i) => (
                                        <TableCell key={i} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', minWidth: 60 }}>
                                            S{i + 1}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#fff4e5', minWidth: 100, zIndex: 10 }}>
                                        Promedio
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((row) => (
                                        <TableRow key={row.studentId} hover>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: '#000A9B' }}>
                                                    {row.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {row.studentName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {row.cedula}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            {row.notas.map((notaObj, idx) => (
                                                <TableCell
                                                    key={idx}
                                                    align="center"
                                                    sx={{
                                                        p: 0.5,
                                                        minWidth: 80,
                                                        borderRight: '1px solid #f0f0f0'
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        {notaObj.evidences && notaObj.evidences.length > 0 ? (
                                                            notaObj.evidences.map((ev) => (
                                                                <Box
                                                                    key={ev.id}
                                                                    onClick={() => handleEditClick(row.studentId, idx, ev.id, ev.grade)}
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        p: 0.5,
                                                                        borderRadius: 1,
                                                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    {editingCell?.evidenceId === ev.id ? (
                                                                        <TextField
                                                                            autoFocus
                                                                            size="small"
                                                                            value={editValue}
                                                                            onChange={(e) => setEditValue(e.target.value)}
                                                                            onBlur={() => handleSave(row.studentId, idx)}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleSave(row.studentId, idx)}
                                                                            sx={{ width: 45, '& .MuiInputBase-input': { p: 0.2, textAlign: 'center', fontSize: '0.75rem' } }}
                                                                        />
                                                                    ) : (
                                                                        <Tooltip title={`${ev.activityName || 'Actividad'}`}>
                                                                            <Typography
                                                                                variant="caption"
                                                                                fontWeight="600"
                                                                                sx={{
                                                                                    color: getGradeColor(ev.grade),
                                                                                    fontSize: '0.75rem',
                                                                                    display: 'block'
                                                                                }}
                                                                            >
                                                                                {ev.grade !== null ? ev.grade : 'N/C'}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    )}
                                                                </Box>
                                                            ))
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            ))}
                                            <TableCell align="center" sx={{ backgroundColor: '#fffaf0' }}>
                                                <Chip
                                                    label={Number(row.promedio).toFixed(2)}
                                                    size="small"
                                                    color={row.promedio >= 7 ? "success" : "error"}
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={18} align="center" sx={{ py: 8 }}>
                                            <Typography color="text.secondary">
                                                {loading ? "Cargando datos..." : "No se encontraron estudiantes"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="caption">Aprobado (&gt;= 7.0)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
                    <Typography variant="caption">Reprobado (&lt; 7.0)</Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>

                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Grades;
