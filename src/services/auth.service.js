export const AuthService = {
    /**
     * Inicia sesión llamando al backend.
     * Si falla o no hay conexión, usa el mock local (por ahora para compatibilidad).
     * @param {string} correo - Correo del usuario
     * @param {string} clave - Contraseña del usuario
     * @returns {Promise<Object>} Datos del usuario o lanza error.
     */
    async login(correo, clave) {
        try {
            // Intento de conexión al backend
            const response = await fetch('/api/v1/auth/login', {
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
                console.warn("Backend API error or not found, falling back to mock.");
                return this.mockLogin(correo, clave);
            }
        } catch (error) {
            console.warn("API Connection failed, falling back to mock login:", error);
            return this.mockLogin(correo, clave);
        }
    },

    /**
     * Lógica mock original (sincrona) envuelta para uso interno.
     */
    mockLogin(user, passwd) {
        // Primero revisamos si hay un registro temporal
        const tempUserStr = sessionStorage.getItem('tempUser');
        const tempUser = tempUserStr ? JSON.parse(tempUserStr) : null;

        if (tempUser && user === tempUser.user && passwd === tempUser.passwd) {
            localStorage.setItem('userEmail', user);
            return {
                name: tempUser.name,
                lastName: tempUser.lastname,
                role: tempUser.role,
                image: "",
            };
        }

        // Usuario admin predefinido
        if (user === "admin" && passwd === "admin123") {
            localStorage.setItem('userEmail', user);
            return { name: "Administrador", lastName: "Main", role: "admin", image: "" };
        }

        // Usuario tutor predefinido
        if (user === "tutor" && passwd === "tutor123") {
            localStorage.setItem('userEmail', user);
            return { name: "Tutor", lastName: "Main", role: "tutor", image: "" };
        }

        // === USUARIOS DE PRUEBA PARA SISTEMA DE ACCESO ===
        if (user === "estudiante_nuevo@uide.edu.ec" && passwd === "123456") {
            localStorage.setItem('userEmail', user);
            return { name: "Juan", lastName: "Pérez", role: "student", image: "" };
        }
        if (user === "estudiante_completo@uide.edu.ec" && passwd === "123456") {
            localStorage.setItem('userEmail', user);
            return { name: "María", lastName: "García", role: "student", image: "" };
        }
        if (user === "estudiante_avanzado@uide.edu.ec" && passwd === "123456") {
            localStorage.setItem('userEmail', user);
            return { name: "Carlos", lastName: "López", role: "student", image: "" };
        }
        if (user === "estudiante" && passwd === "estudiante123") {
            localStorage.setItem('userEmail', "estudiante_completo@uide.edu.ec");
            return { name: "Abel", lastName: "Main", role: "student", image: "" };
        }

        if (user === "revisor" && passwd === "revisor123") {
            localStorage.setItem('userEmail', user);
            return { name: "Revisor", lastName: "Main", role: "reviewer", image: "" };
        }
        if (user === "director" && passwd === "director123") {
            return { name: "Director", lastName: "Carrera", role: "director" };
        }
        if (user === "docente" && passwd === "docente123") {
            return { name: "Docente", lastName: "Integración", role: "docente_integracion", image: "" };
        }
        if (user === "coordinador" && passwd === "coordinador123") {
            return { name: "Darío", lastName: "Valarezo", role: "coordinador" };
        }

        return null; // Login fallido
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
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
        if (!token) throw new Error('No hay sesión activa');

        const response = await fetch('/api/v1/usuarios/cambiar-clave', {
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
    }
};
