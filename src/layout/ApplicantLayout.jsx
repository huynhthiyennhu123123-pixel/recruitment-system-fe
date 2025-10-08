import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Footer from "./Footer";

export default function ApplicantLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#00a86b] to-[#00915d] text-white shadow-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/applicant/dashboard"
            className="text-2xl font-bold hover:opacity-90 transition"
          >
            JobRecruit
          </Link>

          {/* Menu */}
          <nav className="flex items-center gap-8 text-sm font-medium">
            {[
              { to: "/applicant/dashboard", label: "Việc làm" },
              { to: "/applicant/applications", label: "Đơn đã nộp" },
              { to: "/applicant/profile", label: "Hồ sơ" },
            ].map((item) => {
              const active = location.pathname.includes(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative group transition-all ${
                    active ? "text-white font-semibold" : "text-white/90"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-[-6px] left-0 w-0 h-[2px] bg-white transition-all group-hover:w-full ${
                      active ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              );
            })}

            {/* Avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center hover:text-white transition"
              >
                <FaUserCircle className="text-2xl" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg text-gray-700 z-50 overflow-hidden animate-fadeIn">
                  <Link
                    to="/applicant/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* NỘI DUNG */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
