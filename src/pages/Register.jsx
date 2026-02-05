import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import {
  Box,
  Typography,
  TextField,
  Button as MuiButton,
  Link,
  MenuItem,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import uideImage from '../assets/uide3.svg';

function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    role: 'student',
    passwd: '',
    confirmPasswd: ''
  });

  const roleOptions = [
    { value: 'student', label: 'Estudiante' },
    { value: 'tutor', label: 'Tutor' },
    { value: 'reviewer', label: 'Revisor' }
  ];

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.lastname.trim()) newErrors.lastname = 'El apellido es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Formato de correo inválido';
    if (!formData.passwd) newErrors.passwd = 'La contraseña es requerida';
    else if (formData.passwd.length < 6) newErrors.passwd = 'La contraseña debe tener al menos 6 caracteres';
    if (!formData.confirmPasswd) newErrors.confirmPasswd = 'Confirma tu contraseña';
    else if (formData.passwd !== formData.confirmPasswd) newErrors.confirmPasswd = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tempUser = {
      user: formData.email,
      passwd: formData.passwd,
      name: formData.name,
      lastname: formData.lastname,
      phone: formData.phone,
      address: formData.address,
      role: formData.role
    };
    sessionStorage.setItem('tempUser', JSON.stringify(tempUser));
    navigate('/ingreso');
  };

  const handleLogin = () => navigate('/ingreso');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000A9B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 900 }}>
        {/* Logo y Título */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box component="img" src={uideImage} alt="UIDE Logo" sx={{ width: 70, height: 70, mb: 2 }} />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>GradeX</Typography>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>CREAR CUENTA</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
            Completa tus datos para registrarte
          </Typography>
        </Box>

        {/* Formulario */}
        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            {/** Nombre y Apellido en una fila */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Nombre *</Typography>
              <TextField
                fullWidth
                placeholder="Juan"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: errors.name ? '#f44336' : 'transparent' },
                    '&:hover fieldset': { borderColor: errors.name ? '#f44336' : 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: errors.name ? '#f44336' : '#FBBF24' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiFormHelperText-root': { color: '#ffcdd2', backgroundColor: '#000A9B', margin: 0, paddingLeft: 1, paddingTop: 0.5 }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Apellido *</Typography>
              <TextField
                fullWidth
                placeholder="Pérez"
                value={formData.lastname}
                onChange={handleChange('lastname')}
                error={!!errors.lastname}
                helperText={errors.lastname}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: errors.lastname ? '#f44336' : 'transparent' },
                    '&:hover fieldset': { borderColor: errors.lastname ? '#f44336' : 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: errors.lastname ? '#f44336' : '#FBBF24' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiFormHelperText-root': { color: '#ffcdd2', backgroundColor: '#000A9B', margin: 0, paddingLeft: 1, paddingTop: 0.5 }
                }}
              />
            </Grid>

            {/** Correo en una fila completa */}
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Correo Electrónico *</Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="ejemplo@uide.edu.ec"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: errors.email ? '#f44336' : 'transparent' },
                    '&:hover fieldset': { borderColor: errors.email ? '#f44336' : 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: errors.email ? '#f44336' : '#FBBF24' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiFormHelperText-root': { color: '#ffcdd2', backgroundColor: '#000A9B', margin: 0, paddingLeft: 1, paddingTop: 0.5 }
                }}
              />
            </Grid>

            {/** Teléfono y Tipo de Usuario */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Teléfono (opcional)</Typography>
              <TextField
                fullWidth
                placeholder="0999999999"
                value={formData.phone}
                onChange={handleChange('phone')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#FBBF24' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Tipo de Usuario *</Typography>
              <TextField
                select
                fullWidth
                value={formData.role}
                onChange={handleChange('role')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#FBBF24' },
                  },
                  '& .MuiSelect-icon': { color: 'white' },
                }}
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/** Dirección y Contraseña */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Dirección (opcional)</Typography>
              <TextField
                fullWidth
                placeholder="Av. Principal, Quito"
                value={formData.address}
                onChange={handleChange('address')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#FBBF24' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Contraseña *</Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.passwd}
                onChange={handleChange('passwd')}
                error={!!errors.passwd}
                helperText={errors.passwd}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'white' }}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: errors.passwd ? '#f44336' : 'transparent' },
                    '&:hover fieldset': { borderColor: errors.passwd ? '#f44336' : 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: errors.passwd ? '#f44336' : '#FBBF24' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiFormHelperText-root': { color: '#ffcdd2', backgroundColor: '#000A9B', margin: 0, paddingLeft: 1, paddingTop: 0.5 }
                }}
              />
            </Grid>

            {/** Confirmar Contraseña en una sola columna */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: 'white', mb: 0.5, display: 'block' }}>Confirmar Contraseña *</Typography>
              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPasswd}
                onChange={handleChange('confirmPasswd')}
                error={!!errors.confirmPasswd}
                helperText={errors.confirmPasswd}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ color: 'white' }}>
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: errors.confirmPasswd ? '#f44336' : 'transparent' },
                    '&:hover fieldset': { borderColor: errors.confirmPasswd ? '#f44336' : 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: errors.confirmPasswd ? '#f44336' : '#FBBF24' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiFormHelperText-root': { color: '#ffcdd2', backgroundColor: '#000A9B', margin: 0, paddingLeft: 1, paddingTop: 0.5 }
                }}
              />
            </Grid>
          </Grid>

          {/* Botón Registrarse */}
          <MuiButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#FBBF24',
              color: '#000A9B',
              fontWeight: 'bold',
              padding: '12px',
              borderRadius: 1,
              fontSize: '1rem',
              textTransform: 'none',
              mt: 3,
              mb: 2,
              '&:hover': { backgroundColor: '#F59E0B' }
            }}
          >
            Registrarse
          </MuiButton>

          {/* Link a Login */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'white', display: 'inline' }}>
              ¿Ya tienes una cuenta?{' '}
            </Typography>
            <Link
              onClick={handleLogin}
              sx={{
                color: '#FF6B35',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Inicia Sesión
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default RegisterPage;