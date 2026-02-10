import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from './button.mui.component.jsx';
import { Box, Slide, Zoom } from '@mui/material';
import { forwardRef } from 'react';

// Transición con efecto slide desde arriba
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function AlertMui({
    open = false,
    handleClose = () => { },
    title = null,
    message = null,
    status = 'info',
    showBtnL = false,
    showBtnR = false,
    btnNameL = 'Aceptar',
    btnNameR = 'Cancelar',
    actionBtnL = () => { },
    actionBtnR = () => { },
}) {
    // Colores y configuraciones por estado
    const getStatusConfig = () => {
        switch (status) {
            case 'warning':
                return {
                    icon: <WarningAmberIcon sx={{ fontSize: 80 }} />,
                    color: '#ff9800',
                    bgColor: '#fff3e0',
                    iconBg: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)'
                };
            case 'error':
                return {
                    icon: <ErrorOutlineIcon sx={{ fontSize: 80 }} />,
                    color: '#f44336',
                    bgColor: '#ffebee',
                    iconBg: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)'
                };
            case 'success':
                return {
                    icon: <CheckCircleOutlineIcon sx={{ fontSize: 80 }} />,
                    color: '#4caf50',
                    bgColor: '#e8f5e9',
                    iconBg: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)'
                };
            case 'info':
                return {
                    icon: <InfoOutlineIcon sx={{ fontSize: 80 }} />,
                    color: '#2196f3',
                    bgColor: '#e3f2fd',
                    iconBg: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)'
                };
            default:
                return {
                    icon: <InfoOutlineIcon sx={{ fontSize: 80 }} />,
                    color: '#2196f3',
                    bgColor: '#e3f2fd',
                    iconBg: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        minWidth: { xs: '90vw', sm: '450px', md: '500px' },
                        maxWidth: '600px',
                        overflow: 'visible',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }
                }}
            >
                {/* Botón de cerrar (X) */}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: 'grey.500',
                        zIndex: 1,
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Título */}
                {title && (
                    <DialogTitle
                        id="alert-dialog-title"
                        sx={{
                            textAlign: 'center',
                            pt: 4,
                            pb: 2,
                            px: 3,
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'text.primary'
                        }}
                    >
                        {title}
                    </DialogTitle>
                )}

                <DialogContent sx={{ px: 4, py: 2 }}>
                    {/* Icono con efecto zoom y fondo degradado */}
                    <Zoom in={open} style={{ transitionDelay: open ? '100ms' : '0ms' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                my: 3,
                                position: 'relative'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: config.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: `0 4px 20px ${config.color}40`,
                                    animation: 'pulse 2s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%': {
                                            boxShadow: `0 4px 20px ${config.color}40`,
                                        },
                                        '50%': {
                                            boxShadow: `0 4px 30px ${config.color}60`,
                                        },
                                        '100%': {
                                            boxShadow: `0 4px 20px ${config.color}40`,
                                        },
                                    }
                                }}
                            >
                                {config.icon}
                            </Box>
                        </Box>
                    </Zoom>

                    {/* Mensaje */}
                    {message && (
                        <DialogContentText
                            component="div"
                            id="alert-dialog-description"
                            sx={{
                                textAlign: 'center',
                                fontSize: '1rem',
                                color: 'text.secondary',
                                lineHeight: 1.6,
                                mb: 2
                            }}
                        >
                            {message}
                        </DialogContentText>
                    )}
                </DialogContent>

                {/* Botones de acción */}
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        gap: 2,
                        px: 4,
                        pb: 4,
                        pt: 2
                    }}
                >
                    {showBtnR && (
                        <Button
                            name={btnNameR}
                            onClick={actionBtnR}
                            backgroundColor='grey'
                        />
                    )}
                    {showBtnL && (
                        <Button
                            name={btnNameL}
                            onClick={actionBtnL}
                            backgroundColor={status === 'error' ? 'red' : 'blue'}
                        />
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AlertMui;
