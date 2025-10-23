import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import JobSearchSection from "../../layout/JobSearchSection";
import { latestJobs, searchJobs } from "../../services/jobService";
import { saveJob, unsaveJob, getJobDetailWithSave } from "../../services/savedJobService";
import { toast } from "react-toastify";
import { FaHeart} from "react-icons/fa";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaSpinner,
  FaArrowRight,
  FaBriefcase,
  FaRegHeart,
} from "react-icons/fa";
import RecommendedCarousel from "../../components/RecommendedCarousel";
import { motion } from "framer-motion";
import "../../styles/HomePage.css";

export default function HomePage() {
  const [latest, setLatest] = useState([]);
  const [javaJobs, setJavaJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const heroRef = useRef(null);
  const baseUrl = "http://localhost:8081";

  // 🔹 Lấy chiều cao header
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
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

  // 🔹 Load công ty (mock nếu API trống)
  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/companies`, {
          params: { page: 0, size: 6, sortBy: "createdAt", sortDir: "DESC" },
        });
        const list = res.data?.data?.content || [];
        if (list.length > 0) setCompanies(list);
        else {
          setCompanies([
            {
              id: 1,
              name: "Tech Innovate Co.",
              city: "Hồ Chí Minh",
              logoUrl: "/companies/tech.png",
            },
            {
              id: 2,
              name: "NextGen Solutions",
              city: "Hà Nội",
              logoUrl: "/companies/nextgen.png",
            },
            {
              id: 3,
              name: "AI Vision Corp",
              city: "Đà Nẵng",
              logoUrl: "/companies/aivision.png",
            },
          ]);
        }
      } catch (err) {
        console.error("Lỗi tải công ty:", err);
      }
    };
    fetchTopCompanies();
  }, []);

  // 💼 JobCard
  const JobCard = ({ job }) => {
  const [hovered, setHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [saving, setSaving] = useState(false);

  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  // ✅ Kiểm tra xem job này đã được lưu chưa (nếu user đăng nhập)
  useEffect(() => {
    const checkSaved = async () => {
      if (!token) return;
      try {
        const res = await getJobDetailWithSave(job.id);
        const data = res?.data?.data || res?.data;
        if (data && data.isSaved !== undefined) {
          setIsSaved(data.isSaved);
        }
      } catch (err) {
        console.warn("Không kiểm tra được trạng thái lưu:", err);
      }
    };
    checkSaved();
  }, [job.id, token]);

  // ✅ Toggle lưu / bỏ lưu
  const toggleSave = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.warning("Vui lòng đăng nhập để lưu việc làm!");
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(job.id);
        setIsSaved(false);
        toast.info("Đã bỏ lưu việc làm");
      } else {
        await saveJob(job.id);
        setIsSaved(true);
        toast.success("Đã lưu việc làm thành công");
      }
    } catch (err) {
      console.error("❌ Lỗi khi lưu việc làm:", err);
      toast.error("Không thể lưu việc làm!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="job-card relative border border-gray-100 rounded-2xl p-6 shadow-sm bg-white overflow-hidden group"
    >
      {/* ❤️ Nút lưu việc */}
      <button
        onClick={toggleSave}
        disabled={saving}
        className={`job-save-btn transition-all ${
          isSaved
            ? "!text-red-500 hover:text-red-400"
            : "text-gray-400 hover:text-[#00b14f]"
        }`}
        title={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
      >
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </button>

      {/* Logo + Tiêu đề */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={job.company?.logoUrl || "/default-company.png"}
          alt={job.company?.name || "Công ty"}
          className="job-logo"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#00b14f] line-clamp-1 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1 job-company">
            {job.company?.name || "Công ty chưa xác định"}
          </p>
        </div>
      </div>

      {/* Thông tin việc làm */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-[#00b14f]" />
          <span>{job.location || "Không rõ địa điểm"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaBriefcase className="text-[#00b14f]" />
          <span>{job.jobType || "Full-time"}</span>
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
      <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
        <span>
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

      {/* 🌿 Overlay xanh + nút “Ứng tuyển ngay” */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="job-overlay"
      >
        <Link to={`/jobs/${job.id}`} className="job-apply-btn">
          Ứng tuyển ngay
        </Link>
      </motion.div>
    </motion.div>
  );
};

  // 🏢 CompanyCard
  const CompanyCard = ({ company }) => (
    <motion.div whileHover={{ scale: 1.03 }} className="company-card">
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
      {/* 🌟 Hero */}
      <div className="relative left-1/2 right-1/2 w-screen -mx-[50vw]">
        <section
          ref={heroRef}
          className="relative h-[480px] sm:h-[520px] bg-cover bg-center flex flex-col items-center justify-center text-center"
          style={{
            backgroundImage: "url('/hero-banner.jpg')",
            paddingTop: `${headerHeight}px`,
            marginTop: "-1px",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RecommendedCarousel />

        {/* 🧭 Ngành nghề */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-8 text-center">
            Khám phá việc làm theo ngành nghề
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 text-center">
            {["CNTT - Phần mềm", "Kinh doanh", "Marketing", "Thiết kế", "Kế toán", "Nhân sự"].map(
              (cat) => (
                <motion.div
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition"
                >
                  <p className="font-medium text-gray-700">{cat}</p>
                </motion.div>
              )
            )}
          </div>
        </motion.section>

        {/* 🆕 Việc làm mới nhất */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.section>

        {/* 💻 Việc làm Java nổi bật */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-5">
            Việc làm Java nổi bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {javaJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.section>

        {/* 🏢 Công ty nổi bật */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
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
          viewport={{ once: true, amount: 0.2 }}
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

        {/* 📰 Tin tức & Cẩm nang */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-8 text-center">
            Tin tức & Cẩm nang nghề nghiệp
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "5 Mẹo giúp CV của bạn nổi bật trước nhà tuyển dụng",
                img: "/cv-tips.png",
                desc: "Từ ngôn từ, bố cục đến cách trình bày – cùng tìm hiểu cách khiến CV của bạn ghi điểm tuyệt đối.",
              },
              {
                title: "Cách trả lời câu hỏi phỏng vấn khó nhằn nhất",
                img: "/interview.jpg",
                desc: "Đối mặt với câu hỏi 'Điểm yếu của bạn là gì?' một cách tự tin và chuyên nghiệp.",
              },
              {
                title: "Top ngành nghề hot năm 2025: Cơ hội và xu hướng",
                img: "/hot-jobs.png",
                desc: "Ngành công nghệ, AI, và Marketing kỹ thuật số đang dẫn đầu xu hướng tuyển dụng 2025.",
              },
            ].map((a, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <img
                  src={a.img}
                  alt={a.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {a.desc}
                  </p>
                  <Link
                    to="/articles"
                    className="text-[#00b14f] font-medium text-sm hover:underline"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 📊 Thống kê */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20"
        >
          <div className="bg-green-50 rounded-3xl py-12 px-6 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-10">
              Cùng JobRecruit tạo nên mạng lưới tuyển dụng lớn mạnh
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "15K+", label: "Công việc đang tuyển" },
                { number: "8K+", label: "Nhà tuyển dụng uy tín" },
                { number: "200K+", label: "Ứng viên hoạt động" },
                { number: "98%", label: "Tỷ lệ phản hồi nhanh" },
              ].map((item) => (
                <div key={item.label}>
                  <h3 className="text-3xl font-bold text-green-600 mb-1">
                    {item.number}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
      

    </div>
  );
}
