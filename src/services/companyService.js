import axiosClient from "../utils/axiosClient"
export const getCompanyPublicProfile = (id) =>
  axiosClient.get(`/companies/${id}/public`)

export const getCompanyJobsPublic = (id, params = { page: 0, size: 20 }) =>
  axiosClient.get(`/companies/${id}/jobs`, { params })

export const getCompanyById = (id) => {
  return axiosClient.get(`/api/companies/${id}/public`)
}

// (Tuỳ chọn) Lấy danh sách công ty public (nếu sau này cần)
export const getCompanies = (params) => {
  return axiosClient.get("/api/public/companies", { params })
}