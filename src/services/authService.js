import axios from "axios"

const API_URL = "http://localhost:8081/api/auth"

export const registerEmployer = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, formData)
    return res.data 
  } catch (err) {
    throw err.response?.data || { message: "Lỗi kết nối server" }
  }
}
