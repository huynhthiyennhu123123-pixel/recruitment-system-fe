import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applyJob } from "../../services/applicationService";

export default function ApplyJobPage() {
  const { id } = useParams(); // jobPostingId
  const navigate = useNavigate();
  const [form, setForm] = useState({
    coverLetter: "",
    resumeUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        jobPostingId: Number(id),
        coverLetter: form.coverLetter,
        resumeUrl: form.resumeUrl,
      };
      console.log("Apply payload:", payload);

      const res = await applyJob(payload);
      console.log("Apply response:", res);

      if (res.success) {
        alert("✅ Nộp đơn thành công!");
        navigate("/applicant/dashboard");
      } else {
        alert(res.message || "Có lỗi xảy ra khi nộp đơn");
      }
    } catch (err) {
      console.error("Apply job error:", err.response?.data || err.message);
      alert("❌ Nộp đơn thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ứng tuyển công việc #{id}</h1>

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

        <input
          type="url"
          name="resumeUrl"
          placeholder="Link CV (PDF)"
          value={form.resumeUrl}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

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
