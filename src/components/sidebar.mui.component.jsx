import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse,
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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { getDataUser } from "../storage/user.model.jsx";
import uideImage from "../assets/uide3.svg";

// Configuración de menús por rol
const MENU_BY_ROLE = {
    director: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/director/dashboard" },
        { icon: <PeopleIcon />, label: "Estudiantes", path: "/director/students" },
        { icon: <ChecklistIcon />, label: "Prerrequisitos", path: "/director/prerequisites" },
        { icon: <AssignmentIcon />, label: "Propuestas", path: "/director/proposals" },
        {
            icon: <SchoolIcon />,
            label: "Tutores",
            path: "/director/tutors",
            children: [
                { label: "Listado", path: "/director/tutors" },
                { label: "Asignar Tutor", path: "/director/tutors/assign" }
            ]
        },
        { icon: <GavelIcon />, label: "Defensas", path: "/director/defense" },
    ],
    student: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/student/dashboard" },
        { icon: <ChecklistIcon />, label: "Prerrequisitos", path: "/student/prerequisites" },
        { icon: <AssignmentIcon />, label: "Mis Propuestas", path: "/student/proposals" },
        { icon: <SchoolIcon />, label: "Anteproyecto", path: "/student/anteproyecto" },
        { icon: <PersonIcon />, label: "Mi Tutor", path: "/student/tutor" },
        { icon: <AssignmentIcon />, label: "Avances", path: "/student/advances" },
        { icon: <GavelIcon />, label: "Defensa", path: "/student/defense" },
    ],
    tutor: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/tutor/dashboard" },
        { icon: <PeopleIcon />, label: "Mis Estudiantes", path: "/tutor/students" },
        { icon: <AssignmentIcon />, label: "Revisar Avances", path: "/tutor/advances" },
    ],
    reviewer: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/reviewer/dashboard" },
        { icon: <AssignmentIcon />, label: "Propuestas", path: "/reviewer/proposals" },
        { icon: <GavelIcon />, label: "Defensas", path: "/reviewer/defenses" },
    ],
    docente_integracion: [
        { icon: <DashboardIcon />, label: "Dashboard", path: "/docente-integracion/dashboard" },
        { icon: <AssignmentIcon />, label: "Avances", path: "/docente-integracion/advances" },
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
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        item={item}
                        isExpanded={isExpanded}
                        currentPage={currentPage}
                        onNavigate={onNavigate}
                    />
                ))}
            </List>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 2 }} />

            {/* BOTTOM */}
            <Box sx={{ mt: "auto", width: "100%" }}>
                <MenuItem
                    item={{ icon: <PersonIcon />, label: "Perfil", path: userRole === 'director' ? "/director/profile" : "/perfil" }}
                    isExpanded={isExpanded}
                    currentPage={currentPage}
                    onNavigate={onNavigate}
                />

                <MenuItem
                    item={{ icon: <LogoutIcon />, label: "Salir", path: "/ingreso" }}
                    isExpanded={isExpanded}
                    currentPage={currentPage}
                    onNavigate={onNavigate}
                />
            </Box>
        </Box>
    );
}

export default SidebarMui;

function MenuItem({ item, isExpanded, currentPage, onNavigate }) {
    const hasChildren = item.children && item.children.length > 0;
    const [open, setOpen] = useState(false);
    const active = currentPage.includes(item.path);

    const handleClick = () => {
        if (hasChildren) {
            setOpen(!open);
        } else {
            onNavigate(item.path);
        }
    };

    return (
        <>
            <ListItem
                onClick={handleClick}
                sx={{
                    cursor: "pointer",
                    px: isExpanded ? 2 : 0,
                    justifyContent: isExpanded ? "flex-start" : "center",
                    backgroundColor: active && !hasChildren ? "rgba(255,255,255,0.15)" : "transparent",
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                    },
                }}
            >
                <ListItemIcon
                    sx={{
                        color: "white",
                        minWidth: isExpanded ? 40 : "auto",
                        justifyContent: "center",
                    }}
                >
                    {item.icon}
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
        </>
    );
}
