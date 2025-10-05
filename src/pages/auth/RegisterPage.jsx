import { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "APPLICANT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await register(form);
      if (res?.success || res?.data) {
        setInfo("✅ Đăng ký thành công! Vui lòng xác thực email trước khi đăng nhập.");
        // chuyển sang trang check email kèm email đã nhập
        navigate("/auth/check-email", { state: { email: form.email } });
      } else {
        setError(res?.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? "Email đã tồn tại trong hệ thống."
          : err.response?.status === 429
          ? "Bạn thao tác quá nhanh, vui lòng thử lại sau."
          : "Đăng ký thất bại. Vui lòng thử lại.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Tạo tài khoản</h2>

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
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="Họ"
            value={form.firstName}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="lastName"
            placeholder="Tên"
            value={form.lastName}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          name="phoneNumber"
          placeholder="Số điện thoại"
          value={form.phoneNumber}
          onChange={handleChange}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="APPLICANT">Ứng viên</option>
          <option value="EMPLOYER">Nhà tuyển dụng</option>
          
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-600">
        Đã có tài khoản?{" "}
        <Link to="/auth/login" className="text-green-600 hover:underline">
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
}
