// src/services/notificationService.js
import axiosClient from "../utils/axiosClient"

// 📨 Lấy danh sách thông báo
export const getNotifications = (params) =>
  axiosClient.get("/notifications", { params })

// 🔔 Đánh dấu 1 thông báo là đã đọc
export const markAsRead = (id) => axiosClient.patch(`/notifications/${id}/read`)

// 🔕 Đánh dấu tất cả là đã đọc
export const markAllAsRead = () => axiosClient.patch("/notifications/mark-all-read")

// 📬 Đếm số lượng chưa đọc
export const countUnread = () => axiosClient.get("/notifications/count-unread")
