import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
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
    Tooltip,
    CircularProgress
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { BitacoraService } from '../../services/bitacora.service';
import { TutorService } from '../../services/tutor.service';
import { getDataUser } from '../../storage/user.model';
import AlertMui from '../../components/alert.mui.component';

function MeetingLog() {
    const user = getDataUser();
    const [view, setView] = useState('history'); // 'history' | 'create'
    const [meetings, setMeetings] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Estado para edición
    const [editingMeetingId, setEditingMeetingId] = useState(null);

    // Estado para Alertas
    const [alertConfig, setAlertConfig] = useState({
        open: false,
        title: '',
        message: '',
        status: 'info'
    });

    const [formData, setFormData] = useState({
        studentId: '',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        modality: 'PRESENCIAL',
        motivo: '',
        summary: '',
        commitments: [''],
        attended: false
    });

    // Helper para alertas
    const showAlert = (title, message, status = 'info') => {
        setAlertConfig({ open: true, title, message, status });
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, open: false }));
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsData, meetingsData] = await Promise.all([
                TutorService.getAssignedStudents(),
                BitacoraService.getReuniones()
            ]);
            setStudents(studentsData);
            setMeetings(meetingsData);
        } catch (err) {
            console.error("Error fetching data:", err);
            showAlert("Error", "Error al cargar la información. Por favor intente nuevamente.", "error");
        } finally {
            setLoading(false);
        }
    };

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
            modality: 'PRESENCIAL',
            motivo: '',
            summary: '',
            commitments: [''],
            attended: false
        });
        setEditingMeetingId(null);
    };

    const handlePrepareCreate = () => {
        resetForm();
        setView('create');
    };

    const handleEditMeeting = (meeting) => {
        const fechaObj = new Date(meeting.fecha);
        // Ajuste de zona horaria si fuera necesario, por ahora asumiendo UTC o local correcto

        setFormData({
            studentId: meeting.estudianteId,
            date: fechaObj,
            startTime: new Date(meeting.horaInicio),
            endTime: new Date(meeting.horaFin),
            modality: meeting.modalidad,
            motivo: meeting.motivo,
            summary: meeting.resumen || '',
            commitments: meeting.compromisos && meeting.compromisos.length > 0 ? meeting.compromisos : [''],
            attended: meeting.asistio
        });
        setEditingMeetingId(meeting.id);
        setView('create');
    };

    const handleSubmit = async () => {
        if (!formData.studentId || !formData.motivo) {
            showAlert("Campos Requeridos", "Por favor complete los campos obligatorios (Estudiante y Motivo)", "warning");
            return;
        }

        const selectedStudent = students.find(s => s.id === formData.studentId);
        if (!selectedStudent) {
            showAlert("Error", "Estudiante no válido.", "error");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                estudianteId: formData.studentId,
                propuestaId: selectedStudent.propuesta?.id,
                fecha: format(formData.date, 'yyyy-MM-dd'),
                horaInicio: format(formData.startTime, 'HH:mm'),
                horaFin: format(formData.endTime, 'HH:mm'),
                modalidad: formData.modality,
                motivo: formData.motivo,
                resumen: formData.summary || null,
                compromisos: formData.commitments.filter(c => c.trim() !== ''),
                asistio: formData.attended
            };

            if (editingMeetingId) {
                await BitacoraService.updateReunion(editingMeetingId, payload);
                showAlert("Éxito", "Reunión actualizada correctamente", "success");
            } else {
                if (!selectedStudent.propuesta?.id) {
                    showAlert("Error", "El estudiante seleccionado no tiene una propuesta de tesis aprobada.", "error");
                    setSubmitting(false);
                    return;
                }
                await BitacoraService.createReunion(payload);
                showAlert("Éxito", "Reunión agendada/registrada correctamente", "success");
            }

            resetForm();
            setView('history');
            fetchData();
        } catch (err) {
            console.error("Error saving meeting:", err);
            showAlert("Error", `Error al guardar la reunión: ${err.message}`, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleExportPdf = (meeting) => {
        try {
            const doc = new jsPDF();

            // Título
            doc.setFontSize(18);
            doc.text('Bitácora de Reunión de Tutoría', 14, 22);

            // Información General
            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date(meeting.fecha).toLocaleDateString()}`, 14, 35);
            doc.text(`Hora: ${new Date(meeting.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(meeting.horaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 14, 42);
            doc.text(`Modalidad: ${meeting.modalidad}`, 14, 49);

            // Participantes
            doc.text(`Tutor: ${meeting.tutor?.nombres} ${meeting.tutor?.apellidos}`, 14, 60);
            doc.text(`Estudiante: ${meeting.estudiante?.nombres} ${meeting.estudiante?.apellidos}`, 14, 67);

            // Detalles
            autoTable(doc, {
                startY: 75,
                head: [['Sección', 'Detalle']],
                body: [
                    ['Motivo', meeting.motivo],
                    ['Resumen/Acta', meeting.resumen || 'Sin resumen registrado'],
                    ['Estado', meeting.asistio ? 'Realizada' : 'Pendiente']
                ],
            });

            // Compromisos
            if (meeting.compromisos && meeting.compromisos.length > 0) {
                const compromisosData = meeting.compromisos.map(c => [c]);
                doc.text('Compromisos:', 14, doc.lastAutoTable.finalY + 10);
                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 15,
                    head: [['Descripción']],
                    body: compromisosData,
                });
            }

            doc.save(`Reunion_${meeting.estudiante?.apellidos}_${format(new Date(meeting.fecha), 'yyyy-MM-dd')}.pdf`);
            showAlert("PDF Generado", "El reporte se ha descargado correctamente.", "success");
        } catch (err) {
            console.error("Error generating PDF:", err);
            showAlert("Error PDF", `Hubo un problema al generar el PDF: ${err.message}`, "error");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                <AlertMui
                    open={alertConfig.open}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    status={alertConfig.status}
                    handleClose={closeAlert}
                    showBtnR={false}
                    showBtnL={true}
                    btnNameL="Entendido"
                    actionBtnL={closeAlert}
                />

                {/* Encabezado con Botón de Acción */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Bitácora de Reuniones 📝
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {view === 'history'
                                ? 'Historial y planificación de sesiones de tutoría'
                                : (editingMeetingId ? 'Completar / Editar Reunión' : 'Planificar Nueva Reunión')}
                        </Typography>
                    </Box>

                    {view === 'history' ? (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handlePrepareCreate}
                            sx={{
                                backgroundColor: '#667eea',
                                fontWeight: 600,
                                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                '&:hover': { backgroundColor: '#5a6fd6' }
                            }}
                        >
                            Agendar Reunión
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => {
                                resetForm();
                                setView('history');
                            }}
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
                                {editingMeetingId ? 'Detalles de la Reunión' : 'Planificación de Reunión'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {editingMeetingId
                                    ? 'Complete el resumen y compromisos de la reunión realizada, o edite los detalles.'
                                    : 'Complete los detalles para agendar una reunión o registrar una ya realizada.'}
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Seleccionar estudiante */}
                                <FormControl fullWidth>
                                    <InputLabel>Estudiante *</InputLabel>
                                    <Select
                                        value={formData.studentId}
                                        label="Estudiante *"
                                        onChange={(e) => handleChange('studentId', e.target.value)}
                                        disabled={!!editingMeetingId} // No cambiar estudiante al editar para simplificar lógica
                                    >
                                        {students.map((student) => (
                                            <MenuItem key={student.id} value={student.id}>
                                                {student.nombres} {student.apellidos}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Motivo */}
                                <TextField
                                    fullWidth
                                    required
                                    label="Motivo de la Reunión"
                                    placeholder="Ej: Revisión de avance Cap. 1, Planificación de pruebas..."
                                    value={formData.motivo}
                                    onChange={(e) => handleChange('motivo', e.target.value)}
                                />

                                {/* Fecha */}
                                <DatePicker
                                    label="Fecha de la Reunión"
                                    value={formData.date}
                                    onChange={(newValue) => handleChange('date', newValue)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />

                                {/* Horario */}
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TimePicker
                                        label="Hora de Inicio"
                                        value={formData.startTime}
                                        onChange={(newValue) => handleChange('startTime', newValue)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                    <TimePicker
                                        label="Hora de Fin"
                                        value={formData.endTime}
                                        onChange={(newValue) => handleChange('endTime', newValue)}
                                        slotProps={{ textField: { fullWidth: true } }}
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
                                        <FormControlLabel value="PRESENCIAL" control={<Radio />} label="Presencial" />
                                        <FormControlLabel value="VIRTUAL" control={<Radio />} label="Virtual" />
                                        <FormControlLabel value="HIBRIDA" control={<Radio />} label="Híbrida" />
                                    </RadioGroup>
                                </FormControl>

                                {/* Resumen (Opcional para agendar) */}
                                <TextField
                                    fullWidth
                                    label="Resumen / Acta (Post-reunión)"
                                    placeholder="Temas tratados, dudas resueltas... (Llenar al finalizar la reunión)"
                                    multiline
                                    rows={4}
                                    value={formData.summary}
                                    onChange={(e) => handleChange('summary', e.target.value)}
                                    helperText="Llene este campo para registrar lo sucedido en la reunión."
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
                                    label="Confirmar Asistencia (Marcar si la reunión ya ocurrió)"
                                />

                                {/* Botones */}
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            resetForm();
                                            setView('history');
                                        }}
                                        disabled={submitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={!formData.studentId || !formData.motivo || submitting}
                                        sx={{
                                            backgroundColor: '#667eea',
                                            '&:hover': { backgroundColor: '#5568d3' },
                                            px: 4
                                        }}
                                    >
                                        {submitting ? 'Guardando...' : captionSaveButton(editingMeetingId)}
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
                                    No hay reuniones registradas. Comienza agendando una nueva.
                                </Typography>
                            </Paper>
                        ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="tabla de reuniones">
                                    <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Estudiante</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha / Hora</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Motivo</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Modalidad</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
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
                                                        {meeting.estudiante?.nombres} {meeting.estudiante?.apellidos}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {new Date(meeting.fecha).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(meeting.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                        {new Date(meeting.horaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {meeting.motivo}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={meeting.modalidad}
                                                        size="small"
                                                        color={meeting.modalidad === 'PRESENCIAL' ? 'primary' : 'secondary'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={meeting.asistio ? 'Realizada' : 'Pendiente'}
                                                        size="small"
                                                        color={meeting.asistio ? 'success' : 'warning'}
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                        <Tooltip title="Completar / Editar">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditMeeting(meeting)}
                                                                sx={{ color: '#667eea' }}
                                                            >
                                                                <EditIcon fontSize="small" />
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

function captionSaveButton(isEditing) {
    return isEditing ? 'Actualizar Reunión' : 'Guardar Reunión';
}

export default MeetingLog;
