import apiClient from './api';
import { transformUsuario, transformUsuarios } from '../utils/transformers';

/**
 * Servicio de Usuarios
 * Maneja todas las operaciones CRUD de usuarios
 */
export const usuarioService = {
    /**
     * Obtiene todos los usuarios con filtros opcionales
     * @param {object} filters - Filtros opcionales (rol, etc.)
     * @returns {Promise<Array>} Lista de usuarios
     */
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            // Agregar filtros si existen
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });

            const response = await apiClient.get(`/usuarios?${params.toString()}`);
            return transformUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    /**
     * Obtiene un usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<object>} Usuario
     */
    getById: async (id) => {
        try {
            const response = await apiClient.get(`/usuarios/${id}`);
            return transformUsuario(response.data);
        } catch (error) {
            console.error(`Error al obtener usuario ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea un nuevo usuario
     * @param {object} data - Datos del usuario
     * @returns {Promise<object>} Usuario creado
     */
    create: async (data) => {
        try {
            const response = await apiClient.post('/usuarios', data);
            return transformUsuario(response.data);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },

    /**
     * Actualiza un usuario
     * @param {number} id - ID del usuario
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} Usuario actualizado
     */
    update: async (id, data) => {
        try {
            const response = await apiClient.put(`/usuarios/${id}`, data);
            return transformUsuario(response.data);
        } catch (error) {
            console.error(`Error al actualizar usuario ${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina un usuario
     * @param {number} id - ID del usuario
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        try {
            await apiClient.delete(`/usuarios/${id}`);
        } catch (error) {
            console.error(`Error al eliminar usuario ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene usuarios por rol
     * @param {string} rol - Rol a filtrar
     * @returns {Promise<Array>} Lista de usuarios con ese rol
     */
    getByRol: async (rol) => {
        try {
            return await usuarioService.getAll({ rol });
        } catch (error) {
            console.error(`Error al obtener usuarios con rol ${rol}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene todos los estudiantes
     * @returns {Promise<Array>} Lista de estudiantes
     */
    getEstudiantes: async () => {
        return await usuarioService.getByRol('ESTUDIANTE');
    },

    /**
     * Obtiene todos los tutores
     * @returns {Promise<Array>} Lista de tutores
     */
    getTutores: async () => {
        return await usuarioService.getByRol('TUTOR');
    },

    /**
     * Obtiene todos los miembros del comité
     * @returns {Promise<Array>} Lista de comité
     */
    getComite: async () => {
        return await usuarioService.getByRol('COMITE');
    },

    /**
     * Obtiene todos los directores
     * @returns {Promise<Array>} Lista de directores
     */
    getDirectores: async () => {
        return await usuarioService.getByRol('DIRECTOR');
    },

    /**
     * Obtiene todos los coordinadores
     * @returns {Promise<Array>} Lista de coordinadores
     */
    getCoordinadores: async () => {
        return await usuarioService.getByRol('COORDINADOR');
    },

    /**
     * Obtiene todos los docentes de integración
     * @returns {Promise<Array>} Lista de docentes
     */
    getDocentes: async () => {
        return await usuarioService.getByRol('DOCENTE_INTEGRACION');
    },

    /**
     * Obtiene estadísticas de usuarios
     * @returns {Promise<object>} Estadísticas
     */
    getStats: async () => {
        try {
            const allUsuarios = await usuarioService.getAll();

            return {
                total: allUsuarios.length,
                estudiantes: allUsuarios.filter(u => u.rol === 'ESTUDIANTE').length,
                tutores: allUsuarios.filter(u => u.rol === 'TUTOR').length,
                comite: allUsuarios.filter(u => u.rol === 'COMITE').length,
                directores: allUsuarios.filter(u => u.rol === 'DIRECTOR').length,
                coordinadores: allUsuarios.filter(u => u.rol === 'COORDINADOR').length,
                docentes: allUsuarios.filter(u => u.rol === 'DOCENTE_INTEGRACION').length
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de usuarios:', error);
            throw error;
        }
    },

    /**
     * Carga masiva de usuarios desde un array
     * @param {Array} usuarios - Array de usuarios a crear
     * @returns {Promise<object>} Resultado con exitosos y fallidos
     */
    bulkUpload: async (usuarios) => {
        try {
            const response = await apiClient.post('/usuarios/bulk', { usuarios });
            return response.data;
        } catch (error) {
            console.error('Error en carga masiva:', error);
            throw error;
        }
    },

    /**
     * Cambia la contraseña del usuario actual
     * @param {string} claveActual - Contraseña actual
     * @param {string} nuevaClave - Nueva contraseña
     * @returns {Promise<object>} Mensaje de éxito
     */
    changePassword: async (claveActual, nuevaClave) => {
        try {
            const response = await apiClient.post('/usuarios/cambiar-clave', { claveActual, nuevaClave });
            return response.data;
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            throw error.response?.data || error;
        }
    }
};

export default usuarioService;
