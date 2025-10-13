import React, { useState, useEffect } from "react"
import JobSearchSection from "../../layout/JobSearchSection"
import { searchJobs } from "../../services/jobService"
import JobCard from "../../components/job/JobCard"
import { Box, Typography, CircularProgress } from "@mui/material"

export default function JobListPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async (filters = {}) => {
    setLoading(true)
    try {
      const res = await searchJobs({ ...filters, page: 0, size: 12 })
      setJobs(res.data.data.content || [])
    } catch (err) {
      console.error("Lỗi khi tải danh sách việc làm:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <Box>
      <JobSearchSection onSearch={fetchJobs} />
      <Typography variant="h5" mt={3}>
        Danh sách việc làm
      </Typography>
      {loading ? (
        <Box textAlign="center" py={4}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit,minmax(280px,1fr))"
          gap={2}
          mt={2}
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
