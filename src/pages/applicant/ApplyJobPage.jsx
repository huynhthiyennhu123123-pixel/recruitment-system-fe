import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applyJob } from "../../services/applicationService";
import { getProfile } from "../../services/applicantService";
import {
  FaFileAlt,
  FaPaperPlane,
  FaRegSmile,
  FaSpinner,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function ApplyJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    coverLetter: "",
    resumeUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const profileData = res.data?.data || res.data;
        setProfile(profileData);

        if (profileData?.resumeUrl) {
          let resumeUrl = profileData.resumeUrl.trim();

          if (resumeUrl.includes("localhost:5173")) {
            resumeUrl = resumeUrl.replace(
              "http://localhost:5173",
              "https://example.com"
            );
          }
          if (resumeUrl.includes("localhost:8081")) {
            resumeUrl = resumeUrl.replace(
              "http://localhost:8081",
              "https://example.com"
            );
          }
          if (resumeUrl.startsWith("/uploads")) {
            resumeUrl = `https://example.com${resumeUrl}`;
          }

          setForm((prev) => ({ ...prev, resumeUrl }));
        }
      } catch (err) {
        console.error("Get profile error:", err);
        toast.error("Không thể tải hồ sơ ứng viên.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let resumeUrl = form.resumeUrl?.trim() || "";

    if (!resumeUrl) {
      toast.warning("Bạn cần upload CV trước khi nộp đơn!");
      navigate("/applicant/profile");
      return;
    }

    if (resumeUrl.includes("localhost:5173")) {
      resumeUrl = resumeUrl.replace(
        "http://localhost:5173",
        "https://example.com"
      );
    }
    if (resumeUrl.includes("localhost:8081")) {
      resumeUrl = resumeUrl.replace(
        "http://localhost:8081",
        "https://example.com"
      );
    }
    if (resumeUrl.startsWith("/uploads")) {
      resumeUrl = `https://example.com${resumeUrl}`;
    }

    if (!resumeUrl.startsWith("http")) {
      toast.error("URL CV không hợp lệ — vui lòng upload lại CV!");
      navigate("/applicant/profile");
      return;
    }

    const toastId = toast.loading("Đang gửi đơn ứng tuyển...");
    setLoading(true);

    try {
      const payload = {
        jobPostingId: Number(id),
        coverLetter: form.coverLetter,
        resumeUrl: resumeUrl,
      };

      const res = await applyJob(payload);

      if (res.success) {
        toast.update(toastId, {
          render: res.message || "Nộp đơn thành công!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => navigate("/applicant/applications"), 1500);
      } else {
        toast.update(toastId, {
          render: res.message || "Có lỗi xảy ra khi nộp đơn!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Apply job error:", err.response?.data || err.message);
      toast.update(toastId, {
        render: "Đã nộp đơn ứng tuyển!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <motion.div
        className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaFileAlt className="text-[#00b14f] text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">
            Ứng tuyển công việc #{id}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Thư xin việc
            </label>
            <textarea
              name="coverLetter"
              placeholder="Giới thiệu bản thân, kinh nghiệm và lý do bạn phù hợp..."
              value={form.coverLetter}
              onChange={handleChange}
              rows={6}
              className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-xl w-full p-3 text-gray-700 outline-none transition"
              required
            />
          </div>

          {form.resumeUrl ? (
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <FaRegSmile className="inline text-[#00b14f] mr-1" />
              CV mặc định:{" "}
              <a
                href={form.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#00b14f] hover:underline font-medium"
              >
                Xem CV đã lưu
              </a>
            </p>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-yellow-600 text-lg" />
                <span>Bạn chưa có CV — vui lòng upload trước khi nộp đơn!</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/applicant/documents/resume")}
                className="bg-[#00b14f] hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Upload CV ngay
              </button>
            </div>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: !loading ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all shadow-sm ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00b14f] hover:bg-green-600"
              }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Đang nộp...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Nộp đơn ngay
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
