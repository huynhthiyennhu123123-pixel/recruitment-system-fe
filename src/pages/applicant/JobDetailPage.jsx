import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobDetail } from "../../services/jobService";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      console.log("Fetching job detail for id:", id);
      const res = await getJobDetail(id);
      console.log("Job detail response:", res);

      const data = res?.data?.data;
      setJob(data);
    } catch (err) {
      console.error("Get job detail error:", err);
    }
    setLoading(false);
  };

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!job) return <p className="p-6">Không tìm thấy công việc</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tiêu đề + công ty */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h1 className="text-2xl font-bold text-green-700">{job.title}</h1>
        <p className="text-gray-600">{job.company?.name}</p>
        <p className="text-gray-500">
          {job.location} •{" "}
          {job.salaryMin && job.salaryMax
            ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} VND`
            : "Thỏa thuận"}
        </p>

        {/* Nút Apply */}
        <Link
          to={`/applicant/jobs/${job.id}/apply`}
          className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Ứng tuyển ngay
        </Link>
      </div>

      {/* Mô tả công việc */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Mô tả công việc</h2>
        <p className="whitespace-pre-line">{job.description}</p>
      </div>

      {/* Yêu cầu */}
      {job.requirements && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-2">Yêu cầu</h2>
          <p className="whitespace-pre-line">{job.requirements}</p>
        </div>
      )}

      {/* Thông tin công ty */}
      {job.company && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Thông tin công ty</h2>
          <p className="font-semibold">{job.company.name}</p>
          {job.company.description && (
            <p className="text-gray-600">{job.company.description}</p>
          )}
          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              {job.company.website}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
