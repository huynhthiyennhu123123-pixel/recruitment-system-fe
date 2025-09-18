import { Outlet, Link } from "react-router-dom"

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "240px", background: "#dee2e6", padding: "20px" }}>
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin">Dashboard</Link><br />
          <Link to="/admin/users">Users</Link><br />
          <Link to="/admin/companies">Companies</Link><br />
          <Link to="/admin/jobs">Jobs</Link><br />
          <Link to="/admin/roles">Roles</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  )
}
