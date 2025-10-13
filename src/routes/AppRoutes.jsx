
// export default AppRoutes;
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layouts
import PublicLayout from "../layout/PublicLayout";
import AuthLayout from "../layout/AuthLayout";
import ApplicantLayout from "../layout/ApplicantLayout";
import EmployerLayout from "../layout/EmployerLayout";
import AdminLayout from "../layout/AdminLayout";

// Pages Public
import HomePage from "../pages/public/HomePage";
import JobListPage from "../pages/public/JobListPage";
import PublicJobDetailPage from "../pages/public/JobDetailPage";

// Pages Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import EmployerRegisterPage from "../pages/auth/EmployerRegisterPage"; 
import CheckEmailPage from "../pages/auth/CheckEmailPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Pages Applicant
import DashboardPage from "../pages/applicant/DashboardPage";
import ProfilePage from "../pages/applicant/ProfilePage";
import JobDetailPage from "../pages/applicant/JobDetailPage";
import ApplyJobPage from "../pages/applicant/ApplyJobPage";
import ApplicationsPage from "../pages/applicant/ApplicationsPage";
import ApplicationDetailPage from "../pages/applicant/ApplicationDetailPage";
import ApplicantInterviews from "../pages/applicant/ApplicantInterviews";
import CompanyDetailPage from "../pages/applicant/CompanyDetailPage";

// Pages Employer
import EmployerDashboard from "../pages/employer/DashboardPage";
import JobManagePage from "../pages/employer/JobManagePage";
import JobCreatePage from "../pages/employer/JobCreatePage";
import ApplicantsPage from "../pages/employer/ApplicantsPage";
import CompanyProfilePage from "../pages/employer/CompanyProfilePage";
import InterviewPage from "../pages/employer/InterviewPage";
import JobPostEdit from "../pages/employer/JobPostEdit";
import CompanyProfileEdit from "../pages/employer/CompanyProfileEdit";
import EmployerJobDetail from "../pages/employer/EmployerJobDetail";

// Pages Admin
import AdminDashboard from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import CompaniesPage from "../pages/admin/CompaniesPage";
import JobsPage from "../pages/admin/JobsPage";
import RolesPage from "../pages/admin/RolesPage";
import AdminProfilePage from "../pages/admin/AdminProfilePage";

// Route Guard
import PrivateRoute from "../components/common/PrivateRoute";

// 🔄 Redirect giữ nguyên query (?token=...)
function RedirectVerifyEmail() {
  const location = useLocation();
  return <Navigate to={`/auth/verify-email${location.search}`} replace />;
}

function RedirectResetPassword() {
  const location = useLocation();
  return <Navigate to={`/auth/reset-password${location.search}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="jobs" element={<JobListPage />} />
          <Route path="jobs/:id" element={<PublicJobDetailPage />} />
        </Route>

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="employer-register" element={<EmployerRegisterPage />} />
          <Route path="check-email" element={<CheckEmailPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        
        {/* Redirect khi BE trả link trực tiếp */}
        <Route path="/verify-email" element={<RedirectVerifyEmail />} />
        <Route path="/reset-password" element={<RedirectResetPassword />} />

        {/* Applicant */}
        <Route element={<PrivateRoute roles={["APPLICANT"]} />}>
          <Route path="/applicant" element={<ApplicantLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="applications/:id" element={<ApplicationDetailPage />} />
            <Route path="interviews" element={<ApplicantInterviews />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/:id/apply" element={<ApplyJobPage />} />
            <Route path="companies/:id" element={<CompanyDetailPage />} />
          </Route>
        </Route>

        {/* Employer */}
        <Route element={<PrivateRoute roles={["EMPLOYER", "RECRUITER"]} />}>
          <Route path="/employer" element={<EmployerLayout />}>
            <Route index element={<EmployerDashboard />} />
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="jobs" element={<JobManagePage />} />
            <Route path="jobs/:id" element={<EmployerJobDetail />} />
            <Route path="jobs/new" element={<JobCreatePage />} />
            <Route path="jobs/:id/edit" element={<JobPostEdit  />} />
            <Route path="applicants" element={<ApplicantsPage />} />
            <Route path="interviews" element={<InterviewPage />} />
            <Route path="/employer/company/:id" element={<CompanyProfilePage />} />
            <Route path="CompanyProfileEdit" element={<CompanyProfileEdit />} />

          </Route>
        </Route>

        {/* Admin */}
        <Route element={<PrivateRoute roles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
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

export default App;
