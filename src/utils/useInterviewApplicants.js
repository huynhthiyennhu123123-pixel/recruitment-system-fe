// src/hooks/useInterviewApplicants.js
import { useEffect, useState } from "react"
import { getManagedApplications, getApplicationById } from "../services/employerService"

/**
 * Hook lấy danh sách ứng viên của một buổi phỏng vấn
 * @param {Object} interview - object buổi phỏng vấn (có applicationId)
 * @returns {Object} { applicants, loading, error }
 */
export const useInterviewApplicants = (interview) => {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!interview?.applicationId) return
      setLoading(true)
      try {
        // 1️⃣ Lấy application để biết jobPostingId
        const appRes = await getApplicationById(interview.applicationId)
        const jobPostingId = appRes?.data?.jobPosting?.id
        const mainApplicant = appRes?.data?.applicant

        if (!jobPostingId) {
          console.warn("⚠️ Không tìm thấy jobPostingId")
          if (mainApplicant) setApplicants([mainApplicant])
          return
        }

        // 2️⃣ Lấy toàn bộ ứng viên cùng công việc và trạng thái INTERVIEW
        const appsRes = await getManagedApplications(0, 100, "INTERVIEW", jobPostingId)
        const list =
          appsRes?.data?.content?.map((a) => ({
            id: a.applicant?.id,
            name: a.applicant?.fullName,
            email: a.applicant?.email,
            jobTitle: a.jobPosting?.title,
          })) || []

        setApplicants(list)
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách ứng viên:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [interview])

  return { applicants, loading, error }
}
