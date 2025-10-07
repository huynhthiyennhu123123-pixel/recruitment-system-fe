
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

// Pages Employer
import EmployerDashboard from "../pages/employer/DashboardPage";
import JobManagePage from "../pages/employer/JobManagePage";
import JobCreatePage from "../pages/employer/JobCreatePage";
import ApplicantsPage from "../pages/employer/ApplicantsPage";
import CompanyProfilePage from "../pages/employer/ProfilePage";
import InterviewPage from "../pages/employer/InterviewPage";
import JobPostEdit from "../pages/employer/JobPostEdit";


// Pages Admin
import AdminDashboard from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import CompaniesPage from "../pages/admin/CompaniesPage";
import JobsPage from "../pages/admin/JobsPage";
import RolesPage from "../pages/admin/RolesPage";
import ProfilePage from "../pages/admin/ProfilePage";

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
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/:id/apply" element={<ApplyJobPage />} />
          </Route>
        </Route>

        {/* Employer */}
        <Route element={<PrivateRoute roles={["EMPLOYER", "RECRUITER"]} />}>
          <Route path="/employer" element={<EmployerLayout />}>
            <Route index element={<EmployerDashboard />} />
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="jobs" element={<JobManagePage />} />
            <Route path="/employer/jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/new" element={<JobCreatePage />} />
            <Route path="jobs/:id/edit" element={<JobPostEdit  />} />
            <Route path="applicants" element={<ApplicantsPage />} />
            <Route path="interviews" element={<InterviewPage />} />
            <Route path="profile" element={<CompanyProfilePage />} />
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
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
