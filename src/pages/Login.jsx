import { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { Box, Typography, TextField, Button as MuiButton, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AlertMui from '../components/alert.mui.component.jsx';
import LoadingScreen from '../components/load.mui.component.jsx';
import { LoginService } from '../utils/login.js';
import { setUserData, rmDataUser } from '../storage/user.model.jsx';
import uideImage from '../assets/uide3.svg';

// Imagen de estudiantes - si no existe, usaremos un placeholder
const studentsImage = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80';

function LoginPage() {
  const [user, setUser] = useState('');
  const [passwd, setPasswd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [stateModal, setStateModal] = useState({
    open: false,
    title: 'Login',
    message: '',
    status: 'info',
    showbtnl: false,
    showbtnr: false,
    btnNameR: '',
    actionBtnL: () => { },
    actionBtnR: () => { },
  });

  const handleCloseModal = () => {
    setStateModal({ ...stateModal, open: false });
  };

  const handleRegister = () => {
    navigate('/registro');
  };

  const handleSendform = () => {
    const resLogin = LoginService(user, passwd);
    console.log(resLogin);

    if (resLogin == null) {
      setStateModal({
        open: true,
        title: 'Error de autenticación',
        message: 'Usuario o contraseña inválidas',
        status: 'error',
        showbtnl: true,
        showbtnr: true,
        btnNameR: 'Registrarse',
        actionBtnL: handleCloseModal,
        actionBtnR: handleRegister,
      });
      return;
    }

    setUserData(resLogin);

    // Mostrar loading screen
    setIsLoading(true);

    // Esperar 2 segundos antes de navegar
    setTimeout(() => {
      navigateUser(resLogin?.role);
    }, 2000);
  };

  const navigateUser = (role) => {
    switch (role) {
      case "director":
        navigate('/director/dashboard');
        break;
      case "student":
        navigate('/student/dashboard');
        break;
      case "tutor":
        navigate('/tutor/dashboard');
        break;
      case "reviewer":
        navigate('/reviewer/dashboard');
        break;
      case "admin":
        navigate('/director/dashboard');
        break;
      case "docente_integracion":
        navigate('/docente-integracion/dashboard');
        break;
      case "coordinador":
        navigate('/coordinador/dashboard');
        break;
      default:
        navigate('/student/dashboard');
        break;
    }
  }

  useEffect(() => {
    rmDataUser();
  }, []);

  // Mostrar loading screen después del login
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AlertMui
        open={stateModal.open}
        message={stateModal.message}
        status={stateModal.status}
        showBtnL={stateModal.showbtnl}
        handleClose={handleCloseModal}
        actionBtnL={stateModal.actionBtnL}
        showBtnR={stateModal.showbtnr}
        btnNameR={stateModal.btnNameR}
        actionBtnR={stateModal.actionBtnR}
      />

      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Panel Izquierdo - Imagen */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${studentsImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(0,10,155,0.7) 0%, rgba(0,10,155,0.4) 100%)',
            }
          }}
        />

        {/* Panel Derecho - Formulario */}
        <Box
          sx={{
            flex: { xs: 1, md: 0.5 },
            backgroundColor: '#000A9B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
            }}
          >
            {/* Logo y Título */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box
                component="img"
                src={uideImage}
                alt="UIDE Logo"
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                GradeX
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                BIENVENIDO
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'center',
                }}
              >
                Ingresa en tu cuenta para continuar
              </Typography>
            </Box>

            {/* Formulario */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendform();
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'white', mb: 0.5, display: 'block' }}
                >
                  Correo
                </Typography>
                <TextField
                  fullWidth
                  placeholder="example@uide.edu.ec"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FBBF24',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255,255,255,0.5)',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'white', mb: 0.5, display: 'block' }}
                >
                  Contraseña
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="**********"
                  value={passwd}
                  onChange={(e) => setPasswd(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ color: 'white' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FBBF24',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255,255,255,0.5)',
                    },
                  }}
                />
              </Box>

              {/* Olvidaste tu contraseña */}
              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    color: '#FBBF24',
                    fontSize: '0.875rem',
                  }}
                >
                  Olvidaste tu contraseña?
                </Link>
              </Box>

              {/* Botón Ingresar */}
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
                  mb: 3,
                  '&:hover': {
                    backgroundColor: '#F59E0B',
                  },
                }}
              >
                Ingresar
              </MuiButton>

              {/* Registro */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', display: 'inline' }}
                >
                  No tienes una cuenta?{' '}
                </Typography>
                <Link
                  onClick={handleRegister}
                  sx={{
                    color: '#FF6B35',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Regístrate
                </Link>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default LoginPage;