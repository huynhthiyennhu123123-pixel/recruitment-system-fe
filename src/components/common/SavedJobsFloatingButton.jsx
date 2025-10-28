import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

export default function SavedJobsFloatingButton() {
  const location = useLocation();
  const isPrivateRoute =
    location.pathname.startsWith("/applicant") ||
    location.pathname.startsWith("/employer");

  if (isPrivateRoute) return null; 

  return (
    <Link
      to="/applicant/saved-jobs"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#00b14f] hover:bg-[#00a343] text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      title="Xem công việc đã lưu"
    >
      <FaHeart className="text-red-400 text-lg animate-pulse" />
      <span className="hidden sm:inline">Đã lưu</span>
    </Link>
  );
}
