import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Checkbox,
    IconButton,
    Paper,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Tooltip
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Mock data de estudiantes
const MOCK_STUDENTS = [
    { id: 1, name: "Juan Pérez" },
    { id: 2, name: "María García" },
    { id: 3, name: "Carlos López" },
    { id: 4, name: "Ana Martínez" },
    { id: 5, name: "Luis Rodríguez" },
    { id: 6, name: "Sofia Hernández" }
];

// Mock data de reuniones anteriores
const MOCK_MEETINGS = [
    {
        id: 1,
        studentName: "Juan Pérez",
        studentId: 1,
        date: "2026-01-27",
        startTime: "14:00",
        endTime: "15:00",
        modality: "presencial",
        summary: "Revisamos los avances en la implementación de sensores IoT. Juan presentó el código de lectura de datos y discutimos optimizaciones para el consumo de energía. Acordamos implementar modo sleep para los sensores.",
        commitments: [
            "Implementar modo sleep en sensores",
            "Crear dashboard de visualización",
            "Documentar API REST"
        ],
        attended: true
    },
    {
        id: 2,
        studentName: "María García",
        studentId: 2,
        date: "2026-01-24",
        startTime: "10:00",
        endTime: "11:00",
        modality: "virtual",
        summary: "Sesión virtual para revisar el módulo de autenticación. María mostró la implementación de JWT y refresh tokens. Revisamos consideraciones de seguridad y mejores prácticas.",
        commitments: [
            "Agregar rate limiting",
            "Implementar blacklist de tokens",
            "Tests de integración"
        ],
        attended: true
    },
    {
        id: 3,
        studentName: "Carlos López",
        studentId: 3,
        date: "2026-01-20",
        startTime: "16:00",
        endTime: "17:00",
        modality: "presencial",
        summary: "Carlos no asistió a la reunión programada. Se le envió recordatorio por correo.",
        commitments: [],
        attended: false
    }
];

function MeetingLog() {
    const [view, setView] = useState('history'); // 'history' | 'create'
    const [meetings] = useState(MOCK_MEETINGS);
    const [formData, setFormData] = useState({
        studentId: '',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        modality: 'presencial',
        summary: '',
        commitments: [''],
        attended: true
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddCommitment = () => {
        setFormData(prev => ({
            ...prev,
            commitments: [...prev.commitments, '']
        }));
    };

    const handleCommitmentChange = (index, value) => {
        const newCommitments = [...formData.commitments];
        newCommitments[index] = value;
        setFormData(prev => ({
            ...prev,
            commitments: newCommitments
        }));
    };

    const handleRemoveCommitment = (index) => {
        const newCommitments = formData.commitments.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            commitments: newCommitments
        }));
    };

    const resetForm = () => {
        setFormData({
            studentId: '',
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            modality: 'presencial',
            summary: '',
            commitments: [''],
            attended: true
        });
    };

    const handleSubmit = () => {
        console.log('Reunión registrada:', formData);
        alert('Reunión registrada correctamente en la bitácora');
        resetForm();
        setView('history');
    };

    const handleViewMeeting = (meeting) => {
        console.log('Ver detalles:', meeting);
    };

    const handleEditMeeting = (meeting) => {
        console.log('Editar:', meeting);
        // Aquí podrías cargar los datos y cambiar a view='create'
    };

    const handleExportPdf = (meeting) => {
        console.log('Exportar PDF:', meeting);
        alert('Generando PDF de la reunión...');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Encabezado con Botón de Acción */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Bitácora de Reuniones 📝
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {view === 'history'
                                ? 'Historial y registro de sesiones de tutoría'
                                : 'Registrar nueva sesión de tutoría'}
                        </Typography>
                    </Box>

                    {view === 'history' ? (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setView('create')}
                            sx={{
                                backgroundColor: '#667eea',
                                fontWeight: 600,
                                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                '&:hover': { backgroundColor: '#5a6fd6' }
                            }}
                        >
                            Registrar Reunión
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setView('history')}
                            sx={{ fontWeight: 600 }}
                        >
                            Volver al Historial
                        </Button>
                    )}
                </Box>

                {/* Vista: Formulario de Registro */}
                {view === 'create' && (
                    <Card sx={{ borderRadius: 3, boxShadow: 2, maxWidth: 800, mx: 'auto' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Nueva Reunión
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Completa los detalles de la sesión para dejar constancia legal.
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Seleccionar estudiante */}
                                <FormControl fullWidth>
                                    <InputLabel>Estudiante</InputLabel>
                                    <Select
                                        value={formData.studentId}
                                        label="Estudiante"
                                        onChange={(e) => handleChange('studentId', e.target.value)}
                                    >
                                        {MOCK_STUDENTS.map((student) => (
                                            <MenuItem key={student.id} value={student.id}>
                                                {student.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Fecha */}
                                <DatePicker
                                    label="Fecha de la Reunión"
                                    value={formData.date}
                                    onChange={(newValue) => handleChange('date', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />

                                {/* Horario */}
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TimePicker
                                        label="Hora de Inicio"
                                        value={formData.startTime}
                                        onChange={(newValue) => handleChange('startTime', newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                    <TimePicker
                                        label="Hora de Fin"
                                        value={formData.endTime}
                                        onChange={(newValue) => handleChange('endTime', newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Box>

                                {/* Modalidad */}
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Modalidad</FormLabel>
                                    <RadioGroup
                                        row
                                        value={formData.modality}
                                        onChange={(e) => handleChange('modality', e.target.value)}
                                    >
                                        <FormControlLabel value="presencial" control={<Radio />} label="Presencial" />
                                        <FormControlLabel value="virtual" control={<Radio />} label="Virtual" />
                                    </RadioGroup>
                                </FormControl>

                                {/* Resumen */}
                                <TextField
                                    fullWidth
                                    label="Resumen de la Reunión"
                                    placeholder="Temas tratados, dudas resueltas, avances discutidos..."
                                    multiline
                                    rows={4}
                                    value={formData.summary}
                                    onChange={(e) => handleChange('summary', e.target.value)}
                                />

                                {/* Compromisos */}
                                <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600">
                                            Compromisos para la Siguiente Sesión
                                        </Typography>
                                        <Button
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddCommitment}
                                        >
                                            Agregar
                                        </Button>
                                    </Box>

                                    <List sx={{ p: 0 }}>
                                        {formData.commitments.map((commitment, index) => (
                                            <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                                <TextField
                                                    fullWidth
                                                    placeholder={`Compromiso ${index + 1}`}
                                                    value={commitment}
                                                    onChange={(e) => handleCommitmentChange(index, e.target.value)}
                                                    size="small"
                                                />
                                                {formData.commitments.length > 1 && (
                                                    <IconButton
                                                        onClick={() => handleRemoveCommitment(index)}
                                                        size="small"
                                                        color="error"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>

                                {/* Asistencia */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.attended}
                                            onChange={(e) => handleChange('attended', e.target.checked)}
                                        />
                                    }
                                    label="Estudiante asistió a la reunión"
                                />

                                {/* Botones */}
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            resetForm();
                                            setView('history');
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={!formData.studentId || !formData.summary}
                                        sx={{
                                            backgroundColor: '#667eea',
                                            '&:hover': { backgroundColor: '#5568d3' },
                                            px: 4
                                        }}
                                    >
                                        Registrar Reunión
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Vista: Historial de Reuniones */}
                {view === 'history' && (
                    <Box>
                        {meetings.length === 0 ? (
                            <Paper sx={{ p: 5, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                                <Typography color="text.secondary">
                                    No hay reuniones registradas. Comienza registrando una nueva.
                                </Typography>
                            </Paper>
                        ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="tabla de reuniones">
                                    <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Estudiante</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha y Hora</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Modalidad</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Resumen</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Compromisos</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Asistencia</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {meetings.map((meeting) => (
                                            <TableRow
                                                key={meeting.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Typography variant="subtitle2" fontWeight="600">
                                                        {meeting.studentName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {meeting.date}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {meeting.startTime} - {meeting.endTime}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={meeting.modality}
                                                        size="small"
                                                        color={meeting.modality === 'presencial' ? 'primary' : 'secondary'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 300 }}>
                                                    <Typography variant="body2" sx={{
                                                        display: '-webkit-box',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2
                                                    }}>
                                                        {meeting.summary}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 250 }}>
                                                    {meeting.commitments.length > 0 ? (
                                                        <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem' }}>
                                                            {meeting.commitments.slice(0, 2).map((commitment, idx) => (
                                                                <li key={idx}>{commitment}</li>
                                                            ))}
                                                            {meeting.commitments.length > 2 && (
                                                                <li>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        +{meeting.commitments.length - 2} más...
                                                                    </Typography>
                                                                </li>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Sin compromisos
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={meeting.attended ? 'Asistió' : 'No asistió'}
                                                        size="small"
                                                        color={meeting.attended ? 'success' : 'error'}
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                        <Tooltip title="Ver Detalles">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleViewMeeting(meeting)}
                                                                sx={{ color: '#667eea' }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Generar PDF">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleExportPdf(meeting)}
                                                                color="error"
                                                            >
                                                                <PictureAsPdfIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );

}

export default MeetingLog;
