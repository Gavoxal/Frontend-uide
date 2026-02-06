import Alert from '@mui/material/Alert';

function NotificationMui({
    severity = "info",
    variant = "standard",
    children,
    sx = {}
}) {
    return (
        <Alert severity={severity} variant={variant} sx={{ ...sx }}>
            {children}
        </Alert>
    );
}

export default NotificationMui;
