import React, { useState } from "react"
import { uploadResume } from "../../../services/documentService"
import { FaFileUpload, FaCheckCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

export default function UploadResumePage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error("Vui lòng chọn tệp PDF trước!")
      return
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Chỉ chấp nhận tệp PDF!")
      return
    }

    setLoading(true)

    // 🔄 Gói promise để toast tự động hiển thị trạng thái
    const uploadPromise = uploadResume(file)
      .then(() => {
        navigate("/applicant/documents")
      })
      .catch((err) => {
        console.error("Upload error:", err)
        throw err
      })

    toast.promise(uploadPromise, {
      loading: "Đang tải CV lên...",
      success: "Upload CV thành công!",
      error: "Upload thất bại, vui lòng thử lại!",
    })

    uploadPromise.finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-[#00b14f] mb-4 flex items-center gap-2">
          <FaFileUpload /> Upload CV (PDF)
        </h1>

        <p className="text-gray-600 mb-6">
          Vui lòng chọn file <strong>PDF</strong> chứa CV của bạn để tải lên hệ thống.
        </p>

        <form onSubmit={handleUpload} className="space-y-5">
          {/* Input chọn file */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-[#00b14f]"
          />

          {/* Hiển thị tên file nếu đã chọn */}
          {file && (
            <p className="text-sm text-gray-600 mt-1">
              📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}

          {/* Nút upload */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00b14f] hover:bg-green-600"
            }`}
          >
            <FaCheckCircle />
            {loading ? "Đang tải..." : "Tải lên CV"}
          </button>
        </form>
      </div>
    </div>
  )
}
