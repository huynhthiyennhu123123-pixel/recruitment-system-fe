import React, { useEffect, useState } from "react";
import {
  getMyDocuments,
  deleteDocument,
} from "../../../services/documentService";
import { getProfile } from "../../../services/applicantService";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaDownload,
  FaFileAlt,
  FaPlus,
  FaFileUpload,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentListPage() {
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const [docsRes, profileRes] = await Promise.all([
        getMyDocuments(),
        getProfile(),
      ]);

      const docsData = docsRes?.data?.data || {};
      const profile = profileRes?.data?.data || profileRes?.data || {};
      if (profile.resumeUrl) {
        const profileResume = {
          id: "profile-resume",
          filename: "CV chính",
          size: 0,
          uploadedAt: profile.updatedAt || new Date().toISOString(),
          downloadUrl: profile.resumeUrl,
        };

        docsData.RESUME = docsData.RESUME
          ? [profileResume, ...docsData.RESUME]
          : [profileResume];
      }

      setDocs(docsData);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tài liệu:", err);
      toast.error("Không thể tải danh sách tài liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (selectedId === "profile-resume") {
      toast.warning("CV chính không thể xóa — hãy upload CV mới để thay thế.");
      setShowConfirm(false);
      return;
    }

    setDeleting(true);
    try {
      await deleteDocument(selectedId);
      toast.success("Xóa tài liệu thành công!");
      await fetchDocs();
    } catch (err) {
      console.error("Lỗi khi xóa tài liệu:", err);
      toast.error("Không thể xóa tài liệu.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setSelectedId(null);
    }
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
                      <FaFileAlt
                        className={`${
                          file.id === "profile-resume"
                            ? "text-blue-500"
                            : "text-green-500"
                        } text-2xl`}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 truncate">
                          {file.filename}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {file.size > 0
                            ? `${(file.size / 1024).toFixed(1)} KB • `
                            : ""}
                          {new Date(file.uploadedAt).toLocaleString("vi-VN")}
                        </p>
                        {file.id === "profile-resume" && (
                          <p className="text-xs text-gray-400 italic mt-1">
                            (Đây là CV chính — có thể thay thế bằng cách upload mới.)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <a
                        href={
                          file.downloadUrl?.startsWith("http")
                            ? file.downloadUrl
                            : `http://localhost:8081${file.downloadUrl}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition"
                        title="Tải xuống"
                      >
                        <FaDownload /> Tải xuống
                      </a>

                      {file.id !== "profile-resume" && (
                        <button
                          onClick={() => {
                            setSelectedId(file.id);
                            setShowConfirm(true);
                          }}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      )}
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

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-80 text-center shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-3" />
              <h2 className="text-lg font-semibold mb-2">
                Xác nhận xóa tài liệu?
              </h2>
              <p className="text-gray-600 text-sm mb-5">
                Hành động này không thể hoàn tác. Tài liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 ${
                    deleting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deleting && <FaSpinner className="animate-spin" />}
                  {deleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
