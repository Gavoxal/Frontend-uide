import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Typography,
    Chip,
    IconButton,
    Paper
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import es from 'date-fns/locale/es';

function ActivityForm({ students = [], onSubmit, onDraft, initialData = null }) {
    const [formData, setFormData] = useState({
        studentId: initialData?.studentId || '',
        title: initialData?.title || '',
        description: initialData?.description || '',
        deadline: initialData?.deadline || new Date(),

        resources: initialData?.resources || []
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (isDraft = false) => {
        if (isDraft) {
            onDraft?.(formData);
        } else {
            onSubmit?.(formData);
        }
    };



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Selección de estudiante */}
                <FormControl fullWidth>
                    <InputLabel>Estudiante</InputLabel>
                    <Select
                        value={formData.studentId}
                        label="Estudiante"
                        onChange={(e) => handleChange('studentId', e.target.value)}
                    >
                        {students.map((student) => (
                            <MenuItem key={student.id} value={student.id}>
                                {student.name} - {student.thesis}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Título */}
                <TextField
                    fullWidth
                    label="Título de la Actividad"
                    placeholder="Ej: Implementación de Login con JWT"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />

                {/* Descripción */}
                <TextField
                    fullWidth
                    label="Descripción Detallada"
                    placeholder="Instrucciones técnicas, criterios de aceptación, etc."
                    multiline
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />

                {/* Fecha límite */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <DateTimePicker
                        label="Fecha Límite de Entrega"
                        value={formData.deadline}
                        onChange={(newValue) => handleChange('deadline', newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        sx={{ flex: 1 }}
                    />
                </Box>

                {/* Recursos adjuntos */}
                <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600">
                            Recursos Adjuntos (Opcional)
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                // Lógica para agregar recurso
                            }}
                        >
                            Agregar
                        </Button>
                    </Box>

                    {formData.resources.length === 0 ? (
                        <Typography variant="caption" color="text.secondary">
                            No hay recursos adjuntos. Puedes agregar enlaces a documentación o archivos base.
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {formData.resources.map((resource, index) => (
                                <Chip
                                    key={index}
                                    label={resource.name}
                                    icon={<AttachFileIcon />}
                                    onDelete={() => {
                                        // Lógica para eliminar recurso
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Paper>

                {/* Botones de acción */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleSubmit(true)}
                    >
                        Guardar como Borrador
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit(false)}
                        disabled={!formData.studentId || !formData.title || !formData.description}
                        sx={{
                            backgroundColor: '#667eea',
                            '&:hover': {
                                backgroundColor: '#5568d3'
                            }
                        }}
                    >
                        Guardar y Notificar
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default ActivityForm;
