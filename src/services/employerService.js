// src/services/employerService.js
const API_URL = "/api"

// Helper để thêm token vào header
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json"
})

/**
 * Tin tuyển dụng (Jobs)
 */
export const employerService = {
  // Lấy danh sách job của công ty
  async getMyJobs(page = 0, size = 10) {
    const res = await fetch(`${API_URL}/jobs/my-jobs?page=${page}&size=${size}`, {
      headers: getAuthHeaders()
    })
    return res.json()
  },

  // Lấy chi tiết 1 job
  async getJobById(id) {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      headers: getAuthHeaders()
    })
    return res.json()
  },

  // Tạo job mới
  async createJob(data) {
    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return res.json()
  },

  // Cập nhật job
  async updateJob(id, data) {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return res.json()
  },

  // Xoá job
  async deleteJob(id) {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    })
    return res.json()
  },

  // Đổi trạng thái job (OPEN / CLOSE)
  async updateJobStatus(id, status) {
    const res = await fetch(`${API_URL}/jobs/${id}/status?status=${status}`, {
      method: "PATCH",
      headers: getAuthHeaders()
    })
    return res.json()
  },

  /**
   * Hồ sơ công ty (Profile)
   */
  async getCompanyProfile() {
    const res = await fetch(`${API_URL}/companies/my`, {
      headers: getAuthHeaders()
    })
    return res.json()
  },

  async updateCompanyProfile(data) {
    const res = await fetch(`${API_URL}/companies/my`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return res.json()
  },

  /**
   * Ứng viên
   */
  async getApplicants() {
    const res = await fetch(`${API_URL}/applications/my-company`, {
      headers: getAuthHeaders()
    })
    return res.json()
  },

  /**
   * Phỏng vấn
   */
  async getInterviews() {
    const res = await fetch(`${API_URL}/interviews/my`, {
      headers: getAuthHeaders()
    })
    return res.json()
  },

  getCompanyProfile: () => api.get("/api/employer/profile"),
  

}
