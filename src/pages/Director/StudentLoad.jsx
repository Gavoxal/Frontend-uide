import React, { useState } from 'react';
import { Box, Card, CardContent, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

import ButtonMui from '../../components/button.mui.component';
import TableMui from '../../components/table.mui.component';
import TextMui from '../../components/text.mui.component';
import AlertMui from '../../components/alert.mui.component';
import NotificationMui from '../../components/notification.mui.component';

function StudentLoad() {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            // Headers actualizados según requerimiento
            setHeaders([
                'Cédula', 'Nombre Completo', 'Email UIDE', 'Malla', 'Período Lectivo', 'Estado'
            ]);
            // Mock Data basada en la solicitud
            // Nota: Se muestran columnas clave para la vista previa para no saturar la tabla, 
            // pero internamente se procesaría todo.
            setPreviewData([
                {
                    cedula: '1150077467',
                    name: 'Abad Montesdeoca Nicole Belen',
                    email: 'niabadmo@uide.edu.ec',
                    malla: 'ITIL_MALLA 2019',
                    period: 'SEM LOJA OCT 2025 – FEB 2026',
                    status: 'Activo'
                },
                {
                    cedula: '1900714773',
                    name: 'Acacho Yangari Daddy Abel',
                    email: 'daacachoya@uide.edu.ec',
                    malla: 'ITIL_MALLA 2019',
                    period: 'SEM LOJA OCT 2025 – FEB 2026',
                    status: 'Activo'
                },
                {
                    cedula: '1050195104',
                    name: 'Ajila Armijos Cristian Xavier',
                    email: 'crajilaar@uide.edu.ec',
                    malla: 'SINL_MALLA 2023',
                    period: 'SEM LOJA OCT 2025 – FEB 2026',
                    status: 'Activo'
                }
            ]);
        }
    };

    const handleUploadClick = () => {
        setOpenAlert(true);
    };

    const [uploadStats, setUploadStats] = useState(null);

    const confirmUpload = async () => {
        setOpenAlert(false);

        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/v1/estudiantes/importar-excel', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setOpenSuccess(true);
                // Store stats for the notification
                setUploadStats({
                    created: result.exitosos?.length || 0,
                    skipped: result.omitidos?.length || 0,
                    failed: result.fallidos?.length || 0
                });
                console.log('Resultados Carga:', result);
            } else {
                console.error('Error al subir:', result);
                alert('Error al procesar el archivo: ' + (result.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de conexión con el servidor.');
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewData([]);
        setOpenSuccess(false);
        setUploadStats(null);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <TextMui value="Carga Masiva de Estudiantes" variant="h4" />
                <TextMui value="Importación de nómina estudiantil desde Excel" variant="body1" />
            </Box>

            {openSuccess && (
                <Box sx={{ mb: 3 }}>
                    <NotificationMui severity={uploadStats?.failed > 0 ? "warning" : "success"} onClose={() => setOpenSuccess(false)}>
                        <strong>¡Proceso Finalizado!</strong>
                        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                            <li>Nuevos estudiantes creados: <strong>{uploadStats?.created}</strong></li>
                            <li>Omitidos (Ya existían): <strong>{uploadStats?.skipped}</strong></li>
                            {uploadStats?.failed > 0 && (
                                <li style={{ color: '#d32f2f' }}>Fallidos: <strong>{uploadStats?.failed}</strong></li>
                            )}
                        </ul>
                        {uploadStats?.created > 0 && <span>Se han enviado las credenciales a los correos institucionales.</span>}
                    </NotificationMui>
                </Box>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <TextMui value="Seleccionar Archivo" variant="h6" />
                        <TextMui
                            value="El archivo debe contener las columnas: Cédula, Nombre Completo, Email UIDE, Malla, Período, etc."
                            variant="body2"
                        />
                    </Box>

                    {!file ? (
                        <Box sx={{
                            p: 4,
                            border: '2px dashed #1976d2',
                            borderRadius: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#f0f7ff',
                            transition: '0.3s',
                            '&:hover': { backgroundColor: '#e3f2fd' }
                        }}>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                id="file-upload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                <CloudUploadIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                                <TextMui
                                    value="Haga clic para cargar o arrastre el archivo Excel aquí"
                                    variant="h6"
                                />
                            </label>
                        </Box>
                    ) : (
                        <Box sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#fafafa'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CloudUploadIcon color="primary" />
                                <Box>
                                    <TextMui value={file.name} variant="subtitle1" />
                                    <TextMui value={`${(file.size / 1024).toFixed(2)} KB`} variant="caption" />
                                </Box>
                            </Box>
                            <ButtonMui
                                name="Eliminar"
                                onClick={clearFile}
                                backgroundColor="#d32f2f"
                                startIcon={<DeleteIcon />}
                            />
                        </Box>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: '250px' }}>
                            <ButtonMui
                                name="Procesar Nómina"
                                onClick={handleUploadClick}
                                disabled={!file}
                                startIcon={<SendIcon />}
                                backgroundColor={!file ? "gray" : "#1976d2"}
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {previewData.length > 0 && (
                <Card>
                    <CardContent>
                        <Box sx={{ mb: 2 }}>
                            <TextMui value="Vista Previa de Estudiantes (3 primeros registros)" variant="h6" />
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <TableMui headers={headers} data={previewData} />
                    </CardContent>
                </Card>
            )}

            <AlertMui
                open={openAlert}
                handleClose={() => setOpenAlert(false)}
                title="Confirmar Importación"
                message={
                    <span>
                        ¿Está seguro de importar esta nómina de estudiantes?
                        <br /><br />
                        <strong>Acciones automáticas:</strong>
                        <ul>
                            <li>Registro de estudiantes en el período <strong>SEM LOJA OCT 2025 – FEB 2026</strong>.</li>
                            <li>Generación de usuarios y contraseñas.</li>
                            <li>Envío de credenciales a los correos institucionales.</li>
                        </ul>
                    </span>
                }
                status="info"
                showBtnL={true}
                btnNameL="Confirmar y Procesar"
                actionBtnL={confirmUpload}
                showBtnR={true}
                btnNameR="Cancelar"
                actionBtnR={() => setOpenAlert(false)}
            />
        </Box>
    );
}

export default StudentLoad;
