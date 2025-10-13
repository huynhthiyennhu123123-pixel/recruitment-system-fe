import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function PublicLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f8f9fa",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          padding: "20px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
