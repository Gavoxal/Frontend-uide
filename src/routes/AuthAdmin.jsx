import { getDataUser, getActiveRole } from '../storage/user.model.jsx';
import { Navigate, Outlet } from 'react-router-dom';

function AuthAdmin({ }) {
    const dataUser = getDataUser();
    const activeRole = getActiveRole();

    // El rol efectivo es el seleccionado, o el único rol disponible, o el rol principal
    const effectiveRole = (activeRole || dataUser?.rol || "").toUpperCase();

    const allowedRoles = [
        "ADMIN",
        "DIRECTOR",
        "COORDINADOR",
        "ESTUDIANTE",
        "STUDENT",
        "TUTOR",
        "REVIEWER",
        "DOCENTE_INTEGRACION"
    ];

    if (!dataUser) return <Navigate to="/ingreso" replace />;

    // Si tiene múltiples roles y NO ha seleccionado uno, redirigir a selección
    if (dataUser.roles && dataUser.roles.length > 1 && !activeRole) {
        return <Navigate to="/select-role" replace />;
    }

    return allowedRoles.includes(effectiveRole) ? <Outlet /> : <Navigate to="/ingreso" replace />;
}

export default AuthAdmin;
