import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { applyJob } from "../../services/applicationService"
import { getProfile } from "../../services/applicantService"
import { FaFileAlt, FaPaperPlane, FaRegSmile } from "react-icons/fa"

export default function ApplyJobPage() {
  const { id } = useParams() // jobPostingId
  const navigate = useNavigate()

  const [form, setForm] = useState({
    coverLetter: "",
    resumeUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  // lấy CV mặc định từ profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        const profileData = res.data?.data || res.data
        setProfile(profileData)

        if (profileData?.resumeUrl) {
          setForm((prev) => ({ ...prev, resumeUrl: profileData.resumeUrl }))
        }
      } catch (err) {
        console.error("Get profile error:", err)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.resumeUrl) {
      alert("⚠️ Bạn cần upload CV trong hồ sơ trước khi nộp đơn!")
      navigate("/applicant/profile")
      return
    }

    setLoading(true)
    try {
      const payload = {
        jobPostingId: Number(id),
        coverLetter: form.coverLetter,
        resumeUrl: form.resumeUrl,
      }

      const res = await applyJob(payload)
      if (res.success) {
        alert(res.message || "✅ Nộp đơn thành công!")
        navigate("/applicant/applications")
      } else {
        alert(res.message || "❌ Có lỗi xảy ra khi nộp đơn")
      }
    } catch (err) {
      console.error("Apply job error:", err.response?.data || err.message)
      alert("❌ Nộp đơn thất bại")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        {/* Tiêu đề */}
        <div className="flex items-center gap-3 mb-6">
          <FaFileAlt className="text-[#00b14f] text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">
            Ứng tuyển công việc #{id}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Thư xin việc
            </label>
            <textarea
              name="coverLetter"
              placeholder="Giới thiệu bản thân, kinh nghiệm và lý do bạn phù hợp..."
              value={form.coverLetter}
              onChange={handleChange}
              rows={6}
              className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg w-full p-3 text-gray-700 outline-none transition"
              required
            />
          </div>

          {profile?.resumeUrl && (
            <p className="text-sm text-gray-600">
              <FaRegSmile className="inline text-[#00b14f] mr-1" />
              CV mặc định:{" "}
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#00b14f] hover:underline font-medium"
              >
                Xem CV đã lưu
              </a>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00b14f] hover:bg-green-600"
            }`}
          >
            <FaPaperPlane />
            {loading ? "Đang nộp..." : "Nộp đơn ngay"}
          </button>
        </form>
      </div>
    </div>
  )
}
