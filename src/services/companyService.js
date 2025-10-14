import axiosClient from "../utils/axiosClient"

// ✅ Lấy chi tiết công ty public (dành cho ứng viên & khách)
export const getCompanyById = (id) => {
  return axiosClient.get(`/companies/${id}/public`)
}
