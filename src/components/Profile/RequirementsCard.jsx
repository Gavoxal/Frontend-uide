import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon, // Using Cancel (X) instead of Warning for missing
    OpenInNew as OpenInNewIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";

function RequirementItem({ requirement, onView, onEdit, onAction }) {
    // Status Logic
    const isComplete = requirement.status === "complete";
    const statusLabel = isComplete ? "Completo" : "Falta";

    // Icons
    const StatusIcon = isComplete ? CheckCircleIcon : CancelIcon;
    const iconColor = isComplete ? "#4caf50" : "#f44336";

    // Badge Styles
    const badgeBg = isComplete ? "#e8f5e9" : "#ffebee";
    const badgeColor = isComplete ? "#2e7d32" : "#c62828";

    return (
        <ListItem
            sx={{
                px: 0,
                py: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 2
            }}
        >
            {/* Status Icon (Left) */}
            <ListItemIcon sx={{ minWidth: 40, color: iconColor }}>
                <StatusIcon fontSize="medium" />
            </ListItemIcon>

            {/* Title */}
            <ListItemText
                primary={
                    <Typography variant="body1" color="text.primary">
                        {requirement.name}
                    </Typography>
                }
            />

            {/* Right Side: Badge + Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Status Badge */}
                <Chip
                    label={statusLabel}
                    size="small"
                    sx={{
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        fontWeight: "bold",
                        borderRadius: "12px",
                        px: 1
                    }}
                />

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Ver">
                        <IconButton size="small" onClick={() => onView && onView(requirement.id)}>
                            <VisibilityIcon fontSize="small" sx={{ color: "#757575" }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => onEdit && onEdit(requirement.id)}>
                            <EditIcon fontSize="small" sx={{ color: "#757575" }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Abrir enlace">
                        <IconButton size="small" onClick={() => onAction && onAction(requirement.id)}>
                            <OpenInNewIcon fontSize="small" sx={{ color: "#757575" }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </ListItem>
    );
}

function RequirementsCard({ requirements, onView, onEdit, onAction }) {
    return (
        <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Lista de Requisitos
                </Typography>

                <Divider sx={{ mb: 1 }} />

                <List sx={{ p: 0 }}>
                    {requirements.map((req, index) => (
                        <Box key={req.id}>
                            <RequirementItem
                                requirement={req}
                                onView={onView}
                                onEdit={onEdit}
                                onAction={onAction}
                            />
                            {index < requirements.length - 1 && <Divider component="li" />}
                        </Box>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

export default RequirementsCard;
