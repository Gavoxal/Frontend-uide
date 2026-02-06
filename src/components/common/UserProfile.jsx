import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, Avatar, Typography, Divider, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TextMui from '../text.mui.component';

/**
 * Reusable User Profile Component
 * @param {Object} user - User data object { name, email, photoUrl, role, [other] }
 * @param {Array} fields - Array of field objects { label, name, type, value, editable }
 * @param {Function} onSave - Callback when saving changes
 */
function UserProfile({ user, fields = [], onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Initialize form data from fields
    React.useEffect(() => {
        const initialData = {};
        fields.forEach(field => {
            initialData[field.name] = field.value;
        });
        setFormData(initialData);
    }, [fields]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        if (onSave) {
            onSave(formData);
        }
        setIsEditing(false);
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <Box>
            {/* Header / Cover */}
            {/* Header / Cover */}
            <Card sx={{ mb: 3, overflow: 'visible' }}>
                {/* Cover Image Area */}
                <Box sx={{
                    height: 140,
                    bgcolor: 'primary.main',
                    background: 'linear-gradient(45deg, #000A9B 30%, #0022ff 90%)',
                }} />

                {/* Avatar and Info Area */}
                <Box sx={{ px: 3, pb: 3, mt: -6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' } }}>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid white',
                            fontSize: '3rem',
                            bgcolor: 'secondary.main',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        src={user?.photoUrl}
                    >
                        {getInitials(user?.name)}
                    </Avatar>

                    <Box sx={{ ml: { xs: 0, sm: 3 }, mt: { xs: 2, sm: 0 }, textAlign: { xs: 'center', sm: 'left' }, mb: 1 }}>
                        <TextMui value={user?.name || "Usuario"} variant="h4" sx={{ fontWeight: 'bold' }} />
                        <TextMui value={user?.role || "Rol no definido"} variant="h6" color="text.secondary" />
                    </Box>
                </Box>
            </Card>

            {/* Profile Content */}
            <Card>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <TextMui value="Información del Perfil" variant="h6" color="primary" />
                        {!isEditing ? (
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditing(true)}
                            >
                                Editar
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={3}>
                        {fields.map((field, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                {isEditing && field.editable ? (
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        size="medium"
                                        type={field.type || 'text'}
                                    />
                                ) : (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {field.label}
                                        </Typography>
                                        <Typography variant="body1">
                                            {field.value || formData[field.name] || 'N/A'}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default UserProfile;
