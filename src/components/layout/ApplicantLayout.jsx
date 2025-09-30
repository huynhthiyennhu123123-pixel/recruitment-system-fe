import { Outlet, Link, useNavigate } from "react-router-dom";

export default function ApplicantLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Topbar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/applicant/dashboard"
            className="text-2xl font-bold text-green-700"
          >
            JobPortal
          </Link>

          {/* Menu */}
          <nav className="flex gap-6 items-center">
            <Link
              to="/applicant/dashboard"
              className="hover:text-green-600 font-medium"
            >
              Việc làm
            </Link>
            <Link
              to="/applicant/applications"
              className="hover:text-green-600 font-medium"
            >
              Đơn đã nộp
            </Link>
            <Link
              to="/applicant/profile"
              className="hover:text-green-600 font-medium"
            >
              Hồ sơ
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </header>

      {/* Nội dung */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
