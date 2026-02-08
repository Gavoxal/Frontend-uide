<<<<<<< HEAD
import React from 'react';
import { Box } from '@mui/material';
import UserProfile from '../../components/common/UserProfile';
import TextMui from '../../components/text.mui.component';

function DirectorProfile() {
    // Mock user data - normally fetched from API/Auth context
    const user = {
        name: "Ing. Pablo Torres, PhD",
        email: "pablo.torres@uide.edu.ec",
        role: "Director de Carrera",
        photoUrl: ""
    };

    // Fields configuration for Director
    const fields = [
        { label: "Nombres Completos", name: "name", value: user.name, editable: true },
        { label: "Correo Institucional", name: "email", value: user.email, editable: false },
        { label: "Cargo", name: "role", value: user.role, editable: false },
        { label: "Departamento", name: "department", value: "Facultad de Ingeniería", editable: true },
        { label: "Extensión", name: "extension", value: "UIDE - Loja", editable: false },
        { label: "Teléfono", name: "phone", value: "0991234567", editable: true },
    ];

    const handleSave = (updatedData) => {
        console.log("Saving profile data:", updatedData);
        alert("Perfil actualizado correctamente (Simulación)");
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextMui value="Mi Perfil" variant="h4" />
                <TextMui value="Gestiona tu información personal y de cuenta" variant="body1" />
            </Box>

            <UserProfile
                user={user}
                fields={fields}
                onSave={handleSave}
=======
import React, { useState } from "react";
import { Box, Typography, Grid, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Business as BusinessIcon,
    Badge as BadgeIcon
} from "@mui/icons-material";

import ProfileHeader from "../../components/Profile/ProfileHeader";
import InfoCard from "../../components/Profile/InfoCard";
import ChangePasswordDialog from "../../components/Profile/ChangePasswordDialog";

// Director Profile Component standardized with Student Profile
function DirectorProfile() {
    // Mock user data for Director
    const [directorData] = useState({
        name: "Ing. Pablo Torres, PhD",
        initials: "PT",
        email: "pablo.torres@uide.edu.ec",
        cedula: "1104567890",
        sede: "UIDE - Loja",
        role: "Director de Carrera",
        department: "Facultad de Ingeniería",
        status: "Activo",
        telefono: "+593 991234567",
        direccion: "Loja, Ecuador",
        extension: "Ext. 2024"
    });

    // Prepare personal info items for InfoCard
    const personalInfoItems = [
        { icon: <EmailIcon color="primary" />, label: "Email Institucional", value: directorData.email },
        { icon: <PhoneIcon color="primary" />, label: "Teléfono", value: directorData.telefono },
        { icon: <LocationIcon color="primary" />, label: "Ubicación", value: directorData.direccion },
        { icon: <SchoolIcon color="primary" />, label: "Sede", value: directorData.sede },
        { icon: <BusinessIcon color="primary" />, label: "Departamento", value: directorData.department },
        { icon: <BadgeIcon color="primary" />, label: "Identificación", value: directorData.cedula }
    ];

    // State for password change dialog
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    // Handlers
    const handleChangePassword = () => setOpenPasswordDialog(true);
    const handlePasswordSubmit = (passwordData) => {
        console.log("Cambiar contraseña:", passwordData);
        // TODO: Implement API call to change password
        alert("Contraseña cambiada exitosamente");
    };
    const handleEditPersonalInfo = () => console.log("Editar información personal");

    return (
        <Box sx={{ width: "100%" }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Perfil de Director
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gestión de información académica y personal
                </Typography>
            </Box>

            {/* Profile Header Card */}
            <ProfileHeader
                name={directorData.name}
                subtitle={directorData.role}
                initials={directorData.initials}
                tags={[directorData.sede, directorData.status]}
                onChangePassword={handleChangePassword}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Personal Information - Full width since no Requirements card */}
                <Grid item xs={12} md={8}>
                    <InfoCard
                        title="Información de Contacto"
                        items={personalInfoItems}
                        onEdit={handleEditPersonalInfo}
                    />
                </Grid>

                {/* Optional Side Card for Stats or other info (Placeholder for layout consistency) */}
                <Grid item xs={12} md={4}>
                    <InfoCard
                        title="Detalles Académicos"
                        items={[
                            { icon: <BadgeIcon color="secondary" />, label: "Cargo", value: directorData.role },
                            { icon: <SchoolIcon color="secondary" />, label: "Facultad", value: "Ciencias de la Ingeniería" },
                            { icon: <AssignmentIcon color="secondary" />, label: "Extensión", value: directorData.extension }
                        ]}
                        onEdit={() => console.log("Editar detalles")}
                    />
                </Grid>
            </Grid>

            {/* Password Change Dialog */}
            <ChangePasswordDialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                onSubmit={handlePasswordSubmit}
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
            />
        </Box>
    );
}

export default DirectorProfile;
