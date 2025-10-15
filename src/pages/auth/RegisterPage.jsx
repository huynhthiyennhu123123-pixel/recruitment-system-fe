import { useState } from "react"
import { register } from "../../services/authService"
import { useNavigate, Link } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "APPLICANT",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")

    // ✅ Kiểm tra mật khẩu trùng khớp
    if (form.password !== form.confirmPassword) {
      setError("⚠️ Mật khẩu xác nhận không khớp!")
      return
    }

    setLoading(true)
    try {
      const res = await register(form)
      if (res?.success || res?.data) {
        setInfo("✅ Đăng ký thành công! Vui lòng xác thực email trước khi đăng nhập.")
        navigate("/auth/check-email", { state: { email: form.email } })
      } else {
        setError(res?.message || "❌ Đăng ký thất bại!")
      }
    } catch (err) {
      console.error("Register error:", err)
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? "⚠️ Email đã tồn tại trong hệ thống."
          : err.response?.status === 429
          ? "⚠️ Bạn thao tác quá nhanh, vui lòng thử lại sau."
          : "❌ Đăng ký thất bại. Vui lòng thử lại.")
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

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
        {/* Họ tên */}
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

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Mật khẩu */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
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

        {/* Xác nhận mật khẩu */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
            tabIndex={-1}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Số điện thoại */}
        <input
          name="phoneNumber"
          placeholder="Số điện thoại"
          value={form.phoneNumber}
          onChange={handleChange}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Nút đăng ký */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      {/* Liên kết đăng nhập */}
      <p className="mt-6 text-sm text-center text-gray-600">
        Đã có tài khoản?{" "}
        <Link to="/auth/login" className="text-green-600 hover:underline">
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  )
}
