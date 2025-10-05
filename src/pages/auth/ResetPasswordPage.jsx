import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";

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
      setSuccess(false);
      setMessage("Thiếu token reset mật khẩu.");
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
        setSuccess(true);
        setMessage(res.data.message || "Đặt lại mật khẩu thành công!");
        setTimeout(() => navigate("/auth/login"), 2000);
      } else {
        setSuccess(false);
        setMessage(res.data?.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setSuccess(false);
      setMessage("Có lỗi xảy ra khi đặt lại mật khẩu.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Đặt lại mật khẩu</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          required
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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

      <div className="mt-4 text-center">
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
