import { Alert, AlertTitle, Box, Button, LinearProgress, Typography } from '@mui/material';
import { Lock, CheckCircle, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de alerta para mostrar cuando el acceso está restringido
 */
function AccessAlert({
    prerequisitesStatus,
    completedWeeks = 0,
    onGoToPrerequisites
}) {
    const navigate = useNavigate();

    const handleGoToPrerequisites = () => {
        if (onGoToPrerequisites) {
            onGoToPrerequisites();
        } else {
            navigate('/student/prerequisites');
        }
    };

    if (prerequisitesStatus === 'approved') {
        return null; // No mostrar si ya está aprobado
    }

    return (
        <Alert
            severity="warning"
            icon={<Lock />}
            sx={{
                mb: 3,
                borderRadius: 2,
                border: '2px solid #ff9800'
            }}
        >
            <AlertTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                ⚠️ Acceso Limitado al Sistema
            </AlertTitle>

            <Typography variant="body1" sx={{ mb: 2 }}>
                Para acceder a todas las funcionalidades del sistema, debes <strong>completar y que se aprueben tus prerrequisitos</strong>.
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mb: 2,
                p: 2,
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderRadius: 1
            }}>
                <Typography variant="body2" fontWeight="600">
                    📋 Funciones disponibles actualmente:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    <li><Typography variant="body2">Dashboard</Typography></li>
                    <li><Typography variant="body2">Prerrequisitos</Typography></li>
                    <li><Typography variant="body2">Perfil</Typography></li>
                </Box>

                <Typography variant="body2" fontWeight="600" sx={{ mt: 1 }}>
                    🔒 Funciones bloqueadas:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    <li><Typography variant="body2">Propuestas de Tesis</Typography></li>
                    <li><Typography variant="body2">Avances Semanales</Typography></li>
                    <li><Typography variant="body2">Proyecto Final</Typography></li>
                    <li><Typography variant="body2">Defensa de Tesis</Typography></li>
                </Box>
            </Box>

            <Button
                variant="contained"
                onClick={handleGoToPrerequisites}
                sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: '#ff9800',
                    '&:hover': {
                        backgroundColor: '#f57c00'
                    }
                }}
            >
                Ir a Completar Prerrequisitos
            </Button>
        </Alert>
    );
}

/**
 * Componente para mostrar el progreso general del estudiante
 */
export function ProgressSummaryCard({ progressSummary, prerequisitesStatus }) {
    return (
        <Box sx={{
            p: 3,
            backgroundColor: prerequisitesStatus === 'approved' ? '#e8f5e9' : '#fff3e0',
            borderRadius: 2,
            border: `2px solid ${prerequisitesStatus === 'approved' ? '#4caf50' : '#ff9800'}`
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {prerequisitesStatus === 'approved' ? (
                    <CheckCircle sx={{ fontSize: 32, color: '#4caf50' }} />
                ) : (
                    <Schedule sx={{ fontSize: 32, color: '#ff9800' }} />
                )}
                <Box>
                    <Typography variant="h6" fontWeight="700">
                        {prerequisitesStatus === 'approved'
                            ? '✅ Prerrequisitos Aprobados'
                            : '⏳ Esperando Aprobación de Prerrequisitos'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {prerequisitesStatus === 'approved'
                            ? 'Tienes acceso a las funcionalidades del sistema'
                            : 'El director está revisando tu documentación'}
                    </Typography>
                </Box>
            </Box>

            {prerequisitesStatus === 'approved' && (
                <>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                        Progreso de Avances Semanales:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progressSummary.weeklyPercentage}
                            sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 1,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: progressSummary.weeklyPercentage === 100 ? '#4caf50' : '#2196f3'
                                }
                            }}
                        />
                        <Typography variant="body2" fontWeight="700">
                            {progressSummary.weeklyProgress}
                        </Typography>
                    </Box>
                    {progressSummary.projectUnlocked ? (
                        <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                            🎉 ¡Proyecto desbloqueado!
                        </Typography>
                    ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Completa las 15 semanas para desbloquear la sección de Proyecto
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
}

export default AccessAlert;
