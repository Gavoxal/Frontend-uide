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
    ListItemText
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Cancel as CancelIcon,
    OpenInNew as OpenInNewIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";

function RequirementItem({ requirement, onView, onEdit, onAction }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case "complete":
                return <CheckCircleIcon sx={{ color: "#4caf50" }} />;
            case "pending":
                return <WarningIcon sx={{ color: "#ff9800" }} />;
            case "missing":
                return <CancelIcon sx={{ color: "#f44336" }} />;
            default:
                return null;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "complete":
                return "Completo";
            case "pending":
                return "Tensión";
            case "missing":
                return "Falta";
            default:
                return "";
        }
    };

    const getBackgroundColor = (status) => {
        switch (status) {
            case "complete":
                return "#e8f5e9";
            case "pending":
                return "#fff3e0";
            case "missing":
                return "#ffebee";
            default:
                return "#f5f5f5";
        }
    };

    return (
        <ListItem
            sx={{
                px: 0,
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 2
            }}
        >
            <ListItemIcon sx={{ minWidth: 40 }}>
                {getStatusIcon(requirement.status)}
            </ListItemIcon>

            <ListItemText
                primary={
                    <Typography variant="body1" fontWeight="500">
                        {requirement.name}
                    </Typography>
                }
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                    label={getStatusText(requirement.status)}
                    size="small"
                    sx={{
                        backgroundColor: getBackgroundColor(requirement.status),
                        color: requirement.color,
                        fontWeight: "bold"
                    }}
                />
                {onView && (
                    <IconButton
                        size="small"
                        sx={{ color: "text.secondary" }}
                        onClick={() => onView(requirement.id)}
                        title="Visualizar"
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                )}
                {onEdit && (
                    <IconButton
                        size="small"
                        sx={{ color: "text.secondary" }}
                        onClick={() => onEdit(requirement.id)}
                        title="Editar"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                )}
                {onAction && (
                    <IconButton
                        size="small"
                        sx={{ color: "text.secondary" }}
                        onClick={() => onAction(requirement.id)}
                        title="Abrir enlace"
                    >
                        <OpenInNewIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </ListItem>
    );
}

function RequirementsCard({ requirements, onView, onEdit, onAction }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Lista de Requisitos
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <List sx={{ p: 0 }}>
                    {requirements.map((req, index) => (
                        <Box key={req.id}>
                            <RequirementItem
                                requirement={req}
                                onView={onView}
                                onEdit={onEdit}
                                onAction={onAction}
                            />
                            {index < requirements.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

export default RequirementsCard;
