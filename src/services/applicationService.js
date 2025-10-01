import axiosClient from "../utils/axiosClient";

// Ứng tuyển công việc
export const applyJob = (payload) => {
  return axiosClient.post("/applications/my", payload).then(res => res.data);
};

// Lấy danh sách đơn đã nộp
export const getMyApplications = (params) => {
  return axiosClient.get("/applications/my", { params }).then(res => res.data);
};
