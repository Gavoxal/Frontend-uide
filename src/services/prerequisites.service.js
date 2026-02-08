import { apiFetch } from './api';

export const PrerequisiteService = {
    // ... (getByStudent and getStatus remain the same) ...

    async getByStudent(studentId) {
        try {
            const query = studentId ? `?estudianteId=${studentId}` : '';
            const response = await apiFetch(`/api/v1/prerequisitos/${query}`);
            if (!response.ok) return [];

            const data = await response.json();

            // MAPEO: Backend (Español) -> Frontend (English Keys)
            return data.map(item => {
                let frontendKey = 'other';
                const n = (item.nombre || '').toLowerCase();

                if (n.includes('ingles') || n.includes('inglés')) frontendKey = 'english';
                else if (n.includes('vinculacion') || n.includes('vinculación')) frontendKey = 'community';
                else if (n.includes('practicas') || n.includes('prácticas')) frontendKey = 'internship';


                const hasFile = item.archivoUrl && item.archivoUrl.length > 0;

                return {
                    ...item,
                    name: frontendKey, // La clave que busca tu frontend
                    // Mapear estados adicionales: Si no está cumplido (true o 1) pero tiene archivo -> pending
                    status: (item.cumplido === true || item.cumplido === 1 || item.cumplido === "1") ? 'approved' : (hasFile ? 'pending' : 'missing'),
                    fileName: item.archivoUrl ? item.archivoUrl.split('/').pop() : null
                };
            });
        } catch (error) {
            console.error("PrerequisiteService.getByStudent error:", error);
            return [];
        }
    },

    async getStatus() {
        try {
            const response = await apiFetch('/api/v1/prerequisitos/status');
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("PrerequisiteService.getStatus error:", error);
            return null;
        }
    },

    /**
     * Sube un archivo de prerrequisito.
     * Soporta llamada con objeto: upload({ id: 1, archivo: File, ... })
     * O llamada directa: upload(1, File)
     */
    async upload(arg1, arg2) {
        try {
            let prerequisitoId, file;

            // MAPEO: Frontend Names -> Backend IDs
            // Incluimos tanto los nombres en inglés como los valores del ENUM del backend
            const ID_MAP = {
                'english': 1,
                'CERTIFICADO_INGLES': 1,
                'community': 2,
                'VINCULACION': 2,
                'internship': 3,
                'PRACTICAS_PREPROFESIONALES': 3
            };

            // Detectar si se llama con un objeto (desde Prerequisites.jsx)
            if (typeof arg1 === 'object' && !(arg1 instanceof File)) {
                file = arg1.archivo;

                // Prioridad 1: ID directo en el objeto (si viene del estado)
                if (arg1.id || arg1.prerequisitoId) {
                    prerequisitoId = arg1.id || arg1.prerequisitoId;
                }
                // Prioridad 2: Mapeo por nombre (english, community, etc o CERTIFICADO_INGLES)
                else {
                    const nameKey = arg1.name || arg1.nombre; // Frontend puede enviar 'nombre'
                    if (nameKey && ID_MAP[nameKey]) {
                        prerequisitoId = ID_MAP[nameKey];
                    }
                }
            } else {
                // Llamada directa: upload(1, file)
                prerequisitoId = arg1;
                file = arg2;
            }

            if (!file) throw new Error("No se proporcionó ningún archivo para subir.");
            if (!prerequisitoId) throw new Error(`No se pudo identificar el ID para el requisito: ${arg1.name || arg1.nombre || arg1}`);

            // Paso 1: Subir Archivo Físico
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');
            const uploadResponse = await fetch('/api/v1/prerequisitos/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!uploadResponse.ok) {
                const err = await uploadResponse.json().catch(() => ({}));
                throw new Error(err.message || 'Error al subir el archivo físico');
            }

            const uploadResult = await uploadResponse.json();

            // Paso 2: Registrar en Base de Datos
            const response = await apiFetch('/api/v1/prerequisitos/', {
                method: 'POST',
                body: JSON.stringify({
                    prerequisitoId: Number(prerequisitoId),
                    archivoUrl: uploadResult.url
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Error al registrar el prerrequisito');
            }

            return await response.json();
        } catch (error) {
            console.error("PrerequisiteService.upload error:", error);
            throw error;
        }
    }
};