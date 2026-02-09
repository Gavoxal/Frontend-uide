import { apiFetch } from './api';

export const BitacoraService = {
    /**
     * Obtiene todas las reuniones de un tutor.
     * @returns {Promise<Array>}
     */
    async getReuniones() {
        try {
            const response = await apiFetch('/api/v1/bitacora');
            if (!response.ok) {
                // Si es 404 puede ser que no haya reuniones, retornamos array vacío
                if (response.status === 404) return [];
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al obtener reuniones: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("BitacoraService.getReuniones error:", error);
            throw error;
        }
    },

    /**
     * Crea una nueva reunión (agendamiento).
     * @param {Object} reunionData
     * @returns {Promise<Object>}
     */
    async createReunion(reunionData) {
        try {
            const response = await apiFetch('/api/v1/bitacora', {
                method: 'POST',
                body: JSON.stringify(reunionData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al crear reunión: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("BitacoraService.createReunion error:", error);
            throw error;
        }
    },

    /**
     * Actualiza una reunión existente (ej. completar resumen post-reunión).
     * @param {number} id
     * @param {Object} reunionData
     * @returns {Promise<Object>}
     */
    async updateReunion(id, reunionData) {
        try {
            const response = await apiFetch(`/api/v1/bitacora/${id}`, {
                method: 'PUT',
                body: JSON.stringify(reunionData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al actualizar reunión: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("BitacoraService.updateReunion error:", error);
            throw error;
        }
    },

    /**
     * Elimina una reunión.
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    async deleteReunion(id) {
        try {
            const response = await apiFetch(`/api/v1/bitacora/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al eliminar reunión: ${response.statusText}`);
            }
            return true;
        } catch (error) {
            console.error("BitacoraService.deleteReunion error:", error);
            throw error;
        }
    }
};
