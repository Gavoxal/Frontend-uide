import { getDataUser } from '../storage/user.model.jsx';
import { Navigate } from 'react-router-dom';

function SessionGuard({childrenPage}) {
    const isLogin = getDataUser() ? true : false;
    return isLogin ? childrenPage : <Navigate to="/ingreso" replace />;
}

export default SessionGuard;