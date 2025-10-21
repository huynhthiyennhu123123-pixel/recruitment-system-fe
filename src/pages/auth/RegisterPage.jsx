import { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";
import logo from "../../assets/images/logo.png"; // 👈 giữ logo cũ của bạn
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "APPLICANT",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.warn("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      const res = await register(form);
      if (res?.success || res?.data) {
        toast.success("Đăng ký thành công! Vui lòng xác thực email trước khi đăng nhập.");
        navigate("/auth/login");
      } else {
        toast.error(res?.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Bên trái: Form (65%) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-[65%] flex items-center justify-center bg-white px-8 lg:px-16"
      >
        <div className="w-full max-w-md">
          {/* Logo & Tiêu đề */}
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Hệ thống tuyển dụng <span className="text-green-600">JobRecruit</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Đăng ký để xây dựng hồ sơ nổi bật và nhận được cơ hội nghề nghiệp lý tưởng.
            </p>
          </div>

          {/* Form đăng ký */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                placeholder="Họ"
                value={form.firstName}
                onChange={handleChange}
                required
                className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                name="lastName"
                placeholder="Tên"
                value={form.lastName}
                onChange={handleChange}
                required
                className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-lg border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <input
              name="phoneNumber"
              placeholder="Số điện thoại"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          {/* Đăng ký bằng MXH */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p className="mb-3">Hoặc đăng ký bằng</p>
            <div className="flex justify-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-blue-600 hover:bg-blue-50 transition">
                <FaFacebook /> Facebook
              </button>
            </div>
          </div>

          <p className="mt-6 text-sm text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/auth/login" className="text-green-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Bên phải: Banner (35%) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-[35%] bg-gradient-to-br from-[#004d40] via-[#00332c] to-[#001f1f] text-white flex-col justify-center items-center px-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center leading-snug">
          Tiếp lợi thế <br /> <span className="text-green-400">Nối thành công</span>
        </h2>
        <p className="max-w-md text-center text-gray-300 text-sm">
          JobRecruit — Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt Nam.
        </p>
      </motion.div>
    </div>
  );
}
