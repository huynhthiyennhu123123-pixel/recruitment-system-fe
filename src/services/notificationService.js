import axios from "axios";

// =======================
// Cấu hình axiosClient
// =======================
const axiosClient = axios.create({
  baseURL: "http://localhost:8081/api",
});

axiosClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// =======================
// Các hàm gọi API
// =======================

export const getNotifications = (params) => {
  return axiosClient.get("/notifications", { params });
};

export const markAsRead = (id) => {
  return axiosClient.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = () => {
  return axiosClient.patch("/notifications/mark-all-read");
};

export const countUnread = () => {
  return axiosClient.get("/notifications/count-unread");
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  countUnread,
};
