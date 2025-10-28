import React, { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { FaLock, FaEnvelope, FaSpinner, FaSave } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // 🧩 Đổi mật khẩu trực tiếp (nếu backend có /api/auth/change-password)
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.patch("/api/auth/change-password", {
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (res.data?.success) {
        toast.success("Đổi mật khẩu thành công!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.data?.message || "Không thể đổi mật khẩu.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đổi mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Gửi email reset mật khẩu (nếu quên)
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    setSendingEmail(true);
    try {
      const res = await axiosClient.post("/api/auth/forgot-password", {
        email,
      });
      if (res.data?.success) {
        toast.success("Đã gửi email đặt lại mật khẩu!");
      } else {
        toast.error(res.data?.message || "Không gửi được email!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi email!");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        ⚙️ Cài đặt tài khoản
      </h2>

      {/* ĐỔI MẬT KHẨU */}
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaLock /> Đổi mật khẩu
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Mật khẩu mới
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? (
              <FaSpinner className="animate-spin inline mr-2" />
            ) : (
              <FaSave className="inline mr-2" />
            )}
            Lưu thay đổi
          </button>
        </form>
      </motion.div>

      {/* QUÊN MẬT KHẨU */}
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaEnvelope /> Quên mật khẩu
        </h3>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={sendingEmail}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {sendingEmail ? (
              <FaSpinner className="animate-spin inline mr-2" />
            ) : (
              <FaEnvelope className="inline mr-2" />
            )}
            Gửi email đặt lại mật khẩu
          </button>
        </form>
      </motion.div>
    </div>
  );
}
