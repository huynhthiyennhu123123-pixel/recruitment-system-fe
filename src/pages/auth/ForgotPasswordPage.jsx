import { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null); // true | false

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosClient.post("/auth/forgot-password", { email });
      if (res.data?.success) {
        setSuccess(true);
        setMessage(res.data.message || "Email đặt lại mật khẩu đã được gửi!");
      } else {
        setSuccess(false);
        setMessage(res.data?.message || "Không thể gửi email đặt lại mật khẩu.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setSuccess(false);
      setMessage("Có lỗi xảy ra khi gửi yêu cầu.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
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

      <div className="mt-4 text-center">
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
