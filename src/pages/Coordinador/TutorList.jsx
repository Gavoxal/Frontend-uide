import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

import TextMui from '../../components/text.mui.component';
import InputMui from '../../components/input.mui.component';
import TutorCard from '../../components/Director/TutorCard.mui';
import usuarioService from '../../services/usuario.service';

function CoordinatorTutorList() {
    const navigate = useNavigate();
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTutors = async () => {
        setLoading(true);
        try {
            const data = await usuarioService.getTutores();
            // Mapear datos del backend al que espera la TutorCard
            const mappedTutors = data.map(t => ({
                id: t.id,
                name: `${t.nombres} ${t.apellidos}`,
                email: t.correoInstitucional,
                specialty: t.tutorPerfil?.area_investigacion || 'Académico',
                area: t.tutorPerfil?.area_investigacion || 'UIDE',
                department: t.tutorPerfil?.facultad || 'Escuela de Ingeniería TI',
                assignedStudents: t.tutorPerfil?._count?.estudiantes || 0,
                photoUrl: t.fotoUrl || ""
            }));
            setTutors(mappedTutors);
        } catch (error) {
            console.error("Error fetching tutors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    const filteredTutors = tutors.filter(tutor =>
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <TextMui value="Listado de Tutores Académicos" variant="h4" />
                </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Card>
                    <CardContent>
                        <InputMui
                            placeholder="Buscar por nombre, especialidad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<SearchIcon color="action" />}
                        />
                    </CardContent>
                </Card>
            </Box>

            <Grid container spacing={3}>
                {filteredTutors.length > 0 ? (
                    filteredTutors.map((tutor) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={tutor.id}>
                            <TutorCard tutor={tutor} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <TextMui value="No se encontraron tutores" variant="h6" color="text.secondary" />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default CoordinatorTutorList;
