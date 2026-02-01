import { getDataUser } from '../storage/user.model.jsx';
import { Navigate, Outlet } from 'react-router-dom';

function AuthAdmin({ }) {
    const dataUser = getDataUser();
    console.log('AuthAdmin - Usuario:', dataUser);
    // Permitir acceso si hay un usuario con sesión activa y tiene un rol válido
    const isAuthenticated = dataUser && dataUser.role;
    return isAuthenticated ? <Outlet /> : <Navigate to="/ingreso" replace />;
}

export default AuthAdmin;