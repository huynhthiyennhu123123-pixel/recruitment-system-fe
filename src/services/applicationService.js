import axiosClient from "../utils/axiosClient";

// Ứng tuyển công việc
export const applyJob = (payload) => {
  return axiosClient.post("/applications/my", payload).then((res) => res.data);
};

// Lấy danh sách đơn đã nộp
export const getMyApplications = (params) => {
  return axiosClient.get("/applications/my", { params }).then((res) => res.data);
};

// Lấy chi tiết đơn theo ID (nếu backend hỗ trợ)
export const getApplicationById = (id) => {
  return axiosClient.get(`/applications/${id}`).then((res) => res.data);
};

// Rút đơn ứng tuyển (chuẩn theo backend của bạn)
export const withdrawApplication = (applicationId) => {
  return axiosClient
    .post(`/applications/my/${applicationId}/withdraw`)
    .then((res) => res.data);
};
