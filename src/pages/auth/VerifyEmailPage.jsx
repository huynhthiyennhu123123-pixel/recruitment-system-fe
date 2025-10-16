import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const hasRun = useRef(false); // ✅ Dùng để ngăn chạy 2 lần do Strict Mode

  // Lấy token từ query ?token=...
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    // ✅ Chặn không cho chạy 2 lần trong React Strict Mode (DEV)
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
          // Tự động chuyển hướng sau 2 giây
          setTimeout(() => navigate("/auth/login"), 2000);
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
    <div className="text-center mt-10">
      {status === "loading" && (
        <p className="text-gray-600">Đang xác minh email...</p>
      )}

      {status === "success" && (
        <>
          <div className="text-green-600 text-5xl mb-3">✅</div>
          <p className="text-green-600 font-bold text-lg mb-2">{message}</p>
          <p>Bạn sẽ được chuyển đến trang đăng nhập...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-red-600 text-5xl mb-3">❌</div>
          <p className="text-red-600 font-bold text-lg mb-2">Xác minh thất bại</p>
          <p className="text-gray-600 mb-4">{message}</p>

          <Link
            to="/auth/check-email"
            className="block bg-green-600 text-white px-4 py-2 rounded mb-2"
          >
            Gửi lại email xác nhận
          </Link>
          <Link
            to="/auth/login"
            className="block text-blue-600 hover:underline"
          >
            Quay lại đăng nhập
          </Link>
        </>
      )}
    </div>
  );
}
