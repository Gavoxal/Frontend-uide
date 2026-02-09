import { apiFetch } from './api';

export const CommentService = {
    /**
     * Obtiene los comentarios de una propuesta específica
     * @param {number|string} proposalId 
     * @returns {Promise<Array>}
     */
    async getByProposal(proposalId) {
        try {
            const response = await apiFetch(`/api/v1/comentarios/propuesta/${proposalId}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("CommentService.getByProposal error:", error);
            return [];
        }
    },

    /**
     * Crea un nuevo comentario vinculado a una propuesta
     * @param {Object} data - { descripcion, propuestaId }
     * @returns {Promise<Object>}
     */
    async create(data) {
        try {
            const response = await apiFetch('/api/v1/comentarios', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear comentario');
            }
            return await response.json();
        } catch (error) {
            console.error("CommentService.create error:", error);
            throw error;
        }
    },

    /**
     * Elimina un comentario
     * @param {number|string} id 
     */
    async delete(id) {
        try {
            const response = await apiFetch(`/api/v1/comentarios/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar comentario');
            }
            return true;
        } catch (error) {
            console.error("CommentService.delete error:", error);
            throw error;
        }
    }
};
