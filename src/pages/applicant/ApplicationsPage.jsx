import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getMyApplications(0, 10);
      if (res.success) {
        setApplications(res.data.content || []);
      } else {
        console.error("Fetch applications failed:", res.message);
      }
    } catch (err) {
      console.error("Get applications error:", err);
    }
    setLoading(false);
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Đơn đã nộp</h1>

      {applications.length === 0 ? (
        <p>Bạn chưa nộp đơn nào.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div>
                <h2 className="font-semibold text-green-700">
                  {app.jobPosting?.title}
                </h2>
                <p className="text-gray-600">{app.coverLetter}</p>
                <p className="text-sm text-gray-500">
                  Ngày nộp: {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-sm text-blue-600">
                  Trạng thái: {app.status}
                </p>
              </div>
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Xem CV
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
