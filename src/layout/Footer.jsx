import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#00a86b] to-[#00915d] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-wide">
              JobRecruit
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Nền tảng kết nối <span className="font-semibold">nhà tuyển dụng</span> và{" "}
              <span className="font-semibold">ứng viên</span> hiệu quả – giúp bạn
              tìm việc làm và nhân tài nhanh chóng, chuyên nghiệp.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Ứng viên</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/jobs"
                  className="hover:translate-x-1 inline-block transition-transform hover:text-white/80"
                >
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link
                  to="/applicant/profile"
                  className="hover:translate-x-1 inline-block transition-transform hover:text-white/80"
                >
                  Hồ sơ cá nhân
                </Link>
              </li>
              <li>
                <Link
                  to="/applicant/applications"
                  className="hover:translate-x-1 inline-block transition-transform hover:text-white/80"
                >
                  Đơn ứng tuyển
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Nhà tuyển dụng</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/employer/dashboard"
                  className="hover:translate-x-1 inline-block transition-transform hover:text-white/80"
                >
                  Bảng điều khiển
                </Link>
              </li>
              <li>
                <Link
                  to="/employer/jobs"
                  className="hover:translate-x-1 inline-block transition-transform hover:text-white/80"
                >
                  Quản lý tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/employer/applicants"
                  className="hover:translate-x-1 inline-block transition-transform hover:text-white/80"
                >
                  Danh sách ứng viên
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-white/80" />
                support@jobrecruit.com
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-white/80" />
                1800-6868
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-white/80" />
                TP. Cần Thơ, Việt Nam
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-white/80 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">JobRecruit</span>. Mọi
            quyền được bảo lưu.
          </p>

          <div className="mt-3 flex justify-center gap-6 text-white/80">
            <Link
              to="/about"
              className="hover:text-white transition-colors hover:underline underline-offset-2"
            >
              Giới thiệu
            </Link>
            <Link
              to="/terms"
              className="hover:text-white transition-colors hover:underline underline-offset-2"
            >
              Điều khoản
            </Link>
            <Link
              to="/privacy"
              className="hover:text-white transition-colors hover:underline underline-offset-2"
            >
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
