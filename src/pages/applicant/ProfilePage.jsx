import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/applicantService";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const profileData = res.data?.data || res.data;
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      setProfile({
        ...profileData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } catch (err) {
      console.error("❌ Get profile error:", err);
      toast.error("Không thể tải hồ sơ.");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);

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

    const formattedData = {
      dateOfBirth: dateOfBirth ? dateOfBirth.substring(0, 10) : null,
      gender:
        gender === "NU" || gender === "NỮ"
          ? "Nữ"
          : gender === "NAM"
          ? "Nam"
          : gender || null,
      address,
      city,
      country,
      summary,
      experience,
      education,
      skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills.split(",").map((s) => s.trim())
        : [],
      certifications: Array.isArray(certifications)
        ? certifications
        : certifications
        ? certifications.split(",").map((s) => s.trim())
        : [],
      languages,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      desiredSalaryMin: Number(desiredSalaryMin) || 0,
      desiredSalaryMax: Number(desiredSalaryMax) || 0,
      desiredJobType,
      desiredLocation,
      availability,
      isPublic: Boolean(isPublic),
    };

    // ✅ Hiển thị toast loading duy nhất
    const toastId = toast.loading("Đang lưu thay đổi...");

    try {
      await updateProfile(formattedData);

      // ✅ Cập nhật toast thành công
      toast.update(toastId, {
        render: "🎉 Cập nhật hồ sơ thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });

      fetchProfile();
    } catch (err) {
      console.error("❌ Update error:", err);

      // ❌ Cập nhật toast lỗi
      toast.update(toastId, {
        render: "Lỗi khi cập nhật hồ sơ!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <p className="p-6 text-gray-500 italic text-center">
        Đang tải hồ sơ...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* 🧍 Thông tin cá nhân */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400">
            {profile.firstName ? (
              <span className="text-[#00b14f] font-bold">
                {profile.firstName[0]}
              </span>
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600">{profile.phoneNumber}</p>
          </div>
        </div>

        {/* 📝 Form hồ sơ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-[#00b14f] mb-5">
            Thông tin hồ sơ
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Thành phố */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành phố
              </label>
              <input
                name="city"
                value={profile.city || ""}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
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
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Giới thiệu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới thiệu bản thân
              </label>
              <textarea
                name="summary"
                value={profile.summary || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Kỹ năng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kỹ năng (cách nhau bởi dấu phẩy)
              </label>
              <textarea
                name="skills"
                value={
                  Array.isArray(profile.skills)
                    ? profile.skills.join(", ")
                    : profile.skills || ""
                }
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Kinh nghiệm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kinh nghiệm làm việc
              </label>
              <textarea
                name="experience"
                value={profile.experience || ""}
                onChange={handleChange}
                rows={4}
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
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
                className="border border-gray-300 focus:ring-2 focus:ring-[#00b14f] rounded-lg p-2 w-full outline-none"
              />
            </div>

            {/* Nút lưu */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#00b14f] hover:bg-green-600"
              }`}
            >
              <FaSave />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
