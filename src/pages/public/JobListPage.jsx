import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.location) params.append("location", filters.location);
      if (filters.jobType) params.append("jobType", filters.jobType);
      if (filters.salaryMin) params.append("minSalary", filters.salaryMin);
      params.append("page", page);
      navigate(`/jobs?${params.toString()}`, { replace: true });
      fetchJobs();
    }, 400);
    return () => clearTimeout(handler);
  }, [filters, page]);

  useEffect(() => {
    fetchJobs();
  }, [location.search]);

  const handleFilterChange = (key, value) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      jobType: "",
      salaryMin: "",
      salaryMax: "",
    });
    setPage(0);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải danh sách việc làm...
      </div>
    );

  return (
    <div className="bg-[#f9fafb] min-h-screen py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        <aside className="bg-white rounded-2xl border border-gray-200 p-6 h-fit shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-bold mb-4 text-[#00b14f]">Bộ lọc tìm kiếm</h2>

          <input
            type="text"
            placeholder="Từ khóa..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-[#00b14f]"
          />

          <input
            type="text"
            placeholder="Địa điểm..."
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-[#00b14f]"
          />

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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] transition"
            />
          </div>

          <button
            onClick={resetFilters}
            className="w-full bg-gradient-to-r from-[#00b14f] to-[#00d85b] text-white py-2 rounded-md text-sm font-medium shadow hover:opacity-90 transition-all duration-300"
          >
            ⟳ Làm mới bộ lọc
          </button>
        </aside>

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
