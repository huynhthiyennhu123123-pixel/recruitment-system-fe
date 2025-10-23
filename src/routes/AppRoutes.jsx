
// export default AppRoutes;
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layouts
import PublicLayout from "../layout/PublicLayout";
import AuthLayout from "../layout/AuthLayout";
import ApplicantLayout from "../layout/ApplicantLayout";
import EmployerLayout from "../layout/EmployerLayout";
import AdminLayout from "../layout/AdminLayout";

// 🔹 Pages Public
import HomePage from "../pages/public/HomePage";
import JobListPage from "../pages/public/JobListPage";
import JobDetailPage from "../pages/public/JobDetailPage";
import CompanyDetailPage from "../pages/public/CompanyDetailPage";
import AboutPage from "../pages/public/AboutPage";



// Pages Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import EmployerRegisterPage from "../pages/auth/EmployerRegisterPage";
import CheckEmailPage from "../pages/auth/CheckEmailPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Pages Applicant
import ProfilePage from "../pages/applicant/ProfilePage";
import ApplyJobPage from "../pages/applicant/ApplyJobPage";
import ApplicationsPage from "../pages/applicant/ApplicationsPage";
import ApplicationDetailPage from "../pages/applicant/ApplicationDetailPage";
import ApplicantInterviews from "../pages/applicant/ApplicantInterviews";
import SavedJobsPage from "../pages/applicant/SavedJobsPage";
import DocumentListPage from "../pages/applicant/documents/DocumentListPage";
import UploadDocumentPage from "../pages/applicant/documents/UploadDocumentPage";
import UploadResumePage from "../pages/applicant/documents/UploadResumePage";


// Pages Employer
import EmployerDashboard from "../pages/employer/DashboardPage";
import JobManagePage from "../pages/employer/JobManagePage";
import JobCreatePage from "../pages/employer/JobCreatePage";
import ApplicationListPage from "../pages/employer/ApplicationListPage"
import CompanyProfilePage from "../pages/employer/CompanyProfilePage";
import InterviewPage from "../pages/employer/InterviewPage";
import JobPostEdit from "../pages/employer/JobPostEdit";
import CompanyProfileEdit from "../pages/employer/CompanyProfileEdit";
import EmployerJobDetail from "../pages/employer/EmployerJobDetail";
import InterviewDetailPage from "../pages/employer/InterviewDetailPage";
import SavedJobsFloatingButton from "../components/common/SavedJobsFloatingButton";

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
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="companies/:id" element={<CompanyDetailPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Auth - Tất cả trang đều full layout */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/employer-register" element={<EmployerRegisterPage />} />
        <Route path="/auth/check-email" element={<CheckEmailPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />


        {/* Redirect khi BE trả link trực tiếp */}
        <Route path="/verify-email" element={<RedirectVerifyEmail />} />
        <Route path="/reset-password" element={<RedirectResetPassword />} />

        {/* Applicant */}
        <Route element={<PrivateRoute roles={["APPLICANT"]} />}>
          <Route path="/applicant" element={<ApplicantLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="applications/:id" element={<ApplicationDetailPage />} />
            <Route path="interviews" element={<ApplicantInterviews />} />
            <Route path="jobs/:id/apply" element={<ApplyJobPage />} />
            <Route path="companies/:id" element={<CompanyDetailPage />} />
            <Route path="/applicant/saved-jobs" element={<SavedJobsPage />} />
            <Route path="documents" element={<DocumentListPage />} />
            <Route path="documents/upload" element={<UploadDocumentPage />} />
            <Route path="documents/resume" element={<UploadResumePage />} />
          </Route>
        </Route>

        {/* Employer */}
        <Route element={<PrivateRoute roles={["EMPLOYER", "RECRUITER"]} />}>
          <Route path="/employer" element={<EmployerLayout />}>
            <Route index element={<EmployerDashboard />} />
            <Route path="dashboard" element={<EmployerDashboard />} />

            {/* Quản lý tin tuyển dụng */}
            <Route path="jobs" element={<JobManagePage />} />
            <Route path="jobs/new" element={<JobCreatePage />} />
            <Route path="jobs/:id" element={<EmployerJobDetail />} />
            <Route path="jobs/:id/edit" element={<JobPostEdit />} />

            {/* Quản lý ứng viên */}
            <Route path="applications" element={<ApplicationListPage />} />

            {/* Quản lý phỏng vấn */}
            <Route path="interviews" element={<InterviewPage />} />
            <Route path="interviews" element={<InterviewPage />} />
            <Route path="interviews/:id" element={<InterviewDetailPage />} />


            {/* Hồ sơ công ty */}
            <Route path="company/:id" element={<CompanyProfilePage />} />
            <Route path="company/edit" element={<CompanyProfileEdit />} />
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
      
      <SavedJobsFloatingButton />
    </BrowserRouter>
  );
}

export default App;
