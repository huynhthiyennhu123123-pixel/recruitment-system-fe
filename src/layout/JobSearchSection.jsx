import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function JobSearchSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // 🔹 Danh sách loại công việc (enum)
  const jobTypeOptions = [
    { label: "Full-time", value: "FULL_TIME" },
    { label: "Part-time", value: "PART_TIME" },
    { label: "Hợp đồng", value: "CONTRACT" },
    { label: "Thực tập", value: "INTERNSHIP" },
    { label: "Freelance", value: "FREELANCE" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append("keyword", query);
    if (category) params.append("category", category);
    if (location) params.append("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-5xl mx-auto px-6"
    >
      {/* Thẻ container */}
      <div className="bg-white/95 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 text-center relative">
        {/* Tiêu đề */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#006B4E] mb-1">
            TÌM KIẾM VIỆC LÀM
          </h1>
          <p className="italic text-gray-600">
            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
          </p>
        </div>

        {/* Khung input tìm kiếm */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {/* Ô nhập công việc */}
          <input
            type="text"
            placeholder="Tiêu đề công việc, vị trí..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-[230px] rounded-full border border-gray-300 px-5 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00B14F] transition"
          />

          {/* Dropdown ngành nghề */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-gray-300 px-4 py-2.5 text-gray-700 bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#00B14F] transition"
          >
            <option value="">Lọc theo ngành nghề</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Ô nhập địa điểm */}
          <input
            type="text"
            placeholder="Nhập địa điểm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-full border border-gray-300 px-4 py-2.5 text-gray-700 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#00B14F] transition"
          />

          {/* 🔽 Loại công việc */}
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            style={{
              height: "42px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "200px",
              color: "black",
              backgroundColor: "white",
            }}
          >
            <option value="">Loại công việc</option>
            {jobTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 🔍 Nút tìm kiếm */}
          <button
            onClick={handleSearch}
            className="bg-[#006B4E] hover:bg-[#004F38] text-white font-semibold px-8 py-2.5 rounded-full transition-all shadow-md"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Dòng thống kê */}
        <div className="mt-6 text-sm text-gray-600">
          Việc làm hôm nay:{" "}
          <span className="text-[#00B14F] font-semibold">16</span> | Ngày:{" "}
          <span className="font-medium">
            {new Date().toLocaleDateString("vi-VN")}
          </span>{" "}
          | Việc làm đang tuyển:{" "}
          <span className="text-[#00B14F] font-semibold">1.593</span> | Hồ sơ ứng
          viên: <span className="text-[#00B14F] font-semibold">32.248</span>
        </div>
      </div>
    </motion.section>
  );
}
