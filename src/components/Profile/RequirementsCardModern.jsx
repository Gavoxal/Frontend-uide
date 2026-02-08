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
    Tooltip,
    Avatar
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    OpenInNew as OpenInNewIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    ArrowForwardIos as ArrowForwardIcon,
    AccessTime as AccessTimeIcon
} from "@mui/icons-material";

function RequirementItem({ requirement, onView, onEdit, onAction }) {
    // Status Logic
    const isComplete = requirement.status === "complete";
    const isPending = requirement.status === "pending";

    let statusLabel = "Falta";
    if (isComplete) statusLabel = "Completo";
    if (isPending) statusLabel = "En Revisión";

    // Icons & Colors
    let StatusIcon = CancelIcon;
    if (isComplete) StatusIcon = CheckCircleIcon;
    if (isPending) StatusIcon = AccessTimeIcon;

    let baseColor = "#c62828"; // Red
    if (isComplete) baseColor = "#2e7d32"; // Green
    if (isPending) baseColor = "#f57c00"; // Orange

    let iconColor = "#f44336"; // Red
    if (isComplete) iconColor = "#4caf50"; // Green
    if (isPending) iconColor = "#ff9800"; // Orange

    let bgColor = "rgba(244, 67, 54, 0.1)"; // Red bg
    if (isComplete) bgColor = "rgba(76, 175, 80, 0.1)"; // Green bg
    if (isPending) bgColor = "rgba(255, 152, 0, 0.1)"; // Orange bg

    return (
        <ListItem
            sx={{
                px: 2,
                py: 2, // Reduced padding
                borderRadius: 2,
                mb: 1, // Reduced margin
                border: "1px solid transparent",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                    bgcolor: "white",
                    boxShadow: 2,
                    borderColor: "divider",
                    transform: "translateY(-1px)",
                    "& .action-buttons": {
                        opacity: 1,
                        transform: "translateX(0)"
                    }
                }
            }}
        >
            {/* Status Indicator Bar (Left) */}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3, // Thinner bar
                    bgcolor: iconColor
                }}
            />

            {/* Icon Avatar */}
            <Avatar
                sx={{
                    bgcolor: bgColor,
                    color: iconColor,
                    width: 36, // Smaller avatar
                    height: 36,
                    mr: 2
                }}
            >
                <StatusIcon fontSize="small" />
            </Avatar>

            {/* Title */}
            <ListItemText
                primary={
                    <Typography variant="body2" fontWeight="600" color="text.primary"> {/* Smaller text */}
                        {requirement.name}
                    </Typography>
                }
                secondary={
                    <Typography variant="caption" sx={{ color: baseColor, fontWeight: 500 }}>
                        {statusLabel.toUpperCase()}
                    </Typography>
                }
            />

            {/* Right Side: Actions */}
            <Box
                className="action-buttons"
                sx={{
                    display: "flex",
                    gap: 0.5, // Tighter gap
                    // Can make these slide in or just be visible. Let's make them visible but styled nicely.
                    opacity: { xs: 1, md: 0.8 },
                    transition: "all 0.2s"
                }}
            >
                <Tooltip title="Ver Detalle">
                    <IconButton
                        size="small"
                        onClick={() => onView && onView(requirement.id)}
                        sx={{ "&:hover": { color: "#1976d2" } }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Editar">
                    <IconButton
                        size="small"
                        onClick={() => onEdit && onEdit(requirement.id)}
                        sx={{ "&:hover": { color: "#1976d2" } }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Abrir enlace">
                    <IconButton
                        size="small"
                        onClick={() => onAction && onAction(requirement.id)}
                        sx={{ "&:hover": { color: "#1976d2" } }}
                    >
                        <OpenInNewIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </ListItem>
    );
}

function RequirementsCardModern({ requirements, onView, onEdit, onAction }) {
    return (
        <Card
            sx={{
                // Removed height: '100%' so it hugs content
                borderRadius: 3,
                boxShadow: 3,
                transition: "box-shadow 0.3s",
                "&:hover": {
                    boxShadow: 6
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}> {/* Reduced padding */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#1a237e", fontSize: '1.1rem' }}>
                        Lista de Requisitos
                    </Typography>
                    <Chip
                        label={`${requirements.filter(r => r.status === 'complete').length}/${requirements.length}`}
                        size="small"
                        color={requirements.every(r => r.status === 'complete') ? "success" : "default"}
                        variant="outlined"
                        sx={{ fontWeight: "bold", height: 24 }}
                    />
                </Box>

                <Divider sx={{ mb: 1.5, opacity: 0.6 }} />

                <List sx={{ p: 0 }}>
                    {requirements.map((req, index) => (
                        <RequirementItem
                            key={req.id}
                            requirement={req}
                            onView={onView}
                            onEdit={onEdit}
                            onAction={onAction}
                        />
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

export default RequirementsCardModern;
