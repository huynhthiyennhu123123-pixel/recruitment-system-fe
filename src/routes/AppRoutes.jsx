import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ApplicantLayout from "./components/layout/ApplicantLayout";

// Pages
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/applicant/DashboardPage";
import ProfilePage from "./pages/applicant/ProfilePage";
import JobDetailPage from "./pages/applicant/JobDetailPage";
import ApplyJobPage from "./pages/applicant/ApplyJobPage";

// Route Guard
import PrivateRoute from "./components/common/PrivateRoute";

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
        </Route>

        {/* Applicant */}
        <Route element={<PrivateRoute roles={["APPLICANT"]} />}>
          <Route path="/applicant" element={<ApplicantLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/:id/apply" element={<ApplyJobPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
