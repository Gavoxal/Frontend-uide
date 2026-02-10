import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    IconButton,
    TextField,
    MenuItem,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput
} from '@mui/material';

// Icons
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';

// Components
import TextMui from '../../components/text.mui.component';
import ButtonMui from '../../components/button.mui.component';
import SearchBar from '../../components/SearchBar.component';
import StatsCard from '../../components/common/StatsCard';
import AlertMui from '../../components/alert.mui.component';
import NotificationMui from '../../components/notification.mui.component';
import TooltipMui from '../../components/tooltip.mui.component';

import { CommitteeService } from '../../services/committee.service';
import { useEffect } from 'react';

function DirectorCommitteeManagement() {
    // Form state
    const [formData, setFormData] = useState({
        cedula: '',
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        role: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dynamic data - committee members
    const [members, setMembers] = useState([]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const data = await CommitteeService.getMembers();
            // Mapear datos del backend al formato esperado por el frontend si es necesario
            const mappedMembers = data.map(m => ({
                id: m.id,
                name: `${m.nombres} ${m.apellidos}`,
                email: m.correoInstitucional,
                cedula: m.cedula,
                role: m.designacion || 'Miembro',
                status: 'Activo',
                createdAt: m.createdAt.split('T')[0],
                nombres: m.nombres,
                apellidos: m.apellidos
            }));
            setMembers(mappedMembers);
        } catch (error) {
            console.error("Error fetching members:", error);
            setErrorMsg("Error al cargar los miembros del comité.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const roles = ['Presidente', 'Jurado 1', 'Jurado 2', 'Miembro'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nombres || !formData.apellidos || !formData.email || (!editMode && !formData.password) || !formData.cedula) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        setPendingFormData(formData);
        setOpenConfirmAlert(true);
    };

    const confirmSubmit = async () => {
        if (!pendingFormData) return;

        try {
            if (editMode && selectedMember) {
                // TODO: Implementar update en el service si es necesario
                // Por ahora solo mostraremos éxito mock para edición si no está el endpoint listo
                setSuccessMsg(`Funcionalidad de edición en desarrollo.`);
            } else {
                await CommitteeService.createMember(pendingFormData);
                setSuccessMsg(`Miembro del comité "${pendingFormData.nombres} ${pendingFormData.apellidos}" registrado exitosamente. Se ha enviado un correo con sus credenciales.`);
                fetchMembers();
            }
        } catch (error) {
            console.error("Error saving member:", error);
            setErrorMsg("Error al guardar el miembro. Verifique si el correo ya existe.");
        }

        setFormData({ cedula: '', nombres: '', apellidos: '', email: '', password: '', role: '' });
        setSelectedMember(null);
        setOpenConfirmAlert(false);
        setPendingFormData(null);
    };

    const handleEdit = (member) => {
        setFormData({
            cedula: member.cedula || '',
            nombres: member.nombres || '',
            apellidos: member.apellidos || '',
            email: member.email,
            password: '',
            role: member.role || 'Miembro'
        });
        setSelectedMember(member);
        setEditMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (member) => {
        setSelectedMember(member);
        setOpenDeleteAlert(true);
    };

    const confirmDelete = async () => {
        try {
            await CommitteeService.deleteMember(selectedMember.id);
            setSuccessMsg(`Miembro "${selectedMember.name}" eliminado exitosamente.`);
            fetchMembers();
        } catch (error) {
            console.error("Error deleting member:", error);
            setErrorMsg("No se pudo eliminar al miembro.");
        }
        setOpenDeleteAlert(false);
        setSelectedMember(null);
    };

    const cancelEdit = () => {
        setFormData({ cedula: '', name: '', email: '', password: '', role: '' });
        setSelectedMember(null);
        setEditMode(false);
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: members.length,
        presidente: members.filter(m => m.role === 'Presidente').length,
        juez1: members.filter(m => m.role === 'Juez 1').length,
        juez2: members.filter(m => m.role === 'Juez 2').length
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Presidente': return 'error';
            case 'Juez 1': return 'primary';
            case 'Juez 2': return 'secondary';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <TextMui value="Gestión de Comité de Titulación" variant="h4" />
                <TextMui value="Registro y administración de miembros del tribunal" variant="body1" />
            </Box>



            {/* Success Message */}
            {successMsg && (
                <Box sx={{ mb: 3 }}>
                    <NotificationMui severity="success" onClose={() => setSuccessMsg('')}>
                        {successMsg}
                    </NotificationMui>
                </Box>
            )}

            {/* --- CONTENEDOR DE DOS COLUMNAS A TODO ANCHO --- */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    width: '100%'
                }}
            >
                {/* COLUMNA IZQUIERDA: FORMULARIO */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 33%' }, minWidth: 0 }}>
                    <Card sx={{
                        position: { md: 'sticky' },
                        top: { md: 20 },
                        boxShadow: 3,
                        borderRadius: 2,
                        width: '100%' // Asegura que el Card llene su celda del grid
                    }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {editMode ? 'Editar Miembro' : 'Registrar Miembro'}
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Cédula"
                                        name="cedula"
                                        value={formData.cedula}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Nombres"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Apellidos"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Correo Electrónico"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                    />
                                    <FormControl fullWidth variant="outlined" required size="small">
                                        <InputLabel>Contraseña</InputLabel>
                                        <OutlinedInput
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Contraseña"
                                        />
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Rol"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>{role}</MenuItem>
                                        ))}
                                    </TextField>

                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <ButtonMui
                                            name={editMode ? 'Actualizar' : 'Registrar'}
                                            type="submit"
                                            startIcon={<PersonAddIcon />}
                                            backgroundColor={editMode ? '#ed6c02' : '#2e7d32'}
                                            fullWidth={true}
                                        />
                                        {editMode && (
                                            <ButtonMui
                                                name="X"
                                                onClick={cancelEdit}
                                                backgroundColor="#757575"
                                                fullWidth={false}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Box>

                {/* COLUMNA DERECHA: TABLA */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 67%' }, minWidth: 0 }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, email o rol..."
                        title="Buscar Miembros"
                    />

                    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                        <Table size="small" sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre / Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMembers.map((member) => (
                                    <TableRow key={member.id} hover>
                                        <TableCell>{member.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{member.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={member.role} color={getRoleColor(member.role)} size="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" color="primary" onClick={() => handleEdit(member)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(member)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* Delete Confirmation Dialog */}
            <AlertMui
                open={openDeleteAlert}
                handleClose={() => setOpenDeleteAlert(false)}
                title="Confirmar Eliminación"
                message={
                    <Box sx={{ mt: 2 }}>
                        <Typography>¿Está seguro que desea eliminar al miembro <strong>{selectedMember?.name}</strong>?</Typography>
                    </Box>
                }
                status="warning"
                showBtnL={true} btnNameL="Eliminar" actionBtnL={confirmDelete}
                showBtnR={true} btnNameR="Cancelar" actionBtnR={() => setOpenDeleteAlert(false)}
            />

            {/* Register/Update Confirmation Dialog */}
            <AlertMui
                open={openConfirmAlert}
                handleClose={() => setOpenConfirmAlert(false)}
                title={editMode ? "Confirmar Actualización" : "Confirmar Registro"}
                message={
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {editMode ? '¿Actualizar información?' : '¿Registrar nuevo miembro?, se enviara un correo para confirmar el registro'}
                        </Typography>
                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Typography variant="body2"><strong>Nombre:</strong> {pendingFormData?.nombres} {pendingFormData?.apellidos}</Typography>
                            <Typography variant="body2"><strong>Rol:</strong> {pendingFormData?.role}</Typography>
                        </Box>
                    </Box>
                }
                status="info"
                showBtnL={true} btnNameL={editMode ? "Actualizar" : "Registrar"} actionBtnL={confirmSubmit}
                showBtnR={true} btnNameR="Cancelar" actionBtnR={() => { setOpenConfirmAlert(false); setPendingFormData(null); }}
            />
        </Box >
    );
}

export default DirectorCommitteeManagement;
