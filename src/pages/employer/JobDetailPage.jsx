import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Button,
  Avatar,
} from "@mui/material"
import {
  WorkOutline,
  MonetizationOnOutlined,
  LocationOnOutlined,
  CalendarMonthOutlined,
  SchoolOutlined,
  CheckCircleOutline,
  BusinessOutlined,
  ArrowBack,
} from "@mui/icons-material"
import { getJobById } from "../../services/employerService"

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true)
      try {
        const res = await getJobById(id)
        setJob(res?.data)
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết job:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "DRAFT":
        return "default"
      case "EXPIRED":
        return "warning"
      default:
        return "info"
    }
  }

  if (loading)
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress color="success" />
      </Box>
    )

  if (!job)
    return (
      <Typography textAlign="center" color="text.secondary" mt={5}>
        Không tìm thấy tin tuyển dụng.
      </Typography>
    )

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", my: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: "#2e7d32" }}
      >
        Quay lại
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "#e8f5e9",
              color: "#2e7d32",
              width: 56,
              height: 56,
            }}
          >
            <WorkOutline />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#2e7d32">
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.company?.name || "Không rõ công ty"}
            </Typography>
          </Box>
          <Chip
            label={
              job.status === "ACTIVE"
                ? "Đang hiển thị"
                : job.status === "DRAFT"
                ? "Bản nháp"
                : "Hết hạn"
            }
            color={getStatusColor(job.status)}
            sx={{ ml: "auto" }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Thông tin cơ bản */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnOutlined color="success" />
              <Typography>
                <strong>Địa điểm:</strong> {job.location}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthOutlined color="success" />
              <Typography>
                <strong>Hạn nộp:</strong>{" "}
                {new Date(job.applicationDeadline).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <SchoolOutlined color="success" />
              <Typography>
                <strong>Trình độ:</strong> {job.educationRequired || "Không yêu cầu"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <MonetizationOnOutlined color="success" />
              <Typography>
                <strong>Lương:</strong> {job.salaryMin?.toLocaleString()} -{" "}
                {job.salaryMax?.toLocaleString()} {job.salaryCurrency}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircleOutline color="success" />
              <Typography>
                <strong>Kinh nghiệm:</strong>{" "}
                {job.experienceRequired || "Không yêu cầu"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Nội dung mô tả */}
        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" color="#2e7d32" fontWeight="bold" gutterBottom>
            Mô tả công việc
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {job.description}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" color="#2e7d32" fontWeight="bold" gutterBottom>
            Yêu cầu ứng viên
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {job.requirements}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" color="#2e7d32" fontWeight="bold" gutterBottom>
            Phúc lợi
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {job.benefits}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" color="#2e7d32" fontWeight="bold" gutterBottom>
            Kỹ năng yêu cầu
          </Typography>
          <Typography variant="body1">{job.skillsRequired}</Typography>
        </Box>

        {/* Thông tin công ty */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight="bold" color="#2e7d32" gutterBottom>
          Thông tin công ty
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <BusinessOutlined color="success" />
              <Typography>{job.company?.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Ngành nghề:</strong> {job.company?.industry || "Chưa cập nhật"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Website:</strong>{" "}
              <a
                href={job.company?.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2e7d32" }}
              >
                {job.company?.website}
              </a>
            </Typography>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Đăng lúc:{" "}
            {new Date(job.createdAt).toLocaleString("vi-VN")} — Cập nhật:{" "}
            {new Date(job.updatedAt).toLocaleString("vi-VN")}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
