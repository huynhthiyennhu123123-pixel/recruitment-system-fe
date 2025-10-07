import { useEffect, useState } from "react"
import {
  getProfile,
  updateProfile,
  uploadResume,
} from "../../services/applicantService"
import { FaUserCircle, FaFileUpload, FaSave, FaCheckCircle } from "react-icons/fa"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await getProfile()
      const profileData = res.data?.data || res.data
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      setProfile({
        ...profileData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      })
    } catch (err) {
      console.error("Get profile error:", err)
    }
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const {
        dateOfBirth,
        gender,
        address,
        city,
        country,
        summary,
        experience,
        education,
        skills,
        certifications,
        languages,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        desiredSalaryMin,
        desiredSalaryMax,
        desiredJobType,
        desiredLocation,
        availability,
        isPublic,
      } = profile

      await updateProfile({
        dateOfBirth,
        gender,
        address,
        city,
        country,
        summary,
        experience,
        education,
        skills,
        certifications,
        languages,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        desiredSalaryMin,
        desiredSalaryMax,
        desiredJobType,
        desiredLocation,
        availability,
        isPublic,
      })

      alert("✅ Cập nhật thành công!")
      fetchProfile()
    } catch (err) {
      console.error("Update error:", err)
      alert("❌ Cập nhật thất bại")
    }
    setLoading(false)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      alert("⚠️ Chọn file trước khi upload!")
      return
    }
    setLoading(true)
    try {
      await uploadResume(file)
      alert("✅ Upload CV thành công")
      fetchProfile()
    } catch (err) {
      console.error("Upload error:", err)
      alert("❌ Upload CV thất bại")
    }
    setLoading(false)
  }

  if (!profile)
    return (
      <p className="p-6 text-gray-500 italic text-center">
        Đang tải hồ sơ...
      </p>
    )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Thông tin cá nhân */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400">
            {profile.firstName ? (
              <span className="text-[#00b14f] font-bold">
                {profile.firstName[0]}
              </span>
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600">{profile.phoneNumber}</p>
          </div>
        </div>

        {/* Form hồ sơ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-[#00b14f] mb-5">
            Thông tin hồ sơ
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Thành phố */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành phố
              </label>
              <input
                name="city"
                value={profile.city || ""}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Nơi mong muốn làm việc */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nơi mong muốn làm việc
              </label>
              <input
                name="desiredLocation"
                value={profile.desiredLocation || ""}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Giới thiệu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới thiệu bản thân
              </label>
              <textarea
                name="summary"
                value={profile.summary || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Kỹ năng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kỹ năng
              </label>
              <textarea
                name="skills"
                value={profile.skills || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Kinh nghiệm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kinh nghiệm làm việc
              </label>
              <textarea
                name="experience"
                value={profile.experience || ""}
                onChange={handleChange}
                rows={4}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Học vấn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Học vấn
              </label>
              <textarea
                name="education"
                value={profile.education || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Nút lưu */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#00b14f] hover:bg-green-600"
              }`}
            >
              <FaSave />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>

        {/* CV Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#00b14f] mb-3 flex items-center gap-2">
            <FaFileUpload /> CV của tôi
          </h2>
          {profile.resumeUrl ? (
            <p className="text-gray-700 mb-2">
              <FaCheckCircle className="inline text-[#00b14f] mr-1" />
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00b14f] hover:underline font-medium"
              >
                Xem CV hiện tại
              </a>
            </p>
          ) : (
            <p className="text-gray-500 mb-2">Chưa có CV được tải lên</p>
          )}

          <form
            onSubmit={handleUpload}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-gray-300 rounded-lg p-2 w-full sm:flex-1 focus:ring-2 focus:ring-[#00b14f] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition w-full sm:w-auto ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#00b14f] hover:bg-green-600"
              }`}
            >
              <FaFileUpload />
              {loading ? "Đang upload..." : "Upload CV"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
