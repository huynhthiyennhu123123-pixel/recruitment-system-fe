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
import { motion } from "framer-motion";

const STATUS_COLOR = {
  RECEIVED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  REVIEWED: "bg-blue-100 text-blue-700 border-blue-200",
  INTERVIEW: "bg-purple-100 text-purple-700 border-purple-200",
  OFFER: "bg-teal-100 text-teal-700 border-teal-200",
  HIRED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  WITHDRAWN: "bg-gray-100 text-gray-700 border-gray-200",
};

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
    <div className="bg-gray-50 min-h-screen py-10 px-5">
      <motion.div
        className="max-w-6xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <FaBriefcase className="text-[#00b14f]" />
          Danh sách đơn ứng tuyển
        </h1>

        {loading ? (
          <p className="text-gray-500 italic text-center mt-6 animate-pulse">
            Đang tải danh sách đơn ứng tuyển...
          </p>
        ) : applications.length === 0 ? (
          <div className="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
            <FaClock className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Bạn chưa nộp đơn ứng tuyển nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <motion.div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <h2 className="text-lg font-semibold text-[#00b14f] mb-1 line-clamp-1">
                    {app.jobPosting?.title || "Công việc"}
                  </h2>

                  <p className="text-gray-600 flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-gray-400" />
                    {app.jobPosting?.location || "Địa điểm không xác định"}
                  </p>

                  <p className="text-gray-600 flex items-center gap-2 text-sm mt-1">
                    <FaCalendarAlt className="text-gray-400" />
                    Ngày ứng tuyển:
                    <span className="font-medium text-gray-700 ml-1">
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold border rounded-full ${
                      STATUS_COLOR[app.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_TEXT[app.status] || app.status || "Không xác định"}
                  </span>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => navigate(`/applicant/applications/${app.id}`)}
                    className="flex items-center gap-2 bg-[#00b14f] hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition-all"
                  >
                    <FaEye />
                    Xem chi tiết
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
