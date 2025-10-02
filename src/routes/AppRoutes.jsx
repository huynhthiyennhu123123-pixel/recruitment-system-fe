import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import ApplicantLayout from "../layout/ApplicantLayout";
import EmployerLayout from "../layout/EmployerLayout";
import AdminLayout from "../layout/AdminLayout";
import PrivateRoute from "./PrivateRoute";

// pages public
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import EmployerRegisterPage from "../pages/auth/EmployerRegisterPage";

// pages applicant
import ApplicantDashboard from "../pages/applicant/DashboardPage";

// pages employer
import DashboardPage from "../pages/employer/DashboardPage";
import JobManagePage from "../pages/employer/JobManagePage";
import JobFormPage from "../pages/employer/JobFormPage";
import ApplicantsPage from "../pages/employer/ApplicantsPage";
import ProfilePage from "../pages/employer/ProfilePage";
import InterviewPage from "../pages/employer/InterviewPage";

// pages admin
import AdminDashboard from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import CompaniesPage from "../pages/admin/CompaniesPage";
import JobsPage from "../pages/admin/JobsPage";
import RolesPage from "../pages/admin/RolesPage";
import AdminProfilePage from "../pages/admin/AdminProfilePage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route
            path="/auth/employer-register"
            element={<EmployerRegisterPage />}
          />
        </Route>

        {/* Applicant */}
        <Route element={<ApplicantLayout />}>
          <Route path="/applicant" element={<ApplicantDashboard />} />
        </Route>

        {/* Employer */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="jobs" element={<JobManagePage />} />
          <Route path="jobs/new" element={<JobFormPage />} />
          <Route path="jobs/:id/edit" element={<JobFormPage />} />
          <Route path="applicants" element={<ApplicantsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="interviews" element={<InterviewPage />} />
        </Route>

        {/* Admin */}
        <Route
          element={
            <PrivateRoute
              isAuthenticated={true} // TODO: thay bằng check token
              role="admin"
              requiredRole="admin"
            />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
