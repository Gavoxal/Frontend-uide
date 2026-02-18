import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import SearchBar from '../../components/SearchBar.component';
import TextMui from '../../components/text.mui.component';
import InputMui from '../../components/input.mui.component';
import ButtonMui from '../../components/button.mui.component';
import TutorCard from '../../components/Director/TutorCard.mui';
import { TutoringService } from '../../services/tutoring.service';

function DirectorTutorList() {
    const navigate = useNavigate();
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            const data = await TutoringService.getTutorsStats();
            // Mapear al formato que espera TutorCard si es necesario
            const mappedTutors = data.map(t => ({
                id: t.id,
                name: `${t.nombres} ${t.apellidos}`,
                email: t.correoInstitucional,
                specialty: t.especialidad || 'Docente Académico',
                area: t.area || 'Titulaciones',
                department: t.departamento || 'Escuela de Ingeniería TI',
                assignedStudents: t.trabajosActivos,
                photoUrl: t.fotoUrl || ""
            }));
            setTutors(mappedTutors);
            setLoading(false);
        };
        fetchTutors();
    }, []);

    const filteredTutors = tutors.filter(tutor =>
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <TextMui value="Listado de Tutores Académicos" variant="h4" />
                    <TextMui value="Gestión del cuerpo docente para titulaciones" variant="body1" />
                </Box>
                <Box>
                </Box>
            </Box>



            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, especialidad..."
                title="Buscar Tutores"
            />

            <Grid container spacing={3}>
                {loading ? (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress sx={{ color: '#667eea' }} />
                        </Box>
                    </Grid>
                ) : filteredTutors.length > 0 ? (
                    filteredTutors.map((tutor) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={tutor.id}>
                            <TutorCard tutor={tutor} />
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <TextMui value="No se encontraron tutores" variant="h6" color="text.secondary" />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default DirectorTutorList;
