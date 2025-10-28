import axiosClient from "../utils/axiosClient";
export const getMyDocuments = () => axiosClient.get("/profiles/my/documents");
export const deleteDocument = (id) => axiosClient.delete(`/profiles/my/documents/${id}`);
export const uploadDocument = (file, documentType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);
  return axiosClient.post("/profiles/my/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post("/profiles/my/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
