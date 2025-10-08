import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getJobDetail } from "../../services/jobService"
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa"

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchJob()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchJob = async () => {
    setLoading(true)
    try {
      const res = await getJobDetail(id)
      const data = res?.data?.data
      setJob(data)
    } catch (err) {
      console.error("Get job detail error:", err)
    }
    setLoading(false)
  }

  if (loading) return <p className="p-6 text-gray-500 italic">Đang tải...</p>
  if (!job) return <p className="p-6 text-gray-500 italic">Không tìm thấy công việc</p>

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      {/* Header thông tin việc làm */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-[#00b14f] mb-2">{job.title}</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-gray-700">
            <p className="flex items-center gap-2">
              <FaBuilding className="text-gray-400" /> {job.company?.name || "Công ty ẩn danh"}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" /> {job.location}
            </p>
            <p className="flex items-center gap-2">
              <FaMoneyBillWave className="text-gray-400" />
              {job.salaryMin && job.salaryMax
                ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} VND`
                : "Thỏa thuận"}
            </p>
          </div>

          {/* Nút Ứng tuyển */}
          <Link
            to={`/applicant/jobs/${job.id}/apply`}
            className="mt-4 sm:mt-0 inline-block bg-[#00b14f] hover:bg-green-600 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            Ứng tuyển ngay
          </Link>
        </div>
      </div>

      {/* Mô tả công việc */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FaClipboardList className="text-[#00b14f]" /> Mô tả công việc
        </h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
      </div>

      {/* Yêu cầu */}
      {job.requirements && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaCheckCircle className="text-[#00b14f]" /> Yêu cầu công việc
          </h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</p>
        </div>
      )}

      {/* Thông tin công ty */}
      {job.company && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaBuilding className="text-[#00b14f]" /> Thông tin công ty
          </h2>
          <p className="font-bold text-gray-800 mb-1">{job.company.name}</p>
          {job.company.description && (
            <p className="text-gray-600 mb-2">{job.company.description}</p>
          )}
          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noreferrer"
              className="text-[#00b14f] hover:underline"
            >
              {job.company.website}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
