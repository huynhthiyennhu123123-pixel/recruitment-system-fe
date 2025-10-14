import axiosClient from "../utils/axiosClient";

// 🔹 Lấy hồ sơ ứng viên
export const getProfile = () => axiosClient.get("/profiles/my");

// 🔹 Cập nhật hồ sơ ứng viên
export const updateProfile = (data) => axiosClient.put("/profiles/my", data);

// 🔹 Upload CV (PDF)
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post("/profiles/my/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 🔹 Lấy danh sách lịch phỏng vấn của ứng viên
export const getMyInterviews = (params) => {
  // ⚠️ KHÔNG thêm "/api" ở đây, vì axiosClient đã có baseURL = http://localhost:8081/api
  return axiosClient.get("/interviews/my", { params });
};
