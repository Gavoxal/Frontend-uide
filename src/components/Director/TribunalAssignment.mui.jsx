import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Typography,
    Box, Grid, FormControl, InputLabel, Select, MenuItem,
    TextField, IconButton, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonMui from '../button.mui.component';

import { CommitteeService } from '../../services/committee.service';

function TribunalAssignment({ student, onClose, onSave }) {
    const [assignment, setAssignment] = useState({
        president: '',
        vocal1: '',
        vocal2: '',
        date: '',
        time: '',
        classroom: ''
    });
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const data = await CommitteeService.getMembers();
                setMembers(data);
            } catch (error) {
                console.error("Error fetching members for tribunal:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        if (student) {
            setAssignment({
                president: student.privateDefense?.tribunal?.find(p => p.rol === 'PRESIDENTE')?.usuarioId || '',
                vocal1: student.privateDefense?.tribunal?.find(p => p.rol === 'JURADO_1')?.usuarioId || '',
                vocal2: student.privateDefense?.tribunal?.find(p => p.rol === 'JURADO_2')?.usuarioId || '',
                date: student.privateDefense?.date || '',
                time: student.privateDefense?.time || '',
                classroom: student.privateDefense?.classroom || ''
            });
        }
    }, [student]);

    const handleChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleSaveClick = () => {
        onSave({
            ...assignment,
            student: student // Include student data here
        });
    };

    if (!student) return null;

    return (
        <Dialog
            open={!!student}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        Asignar Tribunal
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {student.name}
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                        TEMA DE TESIS:
                    </Typography>
                    <Typography variant="body1">
                        {student.topic}
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Fila 1: Tribunal */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="label-president">Presidente del Tribunal</InputLabel>
                            <Select
                                labelId="label-president"
                                name="president"
                                value={assignment.president}
                                label="Presidente del Tribunal"
                                onChange={handleChange}
                                sx={{ minWidth: '220px' }}
                            >
                                {members.map(m => (
                                    <MenuItem key={m.id} value={m.id}>
                                        {m.nombres} {m.apellidos} ({m.designacion || 'Miembro'})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="label-vocal1">Vocal 1</InputLabel>
                            <Select
                                labelId="label-vocal1"
                                name="vocal1"
                                value={assignment.vocal1}
                                label="Vocal 1"
                                onChange={handleChange}
                                sx={{ minWidth: '150px' }}
                            >
                                {members.map(m => (
                                    <MenuItem key={m.id} value={m.id}>
                                        {m.nombres} {m.apellidos} ({m.designacion || 'Miembro'})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="label-vocal2">Vocal 2</InputLabel>
                            <Select
                                labelId="label-vocal2"
                                name="vocal2"
                                value={assignment.vocal2}
                                label="Vocal 2"
                                onChange={handleChange}
                                sx={{ minWidth: '150px' }}
                            >
                                {members.map(m => (
                                    <MenuItem key={m.id} value={m.id}>
                                        {m.nombres} {m.apellidos} ({m.designacion || 'Miembro'})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Fila 2: Fecha, Hora y Aula */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            name="date"
                            label="Fecha de Sustentación"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={assignment.date}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            name="time"
                            label="Hora"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={assignment.time}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            name="classroom"
                            label="Aula Asignada"
                            placeholder="Ej: Aula Magna"
                            value={assignment.classroom}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <ButtonMui
                    name="Cancelar"
                    onClick={onClose}
                    backgroundColor="gray"
                    variant="text"
                />
                <ButtonMui
                    name="Guardar Asignación"
                    onClick={handleSaveClick}
                    backgroundColor="#1976d2"
                />
            </DialogActions>
        </Dialog>
    );
}

export default TribunalAssignment;