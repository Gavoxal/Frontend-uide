import { Box, Card, CardContent, Typography, Avatar, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import StatusBadge from "./StatusBadge";

function StudentCard({ student, onClick }) {
    const { name, cedula, email, cycle, phase, status } = student;

    return (
        <Card
            sx={{
                cursor: onClick ? "pointer" : "default",
                transition: "all 0.3s",
                "&:hover": onClick
                    ? {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                    }
                    : {},
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                            width: 56,
                            height: 56,
                            mr: 2,
                        }}
                    >
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            {name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                            <BadgeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {cedula}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {email}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Ciclo
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {cycle}°
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Fase
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {phase || "N/A"}
                        </Typography>
                    </Box>
                    <StatusBadge status={status} />
                </Box>
            </CardContent>
        </Card>
    );
}

export default StudentCard;
