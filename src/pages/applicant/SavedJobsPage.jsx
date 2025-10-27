import React, { useEffect, useState } from "react";
import { getSavedJobs, unsaveJob } from "../../services/savedJobService";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaSpinner,
  FaHeart,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await getSavedJobs();
      const content = res?.data?.data?.content || [];
      const normalized = Array.isArray(content) ? content : [];
      setJobs(normalized);
    } catch (err) {
      console.error("Lỗi tải job đã lưu:", err);
      toast.error("Không tải được danh sách công việc đã lưu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    setRemoving(jobId);
    try {
      await unsaveJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.info("Đã bỏ lưu công việc");
    } catch (err) {
      console.error("Lỗi khi bỏ lưu:", err);
      toast.error("Không thể bỏ lưu công việc!");
    } finally {
      setRemoving(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải danh sách công việc đã lưu...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <FaHeart className="text-[#00b14f]" />
          Công việc đã lưu
        </h1>

        {jobs.length === 0 ? (
          <div className="text-center bg-white border border-gray-200 shadow-sm rounded-2xl py-20 px-6">
            <FaHeart className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Bạn chưa lưu công việc nào.</p>
            <Link
              to="/jobs"
              className="inline-block mt-3 text-[#00b14f] hover:underline font-semibold"
            >
              → Xem danh sách việc làm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-lg font-semibold text-[#00b14f] hover:underline"
                  >
                    {job.title}
                  </Link>
                  <p className="text-gray-600 flex items-center gap-2 text-sm mt-2">
                    <FaBuilding className="text-gray-400" />
                    {job.company?.name || "Công ty ẩn danh"}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 text-sm mt-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    {job.location || "Không rõ địa điểm"}
                  </p>

                  {job.savedAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Lưu lúc:{" "}
                      {new Date(job.savedAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleUnsave(job.id)}
                  disabled={removing === job.id}
                  className={`mt-5 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                    removing === job.id
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-red-100 text-red-500 hover:bg-red-50"
                  }`}
                >
                  {removing === job.id ? (
                    <>
                      <FaSpinner className="animate-spin" /> Đang xoá...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Bỏ lưu
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
