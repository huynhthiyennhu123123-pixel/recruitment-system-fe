import React from "react"
import { Link } from "react-router-dom"

// Dữ liệu giả lập (mock)
const jobs = [
  { id: 1, title: "Frontend Developer", company: "TechSoft", location: "Hà Nội" },
  { id: 2, title: "Backend Developer", company: "FinTech VN", location: "TP.HCM" },
  { id: 3, title: "UI/UX Designer", company: "CreativeHub", location: "Đà Nẵng" },
]

export default function HomePage() {
  return (
    <div style={{ padding: "20px" }}>
      {/* Banner */}
      <section style={{ padding: "30px", background: "#2a9d8f", color: "white", borderRadius: "10px" }}>
        <h1>Chào mừng đến với JobRecruit 🚀</h1>
        <p>Nền tảng tìm việc và tuyển dụng thông minh</p>
        <Link to="/jobs" style={{ color: "#fff", fontWeight: "bold", textDecoration: "underline" }}>
          Xem tất cả việc làm →
        </Link>
      </section>

      {/* Việc làm nổi bật */}
      <section style={{ marginTop: "30px" }}>
        <h2>Việc làm nổi bật</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "15px", marginTop: "15px" }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}>
              <h3>{job.title}</h3>
              <p><b>Công ty:</b> {job.company}</p>
              <p><b>Địa điểm:</b> {job.location}</p>
              <Link to={`/jobs/${job.id}`} style={{ color: "#2a9d8f" }}>Xem chi tiết</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
