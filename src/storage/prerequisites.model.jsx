// Utilidad para gestionar prerrequisitos del estudiante en localStorage

const STORAGE_KEY = 'student_prerequisites';

/**
 * Obtiene los prerrequisitos del estudiante desde localStorage
 */
export const getPrerequisites = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error al leer prerrequisitos:', error);
    }

    // Valores por defecto
    return {
        english: { completed: false, verified: false, file: null },
        internship: { completed: false, verified: false, file: null },
        community: { completed: false, verified: false, file: null },
    };
};

/**
 * Guarda los prerrequisitos del estudiante en localStorage
 */
export const savePrerequisites = (prerequisites) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prerequisites));
        return true;
    } catch (error) {
        console.error('Error al guardar prerrequisitos:', error);
        return false;
    }
};

/**
 * Convierte el estado de prerrequisitos al formato de requisitos para el perfil
 */
export const prerequisitesToRequirements = (prerequisites) => {
    const getStatus = (prereq) => {
        if (prereq.verified) return 'complete';
        if (prereq.completed) return 'pending';
        return 'missing';
    };

    const getColor = (status) => {
        switch (status) {
            case 'complete': return '#4caf50';
            case 'pending': return '#ff9800';
            case 'missing': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    return [
        {
            id: 1,
            name: "Certificado de Inglés",
            status: getStatus(prerequisites.english),
            color: getColor(getStatus(prerequisites.english))
        },
        {
            id: 2,
            name: "Certificado de Vinculación",
            status: getStatus(prerequisites.community),
            color: getColor(getStatus(prerequisites.community))
        },
        {
            id: 3,
            name: "Horas de Práctica",
            status: getStatus(prerequisites.internship),
            color: getColor(getStatus(prerequisites.internship))
        }
    ];
};
