import { Typography } from "@mui/material";
function TextMui({
    value = "Sample Text",
    variant = "body1",
    sx = {},
    color = "initial",
    fontWeight = "normal",
    ...props
}) {
    return (
        <>
            <Typography
                variant={variant}
                sx={{ ...sx, fontWeight: fontWeight }}
                color={color}
                {...props}
            >
                {value}
            </Typography>
        </>
    );
}

export default TextMui