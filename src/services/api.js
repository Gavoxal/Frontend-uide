import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * Cliente Axios centralizado con interceptores para autenticación.
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para añadir el token a cada petición y normalizar URL
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    // Solo añadir si el token existe y es válido (no es la cadena "null")
    if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Normalizar URL para evitar doble prefijo /api/v1
    // Si la URL empieza con /api/v1 o api/v1, quitarlo ya que baseURL ya lo incluye
    if (config.url) {
        if (config.url.startsWith('/api/v1')) {
            config.url = config.url.replace('/api/v1', '');
        } else if (config.url.startsWith('api/v1')) {
            config.url = config.url.replace('api/v1', '');
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores globales (ej: 401)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Sesión expirada o inválida detectada por apiClient');
            // Opcional: limpiar sesión si el error es de token malformado o expirado
            if (error.response.data?.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
                // localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Wrapper para fetch que maneja la autenticación y errores comunes.
 * Mantenido por compatibilidad con código existente.
 */
export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    // Normalizar endpoint para evitar duplicados de /api/v1
    let cleanEndpoint = endpoint;
    if (cleanEndpoint.startsWith('/api/v1')) {
        cleanEndpoint = cleanEndpoint.replace('/api/v1', '');
    } else if (cleanEndpoint.startsWith('api/v1')) {
        cleanEndpoint = cleanEndpoint.replace('api/v1', '');
    }

    // Construir URL completa
    const url = cleanEndpoint.startsWith('http') ? cleanEndpoint :
        (cleanEndpoint.startsWith('/') ? `${API_BASE_URL}${cleanEndpoint}` : `${API_BASE_URL}/${cleanEndpoint}`);

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token && token !== 'null' && token !== 'undefined') {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            console.warn('Sesión expirada o inválida detectada por apiFetch');
        }

        return response;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};

/**
 * Descarga un archivo desde una URL protegida por autenticación.
 */
export const downloadFile = async (url, filename) => {
    try {
        const response = await apiFetch(url);
        if (!response.ok) throw new Error('Error al descargar el archivo');

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Download error:", error);
        alert("Error al descargar el archivo. Por favor intente nuevamente.");
    }
};

export default apiClient;
