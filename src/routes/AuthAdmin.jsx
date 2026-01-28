import { getDataUser } from '../storage/user.model.jsx';
import { Navigate, Outlet } from 'react-router-dom';

function AuthAdmin({}) {
    const dataUser = getDataUser();
    console.log(dataUser);
    return dataUser?.role == "admin" ? <Outlet /> : <Navigate to="/ingreso" replace />;
}

export default AuthAdmin;