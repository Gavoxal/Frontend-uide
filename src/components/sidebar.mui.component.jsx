import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse,
    Avatar,
    Typography,
    Chip,
    Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import GavelIcon from "@mui/icons-material/Gavel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HistoryIcon from "@mui/icons-material/History";
import GradeIcon from "@mui/icons-material/Grade";
import { useState, useEffect } from "react";
import { getDataUser } from "../storage/user.model.jsx";
import { useUserProgress } from "../contexts/UserProgressContext";
import { UserService } from "../services/user.service";
import uideImage from "../assets/uide3.svg";

// Mapeo de roles a rutas base
const roleToRoute = {
    admin: 'director', // Temporal redirect
    director: 'director',
    student: 'student',
    tutor: 'tutor',
    reviewer: 'reviewer',
    coordinador: 'director',
    docente_integracion: 'docente-integracion'
};

const roleLabels = {
    admin: 'Administrador',
    director: 'Director de Carrera',
    student: 'Estudiante',
    tutor: 'Tutor',
    reviewer: 'Revisor',
    coordinador: 'Coordinador',
    docente_integracion: 'Docente Integración'
};

// Configuración de menús por rol
const MENU_BY_ROLE = {
    director: [
        { icon: DashboardIcon, label: "Dashboard", path: "/director/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/director/students" },
        { icon: ChecklistIcon, label: "Prerrequisitos", path: "/director/prerequisites" },
        { icon: AssignmentIcon, label: "Propuestas", path: "/director/proposals" },
        { icon: SchoolIcon, label: "Tutores", path: "/director/tutors" },
        { icon: AssignmentIndIcon, label: "Asignar Tutor", path: "/director/tutors/assign" },
        { icon: GroupsIcon, label: "Comité", path: "/director/committee" },
        { icon: GavelIcon, label: "Defensas", path: "/director/defenses" },
        { icon: RateReviewIcon, label: "Calificación", path: "/director/defense-grading" },
    ],
    student: [
        { icon: DashboardIcon, label: "Dashboard", path: "/student/dashboard" },
        { icon: ChecklistIcon, label: "Prerrequisitos", path: "/student/prerequisites" },
        { icon: AssignmentIcon, label: "Propuestas", path: "/student/proposals" },
        { icon: RateReviewIcon, label: "Avances", path: "/student/progress" },
        { icon: SchoolIcon, label: "Proyecto", path: "/student/proyecto" },
        { icon: GavelIcon, label: "Defensa", path: "/student/defense" },
    ],
    tutor: [
        { icon: DashboardIcon, label: "Dashboard", path: "/tutor/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/tutor/students" },
        { icon: SchoolIcon, label: "Propuestas", path: "/tutor/proposals" },
        { icon: AssignmentIcon, label: "Actividades", path: "/tutor/planning" },
        { icon: RateReviewIcon, label: "Avances", path: "/tutor/review" },
        { icon: GradeIcon, label: "Notas", path: "/tutor/grades" },
        { icon: EventNoteIcon, label: "Reuniones", path: "/tutor/meetings" },
        { icon: GavelIcon, label: "Defensas", path: "/tutor/defenses" },
    ],
    coordinador: [
        { icon: DashboardIcon, label: "Dashboard", path: "/director/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/director/students" },
        { icon: ChecklistIcon, label: "Prerrequisitos", path: "/director/prerequisites" },
        { icon: AssignmentIcon, label: "Propuestas", path: "/director/proposals" },
        { icon: SchoolIcon, label: "Tutores", path: "/director/tutors" },
        { icon: AssignmentIndIcon, label: "Asignar Tutor", path: "/director/tutors/assign" },
        { icon: GroupsIcon, label: "Comité", path: "/director/committee" },
        { icon: GavelIcon, label: "Defensas", path: "/director/defenses" },
        { icon: RateReviewIcon, label: "Calificación", path: "/director/defense-grading" },
    ],
    reviewer: [
        { icon: DashboardIcon, label: "Dashboard", path: "/reviewer/dashboard" },
        { icon: AssignmentIcon, label: "Avances", path: "/reviewer/proposals" },
        { icon: GavelIcon, label: "Defensas", path: "/reviewer/defenses" },
    ],
    docente_integracion: [
        { icon: DashboardIcon, label: "Dashboard", path: "/docente-integracion/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/docente-integracion/students" },
        { icon: AssignmentIcon, label: "Planificación", path: "/docente-integracion/planning" },
        { icon: RateReviewIcon, label: "Revisar Avances", path: "/docente-integracion/advances" },
        { icon: GradeIcon, label: "Control de Notas", path: "/docente-integracion/grades" },
    ],
    admin: [
        { icon: DashboardIcon, label: "Dashboard", path: "/director/dashboard" },
        { icon: PeopleIcon, label: "Estudiantes", path: "/director/students" },
        { icon: ChecklistIcon, label: "Prerrequisitos", path: "/director/prerequisites" },
        { icon: AssignmentIcon, label: "Propuestas", path: "/director/proposals" },
        { icon: SchoolIcon, label: "Tutores", path: "/director/tutors" },
        { icon: AssignmentIndIcon, label: "Asignar Tutor", path: "/director/tutors/assign" },
        { icon: GroupsIcon, label: "Comité", path: "/director/committee" },
        { icon: GavelIcon, label: "Defensas", path: "/director/defenses" },
    ],
};

function getMenuByRole(role) {
    return MENU_BY_ROLE[role] || [];
}

function SidebarMui({ onNavigate, currentPage, isExpanded, toggleSidebar }) {
    const user = getDataUser();
    const userRole = user?.role || "user";
    const userRouteBase = roleToRoute[userRole] || userRole;
    const menuItems = getMenuByRole(userRole);

    // State for user display name to allow updates from ID fetch
    const [userData, setUserData] = useState({
        name: user?.nombres || user?.name || "Usuario",
        lastName: user?.apellidos || user?.lastName || "",
        initials: (user?.nombres?.[0] || user?.name?.[0] || "U") + (user?.apellidos?.[0] || user?.lastName?.[0] || "")
    });

    // Fetch fresh user data if we have an ID but generic/missing names
    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id && (userData.name === "Usuario" || !userData.lastName)) {
                try {
                    const freshData = await UserService.getById(user.id);
                    if (freshData) {
                        const newName = freshData.nombres || freshData.nombre || userData.name;
                        const newLast = freshData.apellidos || freshData.apellido || userData.lastName;

                        setUserData({
                            name: newName,
                            lastName: newLast,
                            initials: (newName?.[0] || "") + (newLast?.[0] || "")
                        });

                        // Optionally update session storage to persist across reloads
                        // const updatedSession = { ...user, ...freshData, nombres: newName, apellidos: newLast };
                        // sessionStorage.setItem("sessionUser", JSON.stringify(updatedSession));
                    }
                } catch (error) {
                    console.error("Error fetching user data for sidebar:", error);
                }
            }
        };

        fetchUserData();
    }, [user?.id]);

    // Solo para estudiantes, verificar permisos
    const progressContext = userRole === 'student' ? useUserProgress() : null;

    const canAccessItem = (item) => {
        if (userRole !== 'student' || !progressContext) return true;

        // Extraer el nombre de la sección del path
        const sectionName = item.path.split('/').pop();
        return progressContext.canAccessSection(sectionName);
    };

    const getBlockReasonForItem = (item) => {
        if (userRole !== 'student' || !progressContext) return null;

        const sectionName = item.path.split('/').pop();
        return progressContext.getBlockReason(sectionName);
    };

    return (
        <Box
            sx={{
                width: isExpanded ? 240 : 60,
                backgroundColor: "#000A9B",
                display: "flex",
                flexDirection: "column",
                py: 2,
                position: "fixed",
                inset: 0,
                zIndex: 1200,
                transition: "width 0.3s ease",
            }}
        >
            {/* LOGO */}
            <Box
                sx={{
                    width: "100%",
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    px: 1,
                }}
            >
                <Box
                    component="img"
                    src={uideImage}
                    alt="UIDE Logo"
                    sx={{
                        width: isExpanded ? 50 : 36,
                        height: isExpanded ? 50 : 36,
                        objectFit: 'contain',
                        transition: 'all 0.3s ease',
                        filter: 'brightness(0) invert(1)',
                    }}
                />
            </Box>

            {/* TOGGLE */}
            <IconButton
                onClick={toggleSidebar}
                sx={{ color: "white", alignSelf: "center", mb: 2 }}
            >
                <MenuIcon />
            </IconButton>

            {/* MENU DINÁMICO POR ROL */}
            <List sx={{ width: "100%", flexGrow: 1, overflowY: 'auto' }}>
                {menuItems.map((item, index) => {
                    const canAccess = canAccessItem(item);
                    const blockReason = getBlockReasonForItem(item);

                    return (
                        <MenuItem
                            key={index}
                            item={item}
                            isExpanded={isExpanded}
                            currentPage={currentPage}
                            onNavigate={onNavigate}
                            blocked={!canAccess}
                            blockReason={blockReason}
                        />
                    );
                })}
            </List>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 2 }} />

            {/* BOTTOM - PERFIL DE USUARIO */}
            <Box sx={{ mt: "auto", width: "100%", px: 2, pb: 2 }}>
                {/* Avatar y datos del usuario - Clickeable */}
                {isExpanded ? (
                    <Box
                        onClick={() => onNavigate(`/${userRouteBase}/profile`)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 1.5,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            borderRadius: 2,
                            mb: 1,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.2)",
                                transform: "translateX(4px)",
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "white",
                                color: "#000A9B",
                                width: 40,
                                height: 40,
                                fontWeight: "bold",
                            }}
                        >
                            {userData.initials}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                    lineHeight: 1.2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {userData.name}{" "}
                                {userData.lastName}
                            </Typography>
                            <Chip
                                label={roleLabels[user?.role] || 'Usuario'}
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    color: "white",
                                    fontWeight: 500,
                                    mt: 0.5,
                                    "& .MuiChip-label": {
                                        px: 1,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Box
                        onClick={() => onNavigate(`/${userRouteBase}/profile`)}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 1,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "white",
                                color: "#000A9B",
                                width: 36,
                                height: 36,
                                fontWeight: "bold",
                            }}
                        >
                            {userData.initials}
                        </Avatar>
                    </Box>
                )}

                {/* Botón de cerrar sesión */}
                <MenuItem
                    item={{ icon: LogoutIcon, label: "Cerrar Sesión", path: "/ingreso" }}
                    isExpanded={isExpanded}
                    currentPage={currentPage}
                    onNavigate={onNavigate}
                />
            </Box>
        </Box>
    );
}

export default SidebarMui;

function MenuItem({ item, isExpanded, currentPage, onNavigate, blocked = false, blockReason = null }) {
    const hasChildren = item.children && item.children.length > 0;
    const [open, setOpen] = useState(false);

    // Check if the item is active or any of its children
    const isActive = currentPage === item.path || (hasChildren && item.children.some(child => currentPage === child.path));

    const IconComponent = item.icon;

    const handleClick = () => {
        if (blocked) return;

        if (hasChildren) {
            setOpen(!open);
        } else {
            onNavigate(item.path);
        }
    };

    const listItemContent = (
        <Box sx={{ width: '100%' }}>
            <ListItem
                onClick={handleClick}
                sx={{
                    cursor: blocked ? "not-allowed" : "pointer",
                    px: isExpanded ? 2 : 0,
                    justifyContent: isExpanded ? "flex-start" : "center",
                    backgroundColor: isActive && !hasChildren ? "rgba(255,255,255,0.15)" : "transparent",
                    borderRadius: 1,
                    mb: 1,
                    opacity: blocked ? 0.4 : 1,
                    "&:hover": {
                        backgroundColor: blocked ? "transparent" : "rgba(255,255,255,0.25)",
                    },
                    position: 'relative',
                }}
            >
                <ListItemIcon
                    sx={{
                        color: "white",
                        minWidth: isExpanded ? 40 : "auto",
                        justifyContent: "center",
                    }}
                >
                    {blocked ? <LockIcon fontSize="small" /> : (IconComponent && <IconComponent />)}
                </ListItemIcon>

                {isExpanded && (
                    <>
                        <ListItemText primary={item.label} sx={{ color: "white" }} />
                        {hasChildren ? (open ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />) : null}
                    </>
                )}
            </ListItem>

            {hasChildren && isExpanded && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child, index) => (
                            <ListItem
                                key={index}
                                onClick={() => onNavigate(child.path)}
                                sx={{
                                    pl: 4,
                                    cursor: "pointer",
                                    backgroundColor: currentPage === child.path ? "rgba(255,255,255,0.3)" : "transparent",
                                    borderRadius: 1,
                                    mb: 0.5,
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                                }}
                            >
                                <ListItemText
                                    primary={child.label}
                                    primaryTypographyProps={{ fontSize: '0.9rem', color: '#e0e0e0' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            )}
        </Box>
    );

    if (blocked && blockReason) {
        return (
            <Tooltip title={blockReason} placement="right" arrow>
                {listItemContent}
            </Tooltip>
        );
    }

    return listItemContent;
}
