import { Outlet, Link } from "react-router-dom"

export default function ApplicantLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: "200px", background: "#f4f1de", padding: "20px" }}>
        <h3>Applicant</h3>
        <nav>
          <Link to="/applicant">Dashboard</Link><br />
          <Link to="/applicant/profile">Profile</Link><br />
          <Link to="/applicant/resume">My Resume</Link><br />
          <Link to="/applicant/applications">Applications</Link>
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  )
}
