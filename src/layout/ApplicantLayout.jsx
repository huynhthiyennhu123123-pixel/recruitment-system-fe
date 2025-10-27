import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function ApplicantLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
