import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { searchJobs } from "../../services/jobService";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

export default function JobListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // 📊 State
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🎯 Bộ lọc (filter)
  const [filters, setFilters] = useState({
    keyword: queryParams.get("keyword") || "",
    location: queryParams.get("location") || "",
    salary: "",
    jobType: "",
    level: "",
    experience: "",
  });

  // 📦 Hàm fetch job list
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await searchJobs({
        ...filters,
        page,
        size: 6,
        sortBy: "createdAt",
        sortDir: "DESC",
      });
      setJobs(res?.data?.content || []);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi tải danh sách việc làm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // 🧭 Khi thay đổi filter
  const handleFilterChange = (key, value) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🧹 Reset toàn bộ bộ lọc
  const resetFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      salary: "",
      jobType: "",
      level: "",
      experience: "",
    });
    setPage(0);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải danh sách việc làm...
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

        {/* Từ khóa */}
        <input
          type="text"
          placeholder="Từ khóa..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-[#00b14f]"
        />

        {/* Địa điểm */}
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
        >
          <option value="">Tất cả địa điểm</option>
          <option value="cantho">Cần Thơ</option>
          <option value="hcm">Hồ Chí Minh</option>
          <option value="hanoi">Hà Nội</option>
          <option value="danang">Đà Nẵng</option>
        </select>

        {/* Lương */}
        <select
          value={filters.salary}
          onChange={(e) => handleFilterChange("salary", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
        >
          <option value="">Mức lương</option>
          <option value="10-15tr">10-15 triệu</option>
          <option value="15-20tr">15-20 triệu</option>
          <option value="20-30tr">20-30 triệu</option>
        </select>

        {/* Cấp bậc */}
        <select
          value={filters.level}
          onChange={(e) => handleFilterChange("level", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
        >
          <option value="">Cấp bậc</option>
          <option value="fresher">Fresher</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>

        {/* Loại hình */}
        <select
          value={filters.jobType}
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
        >
          <option value="">Hình thức</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="INTERN">Thực tập</option>
        </select>

        {/* Kinh nghiệm */}
        <select
          value={filters.experience}
          onChange={(e) => handleFilterChange("experience", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5 text-sm"
        >
          <option value="">Kinh nghiệm</option>
          <option value="0-1y">0-1 năm</option>
          <option value="1-3y">1-3 năm</option>
          <option value="3-5y">3-5 năm</option>
        </select>

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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-4 text-sm">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-md border ${
                page === 0
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-[#00b14f] border-[#00b14f]"
              }`}
            >
              ◀ Trang trước
            </button>
            <span className="text-gray-700">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-md border ${
                page + 1 >= totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-[#00b14f] border-[#00b14f]"
              }`}
            >
              Trang sau ▶
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
