import apiClient from './api';

/**
 * Servicio de Votaciones
 * Maneja operaciones de votación de tutores por estudiantes
 */
export const votacionService = {
    /**
     * Crea o actualiza una votación de tutor
     * @param {object} data - { tutorId, propuestaId, prioridad, justificacion }
     * @returns {Promise<object>} Votación creada/actualizada
     */
    votar: async (data) => {
        try {
            const response = await apiClient.post('/votacion', data);
            return response.data;
        } catch (error) {
            console.error('Error al votar:', error);
            throw error;
        }
    },

    /**
     * Obtiene votaciones de un estudiante
     * @param {number} estudianteId - ID del estudiante
     * @returns {Promise<Array>} Lista de votaciones del estudiante
     */
    getByEstudiante: async (estudianteId) => {
        try {
            const response = await apiClient.get(`/votacion/estudiante/${estudianteId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener votaciones del estudiante ${estudianteId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene votaciones de una propuesta
     * @param {number} propuestaId - ID de la propuesta
     * @returns {Promise<Array>} Lista de votaciones de la propuesta
     */
    getByPropuesta: async (propuestaId) => {
        try {
            const response = await apiClient.get(`/votacion/propuesta/${propuestaId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener votaciones de propuesta ${propuestaId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene votaciones recibidas por un tutor
     * @param {number} tutorId - ID del tutor
     * @returns {Promise<Array>} Lista de votaciones recibidas
     */
    getByTutor: async (tutorId) => {
        try {
            const response = await apiClient.get(`/votacion/tutor/${tutorId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener votaciones del tutor ${tutorId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene todas las votaciones (solo Director/Coordinador)
     * @returns {Promise<Array>} Lista de todas las votaciones
     */
    getAll: async () => {
        try {
            const response = await apiClient.get('/votacion/all');
            return response.data;
        } catch (error) {
            console.error('Error al obtener todas las votaciones:', error);
            throw error;
        }
    },

    /**
     * Obtiene resumen de votaciones para dashboard (solo Director/Coordinador)
     * @returns {Promise<object>} Resumen de votaciones
     */
    getSummary: async () => {
        try {
            const response = await apiClient.get('/votacion/summary');
            return response.data;
        } catch (error) {
            console.error('Error al obtener resumen de votaciones:', error);
            throw error;
        }
    },

    /**
     * Elimina una votación
     * @param {number} id - ID de la votación
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        try {
            await apiClient.delete(`/votacion/${id}`);
        } catch (error) {
            console.error(`Error al eliminar votación ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene estadísticas de votaciones
     * @returns {Promise<object>} Estadísticas
     */
    getStats: async () => {
        try {
            const summary = await votacionService.getSummary();
            return summary;
        } catch (error) {
            console.error('Error al obtener estadísticas de votaciones:', error);
            throw error;
        }
    }
};

export default votacionService;
