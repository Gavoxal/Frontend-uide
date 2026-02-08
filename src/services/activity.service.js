import { apiFetch } from './api';

export const ActivityService = {
    /**
     * Crea una nueva actividad vinculada a una propuesta.
     * @param {Object} activityData { nombre, descripcion, propuestaId, tipo }
     */
    async create(activityData) {
        try {
            const response = await apiFetch('/api/v1/actividades', {
                method: 'POST',
                body: JSON.stringify(activityData)
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al crear actividad');
            }
            return await response.json();
        } catch (error) {
            console.error("ActivityService.create error:", error);
            throw error;
        }
    },

    /**
     * Obtiene todas las actividades de una propuesta específica.
     * @param {number|string} propuestaId
     */
    async getByPropuesta(propuestaId) {
        try {
            const response = await apiFetch(`/api/v1/actividades/propuesta/${propuestaId}`);
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al obtener actividades');
            }
            return await response.json();
        } catch (error) {
            console.error("ActivityService.getByPropuesta error:", error);
            throw error;
        }
    },

    /**
     * Obtiene el detalle de una actividad específica.
     * @param {number|string} id
     */
    async getById(id) {
        try {
            const response = await apiFetch(`/api/v1/actividades/${id}`);
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al obtener detalle de actividad');
            }
            return await response.json();
        } catch (error) {
            console.error("ActivityService.getById error:", error);
            throw error;
        }
    },

    /**
     * Actualiza una actividad.
     * @param {number|string} id
     * @param {Object} data { nombre, descripcion }
     */
    async update(id, data) {
        try {
            const response = await apiFetch(`/api/v1/actividades/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al actualizar actividad');
            }
            return await response.json();
        } catch (error) {
            console.error("ActivityService.update error:", error);
            throw error;
        }
    },

    /**
     * Elimina una actividad.
     * @param {number|string} id
     */
    async delete(id) {
        try {
            const response = await apiFetch(`/api/v1/actividades/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al eliminar actividad');
            }
            return true;
        } catch (error) {
            console.error("ActivityService.delete error:", error);
            throw error;
        }
    },

    /**
     * Califica y comenta la evidencia de una actividad como Tutor.
     * @param {number|string} evidenciaId
     * @param {Object} gradingData { calificacion, feedback }
     */
    async gradeEvidencia(evidenciaId, gradingData) {
        try {
            const response = await apiFetch(`/api/v1/actividades/evidencias/${evidenciaId}/calificar-tutor`, {
                method: 'PUT',
                body: JSON.stringify({
                    calificacion: gradingData.calificacion || gradingData.rating,
                    feedback: gradingData.feedback || gradingData.observations || gradingData.observaciones || gradingData.comentarios || gradingData.comment
                })
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al calificar evidencia');
            }
            return await response.json();
        } catch (error) {
            console.error("ActivityService.gradeEvidencia error:", error);
            throw error;
        }
    },

    /**
     * Califica y comenta la evidencia de una actividad como Docente de Integrante.
     * @param {number|string} evidenciaId
     * @param {Object} gradingData { calificacion, feedback }
     */
    async gradeEvidenciaDocente(evidenciaId, gradingData) {
        try {
            const response = await apiFetch(`/api/v1/actividades/evidencias/${evidenciaId}/calificar-docente`, {
                method: 'PUT',
                body: JSON.stringify({
                    calificacion: gradingData.calificacion || gradingData.rating || gradingData.grade,
                    feedback: gradingData.feedback || gradingData.observations || gradingData.comentarios || gradingData.comment
                })
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al calificar evidencia (Docente)');
            }
            return await response.json();
        } catch (error) {
            console.error("ActivityService.gradeEvidenciaDocente error:", error);
            throw error;
        }
    },

    /**
     * Sube una evidencia para una actividad (multipart/form-data).
     * @param {number|string} actividadId
     * @param {FormData} formData Debe contener 'part', 'semana', 'contenido' y opcionalmente campos adicionales.
     */
    async createEvidencia(actividadId, formData) {
        try {
            // 1. Subir el archivo primero
            const uploadFormData = new FormData();
            uploadFormData.append('file', formData.get('file'));

            const token = localStorage.getItem('token');
            const uploadResponse = await fetch('/api/v1/actividades/evidencias/upload', {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: uploadFormData
            });

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json().catch(() => ({}));
                throw new Error(error.message || 'Error al subir archivo de evidencia');
            }

            const { url: archivoUrl } = await uploadResponse.json();

            // 2. Crear el registro de evidencia con el URL del archivo
            // Usamos apiFetch porque espera JSON
            const response = await apiFetch(`/api/v1/actividades/${actividadId}/evidencias`, {
                method: 'POST',
                body: JSON.stringify({
                    semana: Number(formData.get('semana')),
                    contenido: formData.get('contenido'),
                    archivoUrl: archivoUrl
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al registrar la evidencia');
            }

            return await response.json();
        } catch (error) {
            console.error("ActivityService.createEvidencia error:", error);
            throw error;
        }
    },

    /**
     * Obtiene todas las evidencias del sistema (para Docentes).
     */
    async getAllEvidencias() {
        try {
            const response = await apiFetch('/api/v1/actividades/evidencias');
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error al obtener todas las evidencias');
            }
            return await response.json();
        } catch (error) {
            console.error("ActivityService.getAllEvidencias error:", error);
            throw error;
        }
    }
};
