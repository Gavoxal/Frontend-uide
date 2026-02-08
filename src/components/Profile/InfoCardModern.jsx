import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

function InfoItem({ icon, label, value }) {
    return (
        <ListItem
            sx={{
                px: 2,
                py: 2,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": {
                    bgcolor: "rgba(102, 126, 234, 0.04)", // Subtle hover effect using primary theme color
                    transform: "translateX(4px)"
                },
                mb: 1
            }}
        >
            <Avatar
                sx={{
                    bgcolor: "rgba(25, 118, 210, 0.1)", // Light blue background
                    color: "#1976d2", // Primary Blue
                    width: 40,
                    height: 40,
                    mr: 2
                }}
            >
                {icon}
            </Avatar>
            <ListItemText
                primary={
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {label}
                    </Typography>
                }
                secondary={
                    <Typography variant="body1" color="text.primary" fontWeight="500">
                        {value || "No registrado"}
                    </Typography>
                }
            />
        </ListItem>
    );
}

function InfoCardModern({ title, items, onEdit }) {
    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: 3,
                overflow: 'visible', // For potential future effects
                transition: "box-shadow 0.3s",
                "&:hover": {
                    boxShadow: 6
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#1a237e" }}> {/* Deep Blue title */}
                        {title}
                    </Typography>
                    {onEdit && (
                        <IconButton
                            size="small"
                            sx={{
                                color: "#1976d2",
                                bgcolor: "rgba(25, 118, 210, 0.05)",
                                "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" }
                            }}
                            onClick={onEdit}
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>

                <Divider sx={{ mb: 2, opacity: 0.6 }} />

                <List sx={{ p: 0 }}>
                    {items.map((item, index) => (
                        <InfoItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

export default InfoCardModern;
