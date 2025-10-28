import axios from "axios"
const API = axios.create({
  baseURL: "http://localhost:8081/api/interviews",
})
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token")

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const getMyInterviews = (params = {}) => API.get("/my", { params })
export const scheduleInterview = (data) => API.post("/schedule", data)
export const rescheduleInterview = (id, data) =>
  API.patch(`/${id}/reschedule`, data)
export const completeInterview = (id, data) =>
  API.patch(`/${id}/complete`, data)
export const cancelInterview = (id, data) => API.patch(`/${id}/cancel`, data)
export const addParticipants = (id, data) =>
  API.post(`/${id}/participants`, data)
export const removeParticipants = (id, data) =>
  API.delete(`/${id}/participants`, { data })
export const getInterviewById = (id) => API.get(`/${id}`)
export const getInterviewParticipants = (id) => API.get(`/${id}/participants`)

