import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCompanyById } from "../../services/companyService";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaGlobe,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import JobCard from "../../components/job/JobCard";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await getCompanyById(id);
        setCompanyData(res?.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết công ty:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin border-4 border-[#00b14f] border-t-transparent rounded-full w-10 h-10"></div>
      </div>
    );

  if (!companyData || !companyData.company)
    return (
      <div className="text-center text-gray-600 py-10">
        Không tìm thấy công ty.
      </div>
    );
  const { company, jobs } = companyData;

  const coverImage =
    company.coverUrl ||
    "/default-cover.jpg"; 
  const logoImage =
    company.logoUrl || "/default-company.png"; 

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className="relative w-full h-60 bg-center bg-cover"
        style={{
          backgroundImage: `url('${coverImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
          <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
            <img
              src={logoImage}
              alt={company.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">
            {company.name}
          </h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              Giới thiệu công ty
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {company.description || "Chưa có mô tả công ty."}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              Thông tin chung
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              {company.address && (
                <li className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-[#00b14f]" />
                  <span>{company.address}</span>
                </li>
              )}
              {company.city && (
                <li>
                  <strong>Thành phố:</strong> {company.city}
                </li>
              )}
              {company.country && (
                <li>
                  <strong>Quốc gia:</strong> {company.country}
                </li>
              )}
              {company.industry && (
                <li>
                  <strong>Lĩnh vực:</strong> {company.industry}
                </li>
              )}
              {company.companySize && (
                <li>
                  <strong>Quy mô:</strong> {company.companySize}
                </li>
              )}
              {company.employeeCount !== undefined && (
                <li>
                  <strong>Số nhân viên:</strong> {company.employeeCount}
                </li>
              )}
              {company.activeJobsCount !== undefined && (
                <li>
                  <strong>Đang tuyển:</strong> {company.activeJobsCount} việc làm
                </li>
              )}
              {company.phoneNumber && (
                <li className="flex items-center gap-2">
                  <FaPhone className="text-[#00b14f]" /> {company.phoneNumber}
                </li>
              )}
              {company.contactEmail && (
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-[#00b14f]" />{" "}
                  {company.contactEmail}
                </li>
              )}
              {company.website && (
                <li className="flex items-center gap-2">
                  <FaGlobe className="text-[#00b14f]" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00b14f] hover:underline"
                  >
                    {company.website}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        {company.companyPhotos && company.companyPhotos.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              Hình ảnh công ty
            </h2>
            <div className="flex flex-wrap gap-3">
              {company.companyPhotos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`photo-${i}`}
                  className="w-60 h-40 rounded-lg object-cover border border-gray-200"
                />
              ))}
            </div>
          </div>
        )}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Việc làm đang tuyển
          </h2>
          {jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              Doanh nghiệp hiện không có tin tuyển dụng nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
