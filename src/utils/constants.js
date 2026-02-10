// API Base URL - Cambiar según el entorno
export const BASE_URL = 'http://localhost:3000';
export const API_BASE_URL = `${BASE_URL}/api/v1`;

// Roles de usuario
export const USER_ROLES = {
    ESTUDIANTE: 'ESTUDIANTE',
    TUTOR: 'TUTOR',
    DIRECTOR: 'DIRECTOR',
    COORDINADOR: 'COORDINADOR',
    COMITE: 'COMITE',
    DOCENTE_INTEGRACION: 'DOCENTE_INTEGRACION'
};

// Estados de propuesta
export const PROPOSAL_STATUS = {
    PENDIENTE: 'PENDIENTE',
    APROBADA: 'APROBADA',
    APROBADA_CON_COMENTARIOS: 'APROBADA_CON_COMENTARIOS',
    RECHAZADA: 'RECHAZADA'
};

// Estados de evidencia
export const EVIDENCE_STATUS = {
    ENTREGADO: 'ENTREGADO',
    NO_ENTREGADO: 'NO_ENTREGADO'
};

// Estados de revisión
export const REVISION_STATUS = {
    PENDIENTE: 'PENDIENTE',
    APROBADO: 'APROBADO',
    RECHAZADO: 'RECHAZADO',
    REQUIERE_CAMBIOS: 'REQUIERE_CAMBIOS'
};

// Estados de defensa
export const DEFENSE_STATUS = {
    PENDIENTE: 'PENDIENTE',
    PROGRAMADA: 'PROGRAMADA',
    REALIZADA: 'REALIZADA',
    APROBADA: 'APROBADA',
    RECHAZADA: 'RECHAZADA'
};

// Tipos de actividad
export const ACTIVITY_TYPES = {
    DOCENCIA: 'DOCENCIA',
    TUTORIA: 'TUTORIA'
};

// Modalidades de reunión
export const MEETING_MODALITY = {
    PRESENCIAL: 'PRESENCIAL',
    VIRTUAL: 'VIRTUAL',
    HIBRIDA: 'HIBRIDA'
};

// Storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user'
};
