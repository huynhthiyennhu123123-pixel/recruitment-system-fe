import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaHeart,
  FaRegHeart,
  FaGlobe,
} from "react-icons/fa";
import { getJobDetail } from "../../services/jobService";
import { getCompanyById } from "../../services/companyService";
import { saveJob, unsaveJob } from "../../services/savedJobService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");


  // ✅ Load job + company
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setJob(null);
    setCompany(null);
    setRelatedJobs([]);

    const fetchData = async () => {
      try {
        const res = await getJobDetail(id);
        const jobData = res?.data || res;
        setJob(jobData);

        if (jobData?.company?.id) {
          const compRes = await getCompanyById(jobData.company.id);
          setCompany(compRes?.data?.company || compRes?.data);
        }

        fetchRelatedJobs(jobData?.title);
      } catch (err) {
        toast.error("Không thể tải chi tiết công việc.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Việc làm liên quan
  const fetchRelatedJobs = async (title) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/jobs/search?keyword=${encodeURIComponent(
          title || ""
        )}&page=0&size=4`
      );
      const data = await res.json();
      setRelatedJobs(data?.data?.content || []);
    } catch (err) {
      console.error("❌ Lỗi việc liên quan:", err);
    }
  };

  // ✅ Lưu / Bỏ lưu
  const toggleSave = async () => {
    if (!token) {
      toast.warning("Vui lòng đăng nhập để lưu việc làm!");
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(id);
        setIsSaved(false);
        toast.info("Đã bỏ lưu việc làm");
      } else {
        await saveJob(id);
        setIsSaved(true);
        toast.success("Đã lưu việc làm thành công");
      }
    } catch {
      toast.error("Có lỗi khi lưu việc làm");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        <div className="animate-spin border-4 border-[#00b14f] border-t-transparent rounded-full w-10 h-10"></div>
      </div>
    );

  if (!job)
    return (
      <div className="text-center text-gray-600 py-10">
        Không tìm thấy công việc.
      </div>
    );

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-20">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ==== Header Job ==== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-5xl mx-auto mt-10 p-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {job.title}
            </h1>
            <p className="text-gray-600 mb-1 font-medium">
              {job.company?.name}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <FaMoneyBillWave />{" "}
                {job.salaryMin && job.salaryMax
                  ? `${job.salaryMin.toLocaleString(
                      "vi-VN"
                    )}₫ - ${job.salaryMax.toLocaleString("vi-VN")}₫`
                  : "Thoả thuận"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/applicant/jobs/${job.id}/apply`)}
              className="px-6 py-2 bg-gradient-to-r from-[#00b14f] to-[#00d85b] hover:opacity-90 text-white rounded-lg font-semibold shadow transition-all duration-300 hover:scale-[1.03]"
            >
              Ứng tuyển ngay
            </button>
            <button
              onClick={toggleSave}
              disabled={saving}
              className={`px-5 py-2 border rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                isSaved
                  ? "border-red-400 text-red-500 bg-red-50 hover:bg-red-100 hover:scale-[1.03]"
                  : "border-[#00b14f] text-[#00b14f] hover:bg-[#f0fdf4] hover:scale-[1.03]"
              }`}
            >
              {isSaved ? <FaHeart /> : <FaRegHeart />}
              {isSaved ? "Đã lưu" : "Lưu tin"}
            </button>
          </div>
        </div>
      </div>

      {/* ==== Nội dung chính ==== */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 px-2">
        {/* Bên trái */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Mô tả */}
          <div className="bg-[#f9fffb] rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <h2 className="text-lg font-semibold text-[#00b14f] mb-3">
              Mô tả công việc
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description || "Chưa có mô tả công việc."}
            </p>
          </div>

          {/* Yêu cầu */}
          {job.requirements && (
            <div className="bg-[#f9fffb] rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
              <h2 className="text-lg font-semibold text-[#00b14f] mb-3">
                Yêu cầu ứng viên
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Quyền lợi */}
          {job.benefits && (
            <div className="bg-[#f9fffb] rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
              <h2 className="text-lg font-semibold text-[#00b14f] mb-3">
                Quyền lợi
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.benefits}
              </p>
            </div>
          )}

          {/* Việc làm liên quan */}
          {relatedJobs.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-[#00b14f] mb-5">
                Việc làm liên quan
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedJobs.map((rj) => (
                  <Link
                    key={rj.id}
                    to={`/jobs/${rj.id}`}
                    className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-transparent hover:border-[#00b14f]/30 hover:-translate-y-[3px] transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <img
                        src={rj.company?.logoUrl || "/default-company.png"}
                        alt={rj.company?.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-[#00b14f] transition">
                          {rj.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {rj.company?.name || "Công ty chưa xác định"}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-[#00b14f]" />
                      <span>{rj.location || "Không rõ địa điểm"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bên phải */}
        <aside className="space-y-6">
          {company && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={company.logoUrl || "/default-company.png"}
                  alt={company.name}
                  className="w-16 h-16 rounded-md object-cover bg-gray-50 transition-transform duration-300 hover:scale-105"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 hover:text-[#00b14f] transition">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {company.industry || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <ul className="text-gray-600 text-sm space-y-2 mb-4">
                {company.companySize && (
                  <li className="flex items-center gap-2">
                    <FaBuilding /> {company.companySize}
                  </li>
                )}
                {company.city && (
                  <li className="flex items-center gap-2">
                    <FaMapMarkerAlt /> {company.city}
                  </li>
                )}
                {company.website && (
                  <li className="flex items-center gap-2">
                    <FaGlobe />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00b14f] hover:underline"
                    >
                      {company.website}
                    </a>
                  </li>
                )}
              </ul>

              <Link
                to={`/companies/${company.id}`}
                className="block w-full text-center bg-gradient-to-r from-[#00b14f] to-[#00d85b] hover:opacity-90 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-[1.03]"
              >
                Xem trang công ty
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
