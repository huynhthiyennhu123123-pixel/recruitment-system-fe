import axiosClient from "../utils/axiosClient"


// ✅ Lấy chi tiết công ty qua API thật
export const getCompanyById = (id) => {
  return axiosClient.get(`/api/companies/${id}/public`)
}

