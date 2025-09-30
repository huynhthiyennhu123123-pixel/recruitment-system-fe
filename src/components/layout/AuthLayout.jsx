import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo + tiêu đề */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <img
              src="/vite.svg" // thay logo của bạn
              alt="Logo"
              className="h-12 mx-auto mb-2"
            />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Hệ thống tuyển dụng</h1>
          <p className="text-sm text-gray-500">Đăng nhập hoặc đăng ký để tiếp tục</p>
        </div>

        {/* Trang con */}
        <Outlet />
      </div>
    </div>
  );
}
