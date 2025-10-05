import React, { useEffect, useState } from "react";
import jobApi from "../../api/jobApi";
import { extractPage } from "../../utils/normalizers";
import { Link } from "react-router-dom";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    const res = await jobApi.search({ keyword, page, size: 6, sortBy: "createdAt", sortDir: "DESC" });
    const p = extractPage(res);
    setJobs(p.content);
    setTotalPages(p.totalPages);
  };

  useEffect(() => { fetchJobs(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tìm kiếm việc làm</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Nhập từ khoá (VD: Java, React...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Tìm</button>
      </form>

      {/* Job list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            to={`/applicant/jobs/${job.id}`}
            className="p-4 border bg-white rounded shadow hover:shadow-lg"
          >
            <h2 className="font-bold text-lg">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.location} • {job.jobType}</p>
            <p className="text-sm text-green-700">
              {job.salaryMin} - {job.salaryMax} {job.salaryCurrency}
            </p>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded">Trước</button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded">Sau</button>
      </div>
    </div>
  );
};

export default JobsPage;
