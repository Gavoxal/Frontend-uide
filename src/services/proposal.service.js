import { apiFetch } from './api';

export const ProposalService = {
    /**
     * Obtiene las propuestas del estudiante autenticado
     * @returns {Promise<Array>}
     */
    async getAll() {
        try {
            const response = await apiFetch('/api/v1/propuestas/');
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("ProposalService.getAll error:", error);
            return [];
        }
    },

    /**
     * Obtiene la lista de áreas de conocimiento
     * @returns {Promise<Array>}
     */
    async getKnowledgeAreas() {
        try {
            const response = await apiFetch('/api/v1/areas-conocimiento');
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("ProposalService.getKnowledgeAreas error:", error);
            return [];
        }
    },

    /**
     * Obtiene una propuesta por ID
     * @param {number|string} id 
     * @returns {Promise<Object>}
     */
    async getById(id) {
        try {
            const response = await apiFetch(`/api/v1/propuestas/${id}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("ProposalService.getById error:", error);
            return null;
        }
    },

    /**
     * Crea una nueva propuesta
     * @param {Object} data - Datos de la propuesta incluyendo el archivo
     * @returns {Promise<Object>}
     */
    async create(data) {
        try {
            const formData = new FormData();
            formData.append('titulo', data.titulo);
            // El backend ahora espera areaConocimientoId (numérico)
            formData.append('areaConocimientoId', data.areaConocimientoId);
            formData.append('objetivos', data.objetivo);
            formData.append('problematica', data.problematica || '');
            formData.append('alcance', data.alcance || '');

            if (data.file && data.file.raw) {
                formData.append('file', data.file.raw);
            }

            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/v1/propuestas/', {
                method: 'POST',
                body: formData,
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al crear propuesta: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("ProposalService.create error:", error);
            throw error;
        }
    },
    async updateStatus(id, status, feedback) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/v1/propuestas/${id}/revision`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    estadoRevision: status,
                    comentariosRevision: feedback
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al actualizar estado: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("ProposalService.updateStatus error:", error);
            throw error;
        }
    }
};
