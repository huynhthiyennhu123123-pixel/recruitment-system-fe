import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      if (!token) {
        const msg = "Thiếu token xác minh.";
        setStatus("error");
        setMessage(msg);
        toast.error(msg);
        return;
      }

      try {
        const res = await axiosClient.post("/auth/verify-email", { token });
        if (res.data?.success) {
          const msg = res.data.message || "Xác minh email thành công!";
          setStatus("success");
          setMessage(msg);
          toast.success(msg);
          setTimeout(() => navigate("/auth/login"), 2500);
        } else {
          const msg = res.data?.message || "Xác minh thất bại.";
          setStatus("error");
          setMessage(msg);
          toast.error(msg);
        }
      } catch (err) {
        console.error("Verify error:", err);
        const msg = "Có lỗi xảy ra khi xác minh email.";
        setStatus("error");
        setMessage(msg);
        toast.error(msg);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[65%] flex items-center justify-center bg-white px-8 lg:px-16"
      >
        <div className="w-full max-w-md text-center">
          <img src={logo} alt="Logo" className="h-14 mx-auto mb-4" />
          {status === "loading" && (
            <div className="space-y-3">
              <div className="text-gray-600 text-lg animate-pulse">
                Đang xác minh email...
              </div>
            </div>
          )}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-green-600 text-5xl font-bold">✓</div>
              <h2 className="text-xl font-semibold text-green-600">
                {message}
              </h2>
              <p className="text-gray-600">
                Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
              </p>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-red-600 text-5xl font-bold">✕</div>
              <h2 className="text-xl font-semibold text-red-600">
                Xác minh thất bại
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>

              <Link
                to="/auth/check-email"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                Gửi lại email xác nhận
              </Link>
              <Link
                to="/auth/login"
                className="block text-green-600 hover:underline text-sm mt-2"
              >
                ← Quay lại đăng nhập
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-[35%] bg-gradient-to-br from-[#004d40] via-[#00332c] to-[#001f1f] text-white flex-col justify-center items-center px-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center leading-snug">
          Xác thực tài khoản <br />
          <span className="text-green-400">Kích hoạt hành trình nghề nghiệp</span>
        </h2>
        <p className="max-w-md text-center text-gray-300 text-sm">
          JobRecruit — giúp bạn bảo mật thông tin và mở ra nhiều cơ hội mới.
        </p>
      </motion.div>
    </div>
  );
}
