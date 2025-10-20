import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMyApplications,
  withdrawApplication,
} from "../../services/applicationService";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaClipboardCheck,
  FaSpinner,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMyApplications({
        page: 0,
        size: 50,
        sortBy: "createdAt",
        sortDir: "DESC",
      });
      const list = res?.data?.content || [];
      const found = list.find((a) => String(a.id) === String(id));
      setApplication(found || null);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      toast.error("Không thể tải dữ liệu đơn ứng tuyển.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("Bạn có chắc muốn rút đơn này không?")) return;
    setWithdrawing(true);
    try {
      await withdrawApplication(id);
      toast.success("🎉 Rút đơn thành công!");
      setTimeout(() => navigate("/applicant/applications"), 1500);
    } catch (err) {
      console.error("Rút đơn thất bại:", err);
      toast.error("Rút đơn thất bại, vui lòng thử lại!");
    } finally {
      setWithdrawing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải...
      </div>
    );

  if (!application)
    return (
      <div className="text-center py-10 text-gray-600">
        Không tìm thấy đơn ứng tuyển.
      </div>
    );

  const job = application.jobPosting;

  // Trạng thái tiếng Việt
  const statusMap = {
    RECEIVED: "Đã tiếp nhận",
    UNDER_REVIEW: "Đang xem xét",
    SHORTLISTED: "Được chọn phỏng vấn",
    REJECTED: "Bị từ chối",
    HIRED: "Đã tuyển dụng",
    WITHDRAWN: "Đã rút đơn",
    CANCELLED: "Đã hủy",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#00b14f] transition"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>

        {/* Thông tin đơn ứng tuyển */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#00b14f] mb-1">
              {job?.title || "Công việc"}
            </h1>
            <p className="text-gray-600 flex items-center gap-2 text-sm">
              <FaMapMarkerAlt className="text-gray-400" />
              {job?.location || "Không rõ địa điểm"}
            </p>
          </div>

          {/* Nút rút đơn */}
          {application.status !== "WITHDRAWN" &&
            application.status !== "CANCELLED" && (
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className={`mt-4 sm:mt-0 px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition shadow-sm ${
                  withdrawing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {withdrawing && <FaSpinner className="animate-spin" />}
                {withdrawing ? "Đang rút..." : "Rút đơn"}
              </button>
            )}
        </div>

        {/* Chi tiết đơn */}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p className="flex items-center gap-2">
            <FaClipboardCheck className="text-[#00b14f]" />
            <strong>Trạng thái:</strong>{" "}
            <span className="font-medium">
              {statusMap[application.status] || application.status}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#00b14f]" />
            <strong>Ngày ứng tuyển:</strong>{" "}
            {new Date(application.createdAt).toLocaleString("vi-VN")}
          </p>

          {application.coverLetter && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="flex items-center gap-2 mb-1 text-[#00b14f] font-medium">
                <FaFileAlt /> Thư xin việc
              </p>
              <p className="pl-6 text-gray-700 whitespace-pre-line">
                {application.coverLetter}
              </p>
            </div>
          )}

          {application.resumeUrl && (
            <p className="flex items-center gap-2">
              <FaFileAlt className="text-[#00b14f]" />
              <strong>CV:</strong>
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00b14f] hover:underline font-medium"
              >
                Xem CV
              </a>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationDetailPage;
