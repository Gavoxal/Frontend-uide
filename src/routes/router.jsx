import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import NotFound from "../pages/NotFound";

import AuthAdmin from "./AuthAdmin";
import DashboardLayout from "../layouts/dashboard.layout";
import { UserProgressProvider } from "../contexts/UserProgressContext";

// Director pages
import DirectorDashboard from "../pages/Director/Dashboard";
<<<<<<< HEAD
import DirectorPrerequisites from "../pages/Director/Prerequisites";
=======
import DirectorPrerequisites from "../pages/Director/PrerequisitesViewDirector";
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
import DirectorStudentLoad from "../pages/Director/StudentLoad";
import DirectorStudentList from "../pages/Director/StudentList";
import DirectorTutorList from "../pages/Director/TutorList";
import DirectorAssignTutor from "../pages/Director/AssignTutor";
import DirectorProposalReview from "../pages/Director/ProposalReview";
import DirectorProposalDetail from "../pages/Director/ProposalDetail";
import DirectorProfile from "../pages/Director/Profile";
import DirectorThesisDefense from "../pages/Director/ThesisDefense";
<<<<<<< HEAD
=======
import DirectorCommitteeManagement from "../pages/Director/CommitteeManagement";


>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5

// Student pages
import StudentDashboard from "../pages/Student/Dashboard.student";
import StudentPrerequisites from "../pages/Student/Prerequisites";

import StudentAnteproyecto from "../pages/Student/Anteproyecto";
import StudentActivities from "../pages/Student/Activities";

import StudentProyecto from "../pages/Student/Proyecto";
import StudentProfile from "../pages/Student/Profile";
import ThesisProposal from "../pages/Student/Proposal";
import StudentAvances from "../pages/Student/Avances";


// Tutor pages
import TutorDashboard from "../pages/Tutor/Dashboard";
import ActivityPlanning from "../pages/Tutor/ActivityPlanning";
import ReviewFeedback from "../pages/Tutor/ReviewFeedback";
import MeetingLog from "../pages/Tutor/MeetingLog";
import TutorProfile from "../pages/Tutor/Profile";
import TutorStudents from "../pages/Tutor/Students";
import PublicDefense from "../pages/Tutor/PublicDefense";

<<<<<<< HEAD
// Reviewer pages
import ReviewerDashboard from "../pages/Reviewer/Dashboard";
import ReviewerProposals from "../pages/Reviewer/Proposals";
=======
// Shared pages
import SharedProposalReview from "../pages/Shared/ProposalReview";
import SharedProposalList from "../pages/Shared/ProposalList";
import SharedMeetingHistory from "../pages/Shared/MeetingHistory";

// Reviewer pages (Deleted)
// import ReviewerDashboard from "../pages/Reviewer/Dashboard";
// import ReviewerProposals from "../pages/Reviewer/Proposals";
// import ReviewerProposalReview from "../pages/Reviewer/ProposalReview";
// import ReviewerDefenses from "../pages/Reviewer/Defenses";
// import ReviewerProfile from "../pages/Reviewer/Profile";
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5

// Docente Integración pages
import DocenteDashboard from "../pages/DocenteIntegracion/Dashboard";
import DocenteAdvances from "../pages/DocenteIntegracion/WeeklyAdvances";
import ReviewAdvance from "../pages/DocenteIntegracion/ReviewAdvance";
<<<<<<< HEAD


// Coordinador pages
import CoordinadorDashboard from "../pages/Coordinador/Dashboard";
import CoordinadorStudents from "../pages/Coordinador/Students";
import CoordinadorPrerequisites from "../pages/Coordinador/Prerequisites";
import CoordinadorProposals from "../pages/Coordinador/Proposals";
import CoordinadorProposalDetail from "../pages/Coordinador/ProposalDetail";
=======
import DocenteActivityPlanning from "../pages/DocenteIntegracion/ActivityPlanning";
import DocenteProfile from "../pages/DocenteIntegracion/Profile";

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
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5

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
                        <Route path="defense" element={<DirectorThesisDefense />} />
<<<<<<< HEAD
                        <Route path="prerequisites" element={<DirectorPrerequisites />} />
=======
                        <Route path="committee" element={<DirectorCommitteeManagement />} />
                        <Route path="prerequisites" element={<DirectorPrerequisites />} />
                        <Route path="meetings" element={<SharedMeetingHistory />} />
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
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

                        <Route path="anteproyecto" element={<StudentAnteproyecto />} />
                        <Route path="activities" element={<StudentActivities />} />

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
                        <Route path="students" element={<TutorStudents />} />
                        <Route path="planning" element={<ActivityPlanning />} />
                        <Route path="review" element={<ReviewFeedback />} />
<<<<<<< HEAD
                        <Route path="defenses" element={<PublicDefense />} />
=======
                        <Route path="proposals" element={<SharedProposalList />} />
                        <Route path="proposals/review/:id" element={<SharedProposalReview />} />
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                        <Route path="meetings" element={<MeetingLog />} />
                        <Route path="profile" element={<TutorProfile />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Docente Integración */}
                <Route path="/docente-integracion" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<DocenteDashboard />} />
                        <Route path="dashboard" element={<DocenteDashboard />} />
                        <Route path="advances" element={<DocenteAdvances />} />
<<<<<<< HEAD
                        <Route path="review/:weekId/:studentId" element={<ReviewAdvance />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Revisor */}
                <Route path="/reviewer" element={<AuthAdmin />}>
=======
                        <Route path="planning" element={<DocenteActivityPlanning />} />
                        <Route path="review/:weekId/:studentId" element={<ReviewAdvance />} />
                        <Route path="proposals" element={<SharedProposalList />} />
                        <Route path="proposals/review/:id" element={<SharedProposalReview />} />
                        <Route path="profile" element={<DocenteProfile />} />
                    </Route>
                </Route>

                {/* Rutas protegidas - Revisor (ELIMINADO) */}
                {/* <Route path="/reviewer" element={<AuthAdmin />}>
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
                    <Route element={<DashboardLayout />}>
                        <Route index element={<ReviewerDashboard />} />
                        <Route path="dashboard" element={<ReviewerDashboard />} />
                        <Route path="proposals" element={<ReviewerProposals />} />
<<<<<<< HEAD
                    </Route>
                </Route>
=======
                        <Route path="proposals/review/:id" element={<SharedProposalReview />} />
                        <Route path="defenses" element={<ReviewerDefenses />} />
                        <Route path="profile" element={<ReviewerProfile />} />
                    </Route>
                </Route> */}
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5

                {/* Rutas protegidas - Coordinador */}
                <Route path="/coordinador" element={<AuthAdmin />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<CoordinadorDashboard />} />
                        <Route path="dashboard" element={<CoordinadorDashboard />} />
                        <Route path="students" element={<CoordinadorStudents />} />
                        <Route path="prerequisites" element={<CoordinadorPrerequisites />} />
                        <Route path="proposals" element={<CoordinadorProposals />} />
<<<<<<< HEAD
                        <Route path="proposals/detail/:id" element={<CoordinadorProposalDetail />} />
=======
                        <Route path="proposals/detail/:id" element={<SharedProposalReview />} />
                        <Route path="tutors" element={<CoordinadorTutorList />} />
                        <Route path="tutors/assign" element={<CoordinadorAssignTutor />} />
                        <Route path="defense" element={<CoordinadorThesisDefense />} />
                        <Route path="meetings" element={<SharedMeetingHistory />} />
                        <Route path="profile" element={<CoordinadorProfile />} />
>>>>>>> e40cad7ef6d59023c2ef3868f73163032e1e18e5
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
