import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBuilding,
  FaArrowLeft,
  FaSpinner,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import {
  getJobDetailWithSave,
  saveJob,
  unsaveJob,
} from "../../services/savedJobService";
import { getJobDetail } from "../../services/jobService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  //  Tự fallback khi /me lỗi
  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const res = await getJobDetailWithSave(id);
      const jobData = res?.data?.data || res?.data || res;
      setJob(jobData);
      setIsSaved(jobData.isSaved || false);
    } catch (err) {
      console.warn("  Lỗi khi gọi /me, fallback sang API thường:", err);

      //   Thêm toastId để không hiện lặp
      toast.warning(
        "Không thể kiểm tra trạng thái lưu, hiển thị công việc bình thường!",
        { toastId: "saveWarning" }
      );

      try {
        const res2 = await getJobDetail(id);
        const jobData2 = res2?.data?.data || res2?.data || res2;
        setJob(jobData2);
        setIsSaved(false);
      } catch (err2) {
        console.error(" Lỗi tải chi tiết công việc:", err2);
        toast.error("Không tải được thông tin công việc!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  //   Lưu / Bỏ lưu công việc
  const handleToggleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(id);
        setIsSaved(false);
        toast.info("  Đã bỏ lưu công việc");
      } else {
        await saveJob(id);
        setIsSaved(true);
        toast.success(" Đã lưu công việc thành công");
      }
    } catch (err) {
      console.error("Lỗi khi lưu/bỏ lưu job:", err);
      toast.error("Không thể thực hiện thao tác!");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Hiển thị loading / not found
  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải thông tin công
        việc...
      </div>
    );

  if (!job)
    return (
      <div className="text-center text-gray-600 py-20">
        Không tìm thấy công việc.
      </div>
    );

  const company = job.company;
  const companyId = company?.id || job.companyId;
  const companyName = company?.name || "Công ty ẩn danh";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Toast container */}
        <ToastContainer position="top-right" autoClose={2000} theme="light" />

        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#00b14f] mb-6 transition"
        >
          <FaArrowLeft /> <span>Quay lại</span>
        </button>

        {/* Nội dung chính */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#00b14f] mb-2">
                {job.title}
              </h1>
              {company && (
                <p className="text-gray-600 flex items-center gap-2 text-sm mb-1">
                  <FaBuilding className="text-gray-400" />
                  {companyId ? (
                    <Link
                      to={`/applicant/companies/${companyId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {companyName}
                    </Link>
                  ) : (
                    companyName
                  )}
                </p>
              )}
              <p className="text-gray-600 flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-gray-400" />
                {job.location || "Không rõ địa điểm"}
              </p>
            </div>

            {/* Nút lưu và ứng tuyển */}
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleToggleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium ${
                  isSaved
                    ? "bg-red-50 border-red-400 text-red-500 hover:bg-red-100"
                    : "border-gray-300 hover:bg-gray-50 text-gray-600"
                }`}
                disabled={saving}
              >
                {isSaved ? <FaHeart /> : <FaRegHeart />}
                {isSaved ? "Đã lưu" : "Lưu việc"}
              </button>

              <button
                onClick={() => {
                  const token =
                    localStorage.getItem("accessToken") ||
                    localStorage.getItem("token");

                  const user = JSON.parse(
                    localStorage.getItem("user") || "null"
                  );

                  if (!token || !user) {
                    navigate("/auth/login", {
                      state: { from: location.pathname },
                    });
                  } else if (user.role === "APPLICANT") {
                    navigate(`/applicant/jobs/${id}/apply`);
                  } else {
                    toast.warning(
                      " Chỉ tài khoản ứng viên mới được ứng tuyển!"
                    );
                  }
                }}
                className="bg-[#00b14f] hover:bg-[#009a46] text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                Ứng tuyển ngay
              </button>
            </div>
          </div>

          {/* Thông tin phụ */}
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-8">
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-[#00b14f]" />
              <span>
                <strong>Mức lương:</strong>{" "}
                {job.salaryMin || job.salaryMax
                  ? `${job.salaryMin?.toLocaleString(
                      "vi-VN"
                    )}₫ - ${job.salaryMax?.toLocaleString("vi-VN")}₫`
                  : "Thoả thuận"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-[#00b14f]" />
              <span>
                <strong>Hình thức:</strong> {job.jobType || "Không rõ"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-[#00b14f]" />
              <span>
                <strong>Hạn nộp:</strong>{" "}
                {job.applicationDeadline
                  ? new Date(job.applicationDeadline).toLocaleDateString(
                      "vi-VN"
                    )
                  : "Không rõ"}
              </span>
            </div>
          </div>

          {/* Mô tả, yêu cầu, quyền lợi */}
          <div className="space-y-6 text-gray-800 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-2 text-[#00b14f]">
                Mô tả công việc
              </h2>
              <p className="whitespace-pre-line">
                {job.description || "Chưa có mô tả."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2 text-[#00b14f]">
                Yêu cầu công việc
              </h2>
              <p className="whitespace-pre-line">
                {job.requirements || "Không có thông tin."}
              </p>
            </section>

            {job.benefits && (
              <section>
                <h2 className="text-xl font-semibold mb-2 text-[#00b14f]">
                  Quyền lợi
                </h2>
                <p className="whitespace-pre-line">{job.benefits}</p>
              </section>
            )}
          </div>
        </div>

        {/* Thông tin công ty */}
        {company && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-xl font-bold text-[#00b14f] mb-3">
              Thông tin công ty
            </h2>
            <p className="font-medium text-gray-800">{company.name}</p>
            {company.description && (
              <p className="text-gray-600 mt-2 whitespace-pre-line">
                {company.description}
              </p>
            )}
            {company.website && (
              <p className="mt-2">
                Website:{" "}
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00b14f] hover:underline"
                >
                  {company.website}
                </a>
              </p>
            )}
            {companyId && (
              <div className="mt-5">
                <Link
                  to={`/applicant/companies/${companyId}`}
                  className="inline-block border border-[#00b14f] text-[#00b14f] hover:bg-[#00b14f] hover:text-white px-5 py-2 rounded-lg font-medium transition"
                >
                  Xem trang công ty →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quay lại danh sách */}
        <div className="text-center mt-10">
          <Link
            to="/jobs"
            className="inline-block px-6 py-2 border border-[#00b14f] text-[#00b14f] rounded-lg hover:bg-[#00b14f] hover:text-white transition font-medium"
          >
            ← Quay lại danh sách việc làm
          </Link>
        </div>
      </div>
    </div>
  );
}
