import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Button,
    Grid,
    Avatar,
    Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputMui from "../../components/input.mui.component";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

function CoordinadorStudents() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // TODO: API - Obtener lista de todos los estudiantes asignados al coordinador o globales
    // const { data: students } = await fetch('/api/coordinador/students')
    const [students] = useState([
        {
            id: 1184523,
            name: "Jhandry Becerra",
            email: "jbecerra@uide.edu.ec",
            career: "Tecnologías de la Información",
            status: "active",
            thesisStatus: "Pendiente"
        },
        {
            id: 1150373,
            name: "Eduardo Pardo",
            email: "edupardo@uide.edu.ec",
            career: "Tecnologías de la Información",
            status: "active",
            thesisStatus: "En Desarrollo"
        },
        {
            id: 1122334,
            name: "Gabriel Sarango",
            email: "gsarango@uide.edu.ec",
            career: "Tecnologías de la Información",
            status: "inactive",
            thesisStatus: "No Iniciado"
        }
    ]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm)
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Gestión de Estudiantes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Listado general de estudiantes y su estado de titulación
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    {/* Barra de búsqueda */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <InputMui
                                placeholder="Buscar estudiante por nombre o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startIcon={<SearchIcon color="action" />}
                            />
                        </Box>
                        {/* Aquí se podrían agregar más filtros si fuera necesario */}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Lista de Estudiantes (Grid) */}
                    <Grid container spacing={2}>
                        {filteredStudents.map((student) => (
                            <Grid item xs={12} key={student.id}>
                                <Card variant="outlined" sx={{
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:hover': { bgcolor: '#FAFAFA' }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#000A9B', width: 50, height: 50 }}>
                                            {student.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {student.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ID: {student.id} | {student.email}
                                            </Typography>
                                            <Typography variant="caption" color="primary">
                                                {student.career}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                Estado Tesis
                                            </Typography>
                                            <Chip
                                                label={student.thesisStatus}
                                                size="small"
                                                color={student.thesisStatus === 'En Desarrollo' ? 'success' : 'default'}
                                            />
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => {
                                                // TODO: Navegar a detalle del estudiante si se implementa esa vista

                                            }}
                                        >
                                            Detalles
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}

                        {filteredStudents.length === 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Typography color="text.secondary">
                                        No se encontraron estudiantes con ese criterio.
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CoordinadorStudents;
