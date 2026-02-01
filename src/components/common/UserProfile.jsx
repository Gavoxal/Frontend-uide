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
            <Card sx={{ mb: 3, overflow: 'visible' }}>
                <Box sx={{
                    height: 120,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'flex-end',
                    px: 3,
                    pb: 1,
                    mb: 4
                }}>
                    <Box sx={{ position: 'relative', top: 30, display: 'flex', alignItems: 'flex-end' }}>
                        <Avatar
                            sx={{ width: 100, height: 100, border: '4px solid white', fontSize: '2.5rem', bgcolor: 'secondary.main' }}
                            src={user?.photoUrl}
                        >
                            {getInitials(user?.name)}
                        </Avatar>
                        <Box sx={{ ml: 2, mb: -1 }}>
                            <TextMui value={user?.name || "Usuario"} variant="h5" sx={{ fontWeight: 'bold' }} />
                            <TextMui value={user?.role || "Rol no definido"} variant="subtitle1" color="text.secondary" />
                        </Box>
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
