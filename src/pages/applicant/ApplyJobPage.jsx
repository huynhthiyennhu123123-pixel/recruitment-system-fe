import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applyJob } from "../../services/applicationService";
import { getProfile } from "../../services/applicantService";

export default function ApplyJobPage() {
  const { id } = useParams(); // jobPostingId
  const navigate = useNavigate();

  const [form, setForm] = useState({
    coverLetter: "",
    resumeUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  // lấy CV mặc định từ profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        // vì service trả về res.data nên ở đây res đã là object {success, data}
        const profileData = res.data?.data || res.data;
        setProfile(profileData);

        if (profileData?.resumeUrl) {
          setForm((prev) => ({ ...prev, resumeUrl: profileData.resumeUrl }));
        }
      } catch (err) {
        console.error("Get profile error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.resumeUrl) {
      alert("⚠️ Bạn cần upload CV trong hồ sơ trước khi nộp đơn!");
      navigate("/applicant/profile");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        jobPostingId: Number(id),
        coverLetter: form.coverLetter,
        resumeUrl: form.resumeUrl,
      };

      console.log("Apply payload:", payload);
      const res = await applyJob(payload); // res = {success, message, data}

      console.log("Apply response:", res);

      if (res.success) {
        alert(res.message || "✅ Nộp đơn thành công!");
        navigate("/applicant/applications");
      } else {
        alert(res.message || "❌ Có lỗi xảy ra khi nộp đơn");
      }
    } catch (err) {
      console.error("Apply job error:", err.response?.data || err.message);
      alert("❌ Nộp đơn thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        Ứng tuyển công việc: #{id}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="coverLetter"
          placeholder="Thư xin việc..."
          value={form.coverLetter}
          onChange={handleChange}
          rows={6}
          className="border p-2 w-full rounded"
          required
        />

        {profile?.resumeUrl && (
          <p className="text-sm text-gray-600">
            CV mặc định:{" "}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-green-600 underline"
            >
              Xem CV đã lưu
            </a>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Đang nộp..." : "Nộp đơn"}
        </button>
      </form>
    </div>
  );
}
