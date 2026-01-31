import React from 'react';
import { Card, CardContent, Box, Avatar, Divider, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import TextMui from '../text.mui.component';

function TutorCard({ tutor }) {
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
                        sx={{ width: 80, height: 80, bgcolor: '#ed6c02', mb: 2, fontSize: '2rem' }} // Orange for Tutors
                        src={tutor.photoUrl || ''}
                    >
                        {getInitials(tutor.name)}
                    </Avatar>
                    <TextMui value={tutor.name} variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
                        <EmailIcon fontSize="small" />
                        <TextMui value={tutor.email} variant="caption" />
                    </Box>
                    <Chip
                        label={tutor.specialty}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextMui value="Área:" variant="caption" sx={{ fontWeight: 'bold' }} />
                        <TextMui value={tutor.area} variant="body2" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextMui value="Estudiantes Asignados:" variant="caption" sx={{ fontWeight: 'bold' }} />
                        <Chip
                            icon={<GroupIcon sx={{ fontSize: '1rem !important' }} />}
                            label={tutor.assignedStudents}
                            size="small"
                            color={tutor.assignedStudents > 0 ? "secondary" : "default"}
                        />
                    </Box>
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <WorkIcon fontSize="small" />
                    <TextMui value={tutor.department} variant="caption" />
                </Box>
            </CardContent>
        </Card>
    );
}

export default TutorCard;
