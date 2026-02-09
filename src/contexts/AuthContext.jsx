import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth.service';
import { USER_ROLES } from '../utils/constants';

/**
 * Context de Autenticación
 * Proporciona estado global de autenticación y usuario
 */
const AuthContext = createContext(null);

/**
 * Provider de Autenticación
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Inicializar estado desde localStorage al montar
    useEffect(() => {
        const initAuth = () => {
            const currentUser = authService.getCurrentUser();
            const token = authService.getToken();

            if (currentUser && token) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Inicia sesión
     */
    const login = async (correo, clave) => {
        try {
            const { token, usuario } = await authService.login(correo, clave);
            setUser(usuario);
            setIsAuthenticated(true);
            return { success: true, usuario };
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                error: error.message || 'Error al iniciar sesión'
            };
        }
    };

    /**
     * Cierra sesión
     */
    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    /**
     * Verifica si el usuario tiene un rol específico
     */
    const hasRole = (rol) => {
        return user?.rol === rol;
    };

    /**
     * Verifica si el usuario tiene alguno de los roles especificados
     */
    const hasAnyRole = (roles) => {
        return roles.includes(user?.rol);
    };

    /**
     * Verifica si el usuario es Director
     */
    const isDirector = () => {
        return user?.rol === USER_ROLES.DIRECTOR;
    };

    /**
     * Verifica si el usuario es Coordinador
     */
    const isCoordinador = () => {
        return user?.rol === USER_ROLES.COORDINADOR;
    };

    /**
     * Verifica si el usuario es Tutor
     */
    const isTutor = () => {
        return user?.rol === USER_ROLES.TUTOR;
    };

    /**
     * Verifica si el usuario es Estudiante
     */
    const isEstudiante = () => {
        return user?.rol === USER_ROLES.ESTUDIANTE;
    };

    /**
     * Verifica si el usuario es Comité
     */
    const isComite = () => {
        return user?.rol === USER_ROLES.COMITE;
    };

    /**
     * Verifica si el usuario es Docente de Integración
     */
    const isDocente = () => {
        return user?.rol === USER_ROLES.DOCENTE_INTEGRACION;
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
        isDirector,
        isCoordinador,
        isTutor,
        isEstudiante,
        isComite,
        isDocente
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
};

export default AuthContext;
