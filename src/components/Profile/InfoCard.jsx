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
    ListItemText
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

function InfoItem({ icon, label, value }) {
    return (
        <ListItem sx={{ px: 0, py: 2 }}>
            <ListItemIcon sx={{ minWidth: 56, color: "#1976d2" }}>
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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

function InfoCard({ title, items, onEdit }) {
    return (
        <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {title}
                    </Typography>
                    {onEdit && (
                        <IconButton
                            size="small"
                            sx={{ color: "#1976d2" }}
                            onClick={onEdit}
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>

                <Divider sx={{ mb: 2 }} />

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

export default InfoCard;
