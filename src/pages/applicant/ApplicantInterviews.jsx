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
import "react-toastify/dist/ReactToastify.css";

export default function ApplicantInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error("❌ Lỗi tải danh sách phỏng vấn:", err);
        toast.error("Không thể tải lịch phỏng vấn. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
            Đã lên lịch
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
            Hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
            Đã huỷ
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#00b14f] mb-6 flex items-center gap-2">
          <FaCalendarAlt /> Lịch phỏng vấn của tôi
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-60 text-gray-500">
            <FaSpinner className="animate-spin mr-2" /> Đang tải lịch phỏng vấn...
          </div>
        ) : interviews.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Hiện chưa có buổi phỏng vấn nào được lên lịch.
          </p>
        ) : (
          <div className="space-y-5">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[#00b14f]" />
                    <p className="font-medium text-gray-800">
                      {formatDate(item.scheduledAt)}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p className="flex items-center gap-2">
                    <FaVideo className="text-[#00b14f]" />
                    <span>
                      Hình thức:{" "}
                      <strong>
                        {item.interviewType === "VIDEO"
                          ? "Phỏng vấn trực tuyến"
                          : "Phỏng vấn trực tiếp"}
                      </strong>
                    </span>
                  </p>

                  {item.meetingLink && (
                    <p className="flex items-center gap-2">
                      <FaLink className="text-[#00b14f]" />
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00b14f] hover:underline"
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
                    <p className="mt-2 text-gray-600 italic">
                      Ghi chú: {item.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
