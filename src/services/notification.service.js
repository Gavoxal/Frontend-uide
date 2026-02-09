import { apiFetch } from "./api";

export const NotificationService = {
    getAll: async () => {
        try {
            const response = await apiFetch('/api/v1/notificaciones');
            if (!response.ok) throw new Error('Error fetching notifications');
            return await response.json();
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },

    getUnreadCount: async () => {
        try {
            const response = await apiFetch('/api/v1/notificaciones/unread-count');
            if (response.ok) {
                return await response.json();
            }
            return { count: 0 };
        } catch (error) {
            console.error("Error fetching unread count:", error);
            return { count: 0 };
        }
    },

    markAsRead: async (id) => {
        try {
            const response = await apiFetch(`/api/v1/notificaciones/${id}/read`, {
                method: 'PATCH',
                body: JSON.stringify({})
            });
            if (!response.ok) throw new Error('Error marking as read');
            return await response.json();
        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await apiFetch('/api/v1/notificaciones/mark-all-read', {
                method: 'PATCH',
                body: JSON.stringify({})
            });
            if (!response.ok) throw new Error('Error marking all as read');
            return await response.json();
        } catch (error) {
            console.error("Error marking all as read:", error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            // Fastify might complain about empty body with certain configs, key is headers
            const response = await apiFetch(`/api/v1/notificaciones/${id}`, {
                method: 'DELETE',
                // Explicitly send no body or empty json if needed, but usually DELETE has no body
                // The error 'Body cannot be empty when content-type is set to application/json' 
                // implies a content-type header is being sent. apiFetch likely sets it.
                // We'll try sending an empty object to satisfy the parser.
                body: JSON.stringify({})
            });
            if (!response.ok) throw new Error('Error deleting notification');
            return true;
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    }
};
