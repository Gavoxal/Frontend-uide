import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import SearchBar from '../../components/SearchBar.component';
import TextMui from '../../components/text.mui.component';
import InputMui from '../../components/input.mui.component';
import ButtonMui from '../../components/button.mui.component';
import StudentCard from '../../components/Director/StudentCard.mui';
import usuarioService from '../../services/usuario.service';

function DirectorStudentList() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await usuarioService.getEstudiantes();
            // Mapear datos al formato de la tarjeta
            const mapped = data.map(u => ({
                id: u.id,
                cedula: u.cedula,
                name: `${u.nombres} ${u.apellidos}`,
                sex: 'No especificado',
                status: u.activo ? 'Activo' : 'Inactivo',
                campus: 'UIDE - Loja',
                school: u.estudiantePerfil?.escuela || 'Sin Carrera',
                malla: u.estudiantePerfil?.malla || 'Sin Malla',
                period: 'Periodo Actual',
                email: u.correoInstitucional || u.correo || 'Sin correo',
                location: 'Loja, Ecuador',
                photoUrl: ""
            }));
            setStudents(mapped);
        } catch (error) {
            console.error("Error loading students:", error);
        } finally {
            setLoading(false);
        }
    };

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
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={student.cedula}>
                            <StudentCard student={student} />
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
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
