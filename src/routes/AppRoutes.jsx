import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import ApplicantLayout from "../layout/ApplicantLayout";
import EmployerLayout from "../layout/EmployerLayout";
import AdminLayout from "../layout/AdminLayout";
import PrivateRoute from "./PrivateRoute";

// pages
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import ApplicantDashboard from "../pages/applicant/DashboardPage";
import EmployerDashboard from "../pages/employer/DashboardPage";

//pages admin
import AdminDashboard from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import CompaniesPage from "../pages/admin/CompaniesPage";
import JobsPage from "../pages/admin/JobsPage";
import RolesPage from "../pages/admin/RolesPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>

        {/* Applicant */}
        <Route element={<ApplicantLayout />}>
          <Route path="/applicant" element={<ApplicantDashboard />} />
        </Route>

        {/* Employer */}
        <Route element={<EmployerLayout />}>
          <Route path="/employer" element={<EmployerDashboard />} />
        </Route>

        {/* Admin - bảo vệ bằng PrivateRoute */}
        <Route
          element={
            <PrivateRoute
              isAuthenticated={true}
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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
