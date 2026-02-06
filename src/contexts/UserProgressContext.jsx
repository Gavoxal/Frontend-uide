import React, { createContext, useContext, useState, useEffect } from 'react';

const UserProgressContext = createContext();

export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (!context) {
        throw new Error('useUserProgress debe usarse dentro de UserProgressProvider');
    }
    return context;
};

// Mock data de usuarios de prueba
const MOCK_USERS = {
    // Usuario con restricciones - Sin prerrequisitos aprobados
    'estudiante_nuevo@uide.edu.ec': {
        prerequisitesStatus: 'pending',
        completedWeeks: 0,
        hasProjectAccess: false,
        studentName: 'Juan Pérez',
        studentId: 'EST001'
    },
    // Usuario con acceso completo - Todo aprobado
    'estudiante_completo@uide.edu.ec': {
        prerequisitesStatus: 'approved',
        completedWeeks: 15,
        hasProjectAccess: true,
        studentName: 'María García',
        studentId: 'EST002'
    },
    // Usuario con prerrequisitos aprobados pero sin proyecto
    'estudiante_avanzado@uide.edu.ec': {
        prerequisitesStatus: 'approved',
        completedWeeks: 8,
        hasProjectAccess: false,
        studentName: 'Carlos López',
        studentId: 'EST003'
    }
};

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
        // Simular carga de datos del usuario
        loadUserProgress();
    }, []);

    const loadUserProgress = () => {
        setProgressState(prev => ({ ...prev, isLoadingProgress: true }));

        // Simulación: obtener email del localStorage
        const userEmail = localStorage.getItem('userEmail') || 'estudiante_nuevo@uide.edu.ec';

        // Obtener datos del usuario mock
        const userData = MOCK_USERS[userEmail] || MOCK_USERS['estudiante_nuevo@uide.edu.ec'];

        setTimeout(() => {
            setProgressState({
                ...userData,
                isLoadingProgress: false
            });
        }, 500);
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

        // Secciones que requieren las 15 semanas completadas
        const requires15Weeks = ['defensa'];
        if (requires15Weeks.includes(sectionName.toLowerCase())) {
            return progressState.hasProjectAccess;
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

        const requires15Weeks = ['defensa'];
        if (requires15Weeks.includes(sectionName.toLowerCase())) {
            const remaining = 15 - progressState.completedWeeks;
            return `Requiere completar las 15 semanas de avances (${remaining} restantes)`;
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
            weeklyProgress: `${progressState.completedWeeks}/15`,
            weeklyPercentage: (progressState.completedWeeks / 15) * 100,
            projectUnlocked: progressState.hasProjectAccess,
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
