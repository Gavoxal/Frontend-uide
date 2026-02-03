import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChecklistIcon from "@mui/icons-material/Checklist";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import GavelIcon from "@mui/icons-material/Gavel";
import LockIcon from "@mui/icons-material/Lock";
import RateReviewIcon from "@mui/icons-material/RateReview";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { getDataUser } from "../storage/user.model.jsx";
import { useUserProgress } from "../contexts/UserProgressContext";
import uideImage from "../assets/uide3.svg";

// Configuración de menús por rol
const MENU_BY_ROLE = {
    director: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/director/dashboard" },
        { icon: <PeopleIcon />, label: "Estudiantes", path: "/director/students" },
        { icon: <ChecklistIcon />, label: "Prerrequisitos", path: "/director/prerequisites" },
        { icon: <AssignmentIcon />, label: "Propuestas", path: "/director/proposals" },
        { icon: <SchoolIcon />, label: "Tutores", path: "/director/tutors" },
        { icon: <GavelIcon />, label: "Defensas", path: "/director/defenses" },
    ],
    student: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/student/dashboard" },
        { icon: <ChecklistIcon />, label: "Prerrequisitos", path: "/student/prerequisites" },
        { icon: <AssignmentIcon />, label: "Mis Propuestas", path: "/student/proposals" },
        { icon: <AssignmentIcon />, label: "Avances", path: "/student/avances" },
        { icon: <SchoolIcon />, label: "Proyecto", path: "/student/proyecto" },
        { icon: <GavelIcon />, label: "Defensa", path: "/student/defensa" },
    ],
    tutor: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/tutor/dashboard" },
        { icon: <AssignmentIcon />, label: "Planificar Actividades", path: "/tutor/planning" },
        { icon: <RateReviewIcon />, label: "Revisar Avances", path: "/tutor/review" },
        { icon: <EventNoteIcon />, label: "Bitácora de Reuniones", path: "/tutor/meetings" },
    ],
    reviewer: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/reviewer/dashboard" },
        { icon: <AssignmentIcon />, label: "Propuestas", path: "/reviewer/proposals" },
        { icon: <GavelIcon />, label: "Defensas", path: "/reviewer/defenses" },
    ],
    admin: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/director/dashboard" },
        { icon: <PeopleIcon />, label: "Estudiantes", path: "/director/students" },
    ],
};

function SidebarMui({ onNavigate, currentPage, isExpanded, toggleSidebar }) {
    const user = getDataUser();
    const userRole = user?.role || "admin";
    const menuItems = MENU_BY_ROLE[userRole] || MENU_BY_ROLE.admin;

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
            <List sx={{ width: "100%" }}>
                {menuItems.map((item, index) => {
                    const canAccess = canAccessItem(item);
                    const blockReason = getBlockReasonForItem(item);

                    return (
                        <MenuItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            isExpanded={isExpanded}
                            active={currentPage.includes(item.path)}
                            onClick={() => canAccess && onNavigate(item.path)}
                            blocked={!canAccess}
                            blockReason={blockReason}
                        />
                    );
                })}
            </List>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 2 }} />

            {/* BOTTOM */}
            <Box sx={{ mt: "auto", width: "100%" }}>
                <MenuItem
                    icon={<PersonIcon />}
                    label="Perfil"
                    isExpanded={isExpanded}
                    active={currentPage.includes("/profile")}
                    onClick={() => onNavigate(`/${userRole}/profile`)}
                />

                <MenuItem
                    icon={<LogoutIcon />}
                    label="Salir"
                    isExpanded={isExpanded}
                    onClick={() => onNavigate("/ingreso")}
                />
            </Box>
        </Box>
    );
}

export default SidebarMui;

function MenuItem({ icon, label, isExpanded, active, onClick, blocked = false, blockReason = null }) {
    const menuItem = (
        <ListItem
            onClick={blocked ? undefined : onClick}
            sx={{
                cursor: blocked ? "not-allowed" : "pointer",
                px: isExpanded ? 2 : 0,
                justifyContent: isExpanded ? "flex-start" : "center",
                backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
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
                {blocked ? <LockIcon fontSize="small" /> : icon}
            </ListItemIcon>

            {isExpanded && <ListItemText primary={label} sx={{ color: "white" }} />}
        </ListItem>
    );

    if (blocked && blockReason) {
        return (
            <Tooltip title={blockReason} placement="right" arrow>
                {menuItem}
            </Tooltip>
        );
    }

    return menuItem;
}
