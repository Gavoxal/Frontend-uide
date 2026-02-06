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
            />
        </Box>
    );
}

export default DirectorProfile;
