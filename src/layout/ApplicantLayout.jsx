import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header"; // ✅ Import header có sẵn

export default function ApplicantLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER (dùng lại component có sẵn) */}
      <Header />

      {/* NỘI DUNG */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
