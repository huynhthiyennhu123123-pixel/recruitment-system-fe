import { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { Link } from "react-router-dom";

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
        setMessage(res.data.message || "Email xác thực đã được gửi lại!");
      } else {
        setSuccess(false);
        setMessage(res.data?.message || "Không thể gửi lại email xác thực.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setSuccess(false);
      setMessage("Có lỗi xảy ra khi gửi lại email.");
    }

    setLoading(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold mb-4">Gửi lại email xác nhận</h1>
      <form onSubmit={handleResend} className="space-y-4">
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
          {loading ? "Đang gửi..." : "Gửi lại email xác nhận"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 ${success ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}

      <div className="mt-4">
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
