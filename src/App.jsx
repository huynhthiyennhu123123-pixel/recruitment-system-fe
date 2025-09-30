import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ApplicantLayout from "./components/layout/ApplicantLayout";

// Pages
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CheckEmailPage from "./pages/auth/CheckEmailPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";   // ✅ thêm
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";     // ✅ thêm

import DashboardPage from "./pages/applicant/DashboardPage";
import ProfilePage from "./pages/applicant/ProfilePage";
import JobDetailPage from "./pages/applicant/JobDetailPage";
import ApplyJobPage from "./pages/applicant/ApplyJobPage";
import ApplicationsPage from "./pages/applicant/ApplicationsPage";

// Route Guard
import PrivateRoute from "./components/common/PrivateRoute";

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
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="check-email" element={<CheckEmailPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} /> {/* ✅ */}
          <Route path="reset-password" element={<ResetPasswordPage />} />   {/* ✅ */}
        </Route>

        {/* ✅ Redirect nếu backend gửi link trực tiếp */}
        <Route path="/verify-email" element={<RedirectVerifyEmail />} />
        <Route path="/reset-password" element={<RedirectResetPassword />} />

        {/* Applicant */}
        <Route element={<PrivateRoute roles={["APPLICANT"]} />} >
          <Route path="/applicant" element={<ApplicantLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/:id/apply" element={<ApplyJobPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
