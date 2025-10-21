import { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

export default function CheckEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null); // true | false

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosClient.post("/auth/resend-verification", { email });

      if (res.data?.success) {
        setSuccess(true);
        const msg = res.data.message || "Email xác thực đã được gửi lại!";
        setMessage(msg);
        toast.success(msg);
      } else {
        setSuccess(false);
        const msg = res.data?.message || "Không thể gửi lại email xác thực.";
        setMessage(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Resend error:", err);
      setSuccess(false);
      const msg = "Có lỗi xảy ra khi gửi lại email.";
      setMessage(msg);
      toast.error(msg);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Bên trái: form (65%) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[65%] flex items-center justify-center bg-white px-8 lg:px-16"
      >
        <div className="w-full max-w-md">
          {/* Logo + tiêu đề */}
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Gửi lại email xác nhận
            </h1>
            <p className="text-gray-600 text-sm">
              Nhập email bạn đã dùng để đăng ký để nhận lại liên kết xác minh.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleResend} className="space-y-4">
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
              {loading ? "Đang gửi..." : "Gửi lại email xác nhận"}
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

          {/* Quay lại đăng nhập */}
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

      {/* Bên phải: banner (35%) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-[35%] bg-gradient-to-br from-[#004d40] via-[#00332c] to-[#001f1f] text-white flex-col justify-center items-center px-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center leading-snug">
          Xác nhận tài khoản <br />
          <span className="text-green-400">Bắt đầu hành trình của bạn</span>
        </h2>
        <p className="max-w-md text-center text-gray-300 text-sm">
          JobRecruit — đảm bảo tài khoản của bạn được bảo mật và xác thực an toàn.
        </p>
      </motion.div>
    </div>
  );
}
