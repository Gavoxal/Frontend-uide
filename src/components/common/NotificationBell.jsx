import { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    CircularProgress,
    Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotificationService } from '../../services/notification.service';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const fetchUnreadCount = async () => {
        try {
            const data = await NotificationService.getUnreadCount();
            setUnreadCount(data.count);
        } catch (error) {
            console.error("Error fetching unread count", error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await NotificationService.getAll();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        // Optional: Poll every minute
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications();
        // Reset unread count locally when opening (optional, or rely on fetch)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (notification) => {
        if (!notification.leida) {
            try {
                await NotificationService.markAsRead(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, leida: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error("Error marking as read", error);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Evitar abrir/marcar como leída al eliminar
        try {
            await NotificationService.delete(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            // Actualizar contador si borramos una no leída
            const deleted = notifications.find(n => n.id === id);
            if (deleted && !deleted.leida) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Error deleting notification", error);
        }
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 400,
                        width: 380, // Slightly wider for actions
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notificaciones</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" startIcon={<DoneAllIcon />} onClick={handleMarkAllAsRead}>
                            Marcar todas
                        </Button>
                    )}
                </Box>
                <Divider />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No tienes notificaciones
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                button
                                onClick={() => handleMarkAsRead(notification)}
                                sx={{
                                    bgcolor: notification.leido ? 'transparent' : 'action.hover', // Note: backend sends 'leido' not 'leida' usually, checking DB/Types
                                    borderBottom: '1px solid #f0f0f0',
                                    pr: 6 // Space for delete button
                                }}
                                secondaryAction={
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            size="small"
                                            onClick={(e) => handleDelete(e, notification.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: notification.leido ? 'normal' : 'bold' }}>
                                                {/* Titulo handling if exists, else generic */}
                                                Notificación
                                            </Typography>
                                            {!notification.leido && <CircleIcon color="primary" sx={{ fontSize: 10 }} />}
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.primary" sx={{ display: 'block', my: 0.5 }}>
                                                {notification.mensaje}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(notification.fechaCreacion || notification.createdAt || Date.now()).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;
