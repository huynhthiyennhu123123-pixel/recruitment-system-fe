import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/Header.css"
import RegisterModal from "../pages/auth/RegisterModal"

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-left">
        <Link to="/" className="logo">JobRecruit</Link>
      </div>

      {/* Menu giữa */}
      <nav className="header-center">
        <Link to="/jobs">Việc làm ▾</Link>
        <Link to="/cv">Tạo CV ▾</Link>
        <Link to="/tools">Công cụ ▾</Link>
        <Link to="/career">Cẩm nang nghề nghiệp ▾</Link>
        <Link to="/pro" className="pro">JobRecruit Pro</Link>
      </nav>

      {/* Nút bên phải */}
      <div className="header-right">
        <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
          Đăng ký
        </button>
        <Link to="/auth/login" className="btn-fill">Đăng nhập</Link>
        <Link to="/employer/post-job" className="btn-outline">
          Đăng tuyển & tìm hồ sơ
        </Link>
      </div>

      {/* Modal */}
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  )
}
