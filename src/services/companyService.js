import axiosClient from "../utils/axiosClient"
export const getCompanyPublicProfile = (id) =>
  axiosClient.get(`/companies/${id}/public`)

export const getCompanyJobsPublic = (id, params = { page: 0, size: 20 }) =>
  axiosClient.get(`/companies/${id}/jobs`, { params })
