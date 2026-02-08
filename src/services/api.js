/**
 * Wrapper para fetch que maneja la autenticación y errores comunes.
 * Automáticamente añade el token de autorización si existe.
 */
export const apiFetch = async (endpoint, options = {}) => {
    // Obtener token del storage
    const token = localStorage.getItem('token');

    // Configurar headers por defecto
    const defaultHeaders = {
        'Content-Type': 'application/json',
        // Añadir token si existe ('Bearer' es el estándar más común, ajustar si es necesario)
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    // Combinar headers
    const headers = {
        ...defaultHeaders,
        ...options.headers
    };

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(endpoint, config);

        // Manejar expiración de token (401)
        if (response.status === 401) {
            console.warn('Sesión expirada o inválida');
            // Opcional: Redirigir al login o limpiar token
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        return response;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};
