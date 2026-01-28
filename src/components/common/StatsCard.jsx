import { Card, CardContent, Typography, Box } from "@mui/material";

function StatsCard({ title, value, icon, color = "primary", subtitle }) {
    return (
        <Card
            sx={{
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {icon && (
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                bgcolor: `${color}.light`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: `${color}.main`,
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default StatsCard;
