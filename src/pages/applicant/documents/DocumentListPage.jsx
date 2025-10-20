import React, { useEffect, useState } from "react";
import {
  getMyDocuments,
  deleteDocument,
} from "../../../services/documentService";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaDownload,
  FaFileAlt,
  FaPlus,
  FaFileUpload,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function DocumentListPage() {
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await getMyDocuments();
      setDocs(res?.data?.data || {});
    } catch (err) {
      console.error("Lỗi khi tải danh sách tài liệu:", err);
      toast.error("Không thể tải danh sách tài liệu.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

    const deletePromise = deleteDocument(id)
      .then(() => {
        fetchDocs();
      })
      .catch((err) => {
        console.error("Lỗi khi xóa tài liệu:", err);
        throw err;
      });

    toast.promise(deletePromise, {
      loading: "Đang xóa tài liệu...",
      success: "Xóa tài liệu thành công!",
      error: "Không thể xóa tài liệu.",
    });
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Đang tải tài liệu...</p>
    );

  // Ánh xạ tên loại tài liệu sang tiếng Việt
  const typeLabel = {
    RESUME: "CV",
    COVER_LETTER: "Thư xin việc",
    PORTFOLIO: "Hồ sơ năng lực",
    CERTIFICATE: "Chứng chỉ",
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#00b14f]">Tài liệu của tôi</h2>
        <div className="flex gap-3">
          <Link
            to="/applicant/documents/upload"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FaPlus /> Tải lên tài liệu
          </Link>
          <Link
            to="/applicant/documents/resume"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaFileUpload /> Upload CV (PDF)
          </Link>
        </div>
      </div>

      {/* Danh sách tài liệu */}
      {Object.keys(docs).map((type) => (
        <div key={type} className="mb-8">
          <h3 className="text-lg font-semibold mb-3 uppercase">
            {typeLabel[type] || type}
          </h3>

          {docs[type]?.length ? (
            docs[type].map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between border p-3 rounded-lg mb-2 shadow-sm hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-[#00b14f] text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">{file.filename}</p>
                    <p className="text-gray-500 text-sm">
                      {(file.size / 1024).toFixed(1)} KB —{" "}
                      {new Date(file.uploadedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`http://localhost:8081${file.downloadUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="Tải xuống"
                  >
                    <FaDownload />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">
              Chưa có tài liệu{" "}
              {typeLabel[type]?.toLowerCase() || type.toLowerCase()} nào.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
