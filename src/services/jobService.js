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
  const res = await axiosClient.post("/jobs/manage", data);
  return res.data;
};
export const getPublicJobs = (params) => {
  return axiosClient.get("/api/public/jobs/search", { params });
};

//  ADMIN

export const getManagedJobs = (params = {}) => {
  return axiosClient.get("/jobs/manage", { params }).then((res) => res.data);
};

export const deleteJobPosting = async (id, hard = false) => {
  const res = await axiosClient.delete(`/jobs/manage/${id}`, {
    params: { hard },
  });
  return res.data;
};

export const updateJobStatus = async (id, status) => {
  const res = await axiosClient.patch(`/jobs/manage/${id}/status`, { status });
  return res.data;
};

export const updateJobPosting = async (id, data) => {
  const res = await axiosClient.put(`/jobs/manage/${id}`, data);
  return res.data;
};
