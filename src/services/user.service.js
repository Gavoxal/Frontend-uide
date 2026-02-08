import { apiFetch } from './api';

export const UserService = {
    /**
     * Obtiene los datos de un usuario por su ID
     * @param {number|string} id 
     * @returns {Promise<Object>} Datos del usuario
     */
    async getById(id) {
        if (!id) throw new Error("ID de usuario requerido");

        try {
            const response = await apiFetch(`/api/v1/usuarios/${id}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Error al obtener usuario: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("UserService.getById error:", error);
            throw error;
        }
    },

    /**
     * Actualiza los datos de un usuario
     * @param {number|string} id 
     * @param {Object} data 
     * @returns {Promise<Object>} Usuario actualizado
     */
    async update(id, data) {
        if (!id) throw new Error("ID de usuario requerido");

        try {
            const response = await apiFetch(`/api/v1/usuarios/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar usuario: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("UserService.update error:", error);
            throw error;
        }
    }
};
