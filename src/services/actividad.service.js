import apiClient from './api';

/**
 * Servicio de Actividades
 * Maneja operaciones de actividades y evidencias
 */
export const actividadService = {
    /**
     * Obtiene todas las actividades de una propuesta
     * @param {number} propuestaId - ID de la propuesta
     * @returns {Promise<Array>} Lista de actividades
     */
    getByPropuesta: async (propuestaId) => {
        try {
            const response = await apiClient.get(`/actividades/propuesta/${propuestaId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener actividades de propuesta ${propuestaId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene una actividad por ID
     * @param {number} id - ID de la actividad
     * @returns {Promise<object>} Actividad
     */
    getById: async (id) => {
        try {
            const response = await apiClient.get(`/actividades/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener actividad ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea una nueva actividad
     * @param {object} data - Datos de la actividad
     * @returns {Promise<object>} Actividad creada
     */
    create: async (data) => {
        try {
            const response = await apiClient.post('/actividades', data);
            return response.data;
        } catch (error) {
            console.error('Error al crear actividad:', error);
            throw error;
        }
    },

    /**
     * Actualiza una actividad
     * @param {number} id - ID de la actividad
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} Actividad actualizada
     */
    update: async (id, data) => {
        try {
            const response = await apiClient.put(`/actividades/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar actividad ${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina una actividad
     * @param {number} id - ID de la actividad
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        try {
            await apiClient.delete(`/actividades/${id}`);
        } catch (error) {
            console.error(`Error al eliminar actividad ${id}:`, error);
            throw error;
        }
    },

    // ==================== EVIDENCIAS ====================

    /**
     * Obtiene evidencias de una actividad
     * @param {number} actividadId - ID de la actividad
     * @returns {Promise<Array>} Lista de evidencias
     */
    getEvidencias: async (actividadId) => {
        try {
            const response = await apiClient.get(`/actividades/${actividadId}/evidencias`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener evidencias de actividad ${actividadId}:`, error);
            throw error;
        }
    },

    /**
     * Sube una evidencia
     * @param {number} actividadId - ID de la actividad
     * @param {FormData} formData - Datos del formulario con archivo
     * @returns {Promise<object>} Evidencia creada
     */
    uploadEvidencia: async (actividadId, formData) => {
        try {
            const response = await apiClient.post(
                `/actividades/${actividadId}/evidencias`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error al subir evidencia:', error);
            throw error;
        }
    },

    /**
     * Califica una evidencia como tutor (40%)
     * @param {number} evidenciaId - ID de la evidencia
     * @param {object} data - { calificacion, feedback }
     * @returns {Promise<object>} Evidencia calificada
     */
    calificarEvidenciaTutor: async (evidenciaId, data) => {
        try {
            const response = await apiClient.put(
                `/actividades/evidencias/${evidenciaId}/calificar-tutor`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al calificar evidencia (tutor):', error);
            throw error;
        }
    },

    /**
     * Califica una evidencia como docente (60%)
     * @param {number} evidenciaId - ID de la evidencia
     * @param {object} data - { calificacion, feedback }
     * @returns {Promise<object>} Evidencia calificada
     */
    calificarEvidenciaDocente: async (evidenciaId, data) => {
        try {
            const response = await apiClient.put(
                `/actividades/evidencias/${evidenciaId}/calificar-docente`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al calificar evidencia (docente):', error);
            throw error;
        }
    },

    /**
     * Actualiza el estado de revisión de una evidencia
     * @param {number} evidenciaId - ID de la evidencia
     * @param {object} data - { estadoRevision, feedback }
     * @returns {Promise<object>} Evidencia actualizada
     */
    updateEstadoRevision: async (evidenciaId, data) => {
        try {
            const response = await apiClient.put(
                `/actividades/evidencias/${evidenciaId}/estado`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar estado de revisión:', error);
            throw error;
        }
    },

    /**
     * Elimina una evidencia
     * @param {number} evidenciaId - ID de la evidencia
     * @returns {Promise<void>}
     */
    deleteEvidencia: async (evidenciaId) => {
        try {
            await apiClient.delete(`/actividades/evidencias/${evidenciaId}`);
        } catch (error) {
            console.error(`Error al eliminar evidencia ${evidenciaId}:`, error);
            throw error;
        }
    }
};

export default actividadService;
