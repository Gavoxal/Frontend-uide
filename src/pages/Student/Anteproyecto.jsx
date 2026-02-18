import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, TextField, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function StudentAnteproyecto() {
    const [formData, setFormData] = useState({
        title: '',
        objectives: '',
        researchLine: '',
        file: null
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.objectives || !formData.researchLine || !formData.file) {
            alert("Por favor complete todos los campos y suba el archivo.");
            return;
        }
        // Mock submission

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                    Tu propuesta de tema ha sido enviada correctamente y está pendiente de aprobación por el Director.
                </Alert>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Resumen de la Postulación</Typography>
                        <Typography variant="subtitle2" color="text.secondary">Título</Typography>
                        <Typography paragraph>{formData.title}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">Línea de Investigación</Typography>
                        <Typography paragraph>{formData.researchLine}</Typography>
                        <Button variant="outlined" onClick={() => setSubmitted(false)}>Editar Postulación</Button>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Postulación de Tema de Tesis
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Ingresa los detalles de tu propuesta de trabajo de titulación (RF-004)
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Detalles del Proyecto
                            </Typography>

                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    label="Título de la Tesis"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="Ej: Implementación de un modelo de Machine Learning para..."
                                />

                                <FormControl fullWidth required>
                                    <InputLabel>Línea de Investigación</InputLabel>
                                    <Select
                                        name="researchLine"
                                        value={formData.researchLine}
                                        label="Línea de Investigación"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Inteligencia Artificial">Inteligencia Artificial</MenuItem>
                                        <MenuItem value="Ciberseguridad">Ciberseguridad</MenuItem>
                                        <MenuItem value="Desarrollo de Software">Desarrollo de Software</MenuItem>
                                        <MenuItem value="Calidad de Software">Calidad de Software</MenuItem>
                                        <MenuItem value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Objetivos y Descripción Breve"
                                    name="objectives"
                                    value={formData.objectives}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    multiline
                                    rows={6}
                                    placeholder="Describa el objetivo general y los objetivos específicos..."
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Documento de Soporte
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Sube el archivo PDF con el anteproyecto completo firmado.
                            </Typography>

                            <Box sx={{
                                p: 3,
                                border: '2px dashed #1976d2',
                                borderRadius: 2,
                                textAlign: 'center',
                                backgroundColor: '#f0f7ff',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    id="proposal-file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="proposal-file" style={{ cursor: 'pointer', display: 'block' }}>
                                    <CloudUploadIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                        {formData.file ? formData.file.name : "Subir PDF"}
                                    </Typography>
                                </label>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            disabled={!formData.title || !formData.file}
                        >
                            Enviar Postulación
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentAnteproyecto;
