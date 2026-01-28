import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import NotFound from "../pages/NotFound";

import AuthAdmin from "./AuthAdmin";
import DashboardLayout from "../layouts/dashboard.layout";

// Director pages
import DirectorDashboard from "../pages/Director/Dashboard";
import DirectorPrerequisites from "../pages/Director/Prerequisites";

// Student pages
import StudentDashboard from "../pages/Student/Dashboard";
import StudentPrerequisites from "../pages/Student/Prerequisites";
import StudentAnteproyecto from "../pages/Student/Anteproyecto";

// Tutor pages
import TutorDashboard from "../pages/Tutor/Dashboard";

// Reviewer pages
import ReviewerDashboard from "../pages/Reviewer/Dashboard";

// Old admin pages (temporarily keeping for transition)
import OldDashboardPage from "../pages/Admin/dashboard.page";
import RegisterHotelPage from "../pages/Admin/components/register.hotel";
import ListHotelsPage from "../pages/Admin/components/list.hotel";

function RouterPages() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Raíz - redirige a ingreso */}
                <Route path="/" element={<Navigate to="/ingreso" replace />} />

                {/* Públicas */}
                <Route path="/ingreso" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />

                {/* Rutas protegidas - Director */}
                <Route path="/director" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<DirectorDashboard />} />
                        <Route path="dashboard" element={<DirectorDashboard />} />
                        <Route path="prerequisites" element={<DirectorPrerequisites />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Estudiante */}
                <Route path="/student" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<StudentDashboard />} />
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="prerequisites" element={<StudentPrerequisites />} />
                        <Route path="anteproyecto" element={<StudentAnteproyecto />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Tutor */}
                <Route path="/tutor" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<TutorDashboard />} />
                        <Route path="dashboard" element={<TutorDashboard />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Revisor */}
                <Route path="/reviewer" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<ReviewerDashboard />} />
                        <Route path="dashboard" element={<ReviewerDashboard />} />
                    </Route>
                </Route>

                {/* Rutas antiguas (temporales para compatibilidad) */}
                <Route path="/tablero" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<OldDashboardPage />} />
                        <Route path="registrohotel" element={<RegisterHotelPage />} />
                        <Route path="gestionhoteles" element={<ListHotelsPage />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouterPages;
