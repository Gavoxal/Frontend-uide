import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FileUpload from '../../components/file.mui.component.jsx';

function StudentAnteproyecto() {
    const [anteproyectoFile, setAnteproyectoFile] = useState(null);
    const [manualFile, setManualFile] = useState(null);
    const [planPruebasFile, setPlanPruebasFile] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const handleFileSelect = (file, type) => {
        const fileData = {
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            file: file,
        };

        switch (type) {
            case 'anteproyecto':
                setAnteproyectoFile(fileData);
                break;
            case 'manual':
                setManualFile(fileData);
                break;
            case 'planPruebas':
                setPlanPruebasFile(fileData);
                break;
        }
        setHasChanges(true);
    };

    const handleRemoveFile = (type) => {
        switch (type) {
            case 'anteproyecto':
                setAnteproyectoFile(null);
                break;
            case 'manual':
                setManualFile(null);
                break;
            case 'planPruebas':
                setPlanPruebasFile(null);
                break;
        }
        setHasChanges(true);
    };

    const handleSave = () => {
        // Aquí se enviarían los archivos al backend
        console.log('Guardando archivos:', {
            anteproyecto: anteproyectoFile?.file,
            manual: manualFile?.file,
            planPruebas: planPruebasFile?.file,
        });
        setHasChanges(false);
        // Mostrar mensaje de éxito
    };

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Anteproyecto y Documentación
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sube los documentos requeridos para tu trabajo de titulación
                </Typography>
            </Box>

            {/* Información */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Debes subir tu anteproyecto aprobado y los documentos complementarios. Solo se aceptan archivos en formato PDF.
            </Alert>

            {/* Formulario de carga */}
            <Grid container spacing={3}>
                {/* Anteproyecto */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Anteproyecto
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Documento principal del anteproyecto aprobado por el director
                            </Typography>
                            <FileUpload
                                onFileSelect={(file) => handleFileSelect(file, 'anteproyecto')}
                                uploadedFile={anteproyectoFile}
                                onRemoveFile={() => handleRemoveFile('anteproyecto')}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Manual de Usuario/Programador */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Manual de Usuario/Programador
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Documentación técnica del sistema
                            </Typography>
                            <FileUpload
                                onFileSelect={(file) => handleFileSelect(file, 'manual')}
                                uploadedFile={manualFile}
                                onRemoveFile={() => handleRemoveFile('manual')}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Plan de Pruebas */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Plan de Pruebas
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Casos de prueba y validación del sistema
                            </Typography>
                            <FileUpload
                                onFileSelect={(file) => handleFileSelect(file, 'planPruebas')}
                                uploadedFile={planPruebasFile}
                                onRemoveFile={() => handleRemoveFile('planPruebas')}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Botón Guardar */}
            {hasChanges && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        size="large"
                    >
                        Guardar Cambios
                    </Button>
                </Box>
            )}

            {/* Información adicional */}
            <Card sx={{ mt: 3, backgroundColor: '#FFF9E6' }}>
                <CardContent>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        📋 Requisitos de los documentos:
                    </Typography>
                    <Typography variant="body2" component="div">
                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                            <li>Formato: PDF únicamente</li>
                            <li>Tamaño máximo: 10 MB por archivo</li>
                            <li>El anteproyecto debe estar firmado por el tutor</li>
                            <li>Los manuales deben seguir el formato institucional</li>
                        </ul>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default StudentAnteproyecto;
