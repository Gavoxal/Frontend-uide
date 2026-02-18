import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Avatar, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDataUser, setActiveRole } from '../../storage/user.model.jsx';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import RateReviewIcon from '@mui/icons-material/RateReview';

const roleConfig = {
    'ESTUDIANTE': { label: 'Estudiante', icon: <SchoolIcon sx={{ fontSize: 50 }} />, color: '#4caf50', path: '/student/dashboard' },
    'TUTOR': { label: 'Tutor', icon: <SupervisorAccountIcon sx={{ fontSize: 50 }} />, color: '#2196f3', path: '/tutor/proposals' },
    'DIRECTOR': { label: 'Director de Carrera', icon: <AdminPanelSettingsIcon sx={{ fontSize: 50 }} />, color: '#f44336', path: '/director/dashboard' },
    'COORDINADOR': { label: 'Coordinador', icon: <GroupIcon sx={{ fontSize: 50 }} />, color: '#9c27b0', path: '/coordinador/dashboard' },
    'DOCENTE_INTEGRACION': { label: 'Docente de Integración', icon: <CastForEducationIcon sx={{ fontSize: 50 }} />, color: '#ff9800', path: '/docente-integracion/dashboard' },
    'REVIEWER': { label: 'Revisor de Propuestas', icon: <RateReviewIcon sx={{ fontSize: 50 }} />, color: '#795548', path: '/tutor/proposals' },
    'ADMIN': { label: 'Administrador', icon: <AdminPanelSettingsIcon sx={{ fontSize: 50 }} />, color: '#3f51b5', path: '/director/dashboard' },
    'COMITE': { label: 'Comité de Ética/Investigación', icon: <PersonIcon sx={{ fontSize: 50 }} />, color: '#607d8b', path: '/comite/dashboard' },
};

function RoleSelection() {
    const user = getDataUser();
    const navigate = useNavigate();
    const roles = user?.roles || [user?.rol];

    React.useEffect(() => {
        if (!user) {
            console.warn("RoleSelection: No user data found, redirecting to login");
            navigate('/ingreso');
        }
    }, [user, navigate]);

    const handleSelectRole = (role) => {
        if (!role) return;
        setActiveRole(role);
        const config = roleConfig[role] || { path: '/' };
        navigate(config.path);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                py: 4
            }}
        >
            <Container maxWidth="md">
                <Box textAlign="center" mb={6} color="white">
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Bienvenido, {user?.nombres}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8 }}>
                        Selecciona el rol con el que deseas acceder hoy:
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {roles.map((role) => {
                        const config = roleConfig[role] || { label: role, icon: <PersonIcon />, color: '#757575' };
                        return (
                            <Grid item xs={12} sm={6} md={4} key={role}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 20px rgba(0,0,0,0.3)'
                                        },
                                        borderRadius: 4
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleSelectRole(role)}
                                        sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            p: 4,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                bgcolor: config.color,
                                                mb: 2,
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {config.icon}
                                        </Avatar>
                                        <CardContent>
                                            <Typography variant="h5" component="div" fontWeight="bold">
                                                {config.label}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}

export default RoleSelection;
