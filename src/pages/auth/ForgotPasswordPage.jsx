import { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosClient.post("/auth/forgot-password", { email });

      if (res.data?.success) {
        setSuccess(true);
        const msg = res.data.message || "Email đặt lại mật khẩu đã được gửi!";
        setMessage(msg);
        toast.success(msg);
      } else {
        setSuccess(false);
        const msg =
          res.data?.message || "Không thể gửi email đặt lại mật khẩu.";
        setMessage(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setSuccess(false);
      const msg = "Có lỗi xảy ra khi gửi yêu cầu.";
      setMessage(msg);
      toast.error(msg);
    }

    setLoading(false);
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
              Quên mật khẩu
            </h1>
            <p className="text-gray-600 text-sm">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-center ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
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
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-[35%] bg-gradient-to-br from-[#004d40] via-[#00332c] to-[#001f1f] text-white flex-col justify-center items-center px-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center leading-snug">
          Đặt lại mật khẩu <br />{" "}
          <span className="text-green-400">Nhanh chóng và an toàn</span>
        </h2>
        <p className="max-w-md text-center text-gray-300 text-sm">
          JobRecruit — luôn đồng hành cùng bạn trong hành trình tìm kiếm công
          việc mơ ước.
        </p>
      </motion.div>
    </div>
  );
}
