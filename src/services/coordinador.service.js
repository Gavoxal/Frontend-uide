import { apiFetch } from './api';

export const CoordinadorService = {
    async getProfile() {
        try {
            const response = await apiFetch('/api/v1/coordinador/perfil');
            if (!response.ok) throw new Error('Error al obtener perfil del coordinador');
            return await response.json();
        } catch (error) {
            console.error("CoordinadorService.getProfile error:", error);
            throw error;
        }
    },

    async updateProfile(data) {
        try {
            const response = await apiFetch('/api/v1/coordinador/perfil', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al actualizar perfil del coordinador');
            return await response.json();
        } catch (error) {
            console.error("CoordinadorService.updateProfile error:", error);
            throw error;
        }
    }
};
