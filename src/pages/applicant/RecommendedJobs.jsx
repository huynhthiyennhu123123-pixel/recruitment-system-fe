import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const baseUrl = "http://localhost:8081";

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }
    fetchRecommendedJobs();
  }, []);

  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/api/jobs/recommended`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { limit: 10 },
      });

      if (res.data?.success) {
        setJobs(res.data.data || []);
      } else {
        setError("Không thể tải danh sách gợi ý việc làm.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        localStorage.removeItem("token");
        navigate("/auth/login");
      } else if (err.response?.status === 403) {
        setError("Tài khoản của bạn không có quyền xem gợi ý việc làm.");
      } else {
        setError("Lỗi hệ thống, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        💡 Việc làm được gợi ý cho bạn
      </h1>

      {loading ? (
        <p className="text-gray-500">Đang tải gợi ý...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 italic">
          Hiện chưa có việc làm nào được gợi ý cho bạn.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-xl p-5 hover:shadow-lg transition bg-white"
            >
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                {job.title}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                📍 {job.location || "Không rõ địa điểm"}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                💰 {job.salaryMin?.toLocaleString()} -{" "}
                {job.salaryMax?.toLocaleString()} {job.salaryCurrency}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                🕓 Hạn nộp:{" "}
                {new Date(job.applicationDeadline).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-gray-500 text-xs mb-3 line-clamp-3">
                {job.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  🎯 Match: {job.matchScore || 0}%
                </span>
                <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  Ứng tuyển
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}