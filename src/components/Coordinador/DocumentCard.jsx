import { Box, Typography, Paper, Chip, IconButton } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";

/**
 * Componente para mostrar un documento de prerrequisito
 * Muestra información del archivo, estado y opciones de visualización
 */
function DocumentCard({ document }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    label: 'Comprobante de finalización',
                    color: 'success',
                    icon: <CheckCircleIcon fontSize="small" />
                };
            case 'uploaded':
                return {
                    label: 'Evidencia Subida',
                    color: 'info',
                    icon: <HourglassEmptyIcon fontSize="small" />
                };
            case 'pending_review':
                return {
                    label: 'A falta de revisión por director',
                    color: 'warning',
                    icon: <ErrorIcon fontSize="small" />
                };
            default:
                return {
                    label: 'Pendiente',
                    color: 'default',
                    icon: <HourglassEmptyIcon fontSize="small" />
                };
        }
    };

    const statusConfig = getStatusConfig(document.status);

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                mb: 2,
                borderRadius: 2,
                border: '1px solid #E0E0E0',
                '&:hover': {
                    boxShadow: 2,
                    borderColor: '#BDBDBD'
                }
            }}
        >
            {/* Título del prerrequisito */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {document.title}
            </Typography>

            {/* Estado del prerrequisito */}
            <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                color={statusConfig.color}
                size="small"
                sx={{ mb: 2 }}
            />

            {/* Información del archivo */}
            {document.fileName && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: '#F5F5F5',
                        borderRadius: 1,
                        border: '1px dashed #BDBDBD'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <DescriptionIcon color="action" />
                        <Box>
                            <Typography variant="body2" fontWeight="500">
                                {document.fileName}
                            </Typography>
                            {document.uploadedAt && (
                                <Typography variant="caption" color="text.secondary">
                                    Subido: {document.uploadedAt}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                            // TODO: API - Abrir/descargar documento
                            // fetch(`/api/documents/${document.id}/download`)

                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            )}

            {/* Mensaje si no hay archivo */}
            {!document.fileName && (
                <Box sx={{ p: 1.5, bgcolor: '#FFF8E1', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        El estudiante aún no ha subido este documento
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

export default DocumentCard;
