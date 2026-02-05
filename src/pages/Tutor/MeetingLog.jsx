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
    Chip,
    Paper,
    List,
    ListItem
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';
import MeetingCard from '../../components/meetingcard.mui.component';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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

    const handleSubmit = () => {
        console.log('Reunión registrada:', formData);
        alert('Reunión registrada correctamente en la bitácora');

        // Reset form
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

    const handleViewMeeting = (meeting) => {
        console.log('Ver detalles:', meeting);
    };

    const handleEditMeeting = (meeting) => {
        console.log('Editar:', meeting);
        // Cargar datos en el formulario
    };

    const handleExportPdf = (meeting) => {
        console.log('Exportar PDF:', meeting);
        alert('Generando PDF de la reunión...');
    };

    const getStudentName = (id) => {
        const student = MOCK_STUDENTS.find(s => s.id === id);
        return student ? student.name : '';
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Encabezado */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Bitácora de Reuniones 📝
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Registro formal de sesiones de tutoría
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Formulario de registro */}
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Registrar Nueva Reunión
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Documenta la sesión de tutoría para constancia legal
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
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            onClick={() => {
                                                // Reset form
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
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={handleSubmit}
                                            disabled={!formData.studentId || !formData.summary}
                                            sx={{
                                                backgroundColor: '#667eea',
                                                '&:hover': {
                                                    backgroundColor: '#5568d3'
                                                }
                                            }}
                                        >
                                            Registrar Reunión
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Historial de reuniones */}
                    <Grid item xs={12} lg={6}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Historial de Reuniones
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {meetings.length} reunión(es) registrada(s)
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {meetings.map((meeting) => (
                                    <MeetingCard
                                        key={meeting.id}
                                        meeting={meeting}
                                        onView={handleViewMeeting}
                                        onEdit={handleEditMeeting}
                                        onExportPdf={handleExportPdf}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
}

export default MeetingLog;
