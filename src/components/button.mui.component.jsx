import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import SendIcon from '@mui/icons-material/Send';


function ButtonMUI({
    name,
    onClick = () => { },
    backgroundColor = 'primary.main',
    color = 'white',
    type = 'button',
    variant = 'contained',
    startIcon = null,
    endIcon = null,
    disabled = false,
    ...props
}) {
    return (
        <>

            <Button
                fullWidth
                type={type}
                onClick={onClick}
                variant={variant}
                startIcon={startIcon}
                endIcon={endIcon}
                disabled={disabled}
                sx={{
                    color: color,
                    backgroundColor: variant === 'contained' ? backgroundColor : 'transparent',
                    borderColor: variant === 'outlined' ? backgroundColor : undefined,
                    '&:hover': {
                        backgroundColor: variant === 'contained' ? backgroundColor : 'rgba(0,0,0,0.05)',
                        filter: 'brightness(0.9)'
                    },
                    ...props.sx
                }}
                {...props}
            >
                {name}
            </Button>

        </>
    );
}

export default ButtonMUI;