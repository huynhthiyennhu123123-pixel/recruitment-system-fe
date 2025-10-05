import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
});

// Hàm refresh token
async function refreshToken() {
  const token = localStorage.getItem("refreshToken");
  if (!token) return null;
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api"}/auth/refresh?refresh_token=${token}`
    );
    const newToken = res.data?.data?.accessToken || res.data?.accessToken;
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      return newToken;
    }
    return null;
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
}

// Tự gắn token vào request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tự refresh khi bị 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(original);
      }
      // Refresh thất bại → logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
