import { apiFetch } from './api';

export const PrerequisiteService = {
    // ... (getByStudent and getStatus remain the same) ...

    async getByStudent(studentId) {
        try {
            const query = studentId ? `?estudianteId=${studentId}` : '';
            const response = await apiFetch(`/api/v1/prerequisitos/${query}`);
            if (!response.ok) return [];

            const data = await response.json();

            return data.map(item => {
                let frontendKey = 'other';
                // Normalizar texto: minúsculas y quitar tildes
                const n = (item.nombre || '').toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");

                if (n.includes('ingles')) frontendKey = 'english';
                else if (n.includes('vinculacion')) frontendKey = 'community';
                else if (n.includes('practica')) frontendKey = 'internship';


                const hasFile = item.archivoUrl && item.archivoUrl.length > 0;

                return {
                    ...item,
                    name: frontendKey, // La clave que busca tu frontend
                    // Mapear estados adicionales: Si no está cumplido (true o 1) pero YA SE ENTREGÓ (tiene ID) -> pending
                    // Antes dependía de hasFile, ahora depende de si existe el registro
                    status: (item.cumplido === true || item.cumplido === 1 || item.cumplido === "1")
                        ? 'approved'
                        : (item.estudiantePrerequisitoId || item.entregado ? 'pending' : 'missing'),
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
            let archivoUrl = null;

            // Detectar si se llama con un objeto (desde Prerequisites.jsx)
            if (typeof arg1 === 'object' && !(arg1 instanceof File)) {
                file = arg1.archivo;
                // Usar ID del catálogo directamente
                prerequisitoId = arg1.id || arg1.prerequisitoId;
            } else {
                // Llamada directa backward compatibility
                prerequisitoId = arg1;
                file = arg2;
            }

            if (!prerequisitoId) throw new Error("No se pudo identificar el ID para el requisito.");

            // Paso 1: Subir Archivo Físico (Solo si hay archivo)
            if (file) {
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
                archivoUrl = uploadResult.url;
            }

            // Paso 2: Registrar en Base de Datos (Con o sin archivo)
            const response = await apiFetch('/api/v1/prerequisitos/', {
                method: 'POST',
                body: JSON.stringify({
                    prerequisitoId: Number(prerequisitoId),
                    archivoUrl: archivoUrl
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
    },

    async getDashboard() {
        try {
            const response = await apiFetch('/api/v1/prerequisitos/dashboard');
            if (!response.ok) return [];

            const data = await response.json();

            // Transformar datos para el componente DirectorPrerequisites
            return data.map(student => {
                const mappedPrereqs = {
                    english: { completed: false, verified: false, id: null },
                    internship: { completed: false, verified: false, id: null },
                    community: { completed: false, verified: false, id: null }
                };

                student.prerequisitos.forEach(req => {
                    let key = 'other';
                    // Normalizar texto para búsqueda robusta
                    const n = (req.nombre || '').toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "");

                    if (n.includes('ingles')) key = 'english';
                    else if (n.includes('vinculacion')) key = 'community';
                    else if (n.includes('practica')) key = 'internship';

                    if (mappedPrereqs[key]) {
                        mappedPrereqs[key] = {
                            completed: req.completed, // Si el estudiante lo "entregó"
                            verified: req.verified, // Si el director lo validó
                            id: req.id, // ID del catálogo (para referencia)
                            studentPrereqId: req.estudiantePrerequisitoId, // ID correcto para validación
                            file: req.file // URL del archivo si existe
                        };
                    }
                });

                return {
                    ...student,
                    ...mappedPrereqs
                };
            });
        } catch (error) {
            console.error("PrerequisiteService.getDashboard error:", error);
            return [];
        }
    },

    async validate(id, status) {
        try {
            const response = await apiFetch(`/api/v1/prerequisitos/${id}/validate`, {
                method: 'PUT',
                body: JSON.stringify({ cumplido: status })
            });
            return await response.json();
        } catch (error) {
            console.error("PrerequisiteService.validate error:", error);
            throw error;
        }
    },

    async grantAccess(studentId) {
        try {
            const response = await apiFetch(`/api/v1/prerequisitos/${studentId}/enable-access`, {
                method: 'POST'
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Error habilitando acceso');
            }
            return await response.json();
        } catch (error) {
            console.error("PrerequisiteService.grantAccess error:", error);
            throw error;
        }
    }
};