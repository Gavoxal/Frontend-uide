import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Divider
} from '@mui/material';
import {
    EventNote as EventNoteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    VideoCall as VideoCallIcon,
    MeetingRoom as MeetingRoomIcon
} from '@mui/icons-material';
import MeetingCard from '../../components/meetingcard.mui.component';
import SearchBar from '../../components/SearchBar.component';
import StatsCard from '../../components/common/StatsCard';

// Mock data de tutores
const MOCK_TUTORS = [
    { id: 1, name: "Dr. Fernando Rodríguez" },
    { id: 2, name: "Ing. María González" },
    { id: 3, name: "MSc. Carlos Pérez" }
];

// Mock data de estudiantes
const MOCK_STUDENTS = [
    { id: 1, name: "Juan Pérez" },
    { id: 2, name: "María García" },
    { id: 3, name: "Carlos López" },
    { id: 4, name: "Ana Martínez" },
    { id: 5, name: "Luis Rodríguez" },
    { id: 6, name: "Sofia Hernández" }
];

// Mock data de reuniones con información de tutores
const MOCK_MEETINGS = [
    {
        id: 1,
        studentName: "Juan Pérez",
        studentId: 1,
        tutorName: "Dr. Fernando Rodríguez",
        tutorId: 1,
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
        tutorName: "Dr. Fernando Rodríguez",
        tutorId: 1,
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
        tutorName: "Ing. María González",
        tutorId: 2,
        date: "2026-01-20",
        startTime: "16:00",
        endTime: "17:00",
        modality: "presencial",
        summary: "Carlos no asistió a la reunión programada. Se le envió recordatorio por correo.",
        commitments: [],
        attended: false
    },
    {
        id: 4,
        studentName: "Ana Martínez",
        studentId: 4,
        tutorName: "Ing. María González",
        tutorId: 2,
        date: "2026-01-22",
        startTime: "15:00",
        endTime: "16:30",
        modality: "virtual",
        summary: "Revisión del diseño de base de datos. Ana presentó el modelo ER y discutimos normalización y optimización de consultas.",
        commitments: [
            "Normalizar tablas a 3FN",
            "Crear índices para consultas frecuentes",
            "Documentar esquema"
        ],
        attended: true
    },
    {
        id: 5,
        studentName: "Luis Rodríguez",
        studentId: 5,
        tutorName: "MSc. Carlos Pérez",
        tutorId: 3,
        date: "2026-01-25",
        startTime: "09:00",
        endTime: "10:00",
        modality: "presencial",
        summary: "Revisión de avances en el módulo de reportes. Luis implementó generación de PDFs con gráficos estadísticos.",
        commitments: [
            "Agregar filtros de fecha",
            "Implementar exportación a Excel",
            "Mejorar diseño de gráficos"
        ],
        attended: true
    }
];

function MeetingHistory() {
    const [meetings] = useState(MOCK_MEETINGS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        tutorId: '',
        studentId: '',
        modality: '',
        attended: ''
    });

    // Calculate statistics
    const stats = {
        total: meetings.length,
        attended: meetings.filter(m => m.attended).length,
        notAttended: meetings.filter(m => !m.attended).length,
        presencial: meetings.filter(m => m.modality === 'presencial').length,
        virtual: meetings.filter(m => m.modality === 'virtual').length
    };

    const attendanceRate = stats.total > 0
        ? ((stats.attended / stats.total) * 100).toFixed(1)
        : 0;

    // Filter meetings
    const filteredMeetings = meetings.filter(meeting => {
        const matchesSearch =
            meeting.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meeting.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meeting.summary.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTutor = !filters.tutorId || meeting.tutorId === filters.tutorId;
        const matchesStudent = !filters.studentId || meeting.studentId === filters.studentId;
        const matchesModality = !filters.modality || meeting.modality === filters.modality;
        const matchesAttended = filters.attended === '' ||
            meeting.attended === (filters.attended === 'true');

        return matchesSearch && matchesTutor && matchesStudent && matchesModality && matchesAttended;
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleViewMeeting = (meeting) => {

    };

    const handleExportPdf = (meeting) => {

        alert('Generando PDF de la reunión...');
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Historial de Reuniones 📋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitoreo de sesiones de tutoría registradas
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Total Reuniones"
                        value={stats.total}
                        icon={<EventNoteIcon fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Asistencia"
                        value={`${attendanceRate}%`}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Presenciales"
                        value={stats.presencial}
                        icon={<MeetingRoomIcon fontSize="large" />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Virtuales"
                        value={stats.virtual}
                        icon={<VideoCallIcon fontSize="large" />}
                        color="secondary"
                    />
                </Grid>
            </Grid>

            {/* Filters and Search */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Filtros de Búsqueda
                    </Typography>

                    {/* Search Bar Section */}
                    <Box sx={{ mb: 3 }}>
                        <SearchBar
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por tutor, estudiante o contenido..."
                        />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Filters Grid */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="tutor-label">Tutor</InputLabel>
                                <Select
                                    labelId="tutor-label"
                                    value={filters.tutorId}
                                    label="Tutor"
                                    onChange={(e) => handleFilterChange('tutorId', e.target.value)}
                                    sx={{ minHeight: 56 }}
                                >
                                    <MenuItem value="">
                                        <em>Todos</em>
                                    </MenuItem>
                                    {MOCK_TUTORS.map((tutor) => (
                                        <MenuItem key={tutor.id} value={tutor.id}>
                                            {tutor.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="student-label">Estudiante</InputLabel>
                                <Select
                                    labelId="student-label"
                                    value={filters.studentId}
                                    label="Estudiante"
                                    onChange={(e) => handleFilterChange('studentId', e.target.value)}
                                    sx={{ minHeight: 56 }}
                                >
                                    <MenuItem value="">
                                        <em>Todos</em>
                                    </MenuItem>
                                    {MOCK_STUDENTS.map((student) => (
                                        <MenuItem key={student.id} value={student.id}>
                                            {student.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="modality-label">Modalidad</InputLabel>
                                <Select
                                    labelId="modality-label"
                                    value={filters.modality}
                                    label="Modalidad"
                                    onChange={(e) => handleFilterChange('modality', e.target.value)}
                                    sx={{ minHeight: 56 }}
                                >
                                    <MenuItem value="">
                                        <em>Todas</em>
                                    </MenuItem>
                                    <MenuItem value="presencial">Presencial</MenuItem>
                                    <MenuItem value="virtual">Virtual</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="attendance-label">Asistencia</InputLabel>
                                <Select
                                    labelId="attendance-label"
                                    value={filters.attended}
                                    label="Asistencia"
                                    onChange={(e) => handleFilterChange('attended', e.target.value)}
                                    sx={{ minHeight: 56 }}
                                >
                                    <MenuItem value="">
                                        <em>Todas</em>
                                    </MenuItem>
                                    <MenuItem value="true">Asistió</MenuItem>
                                    <MenuItem value="false">No asistió</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Meeting List */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Reuniones Registradas
                    </Typography>
                    <Chip
                        label={`${filteredMeetings.length} de ${meetings.length} reuniones`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                {filteredMeetings.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                            No se encontraron reuniones con los filtros aplicados
                        </Typography>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredMeetings.map((meeting) => (
                            <MeetingCard
                                key={meeting.id}
                                meeting={meeting}
                                onView={handleViewMeeting}
                                onExportPdf={handleExportPdf}
                                readOnly={true}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default MeetingHistory;
