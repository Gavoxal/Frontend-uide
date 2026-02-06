import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';
import EventNoteIcon from '@mui/icons-material/EventNote';

/**
 * Configuración de menús por rol de usuario
 * Cada rol tiene su propio conjunto de opciones de navegación
 * Los iconos se almacenan como componentes (no JSX) para ser renderizados por SidebarMui
 */
export const menuConfig = {
    director: [
        { icon: DashboardIcon, label: "Dashboard", path: "/director/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/director/students" },
        { icon: ChecklistIcon, label: "Prerrequisitos", path: "/director/prerequisites" },
        { icon: AssignmentIcon, label: "Propuestas", path: "/director/proposals" },
        {
            icon: SchoolIcon,
            label: "Tutores",
            path: "/director/tutors",
            children: [
                { label: "Listado", path: "/director/tutors" },
                { label: "Asignar Tutor", path: "/director/tutors/assign" }
            ]
        },
        { icon: GavelIcon, label: "Defensas", path: "/director/defense" },
    ],

    coordinador: [
        { icon: DashboardIcon, label: "Dashboard", path: "/coordinador/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/coordinador/students" },
        { icon: ChecklistIcon, label: "Prerrequisitos", path: "/coordinador/prerequisites" },
        { icon: AssignmentIcon, label: "Propuestas", path: "/coordinador/proposals" },
        {
            icon: SchoolIcon,
            label: "Tutores",
            path: "/coordinador/tutors",
            children: [
                { label: "Listado", path: "/coordinador/tutors" },
                { label: "Asignar Tutor", path: "/coordinador/tutors/assign" }
            ]
        },
        { icon: GavelIcon, label: "Defensas", path: "/coordinador/defense" },
    ],

    student: [
        { icon: DashboardIcon, label: "Dashboard", path: "/student/dashboard" },
        { icon: ChecklistIcon, label: "Prerrequisitos", path: "/student/prerequisites" },
        { icon: DescriptionIcon, label: "Anteproyecto", path: "/student/anteproyecto" },
        { icon: AssignmentIcon, label: "Mis Propuestas", path: "/student/proposals" },
        { icon: AssignmentIcon, label: "Avances", path: "/student/avances" },
        { icon: SchoolIcon, label: "Proyecto", path: "/student/proyecto" },
    ],

    tutor: [
        { icon: DashboardIcon, label: "Dashboard", path: "/tutor/dashboard" },
        { icon: AssignmentIcon, label: "Planificar Actividades", path: "/tutor/planning" },
        { icon: RateReviewIcon, label: "Revisar Avances", path: "/tutor/review" },
        { icon: EventNoteIcon, label: "Bitácora de reuniones", path: "/tutor/meetings" },
    ],

    reviewer: [
        { icon: DashboardIcon, label: "Dashboard", path: "/reviewer/dashboard" },
        { icon: AssignmentIcon, label: "Propuestas", path: "/reviewer/proposals" },
        { icon: GavelIcon, label: "Defensas", path: "/reviewer/defenses" },
    ],

    docente_integracion: [
        { icon: DashboardIcon, label: "Dashboard", path: "/docente-integracion/dashboard" },
        { icon: AssignmentIcon, label: "Avances", path: "/docente-integracion/advances" },
        { icon: AssignmentIcon, label: "Planificar Actividades", path: "/docente-integracion/planning" },
    ],

    admin: [
        { icon: DashboardIcon, label: "Dashboard", path: "/director/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/director/students" },
    ],

    // Menú por defecto para usuarios sin rol específico
    user: [
        { icon: HomeIcon, label: "Dashboard", path: "/dashboard" }
    ]
};

/**
 * Obtiene el menú correspondiente al rol del usuario
 * @param {string} role - Rol del usuario
 * @returns {Array} Array de opciones de menú
 */
export const getMenuByRole = (role) => {
    return menuConfig[role] || menuConfig.user;
};
