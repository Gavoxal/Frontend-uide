import { apiFetch } from './api';

export const TutoringService = {
    /**
     * Obtiene estadísticas de carga de tutores
     * @returns {Promise<Array>}
     */
    async getTutorsStats() {
        try {
            const response = await apiFetch('/api/v1/trabajos-titulacion/stats/carga-tutores');
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("TutoringService.getTutorsStats error:", error);
            return [];
        }
    },

    /**
     * Obtiene todos los trabajos de titulación registrados
     * @returns {Promise<Array>}
     */
    async getAllAssignments() {
        try {
            const response = await apiFetch('/api/v1/trabajos-titulacion');
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("TutoringService.getAllAssignments error:", error);
            return [];
        }
    },

    /**
     * Asigna un tutor a una propuesta
     * @param {Object} data - { propuestaId, tutorId, observaciones }
     * @returns {Promise<Object>}
     */
    async assignTutor(data) {
        try {
            const response = await apiFetch('/api/v1/trabajos-titulacion', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al asignar tutor');
            }
            return await response.json();
        } catch (error) {
            console.error("TutoringService.assignTutor error:", error);
            throw error;
        }
    }
};
