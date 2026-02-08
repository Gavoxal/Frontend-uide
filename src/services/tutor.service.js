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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al obtener estudiantes: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("TutorService.getAssignedStudents error:", error);
            throw error;
        }
    }
};
