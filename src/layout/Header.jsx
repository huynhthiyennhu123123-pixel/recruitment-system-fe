import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import RegisterModal from "../pages/auth/RegisterModal";
import { FaUserCircle, FaSignOutAlt, FaBriefcase } from "react-icons/fa";
import NotificationMenu from "../components/common/NotificationMenu";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // ✅ lưu user để cập nhật UI realtime
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lấy user và token từ localStorage mỗi khi reload
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  const token = localStorage.getItem("accessToken");
  const role = user?.role || null;

  // ✅ Hàm đăng xuất đồng bộ với authService
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");

    setUser(null);
    setMenuOpen(false);
    navigate("/", { replace: true }); // ✅ quay về trang public
  };

  // ✅ Màu nền phù hợp theo layout
  const isEmployer = location.pathname.startsWith("/employer");
  const isApplicant = location.pathname.startsWith("/applicant");
  const isAdmin = location.pathname.startsWith("/admin");

  const bgColor = isEmployer
    ? "#f9fafb"
    : isApplicant
      ? "#f9fffb"
      : isAdmin
        ? "#fff5f5"
        : "white";

  return (
    <header
      className="header shadow-sm"
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
          <span className="text-[#00b14f] font-bold text-lg">Job</span>Recruit
        </Link>
      </div>

      {/* Menu giữa */}
      {!token || role === "APPLICANT" ? (
        <nav className="header-center">
          <Link to="/">Trang chủ</Link>
          <Link to="/jobs">Tìm việc làm</Link>
          <Link to="/companies">Công ty</Link>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/contact">Liên hệ</Link>
        </nav>
      ) : role === "EMPLOYER" ? (
        <nav className="header-center">
          <Link to="/employer/dashboard">Trang tuyển dụng</Link>
          <Link to="/employer/jobs">Tin tuyển dụng</Link>
          <Link to="/employer/applications">Ứng viên</Link>
        </nav>
      ) : role === "ADMIN" ? (
        <nav className="header-center">
          <Link to="/admin/dashboard">Quản trị</Link>
          <Link to="/admin/users">Người dùng</Link>
          <Link to="/admin/companies">Công ty</Link>
          <Link to="/admin/jobs">Việc làm</Link>
        </nav>
      ) : null}

      {/* Menu phải */}
      <div className="header-right">
        {!token ? (
          <>
            <Link to="/auth/login" className="btn-outline">
              Đăng nhập
            </Link>
            <button
              className="btn-primary"
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
          <div className="flex items-center gap-4 relative">
            {/* Notification */}
            <div className="relative flex items-center">
              <NotificationMenu iconColor="#00b14f" size={22} />
            </div>

            {/* 👤 User button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-[#e6f8f0] transition"
            >
              <FaUserCircle className="text-2xl text-[#00b14f]" />
              <span className="font-medium text-gray-700">
                {user?.fullName ||
                  `${user?.firstName || "Người"} ${user?.lastName || ""}`}
              </span>
            </button>

            {/* 📋 Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 top-10 w-52 bg-white shadow-lg rounded-xl overflow-hidden text-gray-700 z-50 border border-gray-100">
                {role === "APPLICANT" && (
                  <>
                    <Link
                      to="/applicant/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Hồ sơ của tôi
                    </Link>
                    <Link
                      to="/applicant/documents"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Tài liệu của tôi
                    </Link>
                    <Link
                      to="/applicant/applications"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Đơn ứng tuyển
                    </Link>
                    <Link
                      to="/applicant/interviews"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Lịch phỏng vấn
                    </Link>
                    <Link
                      to="/applicant/saved-jobs"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Công việc đã lưu
                    </Link>
                  </>
                )}

                {role === "EMPLOYER" && (
                  <>
                    <Link
                      to="/employer/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Bảng điều khiển
                    </Link>
                    <Link
                      to="/employer/jobs"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Quản lý tin tuyển
                    </Link>
                    <Link
                      to="/employer/company"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Hồ sơ công ty
                    </Link>
                  </>
                )}

                {role === "ADMIN" && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Trang quản trị
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Người dùng
                    </Link>
                    <Link
                      to="/admin/companies"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Công ty
                    </Link>
                    <Link
                      to="/admin/jobs"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Việc làm
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
                >
                  <FaSignOutAlt /> Đăng xuất
                </button>
              </div>
            )}
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
