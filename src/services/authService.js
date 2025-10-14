import axios from "axios";
import axiosClient from "../utils/axiosClient";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api/auth";

/* ===========================
   AUTH SERVICE
=========================== */

// ✅ Đăng ký nhà tuyển dụng (dùng endpoint riêng)
export const registerEmployer = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Lỗi kết nối server" };
  }
};

// ✅ Đăng ký ứng viên (dùng axiosClient để tự đính token)
export const register = async (data) => {
  const res = await axiosClient.post("/auth/register", data);
  return res.data;
};

// ✅ Đăng nhập
export const login = async (data) => {
  const res = await axiosClient.post("/auth/login", data);
  const payload = res.data?.data || res.data;

  const accessToken = payload?.accessToken;
  const refreshToken = payload?.refreshToken;
  const user = payload?.user;

  // ✅ Lưu token và user vào localStorage (đồng bộ với axiosClient)
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  if (user) localStorage.setItem("user", JSON.stringify(user));

  return {
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    user: user || null,
    type: payload?.tokenType || "Bearer",
  };
};

// ✅ Lấy thông tin user hiện tại
export const me = () => axiosClient.get("/auth/me");

/// ✅ Đăng xuất
export const logout = async () => {
  try {
    // Gọi API logout nếu backend có
    await axiosClient.post("/auth/logout");
  } catch (err) {
    console.warn("⚠️ API logout không khả dụng hoặc bị lỗi:", err.message);
  } finally {
    // ✅ Dọn dẹp toàn bộ dữ liệu đăng nhập
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
  }
};

// ✅ Xác minh email
export const verifyEmail = async (token) => {
  const res = await axiosClient.post("/auth/verify-email", { token });
  return res.data;
};

// ✅ Gửi lại email xác nhận
export const resendVerification = async (email) => {
  const res = await axiosClient.post("/auth/resend-verification", { email });
  return res.data;
};

// ✅ Quên mật khẩu
export const forgotPassword = async (email) => {
  const res = await axiosClient.post("/auth/forgot-password", { email });
  return res.data;
};

// ✅ Đặt lại mật khẩu
export const resetPassword = async (token, newPassword) => {
  const res = await axiosClient.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return res.data;
};
