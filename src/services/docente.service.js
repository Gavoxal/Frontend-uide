import { apiFetch } from './api';
import { ProposalService } from './proposal.service';

export const DocenteService = {

    /**
     * Obtiene los estudiantes asignados al docente (todos los que tienen propuesta).
     * Nota: Como no hay endpoint específico de "mis estudiantes docente", 
     * usamos ProposalService.getAll() que devuelve todas las propuestas (para directores/docentes).
     */
    async getAssignedStudents() {
        try {
            const propuestas = await ProposalService.getAll();

            // Solo mostrar estudiantes con propuesta APROBADA
            const approvedPropuestas = propuestas.filter(p => p.estado === 'APROBADA');

            // Mapeamos a la estructura de estudiante
            const allStudents = approvedPropuestas
                .filter(p => p.estudiante && p.id)
                .map(p => ({
                    id: p.estudiante.id || p.fkEstudiante,
                    nombres: p.estudiante.nombres,
                    apellidos: p.estudiante.apellidos,
                    correo: p.estudiante.correoInstitucional,
                    propuestaId: p.id,
                    propuesta: p,
                    semanaActual: p.actividadResumen?.totalEvidencias || 0,
                    perfil: p.estudiante.estudiantePerfil
                }));

            // Deduplicate by student ID
            const uniqueStudents = Array.from(new Map(allStudents.map(item => [item.id, item])).values());

            return uniqueStudents;
        } catch (error) {
            console.error("DocenteService.getAssignedStudents error:", error);
            throw error;
        }
    },

    /**
     * Califica una evidencia como Docente de Integración (60%)
     */
    async gradeEvidencia(evidenciaId, calificacion, feedback) {
        try {
            const response = await apiFetch(`/api/v1/actividades/evidencias/${evidenciaId}/calificar-docente`, {
                method: 'PUT',
                body: JSON.stringify({ calificacion, feedback })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al calificar evidencia');
            }
            return await response.json();
        } catch (error) {
            console.error("DocenteService.gradeEvidencia error:", error);
            throw error;
        }
    },

    /**
     * Actualiza el estado revisión (Aprobado/Rechazado)
     */
    async updateEstadoRevision(evidenciaId, estado, comentario) {
        try {
            const response = await apiFetch(`/api/v1/actividades/evidencias/${evidenciaId}/estado`, {
                method: 'PUT',
                body: JSON.stringify({ estado, comentario })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar estado');
            }
            return await response.json();
        } catch (error) {
            console.error("DocenteService.updateEstadoRevision error:", error);
            throw error;
        }
    },

    async getAssignedStudentsGrades() {
        try {
            const response = await apiFetch('/api/v1/docente/estudiantes-notas');
            if (!response.ok) throw new Error('Error al obtener notas de estudiantes (Docente)');
            return await response.json();
        } catch (error) {
            console.error("DocenteService.getAssignedStudentsGrades error:", error);
            return [];
        }
    },

    async getProfile() {
        try {
            const response = await apiFetch('/api/v1/docente/perfil');
            if (!response.ok) throw new Error('Error al obtener perfil del docente');
            return await response.json();
        } catch (error) {
            console.error("DocenteService.getProfile error:", error);
            throw error;
        }
    },

    async updateProfile(data) {
        try {
            const response = await apiFetch('/api/v1/docente/perfil', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al actualizar perfil del docente');
            return await response.json();
        } catch (error) {
            console.error("DocenteService.updateProfile error:", error);
            throw error;
        }
    }
};
