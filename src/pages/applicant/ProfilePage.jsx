import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  uploadResume,
} from "../../services/applicantService";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const profileData = res.data?.data || res.data;

      // Lấy user từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Merge user + profile
      setProfile({
        ...profileData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } catch (err) {
      console.error("Get profile error:", err);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        dateOfBirth,
        gender,
        address,
        city,
        country,
        summary,
        experience,
        education,
        skills,
        certifications,
        languages,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        desiredSalaryMin,
        desiredSalaryMax,
        desiredJobType,
        desiredLocation,
        availability,
        isPublic,
      } = profile;

      await updateProfile({
        dateOfBirth,
        gender,
        address,
        city,
        country,
        summary,
        experience,
        education,
        skills,
        certifications,
        languages,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        desiredSalaryMin,
        desiredSalaryMax,
        desiredJobType,
        desiredLocation,
        availability,
        isPublic,
      });

      alert("Cập nhật thành công");
      fetchProfile();
    } catch (err) {
      console.error("Update error:", err);
      alert("Cập nhật thất bại");
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Chọn file trước khi upload");
      return;
    }
    setLoading(true);
    try {
      await uploadResume(file);
      alert("Upload CV thành công");
      fetchProfile();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload CV thất bại");
    }
    setLoading(false);
  };

  if (!profile) return <p className="p-4">Đang tải hồ sơ...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Info Card */}
      <div className="bg-white p-6 rounded shadow flex items-center space-x-4">
        {/* Avatar mặc định */}
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
          {profile.firstName?.[0] || "U"}
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-gray-600">{profile.phoneNumber}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Thông tin hồ sơ</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thành phố */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thành phố
            </label>
            <input
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Nơi mong muốn làm việc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nơi mong muốn làm việc
            </label>
            <input
              name="desiredLocation"
              value={profile.desiredLocation || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Giới thiệu bản thân */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới thiệu bản thân
            </label>
            <textarea
              name="summary"
              value={profile.summary || ""}
              onChange={handleChange}
              rows={3}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Kỹ năng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kỹ năng
            </label>
            <textarea
              name="skills"
              value={profile.skills || ""}
              onChange={handleChange}
              rows={3}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Kinh nghiệm làm việc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kinh nghiệm làm việc
            </label>
            <textarea
              name="experience"
              value={profile.experience || ""}
              onChange={handleChange}
              rows={4}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Học vấn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Học vấn
            </label>
            <textarea
              name="education"
              value={profile.education || ""}
              onChange={handleChange}
              rows={3}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>

      </div>

      {/* Resume Upload */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-2">CV của tôi</h2>
        {profile.resumeUrl ? (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline"
          >
            Xem CV hiện tại
          </a>
        ) : (
          <p className="text-gray-600">Chưa có CV</p>
        )}

        <form onSubmit={handleUpload} className="mt-2 flex space-x-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Đang upload..." : "Upload CV"}
          </button>
        </form>
      </div>
    </div>
  );
}
