import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchJobs } from "../../services/jobService";
import { FaSpinner } from "react-icons/fa";
import JobCard from "../../components/job/JobCard";
import { motion } from "framer-motion";

export default function JobListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(Number(queryParams.get("page")) || 0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: queryParams.get("keyword") || "",
    location: queryParams.get("location") || "",
    jobType: queryParams.get("jobType") || "",
    salaryMin: queryParams.get("salaryMin") || "",
    salaryMax: queryParams.get("salaryMax") || "",
  });

  // 🧠 Gợi ý tĩnh (local)
  const popularKeywords = [
    "Frontend Developer",
    "Backend Developer",
    "ReactJS",
    "Java Developer",
    "UI/UX Designer",
    "Data Analyst",
    "Project Manager",
    "Tester / QA",
    "DevOps Engineer",
  ];
  const popularLocations = [
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Huế",
  ];

  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const keywordRef = useRef(null);
  const locationRef = useRef(null);

  // 📦 Lấy việc làm
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: filters.keyword || undefined,
        location: filters.location || undefined,
        jobType: filters.jobType || undefined,
        minSalary: filters.salaryMin || undefined,
        page,
        size: 12,
        sortBy: "createdAt",
        sortDir: "DESC",
      };
      const res = await searchJobs(params);
      const list = res?.data?.content || res?.content || [];
      setJobs(list);
      setTotalPages(res?.data?.totalPages || res?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi tải việc làm:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Chỉ fetch khi đổi trang
  useEffect(() => {
    fetchJobs();
  }, [page]);

  // 🔍 Khi nhấn “Tìm kiếm”
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.location) params.append("location", filters.location);
    if (filters.jobType) params.append("jobType", filters.jobType);
    if (filters.salaryMin) params.append("minSalary", filters.salaryMin);
    params.append("page", page);
    navigate(`/jobs?${params.toString()}`, { replace: true });
    fetchJobs();
  };

  // ⚙️ Cập nhật bộ lọc
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🔄 Làm mới bộ lọc
  const resetFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      jobType: "",
      salaryMin: "",
      salaryMax: "",
    });
    setPage(0);
    fetchJobs();
  };

  // 🔤 Gợi ý từ khóa / địa điểm
  useEffect(() => {
    if (!filters.keyword) return setKeywordSuggestions([]);
    const matched = popularKeywords.filter((k) =>
      k.toLowerCase().includes(filters.keyword.toLowerCase())
    );
    setKeywordSuggestions(matched);
  }, [filters.keyword]);

  useEffect(() => {
    if (!filters.location) return setLocationSuggestions([]);
    const matched = popularLocations.filter((loc) =>
      loc.toLowerCase().includes(filters.location.toLowerCase())
    );
    setLocationSuggestions(matched);
  }, [filters.location]);

  // 🚫 Ẩn gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (keywordRef.current && !keywordRef.current.contains(event.target)) {
        setKeywordSuggestions([]);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải danh sách việc làm...
      </div>
    );

  return (
    <div className="bg-[#f9fafb] min-h-screen py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        {/* 🧩 Bộ lọc */}
        <aside className="bg-white rounded-2xl border border-gray-200 p-6 h-fit shadow-sm hover:shadow-md transition-all duration-300 relative">
          <h2 className="text-lg font-bold mb-4 text-[#00b14f]">
            Bộ lọc tìm kiếm
          </h2>

          {/* 🔍 Từ khóa */}
          <div className="relative mb-3" ref={keywordRef}>
            <input
              type="text"
              placeholder="Từ khóa..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f]"
            />
            {keywordSuggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-md max-h-48 overflow-y-auto">
                {keywordSuggestions.map((word, idx) => (
                  <li
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFilters((prev) => ({ ...prev, keyword: word }));
                      setKeywordSuggestions([]);
                      setTimeout(() => setKeywordSuggestions([]), 10); // ép ẩn triệt để
                    }}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {word}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 📍 Địa điểm */}
          <div className="relative mb-3" ref={locationRef}>
            <input
              type="text"
              placeholder="Địa điểm..."
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f]"
            />
            {locationSuggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-md max-h-48 overflow-y-auto">
                {locationSuggestions.map((loc, idx) => (
                  <li
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFilters((prev) => ({ ...prev, location: loc }));
                      setLocationSuggestions([]);
                      setTimeout(() => setLocationSuggestions([]), 10); // ép ẩn triệt để
                    }}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ⚙️ Loại công việc */}
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange("jobType", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-[#00b14f]"
          >
            <option value="">Loại công việc</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Hợp đồng</option>
            <option value="INTERNSHIP">Thực tập</option>
            <option value="FREELANCE">Freelance</option>
          </select>

          {/* 💰 Lương */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lương tối thiểu (triệu VNĐ)
            </label>
            <input
              type="number"
              placeholder="VD: 10"
              value={filters.salaryMin ? filters.salaryMin / 1_000_000 : ""}
              onChange={(e) =>
                handleFilterChange("salaryMin", Number(e.target.value) * 1_000_000)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f]"
            />
          </div>

          {/* 🧭 Hai nút */}
          <div className="flex gap-3">
            <button
              onClick={resetFilters}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-all"
            >
              ⟳ Làm mới
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-[#00b14f] to-[#00d85b] text-white py-2 rounded-md text-sm font-medium shadow hover:opacity-90 transition-all"
            >
              🔍 Tìm kiếm
            </button>
          </div>
        </aside>

        {/* 📋 Kết quả */}
        <section className="lg:col-span-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Kết quả tìm kiếm
          </h1>

          {jobs.length === 0 ? (
            <p className="text-gray-600">
              Không tìm thấy việc làm phù hợp với bộ lọc hiện tại.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
