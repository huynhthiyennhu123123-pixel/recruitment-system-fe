import axios from "axios";
import axiosClient from "../utils/axiosClient";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api/auth";
export const registerEmployer = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Lỗi kết nối server" };
  }
};
export const register = async (data) => {
  const res = await axiosClient.post("/auth/register", data);
  return res.data;
};
export const login = async (data) => {
  const res = await axiosClient.post("/auth/login", data)
  const payload = res.data?.data || res.data

  const accessToken = payload?.accessToken
  const refreshToken = payload?.refreshToken
  const user = payload?.user
  if (accessToken) localStorage.setItem("accessToken", accessToken)
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
  if (user) localStorage.setItem("user", JSON.stringify(user))
  return {
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    user: user || null,
    type: payload?.tokenType || "Bearer",
  }
}
export const me = () => axiosClient.get("/auth/me");
export const logout = async () => {
  try {
    await axiosClient.post("/auth/logout");
  } catch (err) {
    console.warn("⚠️ API logout không khả dụng hoặc bị lỗi:", err.message);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
  }
};
export const verifyEmail = async (token) => {
  const res = await axiosClient.post("/auth/verify-email", { token });
  return res.data;
};
export const resendVerification = async (email) => {
  const res = await axiosClient.post("/auth/resend-verification", { email });
  return res.data;
};
export const forgotPassword = async (email) => {
  const res = await axiosClient.post("/auth/forgot-password", { email });
  return res.data;
};
export const resetPassword = async (token, newPassword) => {
  const res = await axiosClient.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return res.data;
};
