import { Outlet, Link, useLocation } from "react-router-dom"
import logo from "../assets/images/logo.png"

export default function AuthLayout() {
  const location = useLocation()
  const isEmployerRegister = location.pathname.includes("employer-register")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div
        className={`
          w-full 
          ${isEmployerRegister ? "max-w-[750px]" : "max-w-md"}  /* rộng hơn cho nhà tuyển dụng */
          bg-white 
          rounded-2xl 
          shadow-lg 
          p-8 
          md:p-10 
          transition-all 
          duration-300
        `}
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <img src={logo} alt="Logo" className="h-12 mx-auto mb-2" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Hệ thống tuyển dụng</h1>
          <p className="text-sm text-gray-500">
            {isEmployerRegister
              ? "Đăng ký tài khoản Nhà tuyển dụng để tiếp tục"
              : "Đăng nhập hoặc đăng ký để tiếp tục"}
          </p>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
