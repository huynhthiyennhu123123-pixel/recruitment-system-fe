// src/utils/useInterviewApplicants.js
import { useState, useEffect } from "react"
import {
  getInterviewParticipants,
  getInterviewById,
} from "../services/interviewService"
import { getManagedApplications } from "../services/employerService"
import { toast } from "react-toastify"

export const useInterviewApplicants = (interview) => {
  const [participants, setParticipants] = useState([])
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!interview?.id) return
    setLoading(true)

    const fetchData = async () => {
      try {
        // 🧩 1️⃣ Lấy chi tiết phỏng vấn
        const intvRes = await getInterviewById(interview.id)
        const intvData = intvRes?.data?.data
        const applicationId = intvData?.applicationId
        if (!applicationId) {
          console.warn("⚠️ Không tìm thấy applicationId trong buổi phỏng vấn.")
          setApplicants([])
          setLoading(false)
          return
        }

        // 🧩 2️⃣ Lấy danh sách người tham gia (userId, role)
        const res = await getInterviewParticipants(interview.id)
        const participantList = res?.data?.data || []

        // 🧩 3️⃣ Lấy toàn bộ ứng viên employer quản lý
        const appsRes = await getManagedApplications(0, 100)
        const allApps =
          appsRes?.data?.data?.content ||
          appsRes?.data?.content ||
          []

        // 🔍 Tìm jobPostingId của buổi phỏng vấn hiện tại
        const currentApp = allApps.find((a) => a.id === applicationId)
        const jobPostingId = currentApp?.jobPosting?.id

        if (!jobPostingId) {
          console.warn("⚠️ Không tìm thấy jobPostingId từ application.")
          setApplicants([])
          setLoading(false)
          return
        }

        // 🧩 4️⃣ Ghép thông tin ứng viên vào participants
        const formattedParticipants = participantList.map((p) => {
          const matchApp = allApps.find((a) => a.applicant?.id === p.userId)
          return {
            id: p.userId,
            name: matchApp?.applicant?.fullName || `Ứng viên #${p.userId}`,
            email: matchApp?.applicant?.email || "Không có email",
            jobTitle: matchApp?.jobPosting?.title || "Chưa xác định",
            role: p.role,
          }
        })
        setParticipants(formattedParticipants)

        // 🧩 5️⃣ Lọc ra ứng viên cùng job mà chưa được thêm vào participants
        const filtered = allApps.filter(
          (a) =>
            a.jobPosting?.id === jobPostingId &&
            a.status === "INTERVIEW" &&
            !participantList.some((p) => p.userId === a.applicant?.id)
        )

        const formattedApplicants = filtered.map((a) => ({
          id: a.applicant?.id,
          applicantName: a.applicant?.fullName,
          applicantEmail: a.applicant?.email,
          jobTitle: a.jobPosting?.title,
        }))
        setApplicants(formattedApplicants)
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu người tham gia:", err)
        toast.error("Không thể tải danh sách ứng viên.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [interview])

  return { participants, applicants, setParticipants, setApplicants, loading }
}
