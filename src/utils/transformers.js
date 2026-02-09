import { PROPOSAL_STATUS, REVISION_STATUS, DEFENSE_STATUS } from './constants';

/**
 * Transforma el estado de propuesta del backend al formato del frontend
 */
export const transformProposalStatus = (status) => {
    const statusMap = {
        [PROPOSAL_STATUS.PENDIENTE]: 'Pendiente',
        [PROPOSAL_STATUS.APROBADA]: 'Aprobado',
        [PROPOSAL_STATUS.APROBADA_CON_COMENTARIOS]: 'Aprobado con Comentarios',
        [PROPOSAL_STATUS.RECHAZADA]: 'Rechazado'
    };
    return statusMap[status] || status;
};

/**
 * Transforma el estado de revisión del backend al formato del frontend
 */
export const transformRevisionStatus = (status) => {
    const statusMap = {
        [REVISION_STATUS.PENDIENTE]: 'Pendiente',
        [REVISION_STATUS.APROBADO]: 'Aprobado',
        [REVISION_STATUS.RECHAZADO]: 'Rechazado',
        [REVISION_STATUS.REQUIERE_CAMBIOS]: 'Requiere Cambios'
    };
    return statusMap[status] || status;
};

/**
 * Transforma el estado de defensa del backend al formato del frontend
 */
export const transformDefenseStatus = (status) => {
    const statusMap = {
        [DEFENSE_STATUS.PENDIENTE]: 'Pendiente',
        [DEFENSE_STATUS.PROGRAMADA]: 'Programada',
        [DEFENSE_STATUS.REALIZADA]: 'Realizada',
        [DEFENSE_STATUS.APROBADA]: 'Aprobada',
        [DEFENSE_STATUS.RECHAZADA]: 'Rechazada'
    };
    return statusMap[status] || status;
};

/**
 * Concatena nombres y apellidos
 */
export const getFullName = (nombres, apellidos) => {
    return `${nombres || ''} ${apellidos || ''}`.trim();
};

/**
 * Formatea una fecha ISO a formato local
 */
export const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

/**
 * Formatea una fecha ISO a formato datetime local
 */
export const formatDateTime = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Transforma propuesta del backend al formato del frontend
 */
export const transformPropuesta = (propuesta) => {
    if (!propuesta) return null;

    return {
        id: propuesta.id,
        titulo: propuesta.titulo,
        objetivos: propuesta.objetivos,
        problematica: propuesta.problematica,
        alcance: propuesta.alcance,
        archivoUrl: propuesta.archivoUrl,
        carrera: propuesta.carrera,
        malla: propuesta.malla,
        areaConocimiento: propuesta.areaConocimiento?.nombre,
        estudiante: propuesta.estudiante ? {
            id: propuesta.estudiante.id,
            nombre: getFullName(propuesta.estudiante.nombres, propuesta.estudiante.apellidos),
            cedula: propuesta.estudiante.cedula,
            correo: propuesta.estudiante.correoInstitucional
        } : null,
        tutor: propuesta.trabajosTitulacion?.[0] ? {
            id: propuesta.trabajosTitulacion[0].fkTutorId,
            nombre: 'Tutor' // Necesitamos incluir datos del tutor en la respuesta
        } : null,
        estado: transformProposalStatus(propuesta.estado),
        estadoOriginal: propuesta.estado,
        fechaPublicacion: formatDate(propuesta.fechaPublicacion),
        fechaRevision: formatDate(propuesta.fechaRevision),
        comentarioRevision: propuesta.comentarioRevision
    };
};

/**
 * Transforma usuario del backend al formato del frontend
 */
export const transformUsuario = (usuario) => {
    if (!usuario) return null;

    return {
        id: usuario.id,
        nombre: getFullName(usuario.nombres, usuario.apellidos),
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        cedula: usuario.cedula,
        correo: usuario.correoInstitucional,
        correoInstitucional: usuario.correoInstitucional,
        rol: usuario.rol,
        estudiantePerfil: usuario.estudiantePerfil ? {
            id: usuario.estudiantePerfil.id,
            escuela: usuario.estudiantePerfil.escuela,
            sede: usuario.estudiantePerfil.sede,
            malla: usuario.estudiantePerfil.malla
        } : null,
        createdAt: formatDate(usuario.createdAt)
    };
};

/**
 * Transforma lista de propuestas
 */
export const transformPropuestas = (propuestas) => {
    if (!Array.isArray(propuestas)) return [];
    return propuestas.map(transformPropuesta);
};

/**
 * Transforma lista de usuarios
 */
export const transformUsuarios = (usuarios) => {
    if (!Array.isArray(usuarios)) return [];
    return usuarios.map(transformUsuario);
};
