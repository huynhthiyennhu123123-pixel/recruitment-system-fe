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

  const token = localStorage.getItem("token");
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
      setIndex((prev) => (prev - 3 >= 0 ? prev - 3 : Math.max(jobs.length - 3, 0)));
    }
  };

  // 🔹 Thẻ hiển thị JobCard
  const JobCard = ({ job }) => (
    <motion.div
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition w-[330px] flex-shrink-0"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
        {job.title}
      </h3>
      <p className="text-sm text-gray-500 mb-1 font-medium">
        {job.company?.name || job.companyName || "Công ty đang cập nhật"}
      </p>

      <p className="flex items-center gap-1 text-gray-600 text-sm mb-2">
        <FaMapMarkerAlt className="text-[#00b14f]" />
        {job.location || "Không rõ địa điểm"}
      </p>

      {job.salaryMin && job.salaryMax && (
        <p className="text-[#00b14f] font-medium mb-2">
          {job.salaryMin.toLocaleString("vi-VN")}₫ -{" "}
          {job.salaryMax.toLocaleString("vi-VN")}₫
        </p>
      )}

      {job.matchScore && (
        <p className="text-sm text-green-600 mb-2">
          Độ phù hợp: {job.matchScore}%
        </p>
      )}

      <Link
        to={`/jobs/${job.id}`}
        className="inline-block text-sm text-[#00b14f] font-medium hover:underline"
      >
        Xem chi tiết
      </Link>
    </motion.div>
  );

  return (
    <section className="mt-10 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        Gợi ý việc làm nổi bật
      </h2>

      {loading ? (
        <p className="text-gray-500 flex items-center">
          <FaSpinner className="animate-spin mr-2" /> Đang tải việc làm gợi ý...
        </p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 italic">
          Hiện chưa có việc làm gợi ý nào.
        </p>
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
