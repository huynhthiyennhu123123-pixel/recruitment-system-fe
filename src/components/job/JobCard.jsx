import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaArrowRight,
  FaRegHeart,
  FaHeart,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { saveJob, unsaveJob, getJobDetailWithSave } from "../../services/savedJobService";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/HomePage.css"; // ✅ dùng lại style của trang chủ

export default function JobCard({ job }) {
  const [hovered, setHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [saving, setSaving] = useState(false);

  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  // ✅ Kiểm tra trạng thái job đã lưu hay chưa
  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!token) return;
      try {
        const res = await getJobDetailWithSave(job.id);
        const data = res?.data?.data || res?.data;
        if (typeof data?.isSaved === "boolean") setIsSaved(data.isSaved);
      } catch (err) {
        console.warn("Không kiểm tra được trạng thái lưu:", err);
      }
    };
    fetchSavedStatus();
  }, [job.id, token]);

  // ✅ Click lưu / bỏ lưu
  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.warning("Vui lòng đăng nhập để lưu việc làm!");
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(job.id);
        setIsSaved(false);
        toast.info("Đã bỏ lưu việc làm");
      } else {
        await saveJob(job.id);
        setIsSaved(true);
        toast.success("Đã lưu việc làm thành công");
      }
    } catch (err) {
      console.error("Lỗi khi lưu việc làm:", err);
      toast.error("Không thể lưu việc làm!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="job-card relative rounded-2xl p-6 shadow-sm bg-white overflow-hidden group"
    >
      {/* ❤️ Nút lưu việc làm */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={toggleSave}
        disabled={saving}
        className={`absolute top-4 right-4 text-xl z-20 transition-all duration-200 ${
          isSaved
            ? "text-red-500 hover:text-red-400"
            : "text-gray-400 hover:text-[#00b14f]"
        }`}
        title={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
      >
        {saving ? (
          <FaSpinner className="animate-spin text-gray-400" />
        ) : isSaved ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )}
      </motion.button>

      {/* Logo + Tiêu đề */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={job.company?.logoUrl || "/default-company.png"}
          alt={job.company?.name || "Công ty"}
          className="job-logo"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#00b14f] transition line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {job.company?.name || "Công ty chưa xác định"}
          </p>
        </div>
      </div>

      {/* Thông tin việc làm */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-[#00b14f]" />
          <span>{job.location || "Không rõ địa điểm"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaBriefcase className="text-[#00b14f]" />
          <span>{job.jobType || "Full-time"}</span>
        </div>
        {job.salaryMin && job.salaryMax ? (
          <p className="text-[#00b14f] font-semibold">
            💰 {job.salaryMin.toLocaleString("vi-VN")}₫ –{" "}
            {job.salaryMax.toLocaleString("vi-VN")}₫
          </p>
        ) : (
          <p className="text-gray-500 italic">Mức lương thỏa thuận</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
        <span>
          Cập nhật:{" "}
          {new Date(job.createdAt || Date.now()).toLocaleDateString("vi-VN")}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-medium text-[#00b14f] hover:text-[#008f3f] flex items-center gap-1"
        >
          Xem chi tiết <FaArrowRight size={12} />
        </Link>
      </div>

      {/* 🌿 Overlay xanh + nút “Ứng tuyển ngay” */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="job-overlay"
      >
        <Link to={`/jobs/${job.id}`} className="job-apply-btn">
          Ứng tuyển ngay
        </Link>
      </motion.div>
    </motion.div>
  );
}
