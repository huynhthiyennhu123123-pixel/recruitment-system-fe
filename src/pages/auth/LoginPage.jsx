import { useState } from "react";
import { login, resendVerification } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await login(form);
      console.log("Login response:", res);

      if (res?.accessToken) {
        const user = res.user || {};

        if (!user.emailVerified) {
          setError("Tài khoản chưa xác thực email.");
          setLoading(false);
          return;
        }

        // ✅ Lưu token và user vào localStorage
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Điều hướng theo vai trò
        const role = user.role?.toUpperCase();

        switch (role) {
          case "APPLICANT":
            navigate("/applicant/dashboard");
            break;
          case "EMPLOYER":
            navigate("/employer/dashboard");
            break;
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        setError("Sai thông tin đăng nhập");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    try {
      const res = await resendVerification(form.email);
      if (res?.success) {
        setInfo("✅ Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư.");
      }
    } catch (err) {
      setError("❌ Không thể gửi lại email xác nhận.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Đăng nhập vào hệ thống
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-600 p-3 text-sm text-center">
          {error}
        </div>
      )}
      {info && (
        <div className="mb-4 rounded-lg bg-green-50 text-green-600 p-3 text-sm text-center">
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          onChange={handleChange}
          required
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          onChange={handleChange}
          required
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <Link to="/auth/register" className="text-green-600 hover:underline">
          Tạo tài khoản mới
        </Link>
        <Link
          to="/auth/forgot-password"
          className="text-gray-500 hover:underline"
        >
          Quên mật khẩu?
        </Link>
        <button
          onClick={handleResend}
          className="text-gray-500 hover:underline"
          type="button"
        >
          Gửi lại email xác nhận
        </button>
      </div>
    </div>
  );
}
