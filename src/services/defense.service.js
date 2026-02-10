import { apiFetch } from "./api";

export const DefenseService = {
    /**
     * Obtener todas las propuestas que están aprobadas y su estado de defensa
     */
    getProposalsForDefense: async () => {
        const res = await apiFetch('/api/v1/propuestas');
        if (!res.ok) return [];
        return await res.json();
    },

    /**
     * Obtener detalles de defensa privada por propuesta
     */
    getPrivateDefense: async (propuestaId) => {
        const res = await apiFetch(`/api/v1/defensas/privada/propuesta/${propuestaId}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Error al obtener defensa privada');
        return await res.json();
    },

    /**
     * Obtener detalles de defensa pública por propuesta
     */
    getPublicDefense: async (propuestaId) => {
        const res = await apiFetch(`/api/v1/defensas/publica/propuesta/${propuestaId}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Error al obtener defensa pública');
        return await res.json();
    },

    /**
     * Programar o actualizar defensa privada
     */
    schedulePrivate: async (propuestaId, data) => {
        const existing = await DefenseService.getPrivateDefense(propuestaId);

        if (existing) {
            // Actualizar existente
            const res = await apiFetch(`/api/v1/defensas/privada/${existing.id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Error al actualizar defensa privada');
            return await res.json();
        } else {
            // Crear nueva
            const res = await apiFetch('/api/v1/defensas/privada', {
                method: 'POST',
                body: JSON.stringify({
                    propuestaId: Number(propuestaId),
                    ...data
                })
            });
            if (!res.ok) throw new Error('Error al crear defensa privada');
            return await res.json();
        }
    },

    /**
     * Programar o actualizar defensa pública
     */
    schedulePublic: async (propuestaId, data) => {
        const existing = await DefenseService.getPublicDefense(propuestaId);

        if (existing) {
            // Actualizar existente
            const res = await apiFetch(`/api/v1/defensas/publica/${existing.id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Error al actualizar defensa pública');
            return await res.json();
        } else {
            // Crear nueva
            const res = await apiFetch('/api/v1/defensas/publica', {
                method: 'POST',
                body: JSON.stringify({
                    propuestaId: Number(propuestaId),
                    ...data
                })
            });
            if (!res.ok) throw new Error('Error al crear defensa pública');
            return await res.json();
        }
    },

    /**
     * Asignar participantes (Tribunal)
     */
    assignParticipants: async (evaluacionId, type, participantes) => {
        const results = [];
        for (const p of participantes) {
            const res = await apiFetch(`/api/v1/defensas/${type}/${evaluacionId}/participantes`, {
                method: 'POST',
                body: JSON.stringify({
                    usuarioId: p.usuarioId,
                    tipoParticipante: p.tipoParticipante,
                    rol: p.rol
                })
            });
            if (res.ok) {
                results.push(await res.json());
            }
        }
        return results;
    },

    /**
     * Obtener defensas donde el usuario es jurado/tutor
     */
    getDefensasJurado: async () => {
        const res = await apiFetch('/api/v1/defensas/jurado');
        if (!res.ok) throw new Error('Error obteniendo defensas del jurado');
        return await res.json();
    },

    /**
     * Calificar defensa (privada o pública) - Para jurado/tribunal
     */
    calificarDefensa: async (tipo, evaluacionId, data) => {
        const endpoint = tipo === 'PRIVADA' ? 'privada' : 'publica';
        const res = await apiFetch(`/api/v1/defensas/${endpoint}/${evaluacionId}/calificar`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al calificar defensa');
        return await res.json();
    },

    /**
     * Finalizar defensa (Aprobar/Rechazar por el Director)
     */
    finalizeDefense: async (tipo, id, data) => {
        const endpoint = tipo === 'PRIVADA' ? 'privada' : 'publica';
        const res = await apiFetch(`/api/v1/defensas/${endpoint}/${id}/finalizar`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al finalizar defensa');
        return await res.json();
    }
};
