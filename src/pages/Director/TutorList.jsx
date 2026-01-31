import React, { useState } from 'react';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import TextMui from '../../components/text.mui.component';
import InputMui from '../../components/input.mui.component';
import ButtonMui from '../../components/button.mui.component';
import TutorCard from '../../components/Director/TutorCard.mui';

function DirectorTutorList() {
    const navigate = useNavigate();

    // Mock Data
    const [tutors, setTutors] = useState([
        {
            id: 1,
            name: 'Ing. Carlos Mendez, PhD',
            email: 'carlos.mendez@uide.edu.ec',
            specialty: 'Inteligencia Artificial',
            area: 'Ciencia de Datos',
            department: 'Escuela de Ingeniería TI',
            assignedStudents: 3,
            photoUrl: ""
        },
        {
            id: 2,
            name: 'Dra. Maria Elena Silva',
            email: 'maria.silva@uide.edu.ec',
            specialty: 'Gestión de Proyectos',
            area: 'Gestión TI',
            department: 'Escuela de Ingeniería TI',
            assignedStudents: 5,
            photoUrl: ""
        },
        {
            id: 3,
            name: 'Msc. Jorge Ramiro',
            email: 'jorge.ramiro@uide.edu.ec',
            specialty: 'Desarrollo Web',
            area: 'Ingeniería de Software',
            department: 'Escuela de Ingeniería TI',
            assignedStudents: 1,
            photoUrl: ""
        },
        {
            id: 4,
            name: 'Ing. Sofia Castro',
            email: 'sofia.castro@uide.edu.ec',
            specialty: 'Ciberseguridad',
            area: 'Redes y Seguridad',
            department: 'Escuela de Ingeniería TI',
            assignedStudents: 0,
            photoUrl: ""
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");

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
                <Box sx={{ width: '200px' }}>
                    <ButtonMui
                        name="Añadir Tutor"
                        onClick={() => navigate('/director/tutors/create')}
                        startIcon={<PersonAddIcon />}
                        backgroundColor="#ed6c02"
                    />
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

export default DirectorTutorList;
