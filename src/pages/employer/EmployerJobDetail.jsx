import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box, Typography, Paper, Grid, Chip, Avatar, Button, Tabs, Tab, Divider, Card, CardContent, Stack, CircularProgress
} from "@mui/material"
import {
  WorkOutline, MonetizationOnOutlined, LocationOnOutlined, CalendarMonthOutlined,
  SchoolOutlined, CheckCircleOutline, GroupsOutlined, BusinessOutlined,
  VisibilityOutlined, AssignmentIndOutlined
} from "@mui/icons-material"
import { getEmployerJobById } from "../../services/employerService"
import { Line } from "react-chartjs-2"

export default function EmployerJobDetailModern() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))
  const companyId = user?.company?.id
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true)
      try {
        const res = await getEmployerJobById(id)
        setJob(res)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  if (loading) return <Box textAlign="center" mt={10}><CircularProgress color="success" /></Box>
  if (!job) return <Typography textAlign="center" mt={5}>Không tìm thấy tin tuyển dụng.</Typography>

  const infoItems = [
    { icon: <MonetizationOnOutlined />, label: "Lương", value: `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.salaryCurrency}` },
    { icon: <CheckCircleOutline />, label: "Kinh nghiệm", value: job.experienceRequired },
    { icon: <SchoolOutlined />, label: "Trình độ", value: job.educationRequired },
    { icon: <GroupsOutlined />, label: "Số lượng", value: job.numberOfPositions },
    { icon: <CalendarMonthOutlined />, label: "Hạn nộp", value: new Date(job.applicationDeadline).toLocaleDateString("vi-VN") },
    { icon: <VisibilityOutlined />, label: "Lượt xem", value: job.viewsCount },
    { icon: <AssignmentIndOutlined />, label: "Ứng viên", value: job.applicationsCount },
  ]

  const renderTabContent = () => {
    switch (tab) {
      case 0: return <Typography>{job.description}</Typography>
      case 1: return <Typography>{job.requirements}</Typography>
      case 2: return <Typography>{job.benefits}</Typography>
      case 3: return <Typography>{job.skillsRequired}</Typography>
      default: return null
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
      {/* Hero */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3, background: "linear-gradient(90deg,#e8f5e9,#f9fef9)" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 70, height: 70, bgcolor: "#2e7d32" }}><WorkOutline /></Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" fontWeight="bold" color="#2e7d32">{job.title}</Typography>
            <Typography variant="body2">{job.location}</Typography>
            <Chip
              label={job.status === "ACTIVE" ? "Đang hiển thị" : "Bản nháp"}
              color="success"
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item sx={{ marginLeft:120 }}>
            <Button variant="contained" color="success" onClick={() => navigate(`/employer/jobs/${id}/edit`)}>Chỉnh sửa tin</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Info cards */}
      <Grid container spacing={2}>
        {infoItems.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ p: 2, borderRadius: 3, border: "1px solid #a5d6a7", background: "#fff" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {React.cloneElement(item.icon, { color: "success" })}
                <Box>
                  <Typography fontWeight="bold">{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.value}</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mt: 4, borderRadius: 3, p: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          textColor="success"
          indicatorColor="success"
          sx={{ mb: 2 }}
        >
          <Tab label="Mô tả công việc" />
          <Tab label="Yêu cầu ứng viên" />
          <Tab label="Phúc lợi" />
          <Tab label="Kỹ năng" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ whiteSpace: "pre-line" }}>{renderTabContent()}</Typography>
      </Paper>

     {/* Company info - Modern Card Style */}
      <Paper
        sx={{
          mt: 5,
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(145deg, #f0fff4 0%, #ffffff 100%)",
          border: "1px solid #c8e6c9",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Logo + Name */}
          <Grid item xs={12} md={3} textAlign="center">
            <Avatar
              src={job.company?.logoUrl || ""}
              alt={job.company?.name}
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 1,
                bgcolor: "#e8f5e9",
                border: "2px solid #a5d6a7",
              }}
            >
              {job.company?.name?.charAt(0) || "C"}
            </Avatar>
            <Typography variant="h6" fontWeight="bold" color="#2e7d32">
              {job.company?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.company?.industry || "Chưa cập nhật ngành nghề"}
            </Typography>
          </Grid>

          {/* Company Details */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <BusinessOutlined color="success" />
                <Typography variant="body1">
                  <strong>Địa chỉ:</strong> {job.company?.address || "—"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnOutlined color="success" />
                <Typography variant="body1">
                  <strong>Quốc gia:</strong> {job.company?.country || "—"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <MonetizationOnOutlined color="success" />
                <Typography variant="body1">
                  <strong>Quy mô:</strong>{" "}
                  {job.company?.companySize
                    ? job.company.companySize.replace("_", " ")
                    : "Chưa xác định"}
                </Typography>
              </Box>

              {job.company?.website && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircleOutline color="success" />
                  <Typography variant="body1">
                    <strong>Website:</strong>{" "}
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2e7d32", textDecoration: "none" }}
                    >
                      {job.company.website}
                    </a>
                  </Typography>
                </Box>
              )}

              {job.company?.description && (
                <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                  {job.company.description}
                </Typography>
              )}

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ borderRadius: 2, fontWeight: "bold" }}
                   onClick={() => navigate(`/employer/company/${companyId}`)}
                >
                  Xem hồ sơ công ty
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>


      {/* Footer */}
      <Box mt={4} textAlign="center" color="text.secondary">
        <Typography variant="body2">
          Đăng: {new Date(job.publishedAt).toLocaleString("vi-VN")} — Cập nhật: {new Date(job.updatedAt).toLocaleString("vi-VN")}
        </Typography>
      </Box>
    </Box>
  )
}
