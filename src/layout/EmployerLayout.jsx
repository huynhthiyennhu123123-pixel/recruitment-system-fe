import { Outlet, Link } from "react-router-dom"

export default function EmployerLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "220px", background: "#e9ecef", padding: "20px" }}>
        <h3>Employer</h3>
        <nav>
          <Link to="/employer">Dashboard</Link><br />
          <Link to="/employer/jobs">Manage Jobs</Link><br />
          <Link to="/employer/jobs/new">Post a Job</Link><br />
          <Link to="/employer/company">Company Profile</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  )
}
