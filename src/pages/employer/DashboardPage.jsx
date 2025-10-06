import React, { useEffect, useState } from "react"
import { Box, Grid, Paper, Typography } from "@mui/material"
import { employerService } from "../../services/employerService"

export default function DashboardPage() {
  const [stats, setStats] = useState({ jobs: 0, applicants: 0, interviews: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jobsRes = await employerService.getMyJobs(0, 1)
        const applicantsRes = await employerService.getApplicants()
        const interviewsRes = await employerService.getInterviews()

        setStats({
          jobs: jobsRes.data.totalElements,
          applicants: applicantsRes.data.length,
          interviews: interviewsRes.data.length
        })
      } catch (err) {
        console.error("Fetch dashboard stats failed:", err)
      }
    }
    fetchStats()
  }, [])

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Bảng điều khiển Nhà tuyển dụng
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Tin tuyển dụng</Typography>
            <Typography variant="h4" color="primary">{stats.jobs}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Ứng viên</Typography>
            <Typography variant="h4" color="secondary">{stats.applicants}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Phỏng vấn</Typography>
            <Typography variant="h4" color="success.main">{stats.interviews}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
