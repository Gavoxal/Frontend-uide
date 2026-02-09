import apiClient from './api';

/**
 * Servicio de Defensas
 * Maneja operaciones de defensas privadas y públicas
 */
export const defensaService = {
    // ==================== DEFENSAS PRIVADAS ====================

    /**
     * Obtiene todas las defensas privadas
     * @returns {Promise<Array>} Lista de defensas privadas
     */
    getPrivadas: async () => {
        try {
            const response = await apiClient.get('/defensas/privada');
            return response.data;
        } catch (error) {
            console.error('Error al obtener defensas privadas:', error);
            throw error;
        }
    },

    /**
     * Obtiene una defensa privada por propuesta
     * @param {number} propuestaId - ID de la propuesta
     * @returns {Promise<object>} Defensa privada
     */
    getPrivadaByPropuesta: async (propuestaId) => {
        try {
            const response = await apiClient.get(`/defensas/privada/propuesta/${propuestaId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener defensa privada de propuesta ${propuestaId}:`, error);
            throw error;
        }
    },

    /**
     * Crea una nueva defensa privada
     * @param {object} data - { propuestaId, fechaDefensa, horaDefensa, aula }
     * @returns {Promise<object>} Defensa privada creada
     */
    createPrivada: async (data) => {
        try {
            const response = await apiClient.post('/defensas/privada', data);
            return response.data;
        } catch (error) {
            console.error('Error al crear defensa privada:', error);
            throw error;
        }
    },

    /**
     * Actualiza una defensa privada
     * @param {number} id - ID de la defensa
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} Defensa privada actualizada
     */
    updatePrivada: async (id, data) => {
        try {
            const response = await apiClient.put(`/defensas/privada/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar defensa privada ${id}:`, error);
            throw error;
        }
    },

    /**
     * Agrega un participante a una defensa privada
     * @param {number} evaluacionId - ID de la evaluación
     * @param {object} data - { usuarioId, tipoParticipante, rol }
     * @returns {Promise<object>} Participante agregado
     */
    addParticipantePrivada: async (evaluacionId, data) => {
        try {
            const response = await apiClient.post(
                `/defensas/privada/${evaluacionId}/participantes`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al agregar participante a defensa privada:', error);
            throw error;
        }
    },

    /**
     * Califica una defensa privada (por participante)
     * @param {number} evaluacionId - ID de la evaluación
     * @param {object} data - { calificacion, comentario }
     * @returns {Promise<object>} Calificación registrada
     */
    calificarPrivada: async (evaluacionId, data) => {
        try {
            const response = await apiClient.put(
                `/defensas/privada/${evaluacionId}/calificar`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al calificar defensa privada:', error);
            throw error;
        }
    },

    /**
     * Finaliza una defensa privada (aprobar/rechazar)
     * @param {number} id - ID de la defensa
     * @param {object} data - { aprobado, comentarios }
     * @returns {Promise<object>} Defensa finalizada
     */
    finalizarPrivada: async (id, data) => {
        try {
            const response = await apiClient.put(`/defensas/privada/${id}/finalizar`, data);
            return response.data;
        } catch (error) {
            console.error('Error al finalizar defensa privada:', error);
            throw error;
        }
    },

    // ==================== DEFENSAS PÚBLICAS ====================

    /**
     * Obtiene todas las defensas públicas
     * @returns {Promise<Array>} Lista de defensas públicas
     */
    getPublicas: async () => {
        try {
            const response = await apiClient.get('/defensas/publica');
            return response.data;
        } catch (error) {
            console.error('Error al obtener defensas públicas:', error);
            throw error;
        }
    },

    /**
     * Obtiene una defensa pública por propuesta
     * @param {number} propuestaId - ID de la propuesta
     * @returns {Promise<object>} Defensa pública
     */
    getPublicaByPropuesta: async (propuestaId) => {
        try {
            const response = await apiClient.get(`/defensas/publica/propuesta/${propuestaId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener defensa pública de propuesta ${propuestaId}:`, error);
            throw error;
        }
    },

    /**
     * Crea una nueva defensa pública
     * @param {object} data - { propuestaId, fechaDefensa, horaDefensa, aula }
     * @returns {Promise<object>} Defensa pública creada
     */
    createPublica: async (data) => {
        try {
            const response = await apiClient.post('/defensas/publica', data);
            return response.data;
        } catch (error) {
            console.error('Error al crear defensa pública:', error);
            throw error;
        }
    },

    /**
     * Actualiza una defensa pública
     * @param {number} id - ID de la defensa
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} Defensa pública actualizada
     */
    updatePublica: async (id, data) => {
        try {
            const response = await apiClient.put(`/defensas/publica/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar defensa pública ${id}:`, error);
            throw error;
        }
    },

    /**
     * Agrega un participante a una defensa pública
     * @param {number} evaluacionId - ID de la evaluación
     * @param {object} data - { usuarioId, tipoParticipante, rol }
     * @returns {Promise<object>} Participante agregado
     */
    addParticipantePublica: async (evaluacionId, data) => {
        try {
            const response = await apiClient.post(
                `/defensas/publica/${evaluacionId}/participantes`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al agregar participante a defensa pública:', error);
            throw error;
        }
    },

    /**
     * Califica una defensa pública (por participante)
     * @param {number} evaluacionId - ID de la evaluación
     * @param {object} data - { calificacion, comentario }
     * @returns {Promise<object>} Calificación registrada
     */
    calificarPublica: async (evaluacionId, data) => {
        try {
            const response = await apiClient.put(
                `/defensas/publica/${evaluacionId}/calificar`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al calificar defensa pública:', error);
            throw error;
        }
    },

    /**
     * Finaliza una defensa pública (aprobar/rechazar)
     * @param {number} id - ID de la defensa
     * @param {object} data - { aprobado, comentarios }
     * @returns {Promise<object>} Defensa finalizada
     */
    finalizarPublica: async (id, data) => {
        try {
            const response = await apiClient.put(`/defensas/publica/${id}/finalizar`, data);
            return response.data;
        } catch (error) {
            console.error('Error al finalizar defensa pública:', error);
            throw error;
        }
    },

    // ==================== ESTADÍSTICAS ====================

    /**
     * Obtiene estadísticas de defensas
     * @returns {Promise<object>} Estadísticas
     */
    getStats: async () => {
        try {
            const [privadas, publicas] = await Promise.all([
                defensaService.getPrivadas(),
                defensaService.getPublicas()
            ]);

            return {
                privadas: {
                    total: privadas.length,
                    programadas: privadas.filter(d => d.estado === 'PROGRAMADA').length,
                    realizadas: privadas.filter(d => d.estado === 'REALIZADA').length,
                    aprobadas: privadas.filter(d => d.estado === 'APROBADA').length
                },
                publicas: {
                    total: publicas.length,
                    programadas: publicas.filter(d => d.estado === 'PROGRAMADA').length,
                    realizadas: publicas.filter(d => d.estado === 'REALIZADA').length,
                    aprobadas: publicas.filter(d => d.estado === 'APROBADA').length
                }
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de defensas:', error);
            throw error;
        }
    }
};

export default defensaService;
