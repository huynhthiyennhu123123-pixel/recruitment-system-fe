import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";  

export default function PublicLayout() {
  return (
    <div>
      <Header />

      <main style={{ padding: "20px" }}>
        <Outlet /> {/* Trang con sẽ render ở đây */}
      </main>

      <Footer /> {/* 👈 Gọi Footer riêng */}
    </div>
  );
}
