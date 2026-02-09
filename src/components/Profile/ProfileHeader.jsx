import { Box, Typography, Card, CardContent, Avatar, Chip, IconButton, Button } from "@mui/material";
import { CameraAlt as CameraIcon, Lock as LockIcon } from "@mui/icons-material";

function ProfileHeader({ studentData, onEditProfile, onEditCover, onChangePassword }) {
    const { name, subtitle, initials, tags } = {
        name: studentData?.name,
        subtitle: `Estudiante de ${studentData?.carrera || 'Carrera no definida'}`,
        initials: studentData?.initials,
        tags: [studentData?.semestre, studentData?.status].filter(Boolean)
    };
    return (
        <Card
            sx={{
                mb: 3,
                overflow: "visible",
                boxShadow: 2
            }}
        >
            {/* Gradient Top Section */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    height: 120,
                    position: "relative"
                }}
            />

            {/* White Content Section */}
            <CardContent sx={{ pt: 0, pb: 3, px: 3 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mt: -5 }}>
                    {/* Avatar with Camera Icon */}
                    <Box sx={{ position: "relative" }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: "#ffa726",
                                fontSize: "2rem",
                                fontWeight: "bold",
                                border: "4px solid white",
                                boxShadow: 3
                            }}
                        >
                            {initials || "U"}
                        </Avatar>
                        <IconButton
                            size="small"
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                bgcolor: "white",
                                border: "2px solid #e0e0e0",
                                width: 32,
                                height: 32,
                                "&:hover": {
                                    bgcolor: "#f5f5f5"
                                }
                            }}
                        >
                            <CameraIcon sx={{ fontSize: 16, color: "#666" }} />
                        </IconButton>
                    </Box>

                    {/* Name and Info */}
                    <Box sx={{ flex: 1, mt: 5 }}>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            {subtitle}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {tags && tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#e8eaf6" : "#e8f5e9",
                                        color: index % 2 === 0 ? "#5c6bc0" : "#4caf50",
                                        fontWeight: "600",
                                        fontSize: "0.75rem"
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Edit Profile Button & Change Password */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <IconButton onClick={onEditProfile} title="Editar Perfil">
                            {/* Existing logic or icon if any */}
                        </IconButton>

                        {onChangePassword && (
                            <Button
                                onClick={onChangePassword}
                                variant="outlined"
                                startIcon={<LockIcon />}
                                size="small"
                                sx={{
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    '&:hover': {
                                        bgcolor: '#e8eaf6',
                                        borderColor: '#5c6bc0'
                                    }
                                }}
                            >
                                Cambiar Contraseña
                            </Button>
                        )}
                    </Box>

                </Box>
            </CardContent>
        </Card>
    );
}

export default ProfileHeader;
