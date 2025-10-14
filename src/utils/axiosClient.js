import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api"

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// ==============================
// 🔁 Hàm refresh token
// ==============================
async function refreshToken() {
  const token = localStorage.getItem("refreshToken")
  if (!token) return null

  try {
    // ✅ Gửi token qua body (an toàn hơn)
    const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: token })

    const newAccess = res.data?.data?.accessToken || res.data?.accessToken
    if (newAccess) {
      localStorage.setItem("accessToken", newAccess)
      return newAccess
    }
    return null
  } catch (err) {
    console.error("❌ Refresh token failed:", err)
    return null
  }
}

// ==============================
// 📦 Request interceptor
// ==============================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ==============================
// 🚨 Response interceptor
// ==============================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // ✅ Nếu token hết hạn và chưa retry
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const newToken = await refreshToken()
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return axiosClient(original) // ✅ thử lại request
      }

      // ❌ Refresh thất bại → logout & redirect
      console.warn("⚠️ Refresh token hết hạn, chuyển về trang public")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      localStorage.removeItem("companyId")

      window.location.href = "/" // 👈 trở về trang public thay vì /auth/login
    }

    return Promise.reject(error)
  }
)

export default axiosClient
