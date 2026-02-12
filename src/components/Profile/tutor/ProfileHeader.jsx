import { Box, Typography, Card, CardContent, Avatar, Chip, IconButton, Button } from "@mui/material";
import { Lock as LockIcon, Edit as EditIcon } from "@mui/icons-material";

function ProfileHeader({ name, subtitle, initials, tags, studentData, onChangePassword, onEditProfile }) {
    // Si se pasan props individuales, usarlas. Si no, intentar sacar de studentData (compatibilidad hacia atrás por si se reutiliza)
    const displayName = name || studentData?.name;
    const displaySubtitle = subtitle || (studentData ? `Estudiante de ${studentData?.carrera || 'Carrera no definida'}` : '');
    const displayInitials = initials || studentData?.initials;
    const displayTags = tags || [studentData?.semestre, studentData?.status].filter(Boolean);
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
                            {displayInitials || "U"}
                        </Avatar>
                    </Box>

                    {/* Name and Info */}
                    <Box sx={{ flex: 1, mt: 5 }}>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            {displaySubtitle}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {displayTags && displayTags.map((tag, index) => (
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


                    {/* Actions */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {onEditProfile && (
                            <Button
                                onClick={onEditProfile}
                                variant="contained"
                                startIcon={<EditIcon />}
                                size="small"
                                sx={{
                                    bgcolor: '#000A9B',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: '#00087a',
                                    },
                                    boxShadow: 2
                                }}
                            >
                                Editar Perfil
                            </Button>
                        )}

                        {onChangePassword && (
                            <Button
                                onClick={onChangePassword}
                                variant="contained"
                                startIcon={<LockIcon />}
                                size="small"
                                sx={{
                                    bgcolor: '#2e7d32',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: '#1b5e20',
                                    },
                                    boxShadow: 2
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
