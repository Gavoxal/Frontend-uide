import React, { useState } from 'react';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import SearchBar from '../../components/SearchBar.component';
import TextMui from '../../components/text.mui.component';
import InputMui from '../../components/input.mui.component';
import ButtonMui from '../../components/button.mui.component';
import StudentCard from '../../components/Director/StudentCard.mui';

function DirectorStudentList() {
    const navigate = useNavigate();

    // Mock Data
    const [students, setStudents] = useState([
        {
            id: 1,
            cedula: '1150077467',
            name: 'Abad Montesdeoca Nicole Belen',
            sex: 'Femenino',
            status: 'Activo',
            campus: 'UIDE - Loja',
            school: 'Ingenieria en Tecnologias de la Información - Loja',
            malla: 'ITIL_MALLA 2019',
            period: 'SEM LOJA OCT 2025 – FEB 2026',
            email: 'niabadmo@uide.edu.ec',
            location: 'LOJA, ECUADOR',
            photoUrl: ""
        },
        {
            id: 2,
            cedula: '1900714773',
            name: 'Acacho Yangari Daddy Abel',
            sex: 'Masculino',
            status: 'Activo',
            campus: 'UIDE - Loja',
            school: 'Ingenieria en Tecnologias de la Información - Loja',
            malla: 'ITIL_MALLA 2019',
            period: 'SEM LOJA OCT 2025 – FEB 2026',
            email: 'daacachoya@uide.edu.ec',
            location: 'ZAMORA, ECUADOR',
            photoUrl: ""
        },
        {
            id: 3,
            cedula: '1050195104',
            name: 'Ajila Armijos Cristian Xavier',
            sex: 'Masculino',
            status: 'Activo',
            campus: 'UIDE - Loja',
            school: 'Sistemas de Información Loja',
            malla: 'SINL_MALLA 2023',
            period: 'SEM LOJA OCT 2025 – FEB 2026',
            email: 'crajilaar@uide.edu.ec',
            location: 'LOJA, ECUADOR',
            photoUrl: ""
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.cedula.includes(searchTerm)
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <TextMui value="Listado de Estudiantes Registrados" variant="h4" />
                    <TextMui value="Visualización de perfiles estudiantiles" variant="body1" />
                </Box>
                <Box sx={{ width: '200px' }}>
                    <ButtonMui
                        name="Carga Masiva"
                        onClick={() => navigate('/director/student-load')}
                        startIcon={<PersonAddIcon />}
                        backgroundColor="#1976d2"
                    />
                </Box>
            </Box>



            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, cédula..."
                title="Buscar Estudiantes"
            />

            <Grid container spacing={3}>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={student.cedula}>
                            <StudentCard student={student} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <TextMui value="No se encontraron estudiantes" variant="h6" color="text.secondary" />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box >
    );
}

export default DirectorStudentList;
