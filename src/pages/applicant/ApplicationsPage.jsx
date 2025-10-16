import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye,
  FaClock,
} from "react-icons/fa";

// 🎨 Màu trạng thái
const STATUS_COLOR = {
  RECEIVED: "bg-yellow-100 text-yellow-700 border-yellow-200", // Đã tiếp nhận
  REVIEWED: "bg-blue-100 text-blue-700 border-blue-200",       // Đang xem xét
  INTERVIEW: "bg-purple-100 text-purple-700 border-purple-200",// Phỏng vấn
  OFFER: "bg-teal-100 text-teal-700 border-teal-200",          // Đã gửi offer
  HIRED: "bg-green-100 text-green-700 border-green-200",       // Đã tuyển dụng
  REJECTED: "bg-red-100 text-red-700 border-red-200",          // Bị từ chối
  WITHDRAWN: "bg-gray-100 text-gray-700 border-gray-200",      // Đã rút đơn
};

// 🟢 Text tiếng Việt tương ứng
const STATUS_TEXT = {
  RECEIVED: "Đã tiếp nhận",
  REVIEWED: "Đang xem xét",
  INTERVIEW: "Phỏng vấn",
  OFFER: "Đã gửi offer",
  HIRED: "Đã tuyển dụng",
  REJECTED: "Bị từ chối",
  WITHDRAWN: "Đã rút đơn",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = { page: 0, size: 20, sortBy: "createdAt", sortDir: "DESC" };
      const res = await getMyApplications(params);
      setApplications(res.data.content || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaBriefcase className="text-[#00b14f]" />
          Danh sách đơn ứng tuyển
        </h1>

        {loading ? (
          <p className="text-gray-500 italic">Đang tải...</p>
        ) : applications.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <FaClock className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Bạn chưa nộp đơn ứng tuyển nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-[#00b14f] mb-1">
                    {app.jobPosting?.title || "Công việc"}
                  </h2>

                  <p className="text-gray-600 flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-gray-400" />
                    {app.jobPosting?.location || "Địa điểm không xác định"}
                  </p>

                  <p className="text-gray-600 flex items-center gap-2 text-sm mt-1">
                    <FaCalendarAlt className="text-gray-400" />
                    Ngày ứng tuyển:
                    <span className="font-medium text-gray-700">
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </p>

                  {/* 🟩 Hiển thị trạng thái tiếng Việt */}
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold border rounded-full ${
                      STATUS_COLOR[app.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_TEXT[app.status] || app.status || "Không xác định"}
                  </span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      navigate(`/applicant/applications/${app.id}`)
                    }
                    className="flex items-center gap-2 bg-[#00b14f] hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    <FaEye />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
