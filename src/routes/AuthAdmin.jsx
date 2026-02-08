import { getDataUser } from '../storage/user.model.jsx';
import { Navigate, Outlet } from 'react-router-dom';

function AuthAdmin({ }) {
    const dataUser = getDataUser();


    console.log(dataUser);
    const allowedRoles = ["admin", "director", "coordinador", "student", "tutor", "reviewer", "docente_integracion"];

    return dataUser && allowedRoles.includes(dataUser.role) ? <Outlet /> : <Navigate to="/ingreso" replace />;
<<<<<<< HEAD

    console.log('AuthAdmin - Usuario:', dataUser);
    // Permitir acceso si hay un usuario con sesión activa y tiene un rol válido
    const isAuthenticated = dataUser && dataUser.role;
    return isAuthenticated ? <Outlet /> : <Navigate to="/ingreso" replace />;
=======
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
}

export default AuthAdmin;