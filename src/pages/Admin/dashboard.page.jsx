import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { getDataUser } from "../../storage/user.model.jsx";
import uideImage from "../../assets/uide3.svg";

function DashboardPage() {
    const user = getDataUser();

    return (
        <Box>
            {/* Encabezado de bienvenida */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido al Sistema, {user?.name || "Usuario"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel de administración de hoteles
                </Typography>
            </Box>

            {/* Logo UIDE */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
                <img
                    src={uideImage}
                    alt="UIDE Logo"
                    style={{ height: "150px", width: "150px" }}
                />
            </Box>

            {/* Tarjetas de acceso rápido */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: "#000A9B",
                                        width: 56,
                                        height: 56,
                                        mr: 2,
                                    }}
                                >
                                    <HotelIcon fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Registro de Hotel
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Agregar nuevo hotel al sistema
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: "#FBBF24",
                                        width: 56,
                                        height: 56,
                                        mr: 2,
                                    }}
                                >
                                    <ListAltIcon fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Gestión de Hoteles
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ver y administrar hoteles registrados
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Información del usuario */}
            <Box sx={{ mt: 4, p: 3, bgcolor: "#F4F6F8", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    <strong>Rol:</strong> {user?.role || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Usuario:</strong> {user?.username || "N/A"}
                </Typography>
            </Box>
        </Box>
    );
}

export default DashboardPage;
