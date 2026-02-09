import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationBell from './common/NotificationBell';

function HeaderMui({
  title = "Tablero",
  subtitle = null,
  onBack = null,
  sidebarWidth = 0,
  showNotifications = true,
}) {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: 'left 0.3s ease, width 0.3s ease',
      }}
    >
      <Toolbar>
        {/* Botón de retroceso */}
        {onBack && (
          <IconButton edge="start" onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Título y subtítulo */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#000A9B',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Notificaciones */}
        {showNotifications && (
          <NotificationBell />
        )}
      </Toolbar>
    </AppBar>
  );
}

export default HeaderMui;
