// src/services/savedJobService.js
import axiosClient from "../utils/axiosClient";

// ✅ Lưu job
export const saveJob = (jobId) => {
  return axiosClient.post(`/api/jobs/${jobId}/save`);
};

// ✅ Bỏ lưu job
export const unsaveJob = (jobId) => {
  return axiosClient.delete(`/api/jobs/${jobId}/unsave`);
};

// ✅ Lấy danh sách job đã lưu
export const getSavedJobs = () => {
  return axiosClient.get("/api/jobs/saved");
};

// ✅ Lấy chi tiết job (kèm trạng thái isSaved)
export const getJobDetailWithSave = (jobId) => {
  return axiosClient.get(`/api/jobs/${jobId}/me`);
};
