import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getMyApplications,
  withdrawApplication,
} from "../../services/applicationService"
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaClipboardCheck,
  FaSpinner,
} from "react-icons/fa"

const ApplicationDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getMyApplications({
        page: 0,
        size: 50,
        sortBy: "createdAt",
        sortDir: "DESC",
      })
      const list = res?.data?.content || []
      const found = list.find((a) => String(a.id) === String(id))
      setApplication(found || null)
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!window.confirm("Bạn có chắc muốn rút đơn này không?")) return
    setWithdrawing(true)
    try {
      await withdrawApplication(id)
      alert("Rút đơn thành công!")
      navigate("/applicant/applications")
    } catch (err) {
      console.error("Rút đơn thất bại:", err)
      alert("Rút đơn thất bại!")
    } finally {
      setWithdrawing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải...
      </div>
    )

  if (!application)
    return (
      <div className="text-center py-10 text-gray-600">
        Không tìm thấy đơn ứng tuyển.
      </div>
    )

  const job = application.jobPosting

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#00b14f] transition"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>

        {/* Thông tin đơn */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#00b14f] mb-1">
                {job?.title || "Công việc"}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-gray-400" />
                {job?.location || "Không rõ địa điểm"}
              </p>
            </div>

            {application.status !== "WITHDRAWN" && application.status !== "CANCELLED" && (
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className={`mt-4 sm:mt-0 px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition ${withdrawing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                {withdrawing && <FaSpinner className="animate-spin" />}
                {withdrawing ? "Đang rút..." : "Rút đơn"}
              </button>
            )}

          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="flex items-center gap-2">
              <FaClipboardCheck className="text-[#00b14f]" />
              <strong>Trạng thái:</strong>{" "}
              <span className="font-medium">{application.status}</span>
            </p>

            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#00b14f]" />
              <strong>Ngày ứng tuyển:</strong>{" "}
              {new Date(application.createdAt).toLocaleString("vi-VN")}
            </p>

            {application.coverLetter && (
              <div>
                <p className="flex items-center gap-2 mb-1">
                  <FaFileAlt className="text-[#00b14f]" />
                  <strong>Thư xin việc:</strong>
                </p>
                <p className="pl-6 text-gray-700">{application.coverLetter}</p>
              </div>
            )}

            {application.resumeUrl && (
              <p className="flex items-center gap-2">
                <FaFileAlt className="text-[#00b14f]" />
                <strong>CV:</strong>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00b14f] hover:underline font-medium"
                >
                  Xem CV
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailPage
