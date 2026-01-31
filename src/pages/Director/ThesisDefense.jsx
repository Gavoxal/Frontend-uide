import React, { useState } from 'react';
import { Box, Typography, Grid, MenuItem, Select, FormControl, InputLabel, TextField, Card, CardContent, Divider } from '@mui/material';
import ButtonMui from '../../components/button.mui.component';
import TableMui from '../../components/table.mui.component';

function ThesisDefense() {
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Mock Data
    const headers = ['Estudiante', 'Tema', 'Estado Documental', 'Director de Tesis'];
    const data = [
        { id: 1, student: 'Pedro Ramos', topic: 'Blockchain Voting', status: 'Listo para Defensa', director: 'Ing. Wilson' },
        { id: 2, student: 'Maria Sol', topic: 'ERP Modulo Ventas', status: 'Listo para Defensa', director: 'Ing. Lorena' },
    ];

    // Form State
    const [tribunal, setTribunal] = useState({
        president: '',
        vocal1: '',
        vocal2: '',
        date: '',
        time: ''
    });

    const handleAssign = (row) => {
        setSelectedStudent(row);
    };

    const handleChange = (e) => {
        setTribunal({ ...tribunal, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        alert(`Asignado correctamente`);
        setSelectedStudent(null);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Designación de Tribunal
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Programación de defensas y asignación de jurados
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={selectedStudent ? 12 : 12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Estudiantes Habilitados
                            </Typography>
                            <TableMui
                                headers={headers}
                                data={data}
                                actions={(row) => (
                                    <ButtonMui name="Asignar" onClick={() => handleAssign(row)} />
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {selectedStudent && (
                    <Grid item xs={12}>
                        <Card sx={{ border: '1px solid #1976d2' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                    Asignación para: {selectedStudent.student}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Tema: {selectedStudent.topic} | Director: {selectedStudent.director}
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Presidente del Tribunal</InputLabel>
                                            <Select
                                                name="president"
                                                value={tribunal.president}
                                                label="Presidente del Tribunal"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="Ing. Lorena">Ing. Lorena</MenuItem>
                                                <MenuItem value="Ing. Wilson">Ing. Wilson</MenuItem>
                                                <MenuItem value="Ing. Charly">Ing. Charly</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Vocal 1</InputLabel>
                                            <Select
                                                name="vocal1"
                                                value={tribunal.vocal1}
                                                label="Vocal 1"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="Ing. Gabriel">Ing. Gabriel</MenuItem>
                                                <MenuItem value="Ing. Eduardo">Ing. Eduardo</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Vocal 2</InputLabel>
                                            <Select
                                                name="vocal2"
                                                value={tribunal.vocal2}
                                                label="Vocal 2"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="Ing. Fernando">Ing. Fernando</MenuItem>
                                                <MenuItem value="Ing. Dario">Ing. Dario</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="date"
                                            label="Fecha de Sustentación"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={tribunal.date}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="time"
                                            label="Hora"
                                            type="time"
                                            InputLabelProps={{ shrink: true }}
                                            value={tribunal.time}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <ButtonMui name="Guardar Asignación" onClick={handleSave} backgroundColor="#1976d2" />
                                    <ButtonMui name="Cancelar" onClick={() => setSelectedStudent(null)} backgroundColor="gray" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default ThesisDefense;
