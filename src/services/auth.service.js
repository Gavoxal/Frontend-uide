import { API_BASE_URL } from '../utils/constants';
export const AuthService = {
    /**
     * Inicia sesión llamando al backend.
     * Si falla o no hay conexión, usa el mock local (por ahora para compatibilidad).
     * @param {string} correo - Correo del usuario
     * @param {string} clave - Contraseña del usuario
     * @returns {Promise<Object>} Datos del usuario o lanza error.
     */

    async login(correo, clave) {
        // Limpiar cualquier sesión anterior antes de intentar una nueva
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        try {
            // Intento de conexión al backend
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, clave })
            });
            if (response.ok) {
                const data = await response.json();

                // Guardar token si el backend lo devuelve
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Guardar email para contexto
                localStorage.setItem('userEmail', correo);

                const userData = data.user || data.usuario;

                // Normalizar respuesta para el frontend
                if (userData) {
                    // Mapear 'rol' a 'role' si es necesario
                    if (!userData.role && userData.rol) {
                        userData.role = userData.rol;
                    }

                    if (userData.role && typeof userData.role === 'string') {
                        const rawRole = userData.role.toUpperCase();

                        // Mapeo detallado de roles Backend -> Frontend
                        const roleMap = {
                            'ESTUDIANTE': 'student',
                            'DIRECTOR': 'director',
                            'TUTOR': 'tutor',
                            'REVISOR': 'reviewer',
                            'ADMIN': 'admin', // Si existe
                            'COORDINADOR': 'coordinador',
                            'DOCENTE_INTEGRACION': 'docente_integracion',
                            // Mapeos directos por si acaso viene en minuscula pero sin match exacto
                            'STUDENT': 'student',
                            'REVIEWER': 'reviewer'
                        };

                        userData.role = roleMap[rawRole] || userData.role.toLowerCase();
                    }
                }

                return userData;
            } else if (response.status === 401) {
                // Credenciales inválidas reales
                throw new Error('Credenciales inválidas');
            } else {
                // Si el backend responde error (500, etc) o 404
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend API error:", errorData);
                throw new Error(errorData.message || `Error del servidor (${response.status})`);
            }
        } catch (error) {
            console.error("API Connection failed:", error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        rmDataUser();
        // Limpieza adicional si es necesaria
    },

    /**
     * Cambia la contraseña del usuario actual.
     * @param {string} currentPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<Object>} Respuesta del servidor
     */
    async changePassword(currentPassword, newPassword) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay sesión activa (token no encontrado)');

        const response = await fetch(`${API_BASE_URL}/usuarios/cambiar-clave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                claveActual: currentPassword,
                nuevaClave: newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar la contraseña');
        }

        return data;
    },

    /**
     * Solicita una nueva contraseña aleatoria enviada al correo.
     * @param {string} correo - Correo institucional del usuario
     * @returns {Promise<Object>} Respuesta del servidor
     */
    async forgotPassword(correo) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'No se pudo procesar la recuperación de contraseña');
            }

            return data;
        } catch (error) {
            console.error("Forgot password API error:", error);
            throw error;
        }
    }
};
