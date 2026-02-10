import { apiFetch } from './api';

export const TutorService = {
    /**
     * Obtiene la lista de estudiantes asignados al tutor actual.
     * @returns {Promise<Array>}
     */
    async getAssignedStudents() {
        try {
            const response = await apiFetch('/api/v1/tutor/mis-estudiantes');
            if (!response.ok) {
                // Si retorna 401/403 ya lo maneja apiFetch o el interceptor, 
                // pero si es otro error lanzamos excepción
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("TutorService.getAssignedStudents error:", error);
            return []; // Retorna array vacío para no romper el UI
        }
    },

    async getProfile() {
        try {
            const response = await apiFetch('/api/v1/tutor/perfil');
            if (!response.ok) throw new Error('Error al obtener perfil');
            return await response.json();
        } catch (error) {
            console.error("TutorService.getProfile error:", error);
            throw error;
        }
    },

    async updateProfile(data) {
        try {
            const response = await apiFetch('/api/v1/tutor/perfil', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al actualizar perfil');
            return await response.json();
        } catch (error) {
            console.error("TutorService.updateProfile error:", error);
            throw error;
        }
    },

    async getAssignedStudentsGrades() {
        try {
            const response = await apiFetch('/api/v1/tutor/mis-estudiantes-notas');
            if (!response.ok) throw new Error('Error al obtener notas de estudiantes');
            return await response.json();
        } catch (error) {
            console.error("TutorService.getAssignedStudentsGrades error:", error);
            return [];
        }
    }
};
