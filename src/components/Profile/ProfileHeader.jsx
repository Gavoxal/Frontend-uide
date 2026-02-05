import { Box, Typography, Card, CardContent, Avatar, Button, Chip, IconButton } from "@mui/material";
import { Edit as EditIcon, CameraAlt as CameraIcon } from "@mui/icons-material";

function ProfileHeader({ studentData, onEditProfile, onEditCover }) {
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
                    position: "relative",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    p: 2
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={onEditCover}
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        color: "#333",
                        fontWeight: "600",
                        "&:hover": {
                            backgroundColor: "white"
                        }
                    }}
                >
                    Editar Portada
                </Button>
            </Box>

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
                            {studentData.initials || "AY"}
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
                            {studentData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            Estudiante de {studentData.carrera}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Chip
                                label={studentData.semestre}
                                size="small"
                                sx={{
                                    backgroundColor: "#e8eaf6",
                                    color: "#5c6bc0",
                                    fontWeight: "600",
                                    fontSize: "0.75rem"
                                }}
                            />
                            <Chip
                                label={studentData.status}
                                size="small"
                                sx={{
                                    backgroundColor: "#e8f5e9",
                                    color: "#4caf50",
                                    fontWeight: "600",
                                    fontSize: "0.75rem"
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Edit Profile Button */}
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={onEditProfile}
                        sx={{
                            backgroundColor: "#667eea",
                            color: "white",
                            fontWeight: "600",
                            mt: 5,
                            "&:hover": {
                                backgroundColor: "#5568d3"
                            }
                        }}
                    >
                        Editar Perfil
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default ProfileHeader;
