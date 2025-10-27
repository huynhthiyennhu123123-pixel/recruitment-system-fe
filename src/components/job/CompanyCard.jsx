import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function CompanyCard({ company }) {
  if (!company || Object.keys(company).length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <img
          src="/default-company.png"
          alt="Default company"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            marginBottom: "10px",
            objectFit: "cover",
            background: "#f9f9f9",
          }}
        />
        <h3 style={{ color: "#555", fontWeight: 600 }}>Đang cập nhật...</h3>
        <p style={{ color: "#999", fontSize: "14px" }}>Chưa có thông tin</p>
      </div>
    );
  }
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -3 }}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
      className="company-card bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg text-center transition-all"
    >
      <img
        src={company.logoUrl || "/default-company.png"}
        alt={company.name}
        className="w-20 h-20 mx-auto rounded-full object-cover mb-3 border border-gray-100 bg-gray-50"
      />
      <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
        {company.name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-1">
        {company.city || "Chưa cập nhật địa điểm"}
      </p>
      {company.activeJobsCount !== undefined && (
        <p className="text-[#00b14f] font-medium text-sm mt-1">
          🔹 {company.activeJobsCount} việc làm đang tuyển
        </p>
      )}
      <Link
        to={`/companies/${company.id}`}
        className="inline-block mt-4 text-sm text-[#00b14f] font-medium hover:underline"
      >
        Xem chi tiết →
      </Link>
    </motion.div>
  );
}
