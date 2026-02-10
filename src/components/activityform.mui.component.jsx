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
        semana: initialData?.semana || '',
        deadline: initialData?.deadline || new Date(),
        resources: initialData?.resources || []
    });

    // Sincronizar estado cuando initialData cambia (importante para pre-selección)
    React.useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                studentId: initialData.studentId || prev.studentId,
                title: initialData.title || prev.title,
                description: initialData.description || prev.description,
                semana: initialData.semana || prev.semana,
                deadline: initialData.deadline || prev.deadline,
                resources: initialData.resources || prev.resources
            }));
        }
    }, [initialData]);

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



    const startOptions = [
        <MenuItem key="none" value="">
            <em>Seleccione un estudiante</em>
        </MenuItem>
    ];

    // Asegurar tipos consistentes para el matching de MUI Select
    const normalizedValue = formData.studentId ? String(formData.studentId) : '';

    const allOptions = students.map(s => ({
        id: String(s.id),
        name: s.name
    }));

    if (normalizedValue && !allOptions.find(o => o.id === normalizedValue)) {
        allOptions.push({ id: normalizedValue, name: initialData?.studentName || "Estudiante Seleccionado" });
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Estudiante</InputLabel>
                    <Select
                        value={normalizedValue}
                        label="Estudiante"
                        onChange={(e) => handleChange('studentId', e.target.value)}
                    >
                        {startOptions}
                        {allOptions.map((student) => (
                            <MenuItem key={student.id} value={student.id}>
                                {student.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Semana y Título */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Semana</InputLabel>
                        <Select
                            value={formData.semana}
                            label="Semana"
                            onChange={(e) => handleChange('semana', e.target.value)}
                        >
                            {[...Array(16)].map((_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    Semana {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Título de la Actividad"
                        placeholder="Ej: Implementación de Login con JWT"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </Box>

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
                        slotProps={{ textField: { fullWidth: true } }}
                        sx={{ flex: 1 }}
                    />
                </Box>



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
                        disabled={!formData.studentId || !formData.title || !formData.description || !formData.semana}
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
