import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import JobCard from "./job/JobCard"; 

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

  // 🔹 Điều hướng slide
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
        <p className="text-gray-500 italic">
          Hiện chưa có việc làm gợi ý nào.
        </p>
      ) : (
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="flex gap-6 transition-transform"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              {jobs.slice(index, index + 3).map((job) => (
                <div key={job.id} className="flex-shrink-0 w-[330px]">
                  <JobCard job={job} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Nút điều hướng */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
