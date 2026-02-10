import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
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
import { getDataUser } from "../../storage/user.model.jsx";

// Coordinador Profile Component
function CoordinadorProfile() {
    const user = getDataUser();

    // Mock user data for Coordinador
    const [coordinadorData] = useState({
        name: `${user?.name} ${user?.lastName}`,
        initials: `${user?.name?.charAt(0)}${user?.lastName?.charAt(0)}`,
        email: "coordinador@uide.edu.ec",
        cedula: "1106789012",
        sede: "UIDE - Loja",
        role: "Coordinador",
        department: "Facultad de Ingeniería",
        status: "Activo",
        telefono: "+593 993456789",
        direccion: "Loja, Ecuador",
        extension: "Ext. 3020"
    });

    // Prepare personal info items for InfoCard
    const personalInfoItems = [
        { icon: <EmailIcon color="primary" />, label: "Email Institucional", value: coordinadorData.email },
        { icon: <PhoneIcon color="primary" />, label: "Teléfono", value: coordinadorData.telefono },
        { icon: <LocationIcon color="primary" />, label: "Ubicación", value: coordinadorData.direccion },
        { icon: <SchoolIcon color="primary" />, label: "Sede", value: coordinadorData.sede },
        { icon: <BusinessIcon color="primary" />, label: "Departamento", value: coordinadorData.department },
        { icon: <BadgeIcon color="primary" />, label: "Identificación", value: coordinadorData.cedula }
    ];

    // State for password change dialog
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    // Handlers
    const handleChangePassword = () => setOpenPasswordDialog(true);
    const handlePasswordSubmit = (passwordData) => {

        // TODO: Implement API call to change password
        alert("Contraseña cambiada exitosamente");
    };
    const handleEditPersonalInfo = () => alert("Editar perfil no implementado en esta demo");
    return (
        <Box sx={{ width: "100%" }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Perfil de Coordinador
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gestión de información académica y personal
                </Typography>
            </Box>

            {/* Profile Header Card */}
            <ProfileHeader
                name={coordinadorData.name}
                subtitle={coordinadorData.role}
                initials={coordinadorData.initials}
                tags={[coordinadorData.sede, coordinadorData.status]}
                onChangePassword={handleChangePassword}
            />

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={8}>
                    <InfoCard
                        title="Información de Contacto"
                        items={personalInfoItems}
                        onEdit={handleEditPersonalInfo}
                    />
                </Grid>

                {/* Side Card for Academic Details */}
                <Grid item xs={12} md={4}>
                    <InfoCard
                        title="Detalles Académicos"
                        items={[
                            { icon: <BadgeIcon color="secondary" />, label: "Cargo", value: coordinadorData.role },
                            { icon: <SchoolIcon color="secondary" />, label: "Facultad", value: "Ciencias de la Ingeniería" },
                            { icon: <AssignmentIcon color="secondary" />, label: "Extensión", value: coordinadorData.extension }
                        ]}
                        onEdit={() => alert("Editar detalles no implementado en esta demo")}
                    />
                </Grid>
            </Grid>

            {/* Password Change Dialog */}
            <ChangePasswordDialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                onSubmit={handlePasswordSubmit}
            />
        </Box>
    );
}

export default CoordinadorProfile;
