import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Header.css"
import RegisterModal from "../pages/auth/RegisterModal"
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user") || "null")
  const token = localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/auth/login")
  }

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-left">
        <Link to="/" className="logo">
          <span className="text-[#00b14f] font-bold">Job</span>
          Recruit
        </Link>
      </div>

      {/* Menu giữa */}
      <nav className="header-center">
        <Link to="/jobs">Việc làm ▾</Link>
        <Link to="/cv">Tạo CV ▾</Link>
        <Link to="/tools">Công cụ ▾</Link>
        <Link to="/career">Cẩm nang nghề nghiệp ▾</Link>
        <Link to="/pro" className="pro">
          JobRecruit Pro
        </Link>
      </nav>

      {/* Nút bên phải */}
      <div className="header-right">
        {!token ? (
          <>
            <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
              Đăng ký
            </button>
            <Link to="/auth/login" className="btn-outline">
              Đăng nhập
            </Link>
            <Link to="/employer/post-job" className="btn-outline">
              Đăng tuyển & tìm hồ sơ
            </Link>
          </>
        ) : (
          <div className="user-menu">
            <div className="user-info">
              <FaUserCircle className="icon" />
              <span className="username">
                {user?.firstName || "Ứng viên"}
              </span>
            </div>
            <div className="user-dropdown">
              <Link to="/applicant/dashboard">Trang chủ</Link>
              <Link to="/applicant/profile">Hồ sơ của tôi</Link>
              <Link to="/applicant/applications">Đơn ứng tuyển</Link>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal đăng ký */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  )
}
