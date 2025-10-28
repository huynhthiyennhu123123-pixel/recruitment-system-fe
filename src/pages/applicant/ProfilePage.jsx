import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/applicantService";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
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
      console.error("Get profile error:", err);
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

    const toastId = toast.loading("Đang lưu thay đổi...");

    try {
      await updateProfile(formattedData);

      toast.update(toastId, {
        render: "Cập nhật hồ sơ thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchProfile();
    } catch (err) {
      console.error("Update error:", err);
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
      <p className="p-6 text-gray-500 italic text-center animate-pulse">
        Đang tải hồ sơ...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex items-center gap-6 hover:shadow-xl transition"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-6xl text-green-500 shadow-inner">
            {profile.firstName ? (
              <span className="font-bold">
                {profile.firstName[0].toUpperCase()}
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
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-green-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-green-600 mb-6">
            Thông tin hồ sơ
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành phố
              </label>
              <input
                name="city"
                value={profile.city || ""}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 w-full outline-none transition-all focus:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nơi mong muốn làm việc
              </label>
              <input
                name="desiredLocation"
                value={profile.desiredLocation || ""}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 w-full outline-none transition-all focus:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới thiệu bản thân
              </label>
              <textarea
                name="summary"
                value={profile.summary || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 w-full outline-none transition-all focus:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kỹ năng
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
                className="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 w-full outline-none transition-all focus:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kinh nghiệm làm việc
              </label>
              <textarea
                name="experience"
                value={profile.experience || ""}
                onChange={handleChange}
                rows={4}
                className="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 w-full outline-none transition-all focus:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Học vấn
              </label>
              <textarea
                name="education"
                value={profile.education || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 w-full outline-none transition-all focus:shadow-sm"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <FaSave />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
