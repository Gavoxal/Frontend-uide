import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, Container, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import TextMui from '../../components/text.mui.component';
import InputMui from '../../components/input.mui.component';
import ButtonMui from '../../components/button.mui.component';
import NotificationMui from '../../components/notification.mui.component';

function DirectorRegisterTutor() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        cedula: '',
        email: '',
        specialty: '',
        area: '',
        department: ''
    });
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        // Implement save logic here (API call)
        console.log("Saving new tutor:", formData);
        setSuccessMsg('Tutor registrado exitosamente (Simulación)');

        // Redirect after delay
        setTimeout(() => {
            navigate('/director/tutors');
        }, 2000);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Registrar Nuevo Tutor" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }} />
                <TextMui value="Datos del docente para habilitarlo como tutor" variant="body1" color="text.secondary" />
            </Box>

            {successMsg && (
                <Box sx={{ mb: 3 }}>
                    <NotificationMui severity="success" onClose={() => setSuccessMsg('')}>
                        {successMsg}
                    </NotificationMui>
                </Box>
            )}

            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AppRegistrationIcon />
                    <TextMui value="Formulario de Registro" variant="h6" color="inherit" />
                </Box>
                <CardContent sx={{ p: 4 }}>

                    {/* Sección Información Personal (2x2 Grid) */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <PersonIcon color="primary" />
                            <TextMui value="Información Personal" variant="h6" color="text.primary" />
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <InputMui
                                    label="Nombres"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Juan Carlos"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InputMui
                                    label="Apellidos"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    placeholder="Ej: Pérez Lopez"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InputMui
                                    label="Cédula"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    placeholder="Número de identidad"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InputMui
                                    label="Correo Institucional"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="nombre.apellido@uide.edu.ec"
                                    type="email"
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Sección Información Académica (1x3 Grid) */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <SchoolIcon color="primary" />
                            <TextMui value="Información Académica" variant="h6" color="text.primary" />
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <InputMui
                                    label="Especialidad / Título"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    placeholder="Ej: PhD en Inteligencia Artificial"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputMui
                                    label="Área de Conocimiento"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    placeholder="Ej: Ciencia de Datos"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputMui
                                    label="Departamento / Escuela"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Ej: Escuela de Ingeniería TI"
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 4, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/director/tutors')}
                            color="primary"
                            sx={{ height: '40px' }}
                        >
                            Volver
                        </Button>
                        <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
                            <ButtonMui
                                name="Guardar Tutor"
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
                                backgroundColor="#ed6c02"
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Paper>
        </Container>
    );
}

export default DirectorRegisterTutor;
