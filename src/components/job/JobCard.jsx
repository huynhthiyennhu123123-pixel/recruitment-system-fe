import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaArrowRight,
  FaRegHeart,
} from "react-icons/fa";
import "../../styles/HomePage.css"; // ✅ dùng lại style của trang chủ

export default function JobCard({ job }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="job-card relative rounded-2xl p-6 shadow-sm bg-white overflow-hidden group"
    >
      {/* ❤️ Nút lưu việc */}
      <button className="job-save-btn" title="Lưu việc làm">
        <FaRegHeart />
      </button>

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
