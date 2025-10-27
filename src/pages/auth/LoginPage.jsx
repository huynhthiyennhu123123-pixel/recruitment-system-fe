import { useState } from "react";
import { login, resendVerification } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";
import logo from "../../assets/images/logo.png";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(form);
      const user = res?.user;
      if (user && user.emailVerified === false) {
        toast.warn("Tài khoản của bạn chưa xác thực email!");
        setLoading(false);
        return;
      }

      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        const role = user.role?.toUpperCase();
        toast.success("Đăng nhập thành công!");

        switch (role) {
          case "APPLICANT":
            navigate("/", { replace: true });
            break;
          case "EMPLOYER":
          case "RECRUITER":
            navigate("/employer/dashboard", { replace: true });
            break;
          case "ADMIN":
            navigate("/admin/dashboard", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
            break;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) {
      toast.info("Vui lòng nhập email trước khi gửi lại xác nhận!");
      return;
    }
    try {
      const res = await resendVerification(form.email);
      if (res?.success)
        toast.success("Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư.");
      else toast.error("Không thể gửi lại email xác nhận.");
    } catch {
      toast.error("Không thể gửi lại email xác nhận.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[65%] flex items-center justify-center bg-white px-8 lg:px-16"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Chào mừng quay lại{" "}
              <span className="text-green-600">JobRecruit</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Đăng nhập để tiếp tục hành trình nghề nghiệp của bạn.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
          <div className="mt-5 flex flex-col items-center gap-2 text-sm text-gray-600">
            <Link to="/auth/forgot-password" className="hover:underline">
              Quên mật khẩu?
            </Link>
            <button
              onClick={handleResend}
              type="button"
              className="hover:underline"
            >
              Gửi lại email xác nhận
            </button>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p className="mb-3">Hoặc đăng nhập bằng</p>
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
            Chưa có tài khoản?{" "}
            <Link to="/auth/register" className="text-green-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-[35%] bg-gradient-to-br from-[#004d40] via-[#00332c] to-[#001f1f] text-white flex-col justify-center items-center px-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center leading-snug">
          Kết nối ứng viên <br />
          <span className="text-green-400">Vươn xa sự nghiệp</span>
        </h2>
        <p className="max-w-md text-center text-gray-300 text-sm">
          JobRecruit — Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt Nam.
        </p>
      </motion.div>
    </div>
  );
}
