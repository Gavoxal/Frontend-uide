const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const DashboardService = {
    getStats: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener estadísticas');
        }

        return await response.json();
    }
};
