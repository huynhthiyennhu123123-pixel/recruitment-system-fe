import { useState } from "react";
import { login, resendVerification } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify"; // ✅ Thêm import

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
      console.log("✅ Login response:", res);

      const user = res?.user;

      // ⚠️ Kiểm tra email xác thực trước khi cho vào
      if (user && user.emailVerified === false) {
        toast.warn("⚠️ Tài khoản của bạn chưa xác thực email!");
        setLoading(false);
        return;
      }

      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));

        const role = user.role?.toUpperCase();
        toast.success("🎉 Đăng nhập thành công!");

        // ✅ Điều hướng theo vai trò
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
      console.error("❌ Login error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(message); // ✅ Hiển thị lỗi bằng toast
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendVerification(form.email);
      if (res?.success) {
        toast.success("Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư.");
      } else {
        toast.error("Không thể gửi lại email xác nhận.");
      }
    } catch {
      toast.error("Không thể gửi lại email xác nhận.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Đăng nhập vào hệ thống
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Mật khẩu + nút ẩn/hiện */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Nút đăng nhập */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      {/* Liên kết phụ */}
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
