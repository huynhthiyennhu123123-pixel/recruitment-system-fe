import axiosClient from "../utils/axiosClient";
export const getProfile = () => axiosClient.get("/profiles/my");
export const updateProfile = (data) => axiosClient.put("/profiles/my", data);
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post("/profiles/my/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getMyInterviews = (params) => {
  return axiosClient.get("/interviews/my", { params });
};
