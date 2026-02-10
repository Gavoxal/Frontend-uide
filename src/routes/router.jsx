import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import NotFound from "../pages/NotFound";

import AuthAdmin from "./AuthAdmin";
import DashboardLayout from "../layouts/dashboard.layout";
import { UserProgressProvider } from "../contexts/UserProgressContext";

// Director pages
import DirectorDashboard from "../pages/Director/Dashboard";
import DirectorPrerequisites from "../pages/Director/PrerequisitesViewDirector";
import DirectorStudentLoad from "../pages/Director/StudentLoad";
import DirectorStudentList from "../pages/Director/StudentList";
import DirectorTutorList from "../pages/Director/TutorList";
import DirectorAssignTutor from "../pages/Director/AssignTutor";
import DirectorProposalReview from "../pages/Director/ProposalReview";
import DirectorProposalDetail from "../pages/Director/ProposalDetail";
import DirectorProfile from "../pages/Director/Profile";
import DirectorThesisDefense from "../pages/Director/ThesisDefense";
import DirectorCommitteeManagement from "../pages/Director/CommitteeManagement";
import DirectorDefenseGradingTable from "../pages/Director/DirectorDefenseGradingTable";
import SharedMeetingHistory from "../pages/Shared/MeetingHistory";


// Student pages
import StudentDashboard from "../pages/Student/Dashboard";
import StudentPrerequisites from "../pages/Student/Prerequisites";

import StudentAnteproyecto from "../pages/Student/Anteproyecto";
import StudentActivities from "../pages/Student/Activities";

import StudentProyecto from "../pages/Student/Proyecto";
import StudentProfile from "../pages/Student/Profile";
import ThesisProposal from "../pages/Student/Proposal";
import StudentAvances from "../pages/Student/Avances";
import StudentDefense from "../pages/Student/StudentDefense";


// Tutor pages
import TutorDashboard from "../pages/Tutor/Dashboard";
import ActivityPlanning from "../pages/Tutor/ActivityPlanning";
import ReviewFeedback from "../pages/Tutor/ReviewFeedback";
import MeetingLog from "../pages/Tutor/MeetingLog";
import TutorProfile from "../pages/Tutor/Profile";
import TutorStudents from "../pages/Tutor/Students";
import SharedProposalList from "../pages/Shared/ProposalList";
import SharedProposalReview from "../pages/Shared/ProposalReview";
import SharedDefenseEvaluation from "../pages/Shared/DefenseEvaluation";
import PublicDefense from "../pages/Tutor/PublicDefense";


// Docente Integración pages
import DocenteDashboard from "../pages/DocenteIntegracion/Dashboard";
import DocenteReviewFeedback from "../pages/DocenteIntegracion/ReviewFeedback"; // Cambio a vista unificada
import ReviewAdvance from "../pages/DocenteIntegracion/ReviewAdvance";
import DocenteActivityPlanning from "../pages/DocenteIntegracion/ActivityPlanning";
import DocenteGrades from "../pages/DocenteIntegracion/Grades";
import DocenteProfile from "../pages/DocenteIntegracion/Profile";
import DocenteStudents from "../pages/DocenteIntegracion/StudentList.jsx";

// Coordinador pages
import CoordinadorDashboard from "../pages/Coordinador/Dashboard";
import CoordinadorPrerequisites from "../pages/Coordinador/Prerequisites";
import CoordinadorStudents from "../pages/Coordinador/Students";
import CoordinadorProposals from "../pages/Coordinador/Proposals";
import CoordinadorProposalDetail from "../pages/Coordinador/ProposalDetail";
import CoordinadorAssignTutor from "../pages/Coordinador/AssignTutor";
import CoordinadorThesisDefense from "../pages/Coordinador/ThesisDefense";
import CoordinadorTutorList from "../pages/Coordinador/TutorList";
import CoordinadorProfile from "../pages/Coordinador/Profile";

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
                        <Route path="student-load" element={<DirectorStudentLoad />} />
                        <Route path="students" element={<DirectorStudentList />} />
                        <Route path="tutors" element={<DirectorTutorList />} />
                        <Route path="tutors/assign" element={<DirectorAssignTutor />} />
                        <Route path="proposals" element={<DirectorProposalReview />} />
                        <Route path="proposals/detail/:id" element={<DirectorProposalDetail />} />
                        <Route path="defenses" element={<DirectorThesisDefense />} />
                        <Route path="defense-grading" element={<DirectorDefenseGradingTable />} />
                        <Route path="committee" element={<DirectorCommitteeManagement />} />
                        <Route path="prerequisites" element={<DirectorPrerequisites />} />
                        <Route path="meetings" element={<SharedMeetingHistory />} />
                        <Route path="profile" element={<DirectorProfile />} />
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
                        <Route path="proposals" element={<ThesisProposal />} />
                        <Route path="proyecto" element={<StudentProyecto />} />
                        <Route path="progress" element={<StudentAvances />} />
                        <Route path="defense" element={<StudentDefense />} />
                        <Route path="profile" element={<StudentProfile />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Tutor */}
                <Route path="/tutor" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<TutorDashboard />} />
                        <Route path="dashboard" element={<TutorDashboard />} />
                        <Route path="students" element={<TutorStudents />} />
                        <Route path="planning" element={<ActivityPlanning />} />
                        <Route path="review" element={<ReviewFeedback />} />
                        <Route path="proposals" element={<SharedProposalList />} />
                        <Route path="proposals/review/:id" element={<SharedProposalReview />} />
                        <Route path="meetings" element={<MeetingLog />} />
                        <Route path="profile" element={<TutorProfile />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Docente Integración */}
                <Route path="/docente-integracion" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<DocenteDashboard />} />
                        <Route path="dashboard" element={<DocenteDashboard />} />
                        <Route path="students" element={<DocenteStudents />} />
                        <Route path="advances" element={<DocenteReviewFeedback />} />
                        <Route path="planning" element={<DocenteActivityPlanning />} />
                        <Route path="grades" element={<DocenteGrades />} />
                        <Route path="review/:weekId/:studentId" element={<ReviewAdvance />} />
                        <Route path="proposals" element={<SharedProposalList />} />
                        <Route path="proposals/review/:id" element={<SharedProposalReview />} />
                        <Route path="defenses" element={<SharedDefenseEvaluation />} />
                        <Route path="profile" element={<DocenteProfile />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Revisor (Manteniendo comentado como en remote para seguir la estructura nueva) */}
                {/* <Route path="/reviewer" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<SharedProposalList />} />
                        <Route path="dashboard" element={<SharedProposalList />} />
                        <Route path="proposals/review/:id" element={<SharedProposalReview />} />
                        <Route path="profile" element={<DirectorProfile />} /> 
                    </Route>
                </Route> */}

                {/* Rutas protegidas - Coordinador */}
                <Route path="/coordinador" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<CoordinadorDashboard />} />
                        <Route path="dashboard" element={<CoordinadorDashboard />} />
                        <Route path="students" element={<CoordinadorStudents />} />
                        <Route path="prerequisites" element={<CoordinadorPrerequisites />} />
                        <Route path="proposals" element={<CoordinadorProposals />} />
                        <Route path="proposals/detail/:id" element={<SharedProposalReview />} />
                        <Route path="tutors" element={<CoordinadorTutorList />} />
                        <Route path="tutors/assign" element={<CoordinadorAssignTutor />} />
                        <Route path="defense" element={<CoordinadorThesisDefense />} />
                        <Route path="defenses" element={<SharedDefenseEvaluation />} />
                        <Route path="meetings" element={<SharedMeetingHistory />} />
                        <Route path="profile" element={<CoordinadorProfile />} />
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
