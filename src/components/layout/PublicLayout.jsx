import { Outlet, Link } from "react-router-dom"
import Header from "./Header"
export default function PublicLayout() {
  return (
    <div>
            <Header />


      <main style={{ padding: "20px" }}>
        <Outlet /> {/* Trang con sẽ render ở đây */}
      </main>

      <footer style={{ padding: "10px", background: "#264653", color: "white" }}>
        <p>© 2025 JobRecruit. All rights reserved.</p>
      </footer>
    </div>
  )
}
