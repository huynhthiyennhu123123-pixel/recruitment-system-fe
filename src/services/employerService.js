const API_URL = "http://localhost:8081/api"

// Helper để thêm token vào header
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  "Content-Type": "application/json",
})

/* ======================
 * QUẢN LÝ TIN TUYỂN DỤNG
 * ====================== */
export async function getMyJobs(page = 0, size = 10, sortBy = "createdAt", sortDir = "DESC") {
  const res = await fetch(
    `${API_URL}/jobs/manage?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
    { headers: getAuthHeaders() }
  )
  return res.json()
}

export async function getPublicJobById(id) {
  const res = await fetch(`${API_URL}/public/jobs/${id}`, {
    headers: { "Content-Type": "application/json" },
  })
  return res.json()
}




export async function createJob(data) {
  const res = await fetch(`${API_URL}/jobs/manage`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateJob(id, data) {
  const res = await fetch(`${API_URL}/jobs/manage/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/jobs/manage/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  return res.json()
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${API_URL}/jobs/manage/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }), // ✅ gửi trong body JSON
  })
  return res.json()
}


/* ======================
 * HỒ SƠ CÔNG TY
 * ====================== */
export async function getCompanyProfile() {
  const res = await fetch(`${API_URL}/companies/my`, { headers: getAuthHeaders() })
  return res.json()
}

export async function updateCompanyProfile(data) {
  const res = await fetch(`${API_URL}/companies/my`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

/* ======================
 * ỨNG VIÊN & PHỎNG VẤN
 * ====================== */
export async function getApplicants() {
  const res = await fetch(`${API_URL}/applications/my-company`, {
    headers: getAuthHeaders(),
  })
  return res.json()
}

export async function getInterviews() {
  const res = await fetch(`${API_URL}/interviews/my`, { headers: getAuthHeaders() })
  return res.json()
}
