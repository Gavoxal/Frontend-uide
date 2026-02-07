import React from 'react';
import { Tooltip as MuiTooltip, styled } from '@mui/material';

/**
 * Componente Tooltip personalizado con estilo redondeado y compacto
 * Wrapper del Tooltip de Material-UI con estilos mejorados
 */
const StyledTooltip = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
        backgroundColor: '#424242',
        color: '#ffffff',
        fontSize: '0.75rem',
        borderRadius: '12px',
        padding: '6px 12px',
        maxWidth: 220,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        fontWeight: 500,
    },
    '& .MuiTooltip-arrow': {
        color: '#424242',
    },
}));

/**
 * Componente Tooltip mejorado
 * @param {object} props - Todas las props de MUI Tooltip
 * @param {string} props.title - Texto del tooltip
 * @param {React.ReactNode} props.children - Elemento hijo
 * @param {string} props.placement - Posición del tooltip (top, bottom, left, right, etc.)
 * @param {boolean} props.arrow - Mostrar flecha (default: true)
 */
function TooltipMui({ arrow = true, ...props }) {
    return <StyledTooltip arrow={arrow} {...props} />;
}

export default TooltipMui;
