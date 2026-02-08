import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import StatsCard from '../../components/common/StatsCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import { getPendingCount, recentActivity } from './mockWeeks';
import RecentStudentsTable from './RecentStudentsTable';

function Dashboard() {
    const navigate = useNavigate();
    const pendingCount = getPendingCount();

    return (
        <Box>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#000A9B' }}>
                    Resumen General
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
                            subtitle="Requieren revisión"
                        />
                    </Box>

                    <StatsCard
                        title="Total Estudiantes"
                        value="25"
                        icon={<PeopleIcon />}
                        color="primary"
                        subtitle="Cursando materia"
                    />

                    <StatsCard
                        title="Semanas Transcurridas"
                        value="4 / 15"
                        icon={<AssignmentIcon />}
                        color="info"
                    />
<<<<<<< HEAD
=======

>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#000A9B' }}>
<<<<<<< HEAD
                        Actividad Reciente
=======
                        Mis Estudiantes
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                    </Typography>
                    <RecentStudentsTable students={recentActivity} />
                </Box>
            </Box>
        </Box>
    );
}

export default Dashboard;
