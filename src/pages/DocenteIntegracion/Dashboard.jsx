import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import StatsCard from '../../components/common/StatsCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import RecentStudentsTable from './RecentStudentsTable';
import { ActivityService } from '../../services/activity.service';

function Dashboard() {
    const navigate = useNavigate();
    const [evidencias, setEvidencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await ActivityService.getAllEvidencias();
                setEvidencias(data);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const pendingCount = evidencias.filter(e => e.estadoRevisionDocente === 'PENDIENTE').length;
    // Agrupar estudiantes únicos
    const totalStudents = new Set(evidencias.map(e => e.actividad?.propuesta?.estudiante?.id).filter(id => id)).size;

    if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#000A9B' }}>
                    Resumen General Docente 🎓
                </Typography>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 3
                }}>
                    <Box onClick={() => navigate('/docente-integracion/advances')} sx={{ cursor: 'pointer' }}>
                        <StatsCard
                            title="Avances Pendientes"
                            value={pendingCount}
                            icon={<AssignmentIcon />}
                            color="error"
                            subtitle="Requieren tu revisión"
                        />
                    </Box>

                    <StatsCard
                        title="Total Estudiantes"
                        value={totalStudents}
                        icon={<PeopleIcon />}
                        color="primary"
                        subtitle="Con entregas registradas"
                    />

                    <StatsCard
                        title="Entregas Totales"
                        value={evidencias.length}
                        icon={<AssignmentIcon />}
                        color="info"
                        subtitle="En todo el periodo"
                    />

                </Box >

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#000A9B' }}>
                        Últimas Entregas Recibidas
                    </Typography>
                    <RecentStudentsTable evidences={evidencias.slice(0, 5)} />
                </Box>
            </Box >
        </Box >
    );
}

export default Dashboard;
