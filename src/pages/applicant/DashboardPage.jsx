import { useEffect, useState } from "react";
import { searchJobs, latestJobs } from "../../services/jobService";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    keyword: "",
    location: "",
    jobType: "",
    minSalary: "",
    page: 0,
    size: 10,
    sortBy: "createdAt",
    sortDir: "DESC",
  });

  // load mặc định latest job khi vào dashboard
  useEffect(() => {
    fetchLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await searchJobs(query);
      const data = res?.data?.data?.content || [];
      setJobs(data);
    } catch (err) {
      console.error("Search jobs error:", err);
    }
    setLoading(false);
  };

  const fetchLatest = async () => {
    setLoading(true);
    try {
      const res = await latestJobs({ page: 0, size: 10 });
      const data = res?.data?.data?.content || [];
      setJobs(data);
    } catch (err) {
      console.error("Latest jobs error:", err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-4 rounded shadow flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Tìm kiếm từ khóa..."
          value={query.keyword}
          onChange={(e) => setQuery({ ...query, keyword: e.target.value })}
          className="border p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Địa điểm"
          value={query.location}
          onChange={(e) => setQuery({ ...query, location: e.target.value })}
          className="border p-2 w-40"
        />
        <select
          value={query.jobType}
          onChange={(e) => setQuery({ ...query, jobType: e.target.value })}
          className="border p-2 w-40"
        >
          <option value="">Loại việc</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
        <input
          type="number"
          placeholder="Lương tối thiểu"
          value={query.minSalary}
          onChange={(e) => setQuery({ ...query, minSalary: e.target.value })}
          className="border p-2 w-40"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Job list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <p>Đang tải...</p>
        ) : jobs.length === 0 ? (
          <p>Không có công việc nào</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-green-700">
                  <Link to={`/applicant/jobs/${job.id}`}>{job.title}</Link>
                </h3>
                <p className="text-gray-600">
                  {job.company?.name || "Công ty ẩn danh"} • {job.location}
                </p>
                <p className="text-sm text-gray-500">
                  Mức lương:{" "}
                  {job.salaryMin && job.salaryMax
                    ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} VND`
                    : "Thỏa thuận"}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(job.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
