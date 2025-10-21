import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      const msg = "Thiếu token reset mật khẩu.";
      setSuccess(false);
      setMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axiosClient.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      if (res.data?.success) {
        const msg = res.data.message || "Đặt lại mật khẩu thành công!";
        setSuccess(true);
        setMessage(msg);
        toast.success(msg);
        setTimeout(() => navigate("/auth/login"), 2000);
      } else {
        const msg = res.data?.message || "Không thể đặt lại mật khẩu.";
        setSuccess(false);
        setMessage(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const msg = "Có lỗi xảy ra khi đặt lại mật khẩu.";
      setSuccess(false);
      setMessage(msg);
      toast.error(msg);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Bên trái: Form (65%) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[65%] flex items-center justify-center bg-white px-8 lg:px-16"
      >
        <div className="w-full max-w-md">
          {/* Logo + Tiêu đề */}
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600 text-sm">
              Nhập mật khẩu mới để truy cập lại tài khoản của bạn.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          {/* Thông báo */}
          {message && (
            <p
              className={`mt-4 text-center ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Liên kết quay lại */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-green-600 hover:underline text-sm"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Bên phải: Banner (35%) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-[35%] bg-gradient-to-br from-[#004d40] via-[#00332c] to-[#001f1f] text-white flex-col justify-center items-center px-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center leading-snug">
          Khôi phục truy cập <br />{" "}
          <span className="text-green-400">Nhanh chóng và an toàn</span>
        </h2>
        <p className="max-w-md text-center text-gray-300 text-sm">
          JobRecruit — hỗ trợ bạn lấy lại quyền truy cập vào tài khoản dễ dàng,
          chỉ trong vài bước.
        </p>
      </motion.div>
    </div>
  );
}
