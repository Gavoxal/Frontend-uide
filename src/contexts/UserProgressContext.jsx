import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrerequisiteService } from '../services/prerequisites.service';
import { getDataUser } from '../storage/user.model.jsx';

const UserProgressContext = createContext();

export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (!context) {
        throw new Error('useUserProgress debe usarse dentro de UserProgressProvider');
    }
    return context;
};

// Mock data remains if needed elsewhere, but we prioritize real data
export function UserProgressProvider({ children }) {
    const [progressState, setProgressState] = useState({
        prerequisitesStatus: 'pending', // 'pending', 'approved', 'rejected'
        completedWeeks: 0, // 0-15
        hasProjectAccess: false,
        isLoadingProgress: true,
        studentName: '',
        studentId: ''
    });

    useEffect(() => {
        loadUserProgress();
    }, []);

    const loadUserProgress = async () => {
        const user = getDataUser();
        if (!user?.id) {
            setProgressState(prev => ({ ...prev, isLoadingProgress: false }));
            return;
        }

        setProgressState(prev => ({ ...prev, isLoadingProgress: true }));

        try {
            // Cargar registros personales (que ya vienen mapeados por el servicio)
            const prerequisites = await PrerequisiteService.getByStudent(user.id);
            console.log("Context: Prerequisites loaded", prerequisites);

            let allApproved = false;
            if (Array.isArray(prerequisites)) {
                // Buscamos específicamente los 3 obligatorios por sus claves mapeadas por el servicio
                const requiredKeys = ["english", "internship", "community"];

                allApproved = requiredKeys.every(key => {
                    const found = prerequisites.find(p => p.name === key);
                    return found && found.status === 'approved';
                });
            }

            setProgressState(prev => ({
                ...prev,
                studentName: (user.nombres && user.apellidos) ? `${user.nombres} ${user.apellidos}` : (user.name || ""),
                studentId: user.id,
                prerequisitesStatus: allApproved ? 'approved' : 'pending',
                hasProjectAccess: allApproved,
                isLoadingProgress: false
            }));

        } catch (error) {
            console.error("Error loading user progress:", error);
            setProgressState(prev => ({ ...prev, isLoadingProgress: false }));
        }
    };

    const refreshProgress = () => {
        loadUserProgress();
    };

    const updateProgress = (updates) => {
        setProgressState(prev => ({
            ...prev,
            ...updates
        }));
    };

    // Verificar si puede acceder a una sección
    const canAccessSection = (sectionName) => {
        // Secciones siempre disponibles
        const alwaysAvailable = ['dashboard', 'prerequisites', 'profile'];
        if (alwaysAvailable.includes(sectionName.toLowerCase())) {
            return true;
        }

        // Si no tiene prerrequisitos aprobados, no puede acceder a nada más
        if (progressState.prerequisitesStatus !== 'approved') {
            return false;
        }

        // Secciones que requieren las 16 semanas completadas
        const requires16Weeks = ['defensa'];
        if (requires16Weeks.includes(sectionName.toLowerCase())) {
            return progressState.completedWeeks >= 16;
        }

        // Para el resto de secciones (propuestas, avances), solo necesita prerrequisitos aprobados
        return true;
    };

    // Obtener razón de bloqueo
    const getBlockReason = (sectionName) => {
        if (canAccessSection(sectionName)) {
            return null;
        }

        if (progressState.prerequisitesStatus !== 'approved') {
            return 'Debes completar y aprobar tus prerrequisitos primero';
        }

        const requires16Weeks = ['defensa'];
        if (requires16Weeks.includes(sectionName.toLowerCase())) {
            const remaining = 16 - progressState.completedWeeks;
            return `Requiere completar las 16 semanas de avances (${remaining} restantes)`;
        }

        return 'Acceso no disponible';
    };

    // Verificar si mostrar alerta de prerrequisitos
    const shouldShowPrerequisitesAlert = () => {
        return progressState.prerequisitesStatus !== 'approved';
    };

    // Obtener progreso general
    const getProgressSummary = () => {
        return {
            prerequisitesApproved: progressState.prerequisitesStatus === 'approved',
            weeklyProgress: `${progressState.completedWeeks}/16`,
            weeklyPercentage: (progressState.completedWeeks / 16) * 100,
            projectUnlocked: progressState.completedWeeks >= 16,
            fullAccessGranted: progressState.prerequisitesStatus === 'approved' && progressState.hasProjectAccess
        };
    };

    const value = {
        ...progressState,
        canAccessSection,
        getBlockReason,
        shouldShowPrerequisitesAlert,
        getProgressSummary,
        refreshProgress,
        updateProgress
    };

    return (
        <UserProgressContext.Provider value={value}>
            {children}
        </UserProgressContext.Provider>
    );
}

export default UserProgressContext;
