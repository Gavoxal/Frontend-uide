import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import Button from '../components/button.mui.component.jsx';
import { Box } from '@mui/material';

function AlertMui ({
    open = false, 
    handleClose = () => {},  
    title = null, 
    message = null,
    status = 'info',
    showBtnL = false,
    showBtnR = false,
    btnNameL = 'Aceptar',
    btnNameR = 'Cancelar',
    actionBtnL = () => {},
    actionBtnR = () => {},


}) {
    const handleGeticonbyStatus = ()=>{
        switch (status) {
            case 'warning':
                return <WarningAmberIcon color='warning' sx={{fontSize: 75}} />;    
            case 'error':
                return <ErrorOutlineIcon color='error' sx={{fontSize: 75}} />;
            case 'success':
                return <CheckCircleOutlineIcon color='success' sx={{fontSize: 75}} />;
            case 'info':
                return <InfoOutlineIcon color='info' sx={{fontSize: 75}} />;
            default:
                return <WarningAmberIcon color='warning' sx={{fontSize: 75}} />; 
        }
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    minWidth:'20vw'
                }}

            >
                {title &&
                    <DialogTitle id="alert-dialog-title">
                        {title}
                    </DialogTitle>
                }
                <DialogContent>
                    <Box display={'flex'} justifyContent={'center'} my={3}>
                        {handleGeticonbyStatus()}
                    </Box>

                    {message &&
                    <DialogContentText id="alert-dialog-description" textAlign={'center'}>
                        {message}
                    </DialogContentText>
                    }
                </DialogContent>

                <DialogActions>

                    {showBtnL && <Button name={btnNameL} onClick={actionBtnL} backgroundColor='blue' />}
                    {showBtnR && <Button name={btnNameR} onClick={actionBtnR} backgroundColor='red' />}

                </DialogActions>
                
            
            
            </Dialog>
        </>
    )
    
}

export default AlertMui;