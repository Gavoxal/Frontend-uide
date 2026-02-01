import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    Chip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

/**
 * Panel lateral para el dashboard del coordinador
 * Muestra lista de estudiantes con prerrequisitos pendientes
 */
function PrerequisiteChecksPanel({ students, onViewDetails, onApprove }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                height: '100%',
                border: '1px solid #E0E0E0',
                borderRadius: 2
            }}
        >
            {/* Header */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Prerrequisitos checks
            </Typography>

            {/* Lista de estudiantes */}
            <List sx={{ mt: 2 }}>
                {students.map((student) => (
                    <ListItem
                        key={student.id}
                        sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: student.status === 'pending' ? '#FFF8E1' : '#E8F5E9',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: student.status === 'pending' ? '#FFE082' : '#C8E6C9',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}
                        disablePadding
                    >
                        {/* Información del estudiante */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1.5 }}>
                            <Avatar sx={{ bgcolor: '#1976D2', mr: 1.5, width: 32, height: 32 }}>
                                {student.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight="600">
                                    {student.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {student.description}
                                </Typography>
                            </Box>
                            {student.status === 'pending' ? (
                                <HourglassEmptyIcon color="warning" fontSize="small" />
                            ) : (
                                <CheckCircleIcon color="success" fontSize="small" />
                            )}
                        </Box>

                        {/* Botones de acción */}
                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                            <Button
                                size="small"
                                variant="outlined"
                                fullWidth
                                onClick={() => onViewDetails(student)}
                            >
                                Detalles
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                fullWidth
                                disabled={student.status !== 'pending'}
                                onClick={() => onApprove(student)}
                            >
                                Aprobar
                            </Button>
                        </Box>
                    </ListItem>
                ))}
            </List>

            {students.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="body2">
                        No hay prerrequisitos pendientes
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

export default PrerequisiteChecksPanel;
