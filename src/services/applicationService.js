import axiosClient from "../utils/axiosClient";
export const applyJob = (payload) => {
  return axiosClient.post("/applications/my", payload).then((res) => res.data);
};
export const getMyApplications = (params) => {
  return axiosClient.get("/applications/my", { params }).then((res) => res.data);
};
export const getApplicationById = (id) => {
  return axiosClient.get(`/applications/${id}`).then((res) => res.data);
};
export const withdrawApplication = (applicationId) => {
  return axiosClient
    .post(`/applications/my/${applicationId}/withdraw`)
    .then((res) => res.data);
};
