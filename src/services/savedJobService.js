// src/services/savedJobService.js
import axiosClient from "../utils/axiosClient";

// ✅ Lưu job
export const saveJob = (jobId) => {
  return axiosClient.post(`/jobs/${jobId}/save`);
};

// ✅ Bỏ lưu job
export const unsaveJob = (jobId) => {
  return axiosClient.delete(`/jobs/${jobId}/unsave`);
};

// ✅ Lấy danh sách job đã lưu
export const getSavedJobs = () => {
  return axiosClient.get("/jobs/saved");
};

// ✅ Lấy chi tiết job (kèm trạng thái isSaved)
export const getJobDetailWithSave = (jobId) => {
  return axiosClient.get(`/jobs/${jobId}/me`);
};
