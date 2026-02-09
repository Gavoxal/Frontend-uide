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

function DirectorStudentList() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            // Asumimos que hay un servicio para obtener estudiantes
            // Si no existe, debemos crearlo o usar uno existente
            // Revisando servicios... UserService.getAll() podría servir si filtra por rol
            // O crear un endpoint específico.
            // Por ahora, intentemos usar la API de usuarios con filtro
            // Importar UserService al inicio del archivo
            const response = await fetch('/api/v1/usuarios?rol=ESTUDIANTE', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Mapear datos al formato de la tarjeta
                const mapped = data.map(u => ({
                    id: u.id,
                    cedula: u.cedula,
                    name: `${u.nombres} ${u.apellidos}`,
                    sex: 'No especificado', // No está en modelo Usuario simple
                    status: u.activo ? 'Activo' : 'Inactivo',
                    campus: 'UIDE - Loja', // Hardcoded o de perfil
                    school: u.estudiantePerfil?.escuela || 'Sin Carrera',
                    malla: u.estudiantePerfil?.malla || 'Sin Malla',
                    period: 'Periodo Actual',
                    email: u.email,
                    location: 'Loja, Ecuador',
                    photoUrl: ""
                }));
                setStudents(mapped);
            }
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
