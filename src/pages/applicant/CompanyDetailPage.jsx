import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { FaMapMarkerAlt, FaGlobe, FaEnvelope, FaCheckCircle } from "react-icons/fa"
import { getCompanyPublicProfile, getCompanyJobsPublic } from "../../services/companyService"

export default function CompanyDetailPage() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 🔹 Gọi API public profile
        const profileRes = await getCompanyPublicProfile(id)
        setCompany(profileRes?.data?.company || {})

        // 🔹 Gọi API jobs public
        const jobsRes = await getCompanyJobsPublic(id)
        setJobs(jobsRes?.data?.content || [])
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin công ty:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Đang tải thông tin công ty...
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-10 text-gray-600">
        Không tìm thấy thông tin công ty.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* --- Thông tin công ty --- */}
      <div className="bg-white shadow-md rounded-2xl p-8 mb-10">
        <div className="flex items-center gap-6">
          <img
            src={company.logoUrl || "/default-company.png"}
            alt={company.name}
            className="w-24 h-24 rounded-lg object-cover border"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
            <p className="text-gray-600 mt-1">{company.industry || "Chưa cập nhật ngành nghề"}</p>

            {company.isVerified && (
              <span className="text-green-600 flex items-center gap-1 mt-2 text-sm">
                <FaCheckCircle /> Đã xác thực
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-700 mt-6 leading-relaxed">
          {company.description || "Công ty chưa cập nhật mô tả chi tiết."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-gray-700">
          {company.city && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> {company.city}
            </div>
          )}
          {company.website && (
            <div className="flex items-center gap-2">
              <FaGlobe />
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
          {company.contactEmail && (
            <div className="flex items-center gap-2">
              <FaEnvelope /> {company.contactEmail}
            </div>
          )}
        </div>
      </div>

      {/* --- Danh sách việc làm --- */}
      <h2 className="text-2xl font-semibold mb-4">
        Việc làm tại {company.name} ({jobs.length})
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600">Hiện chưa có việc làm nào đang tuyển.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Link
              to={`/applicant/jobs/${job.id}`}
              key={job.id}
              className="block bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
              <p className="text-gray-600 mt-2 line-clamp-2">{job.description}</p>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>
                  <FaMapMarkerAlt className="inline mr-1" />
                  {job.location}
                </span>
                <span>
                  💰 {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}{" "}
                  {job.salaryCurrency}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
