import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { searchJobs } from "../../services/jobService";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

export default function JobListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  //  State
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(Number(queryParams.get("page")) || 0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  //  Bộ lọc (filter)
  const [filters, setFilters] = useState({
    keyword: queryParams.get("keyword") || "",
    location: queryParams.get("location") || "",
    jobType: queryParams.get("jobType") || "",
    salaryMin: queryParams.get("salaryMin") || "",
    salaryMax: queryParams.get("salaryMax") || "",
  });

  // =============================
  //  Gọi API lấy danh sách việc làm
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
        size: 10,
        sortBy: "createdAt",
        sortDir: "DESC",
      };

      const res = await searchJobs(params);
      const jobList = res?.content || res?.data?.content || [];

      // Lọc thêm theo khoảng lương nếu người dùng nhập cả hai
      const min = Number(filters.salaryMin) || 0;
      const max = Number(filters.salaryMax) || Infinity;

      let filteredList = jobList;
      if (filters.salaryMin || filters.salaryMax) {
        filteredList = jobList.filter((job) => {
          const jobMin = Number(job.salaryMin || 0);
          const jobMax = Number(job.salaryMax || 0);
          return jobMax >= min && jobMin <= max;
        });
      }

      setJobs(filteredList);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi tải danh sách việc làm:", err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Cập nhật URL & fetch khi thay đổi filters
  // =============================
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
    }, 500);
    return () => clearTimeout(handler);
  }, [filters, page]);

  // Khi load lại trang (refresh / paste URL)
  useEffect(() => {
    fetchJobs();
  }, [location.search]);

  // =============================
  //  Các hàm tiện ích
  // =============================
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
        <FaSpinner className="animate-spin mr-2" /> Đang tải danh sách việc
        làm...
      </div>
    );

  const JobCard = ({ job }) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{job.title}</h3>
      <p className="text-sm text-gray-500 mb-1 font-medium">
        {job.company?.name || "Công ty chưa xác định"}
      </p>
      <p className="flex items-center gap-1 text-gray-600 text-sm mb-2">
        <FaMapMarkerAlt className="text-[#00b14f]" />{" "}
        {job.location || "Không rõ"}
      </p>
      {job.salaryMin && job.salaryMax && (
        <p className="text-[#00b14f] font-medium mb-2">
          {job.salaryMin.toLocaleString("vi-VN")}₫ -{" "}
          {job.salaryMax.toLocaleString("vi-VN")}₫
        </p>
      )}
      <Link
        to={`/jobs/${job.id}`}
        className="inline-block text-sm text-[#00b14f] font-medium hover:underline"
      >
        Xem chi tiết
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar filter */}
      <aside className="bg-white rounded-2xl border border-gray-200 p-5 h-fit">
        <h2 className="text-lg font-bold mb-4 text-[#00b14f]">
          Bộ lọc tìm kiếm
        </h2>

        {/*  Từ khóa */}
        <input
          type="text"
          placeholder="Từ khóa..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-[#00b14f]"
        />

        {/*  Địa điểm */}
        <input
          type="text"
          placeholder="Nhập địa điểm..."
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-[#00b14f]"
        />

        {/* Loại công việc */}
        <select
          value={filters.jobType}
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
        >
          <option value="">Loại công việc</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Hợp đồng</option>
          <option value="INTERNSHIP">Thực tập</option>
          <option value="FREELANCE">Freelance</option>
        </select>

        {/*  Khoảng lương */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Khoảng lương (VNĐ)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Tối thiểu"
              value={
                filters.salaryMin
                  ? Number(filters.salaryMin).toLocaleString("vi-VN")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                handleFilterChange("salaryMin", raw);
              }}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f]"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Tối đa"
              value={
                filters.salaryMax
                  ? Number(filters.salaryMax).toLocaleString("vi-VN")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                handleFilterChange("salaryMax", raw);
              }}
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00b14f]"
            />
          </div>

          {(filters.salaryMin || filters.salaryMax) && (
            <p className="text-xs text-gray-500 mt-1">
              {filters.salaryMin
                ? `Từ ${Number(filters.salaryMin).toLocaleString("vi-VN")}₫ `
                : ""}
              {filters.salaryMax
                ? `đến ${Number(filters.salaryMax).toLocaleString("vi-VN")}₫`
                : filters.salaryMin
                ? "trở lên"
                : ""}
            </p>
          )}
        </div>

        {/*  Làm mới */}
        <button
          onClick={resetFilters}
          className="w-full bg-[#00b14f] text-white py-2 rounded-md text-sm font-medium hover:bg-[#009d46]"
        >
          ⟳ Làm mới bộ lọc
        </button>
      </aside>

      {/* Job list */}
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
  );
}
