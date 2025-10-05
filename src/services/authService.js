import axios from "axios"
import axiosClient from "../utils/axiosClient";


const API_URL = "http://localhost:8081/api/auth"

export const registerEmployer = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, formData)
    return res.data 
  } catch (err) {
    throw err.response?.data || { message: "Lỗi kết nối server" }
  }
}

export const register = (data) => axiosClient.post("/auth/register", data);

// Đăng nhập
export const login = async (data) => {
  const res = await axiosClient.post("/auth/login", data);
  const payload = res.data?.data || res.data;

  const token = payload?.token;   // ✅ BE trả về token
  if (token) {
    localStorage.setItem("accessToken", token); // lưu vào accessToken cho dễ xài
  }
  if (payload?.refreshToken) {
    localStorage.setItem("refreshToken", payload.refreshToken);
  }
  if (payload?.user) {
    localStorage.setItem("user", JSON.stringify(payload.user));
  }

  return {
    accessToken: token,   // ✅ chuẩn hoá trả về accessToken
    refreshToken: payload?.refreshToken || null,
    user: payload?.user || null,
    type: payload?.type || "Bearer"
  };
};


// Lấy user hiện tại
export const me = () => axiosClient.get("/auth/me");

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  return axiosClient.post("/auth/logout");
};

// ✅ Xác minh email (POST)
export const verifyEmail = (token) =>
  axiosClient.post("/auth/verify-email", { token }).then((res) => res.data);

// ✅ Gửi lại email xác nhận (POST)
export const resendVerification = (email) =>
  axiosClient.post("/auth/resend-verification", { email }).then((res) => res.data);
// Quên mật khẩu
export const forgotPassword = (email) =>
  axiosClient.post("/auth/forgot-password", { email }).then((res) => res.data);

// Đặt lại mật khẩu bằng token
export const resetPassword = (token, newPassword) =>
  axiosClient
    .post("/auth/reset-password", { token, newPassword })
    .then((res) => res.data);
