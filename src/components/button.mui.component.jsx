
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import SendIcon from '@mui/icons-material/Send';


function ButtonMUI({
    name, 
    onClick= () => {}, 
    backgroundColor = 'white', 
    color ='white', 
    type='submit'
}) {
    return (
        <>
            
            <Button 
                fullWidth
                type={type}
                onClick={onClick} 
                variant= "contained"
                sx={{
                    color:color,
                    backgroundColor:backgroundColor
                }}
            > 
                {name} 
            </Button>

        </>
    );
}

export default ButtonMUI;