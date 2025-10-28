import axiosClient from "../utils/axiosClient";
export const saveJob = (jobId) => {
  return axiosClient.post(`/jobs/${jobId}/save`);
};
export const unsaveJob = (jobId) => {
  return axiosClient.delete(`/jobs/${jobId}/unsave`);
};
export const getSavedJobs = () => {
  return axiosClient.get("/jobs/saved");
};
export const getJobDetailWithSave = (jobId) => {
  return axiosClient.get(`/jobs/${jobId}/me`);
};
