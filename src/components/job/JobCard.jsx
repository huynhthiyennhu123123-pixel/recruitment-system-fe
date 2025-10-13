import { Link } from "react-router-dom"

export default function JobCard({ job }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
      }}
    >
      <h3>{job.title}</h3>
      <p>
        <b>Công ty:</b> {job.company?.name || "Đang cập nhật"}
      </p>
      <p>
        <b>Địa điểm:</b> {job.location}
      </p>
      <p>
        <b>Mức lương:</b> {job.salaryMin} - {job.salaryMax}
      </p>
      <Link to={`/jobs/${job.id}`} style={{ color: "#2a9d8f" }}>
        Xem chi tiết
      </Link>
    </div>
  )
}
