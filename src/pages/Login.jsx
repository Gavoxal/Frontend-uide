import { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import {
  Box, Typography, TextField, Button as MuiButton, Link,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AlertMui from '../components/alert.mui.component.jsx';
import LoadingScreen from '../components/load.mui.component.jsx';
import { AuthService } from '../services/auth.service.js';
import { setUserData, rmDataUser, setActiveRole } from '../storage/user.model.jsx';
import uideImage from '../assets/uide3.svg';
import studentimage from '../assets/uide.jpeg';

// Imagen de estudiantes - si no existe, usaremos un placeholder
const studentsImage = studentimage;

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

  // Estado para recuperación de contraseña
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleCloseModal = () => {
    setStateModal({ ...stateModal, open: false });
  };

  const handleRegister = () => {
    navigate('/registro');
  };

  const handleSendform = async () => {
    setIsLoading(true);
    try {
      const resLogin = await AuthService.login(user, passwd);
      setIsLoading(false);

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

      // Mostrar loading screen brevemente o navegar directamente
      setIsLoading(true);

      // Esperar 1 segundo antes de navegar para UX
      setTimeout(() => {
        const roles = resLogin.roles || [resLogin.rol];

        if (roles.length > 1) {
          navigate('/select-role');
        } else {
          setActiveRole(resLogin?.rol);
          navigateUser(resLogin?.rol);
        }
      }, 1000);

    } catch (error) {
      setIsLoading(false);
      let errorMessage = error.message || 'Error al conectar con el servidor';

      if (errorMessage.includes('must match format "email"')) {
        errorMessage = 'El formato del correo electrónico es incorrecto.';
      }

      setStateModal({
        open: true,
        title: 'Error',
        message: errorMessage,
        status: 'error',
        showbtnl: true,
        actionBtnL: handleCloseModal,
      });
    }
  };

  const navigateUser = (role) => {
    const normalizedRole = role?.toUpperCase();
    switch (normalizedRole) {
      case "DIRECTOR":
        navigate('/director/dashboard');
        break;
      case "ESTUDIANTE":
        navigate('/student/dashboard');
        break;
      case "TUTOR":
        navigate('/tutor/dashboard');
        break;
      case "REVIEWER":
        navigate('/reviewer/dashboard');
        break;
      case "ADMIN":
        navigate('/director/dashboard');
        break;
      case "DOCENTE_INTEGRACION":
        navigate('/docente-integracion/dashboard');
        break;
      case "COORDINADOR":
        navigate('/coordinador/dashboard');
        break;
      default:
        navigate('/student/dashboard');
        break;
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setStateModal({
        open: true,
        title: 'Error',
        message: 'Por favor, ingrese su correo institucional',
        status: 'error',
        showbtnl: true,
        actionBtnL: handleCloseModal,
      });
      return;
    }

    setIsForgotLoading(true);
    try {
      await AuthService.forgotPassword(forgotEmail);
      setIsForgotLoading(false);
      setIsForgotModalOpen(false);
      setForgotEmail('');

      setStateModal({
        open: true,
        title: 'Éxito',
        message: 'Se ha generado una nueva contraseña y se ha enviado a su correo institucional.',
        status: 'success',
        showbtnl: true,
        actionBtnL: handleCloseModal,
      });
    } catch (error) {
      setIsForgotLoading(false);
      let errorMessage = error.message || 'No se pudo procesar la recuperación de contraseña';

      // Mapeo de errores de validación del backend
      if (errorMessage.includes('must match format "email"')) {
        errorMessage = 'El formato del correo electrónico es incorrecto.';
      } else if (errorMessage.includes('body/correo')) {
        errorMessage = 'El correo es obligatorio.';
      }

      setStateModal({
        open: true,
        title: 'Error',
        message: errorMessage,
        status: 'error',
        showbtnl: true,
        actionBtnL: handleCloseModal,
      });
    }
  };

  // Comentado: esto borraba la sesión inmediatamente después del login
  // useEffect(() => {
  //   rmDataUser();
  // }, []);

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
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={() => setIsForgotModalOpen(true)}
                  sx={{
                    color: '#FBBF24',
                    fontSize: '0.875rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: 0
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


            </form>
          </Box>
        </Box>
      </Box>

      {/* Modal de Recuperación de Contraseña */}
      <Dialog
        open={isForgotModalOpen}
        onClose={() => !isForgotLoading && setIsForgotModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#000A9B' }}>
          Recuperar Contraseña
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Al confirmar, el sistema generará una <strong>nueva contraseña aleatoria</strong> y la enviará a su correo institucional. Podrá cambiarla una vez que inicie sesión.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Correo Institucional"
            type="email"
            fullWidth
            variant="outlined"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            disabled={isForgotLoading}
            placeholder="example@uide.edu.ec"
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <MuiButton
            onClick={() => setIsForgotModalOpen(false)}
            disabled={isForgotLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </MuiButton>
          <MuiButton
            onClick={handleForgotPassword}
            variant="contained"
            disabled={isForgotLoading}
            sx={{
              backgroundColor: '#FBBF24',
              color: '#000A9B',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#F59E0B',
              }
            }}
          >
            {isForgotLoading ? 'Procesando...' : 'Generar y Enviar Clave'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LoginPage;
