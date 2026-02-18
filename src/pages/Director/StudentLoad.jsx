import React, { useState, useCallback } from 'react';
import { Box, Card, CardContent, Divider, Grid, Paper, Typography, Container, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import * as XLSX from 'xlsx';

import ButtonMui from '../../components/button.mui.component';
import TableMui from '../../components/table.mui.component';
import AlertMui from '../../components/alert.mui.component';
import NotificationMui from '../../components/notification.mui.component';
import { API_BASE_URL } from '../../utils/constants';
import { apiFetch } from '../../services/api';

function StudentLoad() {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [uploadStats, setUploadStats] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    // Columnas requeridas para validación visual y plantilla
    const REQUIRED_COLUMNS = [
        'Cédula', 'Nombres', 'Apellidos', 'Email UIDE', 'Sede', 'Carrera', 'Malla', 'Sexo', 'Estado en Escuela', 'Período Lectivo'
    ];

    const processFile = (selectedFile) => {
        if (!selectedFile) return;

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length > 0) {
                    const fileHeaders = jsonData[0];
                    setHeaders(fileHeaders);
                    // Tomar hasta 5 filas de datos para previsualización
                    const rows = jsonData.slice(1, 6).map((row, index) => {
                        const rowData = {};
                        fileHeaders.forEach((header, i) => {
                            rowData[header] = row[i] || '';
                        });
                        return { id: index, ...rowData };
                    });
                    setPreviewData(rows);
                }
            } catch (error) {
                console.error("Error parsing Excel:", error);
                alert("Error al leer el archivo Excel. Asegúrese de que sea un formato válido.");
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleFileChange = (e) => {
        processFile(e.target.files[0]);
    };

    // Drag and Drop handlers
    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleDownloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            REQUIRED_COLUMNS,
            ['1104567890', 'Juan', 'Perez', 'juan.perez@uide.edu.ec', 'UIDE - Loja', 'Tecnologías de la Información', 'ITIL_MALLA 2023', 'Masculino', 'Activo', '2023-2024'] // Ejemplo
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Plantilla Estudiantes");
        XLSX.writeFile(wb, "Plantilla_Carga_Estudiantes.xlsx");
    };

    const handleUploadClick = () => {
        setOpenAlert(true);
    };

    const confirmUpload = async () => {
        setOpenAlert(false);
        if (!file) return;

        setLoading(true); // Iniciar feedback de carga
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiFetch(`/api/v1/estudiantes/importar-excel`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setFileUploadSuccess(result);
            } else {
                alert('Error al procesar: ' + (result.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de conexión con el servidor.');
        } finally {
            setLoading(false); // Finalizar feedback
        }
    };

    const setFileUploadSuccess = (result) => {
        setOpenSuccess(true);
        setUploadStats({
            created: result.exitosos?.length || 0,
            skipped: result.omitidos?.length || 0,
            failed: result.fallidos?.length || 0
        });
        // Limpiar archivo después de éxito, pero mantener el mensaje de éxito
        setFile(null);
        setPreviewData([]);
    };

    const clearFile = () => {
        setFile(null);
        setPreviewData([]);
        setUploadStats(null);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Moderno con Gradiente */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #1565c0 30%, #42a5f5 90%)',
                    color: 'white',
                    borderRadius: 2
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Carga Masiva de Estudiantes
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Importación rápida y validación de nómina estudiantil desde Excel
                        </Typography>
                    </Box>
                    <ButtonMui
                        name="Descargar Plantilla"
                        onClick={handleDownloadTemplate}
                        startIcon={<DownloadIcon />}
                        variant="contained"
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                            backdropFilter: 'blur(10px)'
                        }}
                    />
                </Box>
            </Paper>

            {/* Success Notification */}
            {openSuccess && (
                <Box sx={{ mb: 3 }}>
                    <NotificationMui severity={uploadStats?.failed > 0 ? "warning" : "success"} onClose={() => setOpenSuccess(false)}>
                        <strong>¡Proceso Finalizado!</strong>
                        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                            <li>Creados: <strong>{uploadStats?.created}</strong></li>
                            <li>Omitidos: <strong>{uploadStats?.skipped}</strong></li>
                            {uploadStats?.failed > 0 && <li style={{ color: '#d32f2f' }}>Fallidos: <strong>{uploadStats?.failed}</strong></li>}
                        </ul>
                    </NotificationMui>
                </Box>
            )}

            {/* Main Content Area */}
            <Grid container spacing={4}>
                {/* Upload Section */}
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        {loading && <LinearProgress />}
                        <CardContent sx={{ p: 4 }}>
                            {!file ? (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom color="textSecondary">
                                        Seleccione o arrastre el archivo de nómina
                                    </Typography>
                                    <Typography variant="caption" display="block" color="textSecondary" sx={{ mb: 3 }}>
                                        Columnas requeridas: {REQUIRED_COLUMNS.join(', ')}
                                    </Typography>

                                    <Box
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                        sx={{
                                            p: 8,
                                            border: `2px dashed ${isDragging ? '#1976d2' : '#e0e0e0'}`,
                                            borderRadius: 4,
                                            backgroundColor: isDragging ? '#e3f2fd' : '#f8f9fa',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: '#f0f4f8',
                                                borderColor: '#1976d2',
                                                transform: 'scale(1.01)'
                                            }
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept=".xlsx, .xls"
                                            id="file-upload"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'block' }}>
                                            <CloudUploadIcon sx={{ fontSize: 80, color: isDragging ? '#1565c0' : '#90a4ae', mb: 2 }} />
                                            <Typography variant="h5" color={isDragging ? 'primary' : 'textSecondary'} fontWeight="medium">
                                                {isDragging ? "¡Suelte el archivo aquí!" : "Haga clic o arrastre el archivo Excel aquí"}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                Formatos soportados: .xlsx, .xls
                                            </Typography>
                                        </label>
                                    </Box>
                                </Box>
                            ) : (
                                <Box>
                                    {/* File Selected State */}
                                    <Grid container spacing={3} alignItems="center" justifyContent="center">
                                        <Grid size={{ xs: 12, md: 8 }}>
                                            <Paper
                                                elevation={0}
                                                variant="outlined"
                                                sx={{
                                                    p: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 3,
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: 2
                                                }}
                                            >
                                                <InsertDriveFileIcon color="primary" sx={{ fontSize: 40 }} />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {file.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {(file.size / 1024).toFixed(2)} KB
                                                    </Typography>
                                                </Box>
                                                <ButtonMui
                                                    name="Eliminar"
                                                    onClick={clearFile}
                                                    variant="outlined"
                                                    startIcon={<DeleteIcon />}
                                                    color="error"
                                                    disabled={loading}
                                                />
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* Preview Section */}
                                    {previewData.length > 0 && (
                                        <Box sx={{ mt: 4 }}>
                                            <Typography variant="h6" color="primary" gutterBottom sx={{ borderLeft: '4px solid #1976d2', pl: 2 }}>
                                                Vista Previa de Datos
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <TableMui headers={headers} data={previewData} />
                                            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
                                                ... mostrando primeros 5 registros de {previewData.length} filas detectadas.
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
                                        <ButtonMui
                                            name="Cancelar Operación"
                                            onClick={clearFile}
                                            variant="text"
                                            color="error"
                                            disabled={loading}
                                            sx={{ minWidth: 150 }}
                                        />
                                        <ButtonMui
                                            name={loading ? "Procesando..." : "Confirmar y Procesar"}
                                            onClick={handleUploadClick}
                                            startIcon={loading ? <Box component="span" sx={{ width: 22, height: 22, border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} /> : <SendIcon />}
                                            backgroundColor="#1976d2"
                                            disabled={loading}
                                            sx={{
                                                px: 6,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Paper>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <AlertMui
                open={openAlert}
                handleClose={() => setOpenAlert(false)}
                title="¿Confirmar Importación Masiva?"
                message={
                    <Box>
                        <Typography paragraph>
                            Está a punto de procesar la nómina de estudiantes. Esta acción:
                        </Typography>
                        <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 1 }}>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>Creará cuentas de usuario para nuevos estudiantes.</li>
                                <li>Enviará credenciales de acceso a los correos institucionales.</li>
                                <li>Registrará a los estudiantes en el período actual.</li>
                            </ul>
                        </Box>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
                            Esta operación no se puede deshacer.
                        </Typography>
                    </Box>
                }
                status="info"
                showBtnL={true}
                btnNameL="Sí, Procesar Ahora"
                actionBtnL={confirmUpload}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenAlert(false)}
            />
        </Container>
    );
}

export default StudentLoad;
