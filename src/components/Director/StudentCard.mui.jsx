import React from 'react';
import { Card, CardContent, Box, Avatar, Divider, Chip, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import TextMui from '../text.mui.component';

function StudentCard({ student }) {
    // Generar iniciales para el Avatar
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <Card elevation={3} sx={{ height: '100%', borderRadius: 2, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{ width: 80, height: 80, bgcolor: '#1976d2', mb: 2, fontSize: '2rem' }}
                        src={student.photoUrl || ''} // Fallback to initials if no photo
                    >
                        {getInitials(student.name)}
                    </Avatar>
                    <TextMui value={student.name} variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
                        <EmailIcon fontSize="small" />
                        <TextMui value={student.email} variant="caption" />
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextMui value="Cédula:" variant="caption" sx={{ fontWeight: 'bold' }} />
                        <TextMui value={student.cedula} variant="body2" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextMui value="Sede:" variant="caption" sx={{ fontWeight: 'bold' }} />
                        <TextMui value={student.campus} variant="body2" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextMui value="Carrera:" variant="caption" sx={{ fontWeight: 'bold' }} />
                        <TextMui value={student.school.substring(0, 25) + '...'} variant="caption" /> {/* Truncate long names */}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextMui value="Malla:" variant="caption" sx={{ fontWeight: 'bold' }} />
                        <TextMui value={student.malla} variant="caption" />
                    </Box>
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <LocationOnIcon fontSize="small" />
                    <TextMui value={student.location} variant="caption" />
                </Box>
            </CardContent>
        </Card>
    );
}

export default StudentCard;
