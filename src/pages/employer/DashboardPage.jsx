import React, { useEffect, useState } from "react"
import { Box, Grid, Paper, Typography } from "@mui/material"
import WorkOutline from "@mui/icons-material/WorkOutline"
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined"
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined"
import { getMyJobs, getApplicants, getInterviews } from "../../services/employerService"

export default function DashboardPage() {
  const [stats, setStats] = useState({ jobs: 0, applicants: 0, interviews: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jobsRes = await getMyJobs(0, 1)
        const applicantsRes = await getApplicants()
        const interviewsRes = await getInterviews()

        setStats({
          jobs: jobsRes?.data?.totalElements || 0,
          applicants: applicantsRes?.data?.length || 0,
          interviews: interviewsRes?.data?.length || 0,
        })
      } catch (err) {
        console.error("Fetch dashboard stats failed:", err)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    {
      title: "Tin tuyển dụng",
      value: stats.jobs,
      color: "#2e7d32",
      icon: <WorkOutline sx={{ fontSize: 36, color: "#2e7d32" }} />,
    },
    {
      title: "Ứng viên",
      value: stats.applicants,
      color: "#0288d1",
      icon: <PeopleAltOutlined sx={{ fontSize: 36, color: "#0288d1" }} />,
    },
    {
      title: "Phỏng vấn",
      value: stats.interviews,
      color: "#f57c00",
      icon: <EventAvailableOutlined sx={{ fontSize: 36, color: "#f57c00" }} />,
    },
  ]

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#2e7d32" }}>
        Bảng điều khiển Nhà tuyển dụng
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 3,
                borderLeft: `6px solid ${card.color}`,
                bgcolor: "#f9fef9",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              }}
            >
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: card.color }}>
                  {card.value}
                </Typography>
              </Box>
              {card.icon}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
