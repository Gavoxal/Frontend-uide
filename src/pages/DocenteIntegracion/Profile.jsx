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

// Docente Integración Profile Component
function DocenteIntegracionProfile() {
    const user = getDataUser();

    // Mock user data for Docente Integración
    const [docenteData] = useState({
        name: `${user?.name} ${user?.lastName}`,
        initials: `${user?.name?.charAt(0)}${user?.lastName?.charAt(0)}`,
        email: "docente.integracion@uide.edu.ec",
        cedula: "1105678901",
        sede: "UIDE - Loja",
        role: "Docente Integración",
        department: "Facultad de Ingeniería",
        status: "Activo",
        telefono: "+593 992345678",
        direccion: "Loja, Ecuador",
        extension: "Ext. 3015"
    });

    // Prepare personal info items for InfoCard
    const personalInfoItems = [
        { icon: <EmailIcon color="primary" />, label: "Email Institucional", value: docenteData.email },
        { icon: <PhoneIcon color="primary" />, label: "Teléfono", value: docenteData.telefono },
        { icon: <LocationIcon color="primary" />, label: "Ubicación", value: docenteData.direccion },
        { icon: <SchoolIcon color="primary" />, label: "Sede", value: docenteData.sede },
        { icon: <BusinessIcon color="primary" />, label: "Departamento", value: docenteData.department },
        { icon: <BadgeIcon color="primary" />, label: "Identificación", value: docenteData.cedula }
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
                    Perfil de Docente Integración
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gestión de información académica y personal
                </Typography>
            </Box>

            {/* Profile Header Card */}
            <ProfileHeader
                name={docenteData.name}
                subtitle={docenteData.role}
                initials={docenteData.initials}
                tags={[docenteData.sede, docenteData.status]}
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
                            { icon: <BadgeIcon color="secondary" />, label: "Cargo", value: docenteData.role },
                            { icon: <SchoolIcon color="secondary" />, label: "Facultad", value: "Ciencias de la Ingeniería" },
                            { icon: <AssignmentIcon color="secondary" />, label: "Extensión", value: docenteData.extension }
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

export default DocenteIntegracionProfile;
