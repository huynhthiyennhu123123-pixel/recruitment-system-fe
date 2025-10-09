import React, { useEffect, useState } from "react"
import { Box, Typography, Grid, Card, CardContent, Avatar, Divider, CircularProgress } from "@mui/material"
import { getEmployerJobs } from "../../services/employerService"

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getEmployerJobs(0, 50) // lấy 50 job mới nhất
        if (res?.data?.content) {
          setJobs(res.data.content)
        } else {
          setJobs([])
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải việc làm:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  if (loading)
    return (
      <Box textAlign="center" py={3}>
        <CircularProgress color="success" />
      </Box>
    )

  if (jobs.length === 0)
    return (
      <Typography textAlign="center" color="text.secondary" mt={3}>
        Hiện tại chưa có tin tuyển dụng nào.
      </Typography>
    )

  return (
    <Box>
      {jobs.map((job, index) => (
        <Card
          key={job.id}
          sx={{
            mb: 2,
            borderRadius: 2,
            transition: "0.3s",
            "&:hover": { boxShadow: 6, transform: "translateY(-2px)" }
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              {/* Logo */}
              <Grid item>
                <Avatar
                  src={job.company?.logoUrl || "/assets/default-logo.png"}
                  variant="square"
                  sx={{ width: 56, height: 56 }}
                />
              </Grid>

              {/* Nội dung */}
              <Grid item xs>
                <Typography variant="subtitle1" fontWeight="bold" color="#2a9d8f">
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {job.location || "Đang cập nhật"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  💰{" "}
                  {job.salaryMin && job.salaryMax
                    ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.salaryCurrency}`
                    : "Thỏa thuận"}
                </Typography>
              </Grid>

              {/* Cập nhật */}
              <Grid item xs={12} md="auto" textAlign={{ xs: "left", md: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  Cập nhật: {new Date(job.updatedAt).toLocaleDateString("vi-VN")}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          {index < jobs.length - 1 && <Divider />}
        </Card>
      ))}
    </Box>
  )
}
