import { apiFetch } from './api';

export const PrerequisiteService = {
    /**
     * Obtiene los prerrequisitos del estudiante
     * @param {number|string} studentId 
     * @returns {Promise<Array>} Lista de prerrequisitos
     */
    async getByStudent(studentId) {
        try {
            const response = await apiFetch(`/api/v1/prerequisitos/?estudianteId=${studentId}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("PrerequisiteService.getByStudent error:", error);
            return [];
        }
    },

    /**
     * Sube un prerrequisito (Simula carga de archivo por ahora)
     * @param {Object} data - { nombre, descripcion, archivo (File) }
     * @returns {Promise<Object>} Resultado
     */
    async upload(data) {
        try {
            const formData = new FormData();
            formData.append('nombre', data.nombre); // Ejemplo: CERTIFICADO_INGLES
            formData.append('descripcion', data.descripcion || "Carga de requisito");

            // FormData key 'file' debe coincidir EXACTAMENTE con el backend
            if (data.archivo) {
                formData.append('file', data.archivo);
            }

            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/v1/prerequisitos/', {
                method: 'POST',
                body: formData,
                headers: headers // No establecer Content-Type, fetch lo hace automático con boundary
            });

            if (!response.ok) {
                throw new Error(`Error al subir prerrequisito: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("PrerequisiteService.upload error:", error);
            throw error;
        }
    }
};
