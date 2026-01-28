import { useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { Box, Grid} from '@mui/material';
import Button from '../components/button.mui.component.jsx';
import InputMui from '../components/input.mui.component.jsx';
import TextMui from '../components/text.mui.component.jsx';
import { LoginService } from '../utils/login.js';
import { useNavigate } from 'react-router-dom';


function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [passwd, setPasswd] = useState('');

  const handleRegisterTemporary = () => {
  // Guardar las credenciales temporalmente en sessionStorage
  const tempUser = { 
    user: email,  // o cualquier campo que uses como usuario
    passwd: passwd,
    name,
    lastname
  };
  
  sessionStorage.setItem('tempUser', JSON.stringify(tempUser));

  // Redirigir al login
  navigate('/ingreso');
};


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyItems="center"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <TextMui value="Registro" variant="h4" />
        </Grid>

        <Grid item size={{ xs: 10, sm: 6, md: 5, lg: 4 }}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid
              container
              spacing={2}
              justifyItems="center"
              justifyContent="center"
              alignItems="center"
            >
              <Grid size={6}>
                <InputMui
                  placeholder="Juan, Carlos"
                  label="Tu Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={6}>
                <InputMui
                  placeholder="Perez, Castillo"
                  label="Tu Apellido"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={6}>
                <InputMui
                  placeholder="example@uide.com"
                  label="Tu Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={6}>
                <InputMui
                  placeholder="Calle, Ciudad"
                  label="Tu Dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={10}>
                <InputMui
                  endIcon={
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  }
                  placeholder="paswd123"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={passwd}
                  onChange={(e) => setPasswd(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={10}>
                <Button
                  type="button"
                  onClick={handleRegisterTemporary}
                  name="Guardar y continuar"
                  backgroundColor="green"
                  color="white"
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RegisterPage