import React, { useEffect, useState } from "react"
import JobSearchSection from "../../layout/JobSearchSection"
import { latestJobs } from "../../services/jobService"
import { Link } from "react-router-dom"
import { CircularProgress } from "@mui/material"

export default function HomePage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await latestJobs({ page: 0, size: 8 })
        setJobs(res.data.data.content || [])
      } catch (err) {
        console.error("Lỗi khi tải việc làm:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  return (
    <div>
      <JobSearchSection />

      <section style={{ marginTop: "30px" }}>
        <h2>💼 Việc làm mới nhất</h2>

        {loading ? (
          <CircularProgress color="success" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  background: "#fff",
                }}
              >
                <h3>{job.title}</h3>
                <p>
                  <b>Công ty:</b> {job.company?.name || "Đang cập nhật"}
                </p>
                <p>
                  <b>Địa điểm:</b> {job.location}
                </p>
                <Link to={`/jobs/${job.id}`} style={{ color: "#2a9d8f" }}>
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
