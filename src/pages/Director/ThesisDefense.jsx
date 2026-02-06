import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Chip, Avatar, Tooltip } from '@mui/material';
import TextMui from '../../components/text.mui.component';
import TribunalAssignment from '../../components/Director/TribunalAssignment.mui';
import StatsCard from '../../components/common/StatsCard'; // Importante
import InputMui from '../../components/input.mui.component'; // Importante

// Icons
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Importante
import SearchIcon from '@mui/icons-material/Search'; // Importante

function ThesisDefense() {
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Mock Data Completo
    const [studentsReady, setStudentsReady] = useState([
        {
            id: 1,
            name: 'Abad Montesdeoca Nicole Belen',
            email: 'niabadmo@uide.edu.ec',
            photoUrl: '', // mock
            topic: 'Implementación de IA para optimización de tráfico urbano en Loja',
            director: 'Ing. Wilson',
            career: 'Ing. Tecnologías de la Información',
            campus: 'UIDE - Loja',
            status: 'Habilitado',
            documents: {
                programmerManual: true,
                userManual: true,
                scientificArticle: true
            }
        },
        {
            id: 2,
            name: 'Acacho Yangari Daddy Abel',
            email: 'daacachoya@uide.edu.ec',
            photoUrl: '',
            topic: 'Sistema de gestión documental con Blockchain para la UIDE',
            director: 'Ing. Lorena',
            career: 'Ing. Tecnologías de la Información',
            campus: 'UIDE - Loja',
            status: 'Pendiente Documentación',
            documents: {
                programmerManual: true,
                userManual: false,
                scientificArticle: false
            }
        },
        {
            id: 3,
            name: 'Ajila Armijos Cristian Xavier',
            email: 'crajilaar@uide.edu.ec',
            photoUrl: '',
            topic: 'Aplicación móvil para turismo comunitario en Saraguro',
            director: 'Ing. Gabriel',
            career: 'Sistemas de Información',
            campus: 'UIDE - Loja',
            status: 'Habilitado',
            documents: {
                programmerManual: true,
                userManual: true,
                scientificArticle: true
            }
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterTab, setFilterTab] = useState("all"); // all, assigned, pending

    const handleCardClick = (student) => {
        setSelectedStudent(student);
    };

    const handleCloseAssignment = () => {
        setSelectedStudent(null);
    };

    const handleSaveAssignment = (assignmentData) => {
        // Actualizamos el estado del estudiante con la asignación
        const updatedStudents = studentsReady.map(s => {
            if (s.id === selectedStudent.id) {
                return {
                    ...s,
                    ...assignmentData,
                    tribunalAssigned: true // Marcamos como asignado
                };
            }
            return s;
        });
        setStudentsReady(updatedStudents);

        alert(`Tribunal asignado correctamente para: ${selectedStudent.name}\nAula: ${assignmentData.classroom}`);
        setSelectedStudent(null);
    };

    // Helper: Get Initials
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
        return name.slice(0, 2).toUpperCase();
    };

    // Estadísticas
    const stats = {
        assigned: studentsReady.filter(s => s.tribunalAssigned).length,
        pending: studentsReady.filter(s => !s.tribunalAssigned).length
    };

    // Filtros
    const filteredStudents = studentsReady.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterTab === 'assigned') return matchesSearch && student.tribunalAssigned;
        if (filterTab === 'pending') return matchesSearch && !student.tribunalAssigned;

        return matchesSearch;
    });

    // Componente interno ThesisDefenseCard
    const ThesisDefenseCard = ({ student, isSelected, onClick }) => {
        const allDocsReady = student.documents.programmerManual && student.documents.userManual && student.documents.scientificArticle;

        return (
            <Card
                onClick={() => onClick(student)}
                elevation={isSelected ? 8 : 3}
                sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s',
                    border: isSelected ? '2px solid #1976d2' : '1px solid transparent',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    backgroundColor: isSelected ? '#f5f9ff' : 'white',
                    filter: isSelected ? 'none' : (selectedStudent ? 'grayscale(0.4) opacity(0.8)' : 'none'), // Dim others
                    '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-3px)',
                        filter: 'none'
                    }
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            sx={{ width: 50, height: 50, bgcolor: '#1976d2', mr: 2 }}
                            src={student.photoUrl || ''}
                        >
                            {getInitials(student.name)}
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle1" fontWeight="bold" noWrap title={student.name}>
                                {student.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon fontSize="inherit" color="action" sx={{ fontSize: '0.8rem' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {student.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 1.5 }} />

                    <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                            Tema de Tesis
                        </Typography>
                        <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            height: '40px',
                            lineHeight: '1.2'
                        }} title={student.topic}>
                            {student.topic}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                            Director Asignado
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="inherit" sx={{ fontSize: '1rem', color: '#555' }} />
                            <Typography variant="body2">
                                {student.director}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Información de Defensa si está asignada */}
                    {student.tribunalAssigned && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                            <Typography variant="caption" fontWeight="bold" color="primary" sx={{ display: 'block' }}>
                                Defensa Programada:
                            </Typography>
                            <Typography variant="caption" display="block">
                                📅 {student.date} | 🕒 {student.time}
                            </Typography>
                            <Typography variant="caption" display="block">
                                🏫 {student.classroom}
                            </Typography>
                        </Box>
                    )}

                    {/* Document Indicators */}
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 0.5 }}>
                            Entregables:
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                            <Box title="Manual de Programador" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: student.documents.programmerManual ? 'green' : 'gray' }}>
                                <ArticleIcon fontSize="inherit" /> M. Prog.
                                {student.documents.programmerManual ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                            </Box>
                            <Box title="Manual de Usuario" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: student.documents.userManual ? 'green' : 'gray' }}>
                                <DescriptionIcon fontSize="inherit" /> M. Usu.
                                {student.documents.userManual ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                            </Box>
                        </Box>
                        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center', fontSize: '0.75rem', color: student.documents.scientificArticle ? 'green' : 'gray' }}>
                            <Box title="Artículo Científico" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ArticleIcon fontSize="inherit" /> Artículo Científico
                                {student.documents.scientificArticle ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Chip
                            label={student.tribunalAssigned ? "Defensa Asignada" : (allDocsReady ? "Habilitado para Defensa" : "Documentación Pendiente")}
                            color={student.tribunalAssigned ? "primary" : (allDocsReady ? "success" : "warning")}
                            size="small"
                        />
                    </Box>

                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Designación de Tribunal" variant="h4" />
                <TextMui value="Programación de defensas y asignación de jurados" variant="body1" />
            </Box>

            {/* Estadísticas / Filtros */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Filtrar pendientes" placement="top">
                        <Box
                            onClick={() => setFilterTab(filterTab === 'pending' ? 'all' : 'pending')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterTab === 'assigned' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterTab === 'pending' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Pendientes de Asignación"
                                value={stats.pending}
                                icon={<HourglassEmptyIcon fontSize="large" />}
                                color="warning"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Filtrar asignadas" placement="top">
                        <Box
                            onClick={() => setFilterTab(filterTab === 'assigned' ? 'all' : 'assigned')}
                            sx={{
                                cursor: 'pointer',
                                opacity: filterTab === 'pending' ? 0.5 : 1,
                                transition: '0.3s',
                                transform: filterTab === 'assigned' ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <StatsCard
                                title="Defensas Asignadas"
                                value={stats.assigned}
                                icon={<CheckCircleIcon fontSize="large" />}
                                color="success"
                            />
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>

            {/* Buscador */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <InputMui
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startIcon={<SearchIcon color="action" />}
                    />
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Lista de Estudiantes (Cards) - Ocupa todo el ancho siempre */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
                                    <ThesisDefenseCard
                                        student={student}
                                        isSelected={selectedStudent?.id === student.id}
                                        onClick={handleCardClick}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">No se encontraron defensas con los filtros aplicados.</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>

            {/* Dialog de Asignación (Fuera del Grid principal) */}
            {selectedStudent && (
                <TribunalAssignment
                    student={selectedStudent}
                    onClose={handleCloseAssignment}
                    onSave={handleSaveAssignment}
                />
            )}
        </Box>
    );
}

export default ThesisDefense;
