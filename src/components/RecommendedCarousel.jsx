import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";

export default function RecommendedCarousel() {
  const [jobs, setJobs] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  const baseUrl = "http://localhost:8081";

  // 🔹 Gọi API gợi ý việc làm
  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${baseUrl}/api/jobs/recommended`, {
          headers,
          params: { limit: 9 },
        });
        setJobs(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi tải việc làm gợi ý:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, [token]);

  // 🔹 Điều hướng trượt
  const nextSlide = () => {
    if (jobs.length > 0) {
      setIndex((prev) => (prev + 3 < jobs.length ? prev + 3 : 0));
    }
  };

  const prevSlide = () => {
    if (jobs.length > 0) {
      setIndex((prev) =>
        prev - 3 >= 0 ? prev - 3 : Math.max(jobs.length - 3, 0)
      );
    }
  };

  // 🔹 Thẻ hiển thị JobCard
  // 🎨 JobCard Pro (dành cho Carousel)
const JobCard = ({ job }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
      className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-[#00b14f]/50 transition-all duration-300 overflow-hidden group w-[330px] flex-shrink-0"
    >
      {/* Logo + Tiêu đề */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={job.company?.logoUrl || "/default-company.png"}
          alt={job.company?.name || "Công ty"}
          className="w-14 h-14 rounded-xl border object-cover bg-gray-50"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#00b14f] transition line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {job.company?.name || job.companyName || "Công ty đang cập nhật"}
          </p>
        </div>
      </div>

      {/* Thông tin việc làm */}
      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-[#00b14f]" />
          <span>{job.location || "Không rõ địa điểm"}</span>
        </div>

        {job.salaryMin && job.salaryMax ? (
          <p className="text-[#00b14f] font-semibold">
            💰 {job.salaryMin.toLocaleString("vi-VN")}₫ –{" "}
            {job.salaryMax.toLocaleString("vi-VN")}₫
          </p>
        ) : (
          <p className="text-gray-500 italic">Mức lương thỏa thuận</p>
        )}

        {job.matchScore && (
          <p className="text-sm text-green-600">🎯 Độ phù hợp: {job.matchScore}%</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5">
        <span className="text-xs text-gray-400">
          Cập nhật:{" "}
          {new Date(job.createdAt || Date.now()).toLocaleDateString("vi-VN")}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-medium text-[#00b14f] hover:text-[#008f3f] flex items-center gap-1"
        >
          Xem chi tiết
        </Link>
      </div>

      {/* Ribbon */}
      <div className="absolute top-0 right-0 bg-[#00b14f] text-white text-xs font-semibold px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow">
        {job.jobType || "Full-time"}
      </div>

      {/* ❤️ Nút lưu việc */}
      <button
        className="absolute top-3 right-3 text-gray-300 hover:text-[#00b14f] transition z-10"
        title="Lưu việc làm"
      >
        <i className="fa-regular fa-heart text-lg"></i>
      </button>

      {/* 🌟 Overlay + nút “Ứng tuyển ngay” */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-[#00b14f]/90 via-[#00b14f]/60 to-transparent flex items-end justify-center p-5"
      >
        <Link
          to={`/jobs/${job.id}`}
          className="bg-white text-[#00b14f] font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-[#00b14f] hover:text-white transition"
        >
          Ứng tuyển ngay
        </Link>
      </motion.div>
    </motion.div>
  );
};
  return (
    <section className="mt-10 relative">
      <h2 className="text-2xl font-bold text-green-600 mb-5 flex items-center gap-2">
        Gợi ý việc làm nổi bật
      </h2>

      {loading ? (
        <p className="text-gray-500 flex items-center">
          <FaSpinner className="animate-spin mr-2" /> Đang tải việc làm gợi ý...
        </p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 italic">Hiện chưa có việc làm gợi ý nào.</p>
      ) : (
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="flex gap-5 transition-transform"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              {jobs.slice(index, index + 3).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Nút điều hướng */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
