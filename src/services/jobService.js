import axiosClient from "../utils/axiosClient";

// 🔍 Tìm kiếm công việc
export const searchJobs = (params = {}) => {
  return axiosClient
    .get("/public/jobs/search", { params })
    .then((res) => res.data);
};

// 🆕 Lấy danh sách việc làm mới nhất
export const latestJobs = (params = { page: 0, size: 6 }) => {
  return axiosClient
    .get("/public/jobs/latest", { params })
    .then((res) => res.data);
};

// 📄 Lấy chi tiết một công việc
export const getJobDetail = (id) => {
  return axiosClient.get(`/public/jobs/${id}`).then((res) => res.data);
};

export const createJobPosting = async (data) => {
  const res = await axiosClient.post("/jobs/manage", data)
  return res.data
}