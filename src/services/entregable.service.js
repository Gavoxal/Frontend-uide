import { apiFetch } from './api';

export const EntregableService = {
    /**
     * Obtiene el estado de desbloqueo (16 semanas aprobadas)
     */
    async getUnlockStatus() {
        try {
            const response = await apiFetch('/api/v1/entregables/unlock-status');
            if (!response.ok) return { unlocked: false, approvedWeeks: 0, requiredWeeks: 16 };
            return await response.json();
        } catch (error) {
            console.error("EntregableService.getUnlockStatus error:", error);
            return { unlocked: false, approvedWeeks: 0, requiredWeeks: 16 };
        }
    },

    /**
     * Obtiene los entregables de una propuesta (activos o con historial)
     */
    async getByPropuesta(propuestaId, history = false) {
        try {
            const response = await apiFetch(`/api/v1/entregables/propuesta/${propuestaId}?history=${history}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("EntregableService.getByPropuesta error:", error);
            return [];
        }
    },

    /**
     * Sube un nuevo entregable (Tesis, Manual, etc.)
     * Maneja el versionamiento automáticamente en el backend
     */
    async upload(tipo, propuestaId, file) {
        try {
            const formData = new FormData();
            formData.append('tipo', tipo);
            formData.append('propuestasId', propuestaId);
            formData.append('file', file);

            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/entregables/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al subir entregable');
            }
            return await response.json();
        } catch (error) {
            console.error("EntregableService.upload error:", error);
            throw error;
        }
    }
};
