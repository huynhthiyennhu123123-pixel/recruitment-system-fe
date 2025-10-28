import axiosClient from "../utils/axiosClient";
export const searchJobs = (params = {}) => {
  return axiosClient
    .get("/public/jobs/search", { params })
    .then((res) => res.data);
};
export const latestJobs = (params = { page: 0, size: 6 }) => {
  return axiosClient
    .get("/public/jobs/latest", { params })
    .then((res) => res.data);
};
export const getJobDetail = (id) => {
  return axiosClient.get(`/public/jobs/${id}`).then((res) => res.data);
};
export const createJobPosting = async (data) => {
  const res = await axiosClient.post("/jobs/manage", data)
  return res.data
}
export const getPublicJobs = (params) => {
  return axiosClient.get("/api/public/jobs/search", { params })
}