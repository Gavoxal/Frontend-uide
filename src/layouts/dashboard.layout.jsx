import { Box } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SidebarMui from "../components/sidebar.mui.component";
import HeaderMui from "../components/header.mui.component";

function DashboardLayout() {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarWidth = isExpanded ? 240 : 60;

    // Determinar título según la ruta actual
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'Tablero';
        if (path.includes('/prerequisites')) return 'Prerrequisitos';
        if (path.includes('/students')) return 'Estudiantes';
        if (path.includes('/proposals')) return 'Propuestas';
        if (path.includes('/tutors')) return 'Tutores';
        if (path.includes('/advances')) return 'Avances';
        if (path.includes('/defenses')) return 'Defensas';
        if (path.includes('/tutor')) return 'Mi Tutor';
        if (path.includes('/anteproyecto')) return 'Anteproyecto';
        if (path.includes('/profile')) return 'Perfil';
        return 'Tablero';
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
            {/* SIDEBAR */}
            <SidebarMui
                isExpanded={isExpanded}
                toggleSidebar={() => setIsExpanded(!isExpanded)}
                currentPage={location.pathname}
                onNavigate={navigate}
            />

            {/* HEADER */}
            <HeaderMui
                title={getPageTitle()}
                sidebarWidth={sidebarWidth}
                showNotifications={true}
            />

            {/* CONTENIDO */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: `${sidebarWidth}px`,
                    marginTop: '64px',
                    padding: 3,
                    backgroundColor: "#F4F6F8",
                    minHeight: "calc(100vh - 64px)",
                    width: `calc(100% - ${sidebarWidth}px)`,
                    transition: 'margin-left 0.3s ease, width 0.3s ease',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default DashboardLayout;
