import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrerequisiteService } from '../services/prerequisites.service';
import { EntregableService } from '../services/entregable.service';
import { getDataUser } from '../storage/user.model.jsx';

const UserProgressContext = createContext();

export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (!context) {
        throw new Error('useUserProgress debe usarse dentro de UserProgressProvider');
    }
    return context;
};

export function UserProgressProvider({ children }) {
    const [progressState, setProgressState] = useState({
        prerequisitesStatus: 'pending', // 'pending', 'approved', 'rejected'
        completedWeeks: 0, // 0-16
        hasProjectAccess: false,
        isLoadingProgress: true,
        studentName: '',
        studentId: '',
        defenseUnlocked: false,
        finalDocuments: {
            hasTesis: false,
            hasManual: false,
            hasArticulo: false
        }
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
            // 1. Cargar prerrequisitos
            const prerequisites = await PrerequisiteService.getByStudent(user.id);

            let allApproved = false;
            if (Array.isArray(prerequisites)) {
                const requiredKeys = ["english", "internship", "community"];
                allApproved = requiredKeys.every(key => {
                    const found = prerequisites.find(p => p.name === key);
                    return found && found.status === 'approved';
                });
            }

            // 2. Cargar estado de desbloqueo de proyecto y defensa
            const unlockInfo = await EntregableService.getUnlockStatus();

            setProgressState(prev => ({
                ...prev,
                studentName: (user.nombres && user.apellidos) ? `${user.nombres} ${user.apellidos}` : (user.name || ""),
                studentId: user.id,
                prerequisitesStatus: allApproved ? 'approved' : 'pending',
                hasProjectAccess: allApproved,
                completedWeeks: unlockInfo.approvedWeeks,
                defenseUnlocked: unlockInfo.unlockedDefense,
                finalDocuments: unlockInfo.documents || prev.finalDocuments,
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

        // Sección de Defensa (Requiere 16 semanas + Documentos Finales)
        if (sectionName.toLowerCase() === 'defensa') {
            return progressState.defenseUnlocked;
        }

        // Sección de Avance del Proyecto (Solo necesita Prerrequisitos aprobados)
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

        if (sectionName.toLowerCase() === 'defensa') {
            if (progressState.completedWeeks < 16) {
                return `Requiere completar las 16 semanas de avances (${16 - progressState.completedWeeks} restantes)`;
            }
            return 'Debes subir los documentos finales (Tesis, Manual, Artículo) en la sección de Proyecto';
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
            defenseUnlocked: progressState.defenseUnlocked,
            fullAccessGranted: progressState.prerequisitesStatus === 'approved' && progressState.defenseUnlocked
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
