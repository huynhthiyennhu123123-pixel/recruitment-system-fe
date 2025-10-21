import React, { useEffect, useState } from "react";
import {
  FaVideo,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaSpinner,
  FaLink,
} from "react-icons/fa";
import { getMyInterviews } from "../../services/applicantService";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

export default function ApplicantInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Ánh xạ trạng thái sang tiếng Việt + màu
  const renderStatus = (status) => {
    const map = {
      SCHEDULED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
      COMPLETED: { text: "Hoàn tất", color: "bg-green-100 text-green-700" },
      CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
      RESCHEDULED: { text: "Đã đặt lại lịch", color: "bg-yellow-100 text-yellow-700" },
      MOI_TAO: { text: "Mới tạo", color: "bg-gray-100 text-gray-700" },
      XAC_NHAN: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
      HOAN_TAT: { text: "Hoàn tất", color: "bg-green-100 text-green-700" },
      HUY: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
    };
    const { text, color } = map[status] || { text: status, color: "bg-gray-100 text-gray-600" };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const res = await getMyInterviews({
          start: "2025-01-01T00:00:00",
          end: "2099-12-31T23:59:59",
          page: 0,
          size: 20,
        });
        const data = res?.data?.data?.content || [];
        setInterviews(data);
      } catch (err) {
        console.error("Lỗi tải danh sách phỏng vấn:", err);
        toast.error("Không thể tải lịch phỏng vấn. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <ToastContainer position="top-right" autoClose={2000} theme="light" />

      <motion.div
        className="max-w-5xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <FaCalendarAlt className="text-[#00b14f]" />
          Lịch phỏng vấn của tôi
        </h1>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-60 text-gray-500">
            <FaSpinner className="animate-spin mr-2" /> Đang tải lịch phỏng vấn...
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 shadow-sm rounded-2xl p-12">
            <FaVideo className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Hiện chưa có buổi phỏng vấn nào được lên lịch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                {/* Thông tin lịch */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaClock className="text-[#00b14f]" />
                    <span className="font-medium">{formatDate(item.scheduledAt)}</span>
                  </div>
                  {renderStatus(item.status)}
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <FaVideo className="text-[#00b14f]" />
                    Hình thức:{" "}
                    <strong>
                      {item.interviewType === "VIDEO"
                        ? "Phỏng vấn trực tuyến"
                        : "Phỏng vấn trực tiếp"}
                    </strong>
                  </p>

                  {item.meetingLink && (
                    <p className="flex items-center gap-2">
                      <FaLink className="text-[#00b14f]" />
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00b14f] hover:underline font-medium"
                      >
                        Tham gia buổi phỏng vấn
                      </a>
                    </p>
                  )}

                  {item.location && (
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#00b14f]" />
                      <span>{item.location}</span>
                    </p>
                  )}

                  {item.notes && (
                    <p className="mt-2 text-gray-600 italic border-l-4 border-[#00b14f] pl-3">
                      {item.notes}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
