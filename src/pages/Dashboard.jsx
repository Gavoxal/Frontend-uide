import { Height } from '@mui/icons-material';
import uideImage from '../assets/uide3.svg'; // ruta relativa desde este archivo
import { getDataUser } from '../storage/user.model.jsx';

function DashboardPage() {
  const user = getDataUser();
  return (
    <>
      <h1>Bienvenido al Dashboard {user.name}</h1>
      <img src={uideImage} alt="Descripción de la imagen" style={{ height: '200px' , width: '200px'}} />
    </>
  );
}

export default DashboardPage;
