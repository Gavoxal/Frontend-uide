import apiClient from './api';
import { transformPropuesta, transformPropuestas } from '../utils/transformers';

/**
 * Servicio de Propuestas
 * Maneja todas las operaciones CRUD de propuestas
 */
export const propuestaService = {
    /**
     * Obtiene todas las propuestas con filtros opcionales
     * @param {object} filters - Filtros opcionales (estado, estudianteId, etc.)
     * @returns {Promise<Array>} Lista de propuestas
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

            const response = await apiClient.get(`/propuestas?${params.toString()}`);
            return transformPropuestas(response.data);
        } catch (error) {
            console.error('Error al obtener propuestas:', error);
            throw error;
        }
    },

    /**
     * Obtiene una propuesta por ID
     * @param {number} id - ID de la propuesta
     * @returns {Promise<object>} Propuesta
     */
    getById: async (id) => {
        try {
            const response = await apiClient.get(`/propuestas/${id}`);
            return transformPropuesta(response.data);
        } catch (error) {
            console.error(`Error al obtener propuesta ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea una nueva propuesta
     * @param {object} data - Datos de la propuesta
     * @returns {Promise<object>} Propuesta creada
     */
    create: async (data) => {
        try {
            const response = await apiClient.post('/propuestas', data);
            return transformPropuesta(response.data);
        } catch (error) {
            console.error('Error al crear propuesta:', error);
            throw error;
        }
    },

    /**
     * Actualiza una propuesta
     * @param {number} id - ID de la propuesta
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} Propuesta actualizada
     */
    update: async (id, data) => {
        try {
            const response = await apiClient.put(`/propuestas/${id}`, data);
            return transformPropuesta(response.data);
        } catch (error) {
            console.error(`Error al actualizar propuesta ${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina una propuesta
     * @param {number} id - ID de la propuesta
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        try {
            await apiClient.delete(`/propuestas/${id}`);
        } catch (error) {
            console.error(`Error al eliminar propuesta ${id}:`, error);
            throw error;
        }
    },

    /**
     * Revisa una propuesta (aprobar/rechazar)
     * @param {number} id - ID de la propuesta
     * @param {object} data - { estadoRevision: 'APROBADO'|'RECHAZADO', comentarioRevision: string }
     * @returns {Promise<object>} Propuesta revisada
     */
    revisar: async (id, data) => {
        try {
            const response = await apiClient.put(`/propuestas/${id}/revisar`, data);
            return transformPropuesta(response.data);
        } catch (error) {
            console.error(`Error al revisar propuesta ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza el estado de una propuesta
     * @param {number} id - ID de la propuesta
     * @param {object} data - { estado: string, observaciones?: string }
     * @returns {Promise<object>} Propuesta actualizada
     */
    updateEstado: async (id, data) => {
        try {
            const response = await apiClient.put(`/propuestas/${id}/estado`, data);
            return transformPropuesta(response.data);
        } catch (error) {
            console.error(`Error al actualizar estado de propuesta ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene propuestas por estudiante
     * @param {number} estudianteId - ID del estudiante
     * @returns {Promise<Array>} Lista de propuestas del estudiante
     */
    getByEstudiante: async (estudianteId) => {
        try {
            const response = await apiClient.get(`/propuestas/estudiante/${estudianteId}`);
            return transformPropuestas(response.data);
        } catch (error) {
            console.error(`Error al obtener propuestas del estudiante ${estudianteId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene estadísticas de propuestas
     * @returns {Promise<object>} Estadísticas
     */
    getStats: async () => {
        try {
            const allPropuestas = await propuestaService.getAll();

            return {
                total: allPropuestas.length,
                pendientes: allPropuestas.filter(p => p.estadoOriginal === 'PENDIENTE').length,
                aprobadas: allPropuestas.filter(p => p.estadoOriginal === 'APROBADA').length,
                rechazadas: allPropuestas.filter(p => p.estadoOriginal === 'RECHAZADA').length
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de propuestas:', error);
            throw error;
        }
    }
};

export default propuestaService;
