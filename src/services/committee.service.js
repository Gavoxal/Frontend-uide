import { apiFetch } from "./api";

export const CommitteeService = {
    /**
     * Obtener todos los miembros con rol COMITE
     */
    getMembers: async () => {
        const res = await apiFetch('/api/v1/usuarios?rol=COMITE,TUTOR');
        if (!res.ok) return [];
        return await res.json();
    },

    /**
     * Crear un nuevo miembro del comité
     */
    createMember: async (data) => {
        // Enviar datos al endpoint de creación de usuario
        const res = await apiFetch('/api/v1/usuarios', {
            method: 'POST',
            body: JSON.stringify({
                cedula: data.cedula,
                nombres: data.nombres,
                apellidos: data.apellidos,
                correo: data.email,
                clave: data.password,
                rol: 'COMITE',
                designacion: data.role
            })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Error al crear usuario');
        }
        return await res.json();
    },

    /**
     * Eliminar un miembro del comité
     */
    deleteMember: async (id) => {
        const res = await apiFetch(`/api/v1/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Error al eliminar usuario');
        }
        return true;
    }
};
