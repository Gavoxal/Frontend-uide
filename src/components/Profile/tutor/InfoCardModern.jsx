import {
    Box,
    Typography,
    Card,

    CardContent,
    IconButton,
    Divider,
    Grid,
    Avatar
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

function InfoItem({ icon, label, value }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": {
                    bgcolor: "rgba(102, 126, 234, 0.04)",
                    transform: "translateX(4px)"
                }
            }}
        >
            <Avatar
                sx={{
                    bgcolor: "rgba(25, 118, 210, 0.1)",
                    color: "#1976d2",
                    width: 40,
                    height: 40,
                    mr: 2,
                    flexShrink: 0 // Prevent avatar shrinking
                }}
            >
                {icon}
            </Avatar>
            <Box sx={{ minWidth: 0, overflow: "hidden" }}> {/* Ensure text truncation if needed */}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                </Typography>
                <Typography variant="body1" color="text.primary" fontWeight="500" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {value || "No registrado"}
                </Typography>
            </Box>
        </Box>
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

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)', // Force 2 equal columns
                    gap: 2
                }}>
                    {items.map((item, index) => (
                        <InfoItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}

export default InfoCardModern;
