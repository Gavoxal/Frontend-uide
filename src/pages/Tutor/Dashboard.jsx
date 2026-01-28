import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, Divider } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { getDataUser } from "../../storage/user.model.jsx";
import StatsCard from "../../components/common/StatsCard";
import StudentCard from "../../components/common/StudentCard";

function TutorDashboard() {
    const user = getDataUser();

    const stats = {
        totalStudents: 5,
        avancesReview: 3,
        pendingMeetings: 2,
    };

    const myStudents = [
        {
            name: "Eduardo Pardo",
            cedula: "1234567890",
            email: "epardo@example.com",
            cycle: 8,
            phase: "Desarrollo",
            status: "in-progress",
        },
        {
            name: "Ana García",
            cedula: "5566778899",
            email: "agarcia@example.com",
            cycle: 8,
            phase: "Desarrollo",
            status: "in-progress",
        },
    ];

    const upcomingMeetings = [
        { student: "Eduardo Pardo", date: "2026-01-27", time: "10:00 AM" },
        { student: "Ana García", date: "2026-01-28", time: "02:00 PM" },
    ];

    return (
        <Box>
            {/* Encabezado */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido, {user?.name || "Tutor"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de gestión de tutoría
                </Typography>
            </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Estudiantes Asignados"
                        value={stats.totalStudents}
                        icon={<PeopleIcon fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Avances por Revisar"
                        value={stats.avancesReview}
                        icon={<AssignmentTurnedInIcon fontSize="large" />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Reuniones Pendientes"
                        value={stats.pendingMeetings}
                        icon={<ScheduleIcon fontSize="large" />}
                        color="info"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Mis Estudiantes */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Mis Estudiantes
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {myStudents.map((student, index) => (
                            <StudentCard key={index} student={student} onClick={() => console.log("Ver estudiante", student.name)} />
                        ))}
                    </Box>
                </Grid>

                {/* Próximas Reuniones */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Próximas Reuniones
                    </Typography>
                    <Card>
                        <CardContent>
                            <List>
                                {upcomingMeetings.map((meeting, index) => (
                                    <Box key={index}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={meeting.student}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            {new Date(meeting.date).toLocaleDateString()}
                                                        </Typography>
                                                        {" — "}{meeting.time}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < upcomingMeetings.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default TutorDashboard;
