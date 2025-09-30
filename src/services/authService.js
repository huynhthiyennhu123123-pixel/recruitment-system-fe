import axiosClient from "../utils/axiosClient";

// Đăng ký
export const register = (data) => axiosClient.post("/auth/register", data);

// Đăng nhập
export const login = async (data) => {
  const res = await axiosClient.post("/auth/login", data);
  const payload = res.data?.data || res.data;

  if (payload?.accessToken) {
    localStorage.setItem("accessToken", payload.accessToken);
  }
  if (payload?.refreshToken) {
    localStorage.setItem("refreshToken", payload.refreshToken);
  }
  if (payload?.user) {
    localStorage.setItem("user", JSON.stringify(payload.user));
  }

  return payload;
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
