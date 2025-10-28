import axiosClient from "../utils/axiosClient"
export const getCompanyById = (id) => {
  return axiosClient.get(`/companies/${id}/public`)
}
