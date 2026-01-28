import { Typography } from "@mui/material";
function TextMui({
    value ="Sample Text",
    variant= "h1",

}){
    return(
        <>
        <Typography variant={variant}>
            {value}
        </Typography>
        </>
    );
}

export default TextMui