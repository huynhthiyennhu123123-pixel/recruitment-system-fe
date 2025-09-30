import axiosClient from "../utils/axiosClient";

// Tìm kiếm công việc
export const searchJobs = (params) => {
  return axiosClient.get("/public/jobs/search", { params });
};

// Danh sách job mới nhất
export const latestJobs = (params) => {
  return axiosClient.get("/public/jobs/latest", { params });
};

// Lấy chi tiết 1 job
export const getJobDetail = (id) => {
  return axiosClient.get(`/public/jobs/${id}`);
};
