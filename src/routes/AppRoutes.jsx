import { BrowserRouter, Routes, Route } from "react-router-dom"
import PublicLayout from "../components/layout/PublicLayout"
import ApplicantLayout from "../components/layout/ApplicantLayout"
import EmployerLayout from "../components/layout/EmployerLayout"
import AdminLayout from "../components/layout/AdminLayout"

// pages mẫu
import HomePage from "../pages/public/HomePage"
import LoginPage from "../pages/auth/LoginPage"
import DashboardPage from "../pages/applicant/DashboardPage"
import EmployerDashboard from "../pages/employer/DashboardPage"
import AdminDashboard from "../pages/admin/DashboardPage"

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
          <Route path="/applicant" element={<DashboardPage />} />
        </Route>

        {/* Employer */}
        <Route element={<EmployerLayout />}>
          <Route path="/employer" element={<EmployerDashboard />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
