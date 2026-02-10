import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Typography,
    Box, Grid, FormControl, InputLabel, Select, MenuItem,
    TextField, IconButton, Divider, CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArticleIcon from '@mui/icons-material/Article';
import ButtonMui from '../button.mui.component';

import { CommitteeService } from '../../services/committee.service';

function TribunalAssignment({ student, type, currentUser, onClose, onSave }) {
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
    const [error, setError] = useState('');

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
            const defenseData = type === 'public' ? student.publicDefense : student.privateDefense;
            setAssignment(prev => ({
                ...prev,
                president: defenseData?.tribunal?.find(p => p.rol === 'PRESIDENTE')?.usuarioId || currentUser?.id || '',
                vocal1: defenseData?.tribunal?.find(p => p.rol === 'JURADO_1')?.usuarioId || '',
                vocal2: defenseData?.tribunal?.find(p => p.rol === 'JURADO_2')?.usuarioId || '',
                date: defenseData?.date || '',
                time: defenseData?.time || '',
                classroom: defenseData?.classroom || ''
            }));
        }
    }, [student, type, currentUser]);

    const handleChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleSaveClick = () => {
        // Validación básica
        if (!assignment.president || !assignment.vocal1 || !assignment.vocal2 || !assignment.date || !assignment.time || !assignment.classroom) {
            setError('Por favor, complete todos los campos de logística y seleccione los tres miembros del tribunal.');
            return;
        }

        if (assignment.president === assignment.vocal1 || assignment.president === assignment.vocal2 || assignment.vocal1 === assignment.vocal2) {
            setError('Los miembros del tribunal no pueden repetirse.');
            return;
        }

        setError('');

        // Find member objects to get their roles
        const presidentMember = members.find(m => m.id === assignment.president) || (assignment.president === currentUser?.id ? currentUser : null);
        const vocal1Member = members.find(m => m.id === assignment.vocal1);
        const vocal2Member = members.find(m => m.id === assignment.vocal2);

        onSave({
            ...assignment,
            presidentRole: presidentMember?.rol,
            vocal1Role: vocal1Member?.rol,
            vocal2Role: vocal2Member?.rol,
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
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{
                m: 0, p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                        p: 1.5, borderRadius: '12px', bgcolor: 'primary.main', color: 'white',
                        boxShadow: '0 4px 10px rgba(25,118,210,0.3)'
                    }}>
                        <AssignmentIndIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="900" color="#1e293b" sx={{ letterSpacing: -0.5 }}>
                            Asignación de Tribunal
                        </Typography>
                        <Typography variant="subtitle2" color="primary.main" fontWeight="700">
                            Estudiante: {student.name}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        bgcolor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        '&:hover': { bgcolor: '#fee2e2', color: '#ef4444' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                        {error}
                    </Alert>
                )}

                {/* Banner de Información */}
                <Box sx={{
                    mb: 4, p: 2.5,
                    bgcolor: '#f0f9ff',
                    borderRadius: '16px',
                    border: '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2
                }}>
                    <ArticleIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Tema de Tesis
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#0c4a6e" sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                            "{student.topic}"
                        </Typography>
                    </Box>
                </Box>

                <Box component="section" sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <EventIcon color="primary" />
                        <Typography variant="h6" fontWeight="800" color="#334155">Logística de la Defensa</Typography>
                        <Divider sx={{ flexGrow: 1, ml: 1, opacity: 0.6 }} />
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                name="date"
                                label="Fecha de Sustentación"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={assignment.date}
                                onChange={handleChange}
                                InputProps={{
                                    sx: { borderRadius: '12px' },
                                    startAdornment: <EventIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                name="time"
                                label="Hora Programada"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={assignment.time}
                                onChange={handleChange}
                                InputProps={{
                                    sx: { borderRadius: '12px' },
                                    startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                name="classroom"
                                label="Aula / Enlace"
                                placeholder="Ej: Aula Magna / Zoom"
                                value={assignment.classroom}
                                onChange={handleChange}
                                InputProps={{
                                    sx: { borderRadius: '12px' },
                                    startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box component="section">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <GroupIcon color="primary" />
                        <Typography variant="h6" fontWeight="800" color="#334155">Miembros del Tribunal</Typography>
                        <Divider sx={{ flexGrow: 1, ml: 1, opacity: 0.6 }} />
                    </Box>

                    <Grid container spacing={3}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
                                <CircularProgress size={30} />
                                <Typography sx={{ ml: 2 }}>Cargando miembros disponibles...</Typography>
                            </Box>
                        ) : [
                            { name: 'president', label: 'Presidente del Tribunal', icon: <PersonIcon /> },
                            { name: 'vocal1', label: 'Vocal 1 (Miembro)', icon: <PersonIcon /> },
                            { name: 'vocal2', label: 'Vocal 2 (Miembro)', icon: <PersonIcon /> }
                        ].map((field, idx) => (
                            <Grid item xs={12} key={idx}>
                                <FormControl fullWidth sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                                }}>
                                    <InputLabel id={`label-${field.name}`}>{field.label}</InputLabel>
                                    <Select
                                        labelId={`label-${field.name}`}
                                        name={field.name}
                                        value={assignment[field.name]}
                                        label={field.label}
                                        onChange={handleChange}
                                        startAdornment={<Box sx={{ ml: 1, color: 'primary.main', display: 'flex' }}>{field.icon}</Box>}
                                    >
                                        <MenuItem value="">
                                            <em>Sin seleccionar</em>
                                        </MenuItem>
                                        {members.map(m => (
                                            <MenuItem key={m.id} value={m.id}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {m.nombres} {m.apellidos}
                                                    </Typography>
                                                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                                        {m.rol === 'TUTOR' ? 'Tutor' : (m.designacion || m.rol)}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                        {currentUser && !members.find(m => m.id === currentUser.id) && (
                                            <MenuItem key={currentUser.id} value={currentUser.id}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant="body2" fontWeight="700" color="primary">
                                                        {currentUser.nombres} {currentUser.apellidos} (Usted)
                                                    </Typography>
                                                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
                                                        {currentUser.rol}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 4, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', gap: 2 }}>
                <ButtonMui
                    name="Cancelar"
                    onClick={onClose}
                    backgroundColor="#94a3b8"
                    variant="outlined"
                />
                <ButtonMui
                    name="Confirmar Asignación"
                    onClick={handleSaveClick}
                    backgroundColor="#1e3a8a"
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        boxShadow: '0 8px 20px rgba(30,58,138,0.25)',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(30,58,138,0.35)' }
                    }}
                />
            </DialogActions>
        </Dialog>
    );
}

export default TribunalAssignment;
