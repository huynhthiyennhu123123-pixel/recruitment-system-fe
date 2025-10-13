import axios from "axios"

const API_URL = "http://localhost:8081/api/interviews"
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  "Content-Type": "application/json"
})

// === GET ===
export const getMyInterviews = async (params = {}) => {
  const res = await axios.get(`${API_URL}/my`, { params, headers: headers() })
  return res.data.data
}

// === POST ===
export const createInterview = async (data) => {
  const res = await axios.post(`${API_URL}/schedule`, data, { headers: headers() })
  return res.data
}

// === PATCH ===
export const rescheduleInterview = async (id, data) => {
  const res = await axios.patch(`${API_URL}/${id}/reschedule`, data, { headers: headers() })
  return res.data
}

export const completeInterview = async (id, notes) => {
  const res = await axios.patch(`${API_URL}/${id}/complete`, { notes }, { headers: headers() })
  return res.data
}

export const cancelInterview = async (id, reason) => {
  const res = await axios.patch(`${API_URL}/${id}/cancel`, { reason }, { headers: headers() })
  return res.data
}

// === Participants ===
export const addParticipants = async (id, userIds, role) => {
  const res = await axios.post(`${API_URL}/${id}/participants`, { userIds, role }, { headers: headers() })
  return res.data
}

export const removeParticipants = async (id, userIds, role) => {
  const res = await axios.delete(`${API_URL}/${id}/participants`, {
    data: { userIds, role },
    headers: headers()
  })
  return res.data
}
