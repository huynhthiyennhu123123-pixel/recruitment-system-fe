import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RegisterModal from "../pages/auth/RegisterModal";
import { FaUserCircle, FaSignOutAlt, FaBriefcase } from "react-icons/fa";
import NotificationMenu from "../components/common/NotificationMenu";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  const token = localStorage.getItem("accessToken");
  const role = user?.role || null;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
    setUser(null);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const isEmployer = location.pathname.startsWith("/employer");
  const isApplicant = location.pathname.startsWith("/applicant");
  const isAdmin = location.pathname.startsWith("/admin");

  const bgColor = isEmployer
    ? "bg-gray-50"
    : isApplicant
    ? "bg-green-50"
    : isAdmin
    ? "bg-red-50"
    : "bg-green-50";

  return (
    <header
      className={`${bgColor} sticky top-0 z-50 shadow-sm border-b border-gray-200 backdrop-blur-sm bg-opacity-95`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* 🔹 Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-[#00b14f] text-xl hover:scale-105 transition-transform"
        >
          <FaBriefcase size={22} />
          <span>Job</span>
          <span className="text-gray-800">Recruit</span>
        </Link>

        {/* 🔹 Menu giữa */}
        {!token || role === "APPLICANT" ? (
          <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-[#00b14f] transition-colors">
              Trang chủ
            </Link>
            <Link to="/jobs" className="hover:text-[#00b14f] transition-colors">
              Việc làm
            </Link>
            <Link
              to="/companies"
              className="hover:text-[#00b14f] transition-colors"
            >
              Công ty
            </Link>
            <Link
              to="/about"
              className="hover:text-[#00b14f] transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#00b14f] transition-colors"
            >
              Liên hệ
            </Link>
          </nav>
        ) : role === "EMPLOYER" ? (
          <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/employer/dashboard" className="hover:text-[#00b14f]">
              Trang tuyển dụng
            </Link>
            <Link to="/employer/jobs" className="hover:text-[#00b14f]">
              Tin tuyển dụng
            </Link>
            <Link to="/employer/applications" className="hover:text-[#00b14f]">
              Ứng viên
            </Link>
          </nav>
        ) : role === "ADMIN" ? (
          <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/admin/dashboard" className="hover:text-[#00b14f]">
              Quản trị
            </Link>
            <Link to="/admin/users" className="hover:text-[#00b14f]">
              Người dùng
            </Link>
            <Link to="/admin/companies" className="hover:text-[#00b14f]">
              Công ty
            </Link>
            <Link to="/admin/jobs" className="hover:text-[#00b14f]">
              Việc làm
            </Link>
          </nav>
        ) : null}

        {/* 🔹 Menu phải */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/auth/login"
                className="px-4 py-2 text-[#00b14f] border border-[#00b14f] rounded-lg hover:bg-[#00b14f] hover:text-white transition"
              >
                Đăng nhập
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#00b14f] text-white rounded-lg hover:bg-[#00915d] transition"
              >
                Đăng ký
              </button>
              <Link
                to="/auth/employer-register"
                className="px-4 py-2 text-[#00915d] border border-[#00915d] rounded-lg hover:bg-[#00915d] hover:text-white transition"
              >
                Dành cho Nhà tuyển dụng
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 relative">
              <NotificationMenu iconColor="#00b14f" size={22} />

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-green-50 transition"
              >
                <FaUserCircle className="text-2xl text-[#00b14f]" />
                <span className="font-medium text-gray-700">
                  {user?.fullName ||
                    `${user?.firstName || "Người"} ${user?.lastName || ""}`}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden animate-fadeIn">
                  {(role === "APPLICANT" ||
                    role === "EMPLOYER" ||
                    role === "ADMIN") && (
                    <>
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
                            to="/applicant/applications"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setMenuOpen(false)}
                          >
                            Đơn ứng tuyển
                          </Link>
                          <Link
                            to="/applicant/saved-jobs"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setMenuOpen(false)}
                          >
                            Việc làm đã lưu
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
                        </>
                      )}
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
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}
