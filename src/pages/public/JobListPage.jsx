import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { searchJobs } from "../../services/jobService";
import { FaMapMarkerAlt, FaSpinner, FaArrowRight } from "react-icons/fa";
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

  // =============================
  // Gọi API
  // =============================
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
      console.error("❌ Lỗi tải việc làm:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật URL & gọi lại
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.location) params.append("location", filters.location);
      if (filters.jobType) params.append("jobType", filters.jobType);
      if (filters.salaryMin) params.append("salaryMin", filters.salaryMin);
      if (filters.salaryMax) params.append("salaryMax", filters.salaryMax);
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

  // =============================
  // JobCard (đồng bộ JobDetailPage & HomePage)
  // =============================
  const JobCard = ({ job }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 160, damping: 15 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        {/* Logo + tiêu đề */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={job.company?.logoUrl || "/default-company.png"}
            alt={job.company?.name || "Công ty"}
            className="w-14 h-14 rounded-xl border object-cover bg-gray-50 transition-transform duration-300 group-hover:scale-110"
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
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
          <span>
            Cập nhật:{" "}
            {new Date(job.createdAt || Date.now()).toLocaleDateString("vi-VN")}
          </span>
          <Link
            to={`/jobs/${job.id}`}
            className="text-sm font-medium text-[#00b14f] hover:text-[#009944] flex items-center gap-1"
          >
            Xem chi tiết <FaArrowRight size={12} />
          </Link>
        </div>

        {/* Overlay + Nút Ứng tuyển */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-[#00b14f]/90 via-[#00b14f]/60 to-transparent flex items-end justify-center p-5"
        >
          <Link
            to={`/jobs/${job.id}`}
            className="bg-white text-[#00b14f] font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-[#00b14f] hover:text-white transition-all duration-300 hover:scale-[1.05]"
          >
            Ứng tuyển ngay
          </Link>
        </motion.div>
      </motion.div>
    );
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
        {/* Sidebar filter */}
        <aside className="bg-white rounded-2xl border border-gray-200 p-6 h-fit shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-bold mb-4 text-[#00b14f]">
            Bộ lọc tìm kiếm
          </h2>

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
              Khoảng lương (VNĐ)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Tối thiểu"
                value={filters.salaryMin}
                onChange={(e) =>
                  handleFilterChange("salaryMin", e.target.value)
                }
                className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f]"
              />
              <input
                type="number"
                placeholder="Tối đa"
                value={filters.salaryMax}
                onChange={(e) =>
                  handleFilterChange("salaryMax", e.target.value)
                }
                className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f]"
              />
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full bg-gradient-to-r from-[#00b14f] to-[#00d85b] text-white py-2 rounded-md text-sm font-medium shadow hover:opacity-90 transition-all duration-300"
          >
            ⟳ Làm mới bộ lọc
          </button>
        </aside>

        {/* Danh sách việc làm */}
        <section className="lg:col-span-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Kết quả tìm kiếm
          </h1>

          {jobs.length === 0 ? (
            <p className="text-gray-600">
              Không tìm thấy việc làm phù hợp với bộ lọc hiện tại.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
