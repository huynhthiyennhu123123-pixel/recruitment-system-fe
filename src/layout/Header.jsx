import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import RegisterModal from "../pages/auth/RegisterModal";
import { FaUserCircle, FaSignOutAlt, FaBriefcase } from "react-icons/fa";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const role = user?.role || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  // ✅ Nền tùy layout
  const isEmployer = location.pathname.startsWith("/employer");
  const isApplicant = location.pathname.startsWith("/applicant");
  const bgColor = isEmployer ? "#f9fafb" : isApplicant ? "#f9fffb" : "white";

  return (
    <header
      className="header"
      style={{
        backgroundColor: bgColor,
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div className="header-left">
        <Link to="/" className="logo flex items-center gap-1">
          <FaBriefcase className="text-[#00b14f]" size={22} />
          <span className="text-[#00b14f] font-bold text-lg">Job</span>
          Recruit
        </Link>
      </div>

      {/* Menu giữa */}
      <nav className="header-center">
        <Link to="/">Trang chủ</Link>
        <Link to="/jobs">Tìm việc làm</Link>
        <Link to="/companies">Công ty</Link>
        <Link to="/about">Giới thiệu</Link>
        <Link to="/contact">Liên hệ</Link>
      </nav>

      {/* Menu phải */}
      <div className="header-right">
        {/* ❌ Chưa đăng nhập */}
        {!token ? (
          <>
            <Link
              to="/auth/login"
              className="btn-outline hover:shadow-sm transition-all"
            >
              Đăng nhập
            </Link>
            <button
              className="btn-primary hover:shadow-sm transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              Đăng ký
            </button>
            <Link
              to="/auth/employer-register"
              className="btn-outline border-[#00915d] text-[#00915d] hover:bg-[#00b14f] hover:text-white"
            >
              Dành cho Nhà tuyển dụng
            </Link>
          </>
        ) : (
          /* ✅ Đã đăng nhập */
          <div className="user-menu">
            <div className="user-info">
              <FaUserCircle className="icon" />
              <span className="username font-medium">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ""}`
                  : "Người dùng"}
              </span>
            </div>

            {/* Dropdown menu */}
            <div className="user-dropdown">
              {role === "APPLICANT" && (
                <>
                  <Link to="/applicant/dashboard">🏠 Bảng điều khiển</Link>
                  <Link to="/applicant/profile">👤 Hồ sơ của tôi</Link>
                  <Link to="/applicant/applications">📄 Đơn ứng tuyển</Link>
                  <Link to="/jobs" className="text-[#00b14f] font-medium">
                    🔍 Tìm việc làm
                  </Link>
                </>
              )}

              {role === "EMPLOYER" && (
                <>
                  <Link to="/employer/dashboard">📊 Trang tuyển dụng</Link>
                  <Link to="/employer/jobs">📢 Quản lý tin tuyển</Link>
                  <Link to="/employer/profile">🏢 Hồ sơ công ty</Link>
                </>
              )}

              {role === "ADMIN" && (
                <>
                  <Link to="/admin/dashboard">🛠 Trang quản trị</Link>
                  <Link to="/admin/users">👥 Người dùng</Link>
                  <Link to="/admin/companies">🏢 Công ty</Link>
                </>
              )}

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
  );
}
