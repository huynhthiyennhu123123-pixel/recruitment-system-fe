import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import JobSearchSection from "../../layout/JobSearchSection";
import { latestJobs, searchJobs } from "../../services/jobService";
import axios from "axios";
import { FaMapMarkerAlt, FaSpinner, FaArrowRight } from "react-icons/fa";
import RecommendedCarousel from "../../components/RecommendedCarousel";
import { motion } from "framer-motion";

export default function HomePage() {
  const [latest, setLatest] = useState([]);
  const [javaJobs, setJavaJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const heroRef = useRef(null);
  const baseUrl = "http://localhost:8081";

  // 🔹 Lấy chiều cao thật của header để căn sát
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  // 🔹 Load jobs
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [latestRes, javaRes] = await Promise.all([
          latestJobs({ page: 0, size: 6 }),
          searchJobs({
            keyword: "java",
            page: 0,
            size: 6,
            sortBy: "createdAt",
            sortDir: "DESC",
          }),
        ]);
        setLatest(latestRes?.data?.content || []);
        setJavaJobs(javaRes?.data?.content || []);
      } catch (err) {
        console.error("Lỗi tải việc làm:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🔹 Load top companies
  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/companies`, {
          params: { page: 0, size: 6, sortBy: "createdAt", sortDir: "DESC" },
        });
        setCompanies(res.data?.data?.content || []);
      } catch (err) {
        console.error("Lỗi tải công ty:", err);
      }
    };
    fetchTopCompanies();
  }, []);

  // 🎨 JobCard kiểu TopCV Pro
const JobCard = ({ job }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
      className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Logo + tiêu đề */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={job.company?.logoUrl || "/default-company.png"}
          alt={job.company?.name || "Công ty"}
          className="w-14 h-14 rounded-xl border object-cover bg-gray-50"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#00b14f] transition line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {job.company?.name || "Công ty chưa xác định"}
          </p>
        </div>
      </div>

      {/* Thông tin việc làm */}
      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-[#00b14f]" />
          <span>{job.location || "Không rõ địa điểm"}</span>
        </div>

        {job.salaryMin && job.salaryMax ? (
          <p className="text-[#00b14f] font-semibold">
            💰 {job.salaryMin.toLocaleString("vi-VN")}₫ –{" "}
            {job.salaryMax.toLocaleString("vi-VN")}₫
          </p>
        ) : (
          <p className="text-gray-500 italic">Mức lương thỏa thuận</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5">
        <span className="text-xs text-gray-400">
          Cập nhật:{" "}
          {new Date(job.createdAt || Date.now()).toLocaleDateString("vi-VN")}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-medium text-[#00b14f] hover:text-[#008f3f] flex items-center gap-1"
        >
          Xem chi tiết <FaArrowRight size={12} />
        </Link>
      </div>

      {/* Ribbon */}
      <div className="absolute top-0 right-0 bg-[#00b14f] text-white text-xs font-semibold px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow">
        {job.jobType || "Full-time"}
      </div>

      {/* ❤️ Nút lưu việc */}
      <button
        className="absolute top-3 right-3 text-gray-300 hover:text-[#00b14f] transition z-10"
        title="Lưu việc làm"
      >
        <i className="fa-regular fa-heart text-lg"></i>
      </button>

      {/* 🌟 Hiệu ứng hover overlay + nút Ứng tuyển */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-[#00b14f]/90 via-[#00b14f]/60 to-transparent flex items-end justify-center p-5"
      >
        <Link
          to={`/jobs/${job.id}`}
          className="bg-white text-[#00b14f] font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-[#00b14f] hover:text-white transition"
        >
          Ứng tuyển ngay
        </Link>
      </motion.div>
    </motion.div>
  );
};


  // 🎨 Company card
  const CompanyCard = ({ company }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition text-center"
    >
      <img
        src={company.logoUrl || "/default-company.png"}
        alt={company.name}
        className="w-20 h-20 mx-auto rounded-full object-cover mb-3 border"
      />
      <h3 className="font-semibold text-gray-800">{company.name}</h3>
      <p className="text-sm text-gray-500">{company.city || "Chưa cập nhật"}</p>
      <Link
        to={`/companies/${company.id}`}
        className="inline-block mt-3 text-sm text-[#00b14f] font-medium hover:underline"
      >
        Xem chi tiết
      </Link>
    </motion.div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Đang tải việc làm...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 🌟 Hero Section */}
      <div className="relative left-1/2 right-1/2 w-screen -mx-[50vw]">
        <section
          ref={heroRef}
          className="relative h-[480px] sm:h-[520px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center"
          style={{
            backgroundImage: "url('/hero-banner.jpg')",
            paddingTop: `${headerHeight}px`,
            marginTop: "-1px",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 via-transparent"></div>

          {/* Nội dung chính */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-white px-6 w-full"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 drop-shadow-lg">
              Tìm việc làm mơ ước cùng{" "}
              <span className="text-[#00ff99]">Recruitment System</span>
            </h1>
            <p className="text-gray-100 text-lg mb-8 drop-shadow-md">
              Hàng ngàn việc làm chất lượng từ các công ty hàng đầu đang chờ bạn.
            </p>
            <div className="max-w-5xl mx-auto">
              <JobSearchSection />
            </div>
          </motion.div>
        </section>
      </div>

      {/* Nội dung tiếp theo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RecommendedCarousel />

        {/* 🧭 Ngành nghề */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-8 text-center">
            Khám phá việc làm theo ngành nghề
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 text-center">
            {[
              "CNTT - Phần mềm",
              "Kinh doanh",
              "Marketing",
              "Thiết kế",
              "Kế toán",
              "Nhân sự",
            ].map((cat) => (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition"
              >
                <p className="font-medium text-gray-700">{cat}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 🆕 Việc làm mới nhất */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-green-600">Việc làm mới nhất</h2>
            <Link
              to="/jobs"
              className="text-sm text-[#00b14f] font-medium hover:underline flex items-center gap-1"
            >
              Xem tất cả <FaArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latest.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.section>

        {/* 💻 Việc làm Java */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-5">
            Việc làm Java nổi bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {javaJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.section>

        {/* 🏢 Công ty nổi bật */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-5">Công ty nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </motion.section>

        {/* 👔 Dành cho nhà tuyển dụng */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-8">
            Dành cho nhà tuyển dụng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Đăng tin & quản lý đăng tin",
                desc: "Đăng tin để tiếp cận hơn 1M+ ứng viên tiềm năng. Xem và thống kê hiệu quả trực quan.",
                img: "/job1.jpg",
              },
              {
                title: "Tìm kiếm ứng viên",
                desc: "Chủ động tìm kiếm ứng viên từ kho hồ sơ với 50.000+ hồ sơ chất lượng cao.",
                img: "/job2.jpg",
              },
              {
                title: "Quản lý ứng viên",
                desc: "Xem lại hồ sơ ứng viên đã mua/ứng tuyển. Đặt trạng thái hồ sơ để phân loại hiệu quả.",
                img: "/job3.jpg",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-36 object-cover mb-4 rounded-lg"
                />
                <h3 className="font-semibold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
