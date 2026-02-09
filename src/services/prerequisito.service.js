import apiClient from './api';

/**
 * Servicio de Prerrequisitos
 * Maneja operaciones relacionadas con prerrequisitos de estudiantes
 */
export const prerequisitoService = {
    /**
     * Obtiene el dashboard de prerrequisitos (todos los estudiantes con sus prerrequisitos)
     * @returns {Promise<Array>} Lista de estudiantes con prerrequisitos
     */
    getDashboard: async () => {
        try {
            const response = await apiClient.get('/prerequisitos/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error al obtener dashboard de prerrequisitos:', error);
            throw error;
        }
    },

    /**
     * Obtiene prerrequisitos de un estudiante específico
     * @param {number} estudianteId - ID del estudiante
     * @returns {Promise<Array>} Lista de prerrequisitos del estudiante
     */
    getByEstudiante: async (estudianteId) => {
        try {
            const response = await apiClient.get(`/prerequisitos/estudiante/${estudianteId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener prerrequisitos del estudiante ${estudianteId}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza el estado de un prerrequisito de un estudiante
     * @param {number} estudianteId - ID del estudiante
     * @param {number} prerequisitoId - ID del prerrequisito
     * @param {object} data - { cumplido: boolean, observaciones?: string }
     * @returns {Promise<object>} Prerrequisito actualizado
     */
    update: async (estudianteId, prerequisitoId, data) => {
        try {
            const response = await apiClient.put(
                `/prerequisitos/estudiante/${estudianteId}/${prerequisitoId}`,
                data
            );
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar prerrequisito:`, error);
            throw error;
        }
    },

    /**
     * Verifica (aprueba) un prerrequisito de un estudiante
     * @param {number} estudianteId - ID del estudiante
     * @param {number} prerequisitoId - ID del prerrequisito
     * @param {string} observaciones - Observaciones opcionales
     * @returns {Promise<object>} Prerrequisito verificado
     */
    verificar: async (estudianteId, prerequisitoId, observaciones = '') => {
        try {
            return await prerequisitoService.update(estudianteId, prerequisitoId, {
                cumplido: true,
                observaciones
            });
        } catch (error) {
            console.error('Error al verificar prerrequisito:', error);
            throw error;
        }
    },

    /**
     * Rechaza un prerrequisito de un estudiante
     * @param {number} estudianteId - ID del estudiante
     * @param {number} prerequisitoId - ID del prerrequisito
     * @param {string} observaciones - Motivo del rechazo
     * @returns {Promise<object>} Prerrequisito rechazado
     */
    rechazar: async (estudianteId, prerequisitoId, observaciones) => {
        try {
            return await prerequisitoService.update(estudianteId, prerequisitoId, {
                cumplido: false,
                observaciones
            });
        } catch (error) {
            console.error('Error al rechazar prerrequisito:', error);
            throw error;
        }
    },

    /**
     * Obtiene el catálogo de prerrequisitos
     * @returns {Promise<Array>} Lista de prerrequisitos disponibles
     */
    getCatalogo: async () => {
        try {
            const response = await apiClient.get('/prerequisitos/catalogo');
            return response.data;
        } catch (error) {
            console.error('Error al obtener catálogo de prerrequisitos:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo prerrequisito en el catálogo
     * @param {object} data - { nombre, descripcion, activo }
     * @returns {Promise<object>} Prerrequisito creado
     */
    createCatalogo: async (data) => {
        try {
            const response = await apiClient.post('/prerequisitos/catalogo', data);
            return response.data;
        } catch (error) {
            console.error('Error al crear prerrequisito en catálogo:', error);
            throw error;
        }
    },

    /**
     * Actualiza un prerrequisito del catálogo
     * @param {number} id - ID del prerrequisito
     * @param {object} data - Datos a actualizar
     * @returns {Promise<object>} Prerrequisito actualizado
     */
    updateCatalogo: async (id, data) => {
        try {
            const response = await apiClient.put(`/prerequisitos/catalogo/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar prerrequisito ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene estadísticas de prerrequisitos
     * @returns {Promise<object>} Estadísticas
     */
    getStats: async () => {
        try {
            const dashboard = await prerequisitoService.getDashboard();

            const totalEstudiantes = dashboard.length;
            const estudiantesCompletos = dashboard.filter(est =>
                est.prerequisitos.every(p => p.cumplido)
            ).length;
            const estudiantesPendientes = totalEstudiantes - estudiantesCompletos;

            return {
                totalEstudiantes,
                estudiantesCompletos,
                estudiantesPendientes,
                porcentajeCompleto: totalEstudiantes > 0
                    ? Math.round((estudiantesCompletos / totalEstudiantes) * 100)
                    : 0
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de prerrequisitos:', error);
            throw error;
        }
    },

    /**
     * Obtiene mis prerrequisitos (Estudiante actual)
     * @returns {Promise<Array>} Lista de prerrequisitos
     */
    getMyPrerequisites: async () => {
        try {
            const response = await apiClient.get('/prerequisitos');
            return response.data;
        } catch (error) {
            console.error('Error al obtener mis prerrequisitos:', error);
            throw error;
        }
    },

    /**
     * Sube un archivo de prerrequisito
     * @param {File} file - Archivo a subir
     * @returns {Promise<object>} { message, url, filename }
     */
    uploadFile: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post('/prerequisitos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al subir archivo:', error);
            throw error;
        }
    },

    /**
     * Registra el cumplimiento de un prerrequisito (subida de archivo)
     * @param {object} data - { prerequisitoId, archivoUrl }
     * @returns {Promise<object>} Registro creado/actualizado
     */
    createEstudiantePrerequisito: async (data) => {
        try {
            const response = await apiClient.post('/prerequisitos', data);
            return response.data;
        } catch (error) {
            console.error('Error al registrar prerrequisito:', error);
            throw error;
        }
    }
};

export default prerequisitoService;
