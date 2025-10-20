import React, { useState } from "react";
import { uploadDocument } from "../../../services/documentService";
import { useNavigate } from "react-router-dom";
import { FaFileUpload } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function UploadDocumentPage() {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("RESUME");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Vui lòng chọn tệp.");
      return;
    }

    const allowed = ["pdf", "doc", "docx"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error("Chỉ hỗ trợ tệp PDF, DOC hoặc DOCX.");
      return;
    }

    setLoading(true);

    const uploadPromise = uploadDocument(file, documentType)
      .then(() => {
        navigate("/applicant/documents");
      })
      .catch((err) => {
        console.error("Upload error:", err);
        throw err;
      });

    toast.promise(uploadPromise, {
      loading: "Đang tải lên...",
      success: "Tải lên thành công!",
      error: "Tải lên thất bại, vui lòng thử lại.",
    });

    uploadPromise.finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-[#00b14f] mb-4 flex items-center gap-2">
          <FaFileUpload /> Tải lên tài liệu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Chọn loại tài liệu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại tài liệu
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-[#00b14f]"
            >
              <option value="RESUME">CV</option>
              <option value="COVER_LETTER">Thư xin việc</option>
              <option value="PORTFOLIO">Portfolio</option>
              <option value="CERTIFICATE">Chứng chỉ</option>
            </select>
          </div>

          {/* Chọn file */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn file
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
              className="border border-gray-300 rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-[#00b14f]"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Nút tải lên */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00b14f] hover:bg-green-600"
            }`}
          >
            <FaFileUpload />
            {loading ? "Đang tải..." : "Tải lên"}
          </button>
        </form>
      </div>
    </div>
  );
}
