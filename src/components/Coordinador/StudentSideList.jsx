import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    Button,
    ButtonGroup
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

/**
 * Componente de lista lateral de estudiantes para revisión de prerrequisitos
 * Muestra estudiantes con filtros y búsqueda
 */
function StudentSideList({ students, selectedStudentId, onSelectStudent }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPending, setFilterPending] = useState(false);

    // Filtrar estudiantes según búsqueda y filtro
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toString().includes(searchTerm);
        const matchesFilter = !filterPending || !student.allApproved;
        return matchesSearch && matchesFilter;
    });

    return (
        <Box sx={{
            width: 300,
            height: '100%',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#FAFAFA'
        }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Estudiantes
                </Typography>

                {/* Búsqueda */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Busca por nombre o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                {/* Filtros */}
                <ButtonGroup size="small" fullWidth variant="outlined">
                    <Button
                        onClick={() => setFilterPending(!filterPending)}
                        variant={filterPending ? "contained" : "outlined"}
                    >
                        Filter Pending
                    </Button>
                    <Button variant="outlined">
                        Sort Date
                    </Button>
                </ButtonGroup>
            </Box>

            {/* Lista de estudiantes */}
            <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                {filteredStudents.map((student) => (
                    <ListItem
                        key={student.id}
                        disablePadding
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: selectedStudentId === student.id ? '#E3F2FD' : 'white',
                        }}
                    >
                        <ListItemButton onClick={() => onSelectStudent(student)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#C2185B', width: 40, height: 40 }}>
                                    {student.name.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" fontWeight="600">
                                        {student.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        ID: {student.id}
                                    </Typography>
                                }
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {student.timeAgo}
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                ))}

                {filteredStudents.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No se encontraron estudiantes
                        </Typography>
                    </Box>
                )}
            </List>
        </Box>
    );
}

export default StudentSideList;
