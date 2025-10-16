// src/services/interviewService.js
import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:8081/api/interviews",
})

// ✅ Thêm Authorization header tự động cho mọi request
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token")

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ============================
//  Lấy danh sách lịch phỏng vấn (phân trang + lọc)
// ============================
export const getMyInterviews = (params = {}) => API.get("/my", { params })

// ============================
//  Tạo lịch phỏng vấn mới
// ============================
export const scheduleInterview = (data) => API.post("/schedule", data)

// ============================
//  Đổi lịch (reschedule)
// ============================
export const rescheduleInterview = (id, data) =>
  API.patch(`/${id}/reschedule`, data)

// ============================
// Hoàn tất phỏng vấn
// ============================
export const completeInterview = (id, data) =>
  API.patch(`/${id}/complete`, data)

// ============================
//  Hủy lịch phỏng vấn
// ============================
export const cancelInterview = (id, data) => API.patch(`/${id}/cancel`, data)

// ============================
// Quản lý người tham gia
// ============================
export const addParticipants = (id, data) =>
  API.post(`/${id}/participants`, data)

export const removeParticipants = (id, data) =>
  API.delete(`/${id}/participants`, { data })

// ============================
// Lấy chi tiết một lịch phỏng vấn
// ============================
export const getInterviewById = (id) => API.get(`/${id}`)

export const getInterviewParticipants = (id) => API.get(`/${id}/participants`)

