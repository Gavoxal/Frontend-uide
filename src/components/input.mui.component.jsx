import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
function InputMui({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => { },
  required = false,
  helperText = '',
  error = false,
  label = "",
  startIcon = null,
  endIcon = null,
  multiline = false,
  rows = 1
}) {
  return (
    <>
      <TextField
        fullWidth
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        variant='outlined'
        required={required}
        helperText={helperText}
        error={error}
        label={label}
        multiline={multiline}
        rows={rows}
        slotProps={{
          input: {
            startAdornment: startIcon && (
              <InputAdornment position="start">
                {startIcon}
              </InputAdornment>
            ),
            endAdornment: endIcon && (
              <InputAdornment position="end">
                {endIcon}
              </InputAdornment>
            )
          },
        }}
      />
    </>



  );
}

export default InputMui;