import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobSearchSection from "../../layout/JobSearchSection";
import { latestJobs, searchJobs } from "../../services/jobService";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

export default function HomePage() {
  const [latest, setLatest] = useState([]);
  const [javaJobs, setJavaJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [latestRes, javaRes] = await Promise.all([
          latestJobs({ page: 0, size: 6 }),
          searchJobs({
            keyword: "java",
            page: 0,
            size: 6,
            sortBy: "createdAt",
            sortDir: "DESC",
          }),
        ]);
        setLatest(latestRes?.data?.content || []);
        setJavaJobs(javaRes?.data?.content || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải việc làm...
      </div>
    );

  const JobCard = ({ job }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{job.title}</h3>
      <p className="text-sm text-gray-500 mb-1 font-medium">
        {job.company?.name || "Công ty chưa xác định"}
      </p>
      <p className="flex items-center gap-1 text-gray-600 text-sm mb-2">
        <FaMapMarkerAlt className="text-[#00b14f]" /> {job.location || "Không rõ"}
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
    <div className="bg-gray-50 min-h-screen pb-20">
      <JobSearchSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Việc làm mới nhất
          </h2>
          {latest.length === 0 ? (
            <p className="text-gray-500">Chưa có việc làm mới.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Việc làm Java nổi bật
          </h2>
          {javaJobs.length === 0 ? (
            <p className="text-gray-500">Không có việc làm Java.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {javaJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
