import { useEffect, useState } from "react"
import { searchJobs, latestJobs } from "../../services/jobService"
import { Link } from "react-router-dom"
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from "react-icons/fa"

export default function DashboardPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState({
    keyword: "",
    location: "",
    jobType: "",
    minSalary: "",
    page: 0,
    size: 10,
    sortBy: "createdAt",
    sortDir: "DESC",
  })

  useEffect(() => {
    fetchLatest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await searchJobs(query)
      const data = res?.data?.data?.content || []
      setJobs(data)
    } catch (err) {
      console.error("Search jobs error:", err)
    }
    setLoading(false)
  }

  const fetchLatest = async () => {
    setLoading(true)
    try {
      const res = await latestJobs({ page: 0, size: 10 })
      const data = res?.data?.data?.content || []
      setJobs(data)
    } catch (err) {
      console.error("Latest jobs error:", err)
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Khám phá cơ hội việc làm phù hợp với bạn
      </h1>

      {/* Thanh tìm kiếm */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-5 rounded-2xl shadow-md flex flex-wrap gap-3 items-center border border-gray-100"
      >
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm từ khóa (VD: React, Designer...)"
            value={query.keyword}
            onChange={(e) => setQuery({ ...query, keyword: e.target.value })}
            className="border border-gray-200 rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Địa điểm"
            value={query.location}
            onChange={(e) => setQuery({ ...query, location: e.target.value })}
            className="border border-gray-200 rounded-lg pl-10 pr-3 py-2 w-40 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <select
          value={query.jobType}
          onChange={(e) => setQuery({ ...query, jobType: e.target.value })}
          className="border border-gray-200 rounded-lg p-2 w-40 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">Loại việc</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="INTERNSHIP">Thực tập</option>
        </select>

        <input
          type="number"
          placeholder="Lương tối thiểu (VND)"
          value={query.minSalary}
          onChange={(e) => setQuery({ ...query, minSalary: e.target.value })}
          className="border border-gray-200 rounded-lg p-2 w-44 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <button
          type="submit"
          className="bg-[#00b14f] hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
        >
          Tìm việc
        </button>
      </form>

      {/* Danh sách việc làm */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-gray-500 italic">Đang tải...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 italic">Không có công việc nào phù hợp</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#00b14f] hover:underline">
                  <Link to={`/applicant/jobs/${job.id}`}>{job.title}</Link>
                </h3>
                <p className="text-gray-700 mt-1 flex items-center gap-2">
                  <FaBriefcase className="text-gray-400" />
                  {job.company?.name || "Công ty ẩn danh"} • {job.location}
                </p>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                  <FaMoneyBillWave className="text-gray-400" />
                  Mức lương:{" "}
                  {job.salaryMin && job.salaryMax
                    ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} VND`
                    : "Thỏa thuận"}
                </p>
              </div>

              <div className="text-sm text-gray-400 whitespace-nowrap">
                {new Date(job.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
