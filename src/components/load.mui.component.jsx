import { Box, CircularProgress, Typography, Fade, Grow } from '@mui/material';
import { useEffect, useState } from 'react';
import uideImage from '../assets/uide3.svg';

export default function LoadingScreen() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#000A9B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
            }}
        >
            {/* Logo con animación */}
            <Grow in={show} timeout={800}>
                <Box
                    sx={{
                        width: 140,
                        height: 140,
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': {
                                transform: 'scale(1)',
                                opacity: 1,
                            },
                            '50%': {
                                transform: 'scale(1.05)',
                                opacity: 0.9,
                            },
                        },
                    }}
                >
                    <Box
                        component="img"
                        src={uideImage}
                        alt="UIDE Logo"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
                        }}
                    />
                </Box>
            </Grow>

            {/* Título con animación */}
            <Fade in={show} timeout={1200}>
                <Typography
                    variant="h3"
                    sx={{
                        color: 'white',
                        mb: 4,
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    GradeX
                </Typography>
            </Fade>

            {/* Spinner */}
            <Fade in={show} timeout={1500}>
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: '#FBBF24',
                            filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.4))',
                        }}
                    />
                </Box>
            </Fade>
        </Box>
    );
}
