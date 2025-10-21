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
import { motion } from "framer-motion";

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
      .then(() => fetchDocs())
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
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Đang tải tài liệu...
      </p>
    );

  const typeLabel = {
    RESUME: "CV",
    COVER_LETTER: "Thư xin việc",
    PORTFOLIO: "Hồ sơ năng lực",
    CERTIFICATE: "Chứng chỉ",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaFileAlt className="text-green-500" /> Tài liệu của tôi
          </h2>
          <div className="flex gap-3">
            <Link
              to="/applicant/documents/upload"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              <FaPlus /> Tải lên tài liệu
            </Link>
            <Link
              to="/applicant/documents/resume"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              <FaFileUpload /> Upload CV (PDF)
            </Link>
          </div>
        </div>

        {/* Danh sách tài liệu */}
        {Object.keys(docs).length === 0 && (
          <p className="text-gray-500 text-center italic mt-10">
            Chưa có tài liệu nào. Hãy tải lên để hoàn thiện hồ sơ của bạn!
          </p>
        )}

        {Object.keys(docs).map((type) => (
          <div key={type} className="mb-10">
            <h3 className="text-lg font-semibold mb-4 uppercase text-gray-700">
              {typeLabel[type] || type}
            </h3>

            {docs[type]?.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs[type].map((file) => (
                  <motion.div
                    key={file.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FaFileAlt className="text-green-500 text-2xl" />
                      <div>
                        <p className="font-semibold text-gray-800 truncate">
                          {file.filename}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {(file.size / 1024).toFixed(1)} KB •{" "}
                          {new Date(file.uploadedAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <a
                        href={`http://localhost:8081${file.downloadUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition"
                        title="Tải xuống"
                      >
                        <FaDownload /> Tải xuống
                      </a>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Chưa có tài liệu{" "}
                {typeLabel[type]?.toLowerCase() || type.toLowerCase()} nào.
              </p>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
