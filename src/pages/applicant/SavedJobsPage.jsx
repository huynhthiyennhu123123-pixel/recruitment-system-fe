import React, { useEffect, useState } from "react";
import { getSavedJobs, unsaveJob } from "../../services/savedJobService";
import { Link } from "react-router-dom";
import { FaTrash, FaSpinner, FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await getSavedJobs();
      const data = res?.data?.data || res?.data || [];
      setJobs(data);
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
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#00b14f] mb-6">
          Công việc đã lưu
        </h1>

        {jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <FaHeart className="text-5xl text-gray-300 mx-auto mb-4" />
            <p>Bạn chưa lưu công việc nào.</p>
            <Link
              to="/jobs"
              className="inline-block mt-4 text-[#00b14f] hover:underline font-medium"
            >
              → Xem danh sách việc làm
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <Link
                    to={`/applicant/jobs/${job.id}`}
                    className="text-lg font-semibold text-[#00b14f] hover:underline"
                  >
                    {job.title}
                  </Link>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <span className="font-medium">{job.company?.name}</span>
                    <span>•</span>
                    <span>{job.location || "Không rõ địa điểm"}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleUnsave(job.id)}
                  disabled={removing === job.id}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
                >
                  <FaTrash />
                  <span className="hidden sm:inline">
                    {removing === job.id ? "Đang xoá..." : "Bỏ lưu"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
