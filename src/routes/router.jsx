import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import NotFound from "../pages/NotFound";

import AuthAdmin from "./AuthAdmin";
import DashboardLayout from "../layouts/dashboard.layout";
import { UserProgressProvider } from "../contexts/UserProgressContext";

// Director pages
import DirectorDashboard from "../pages/Director/Dashboard";
import DirectorPrerequisites from "../pages/Director/Prerequisites";

// Student pages
import StudentDashboard from "../pages/Student/Dashboard";
import StudentPrerequisites from "../pages/Student/Prerequisites";
import StudentProyecto from "../pages/Student/Proyecto";
import StudentProfile from "../pages/Student/Profile";
import ThesisProposal from "../pages/Student/Proporsal";
import StudentAvances from "../pages/Student/Avances";

// Tutor pages
import TutorDashboard from "../pages/Tutor/Dashboard";
import ActivityPlanning from "../pages/Tutor/ActivityPlanning";
import ReviewFeedback from "../pages/Tutor/ReviewFeedback";
import MeetingLog from "../pages/Tutor/MeetingLog";
import TutorProfile from "../pages/Tutor/Profile";

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
                    <Route element={
                        <UserProgressProvider>
                            <DashboardLayout />
                        </UserProgressProvider>
                    }>
                        <Route index element={<StudentDashboard />} />
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="prerequisites" element={<StudentPrerequisites />} />
                        <Route path="proyecto" element={<StudentProyecto />} />
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="proposals" element={<ThesisProposal />} />
                        <Route path="avances" element={<StudentAvances />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Tutor */}
                <Route path="/tutor" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<TutorDashboard />} />
                        <Route path="dashboard" element={<TutorDashboard />} />
                        <Route path="planning" element={<ActivityPlanning />} />
                        <Route path="review" element={<ReviewFeedback />} />
                        <Route path="meetings" element={<MeetingLog />} />
                        <Route path="profile" element={<TutorProfile />} />
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
