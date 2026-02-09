import { getDataUser } from '../storage/user.model.jsx';
import { Navigate, Outlet } from 'react-router-dom';

function AuthAdmin({ }) {
    const dataUser = getDataUser();




    const allowedRoles = ["admin", "director", "coordinador", "student", "tutor", "reviewer", "docente_integracion"];

    return dataUser && allowedRoles.includes(dataUser.role) ? <Outlet /> : <Navigate to="/ingreso" replace />;

}

export default AuthAdmin;