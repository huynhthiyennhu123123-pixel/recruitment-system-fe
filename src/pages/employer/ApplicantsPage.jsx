import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material"
import PersonOutline from "@mui/icons-material/PersonOutline"
import WorkOutline from "@mui/icons-material/WorkOutline"
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined"
import { getApplicants } from "../../services/employerService"

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true)
      try {
        const res = await getApplicants()
        setApplicants(res?.data || [])
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách ứng viên:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplicants()
  }, [])

  // 🧮 Tính thống kê trạng thái
  const pendingCount = applicants.filter((a) => a.status === "PENDING").length
  const approvedCount = applicants.filter((a) => a.status === "APPROVED").length
  const rejectedCount = applicants.filter((a) => a.status === "REJECTED").length

  const formatTimeAgo = (dateString) => {
    const diff = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24))
    if (diff <= 0) return "Hôm nay"
    if (diff === 1) return "1 ngày trước"
    return `${diff} ngày trước`
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 4 }}>
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: "linear-gradient(45deg, #2e7d32, #66bb6a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <PersonOutline sx={{ fontSize: 28, color: "#2e7d32" }} />
        Ứng viên đã ứng tuyển
      </Typography>

      {/* Thống kê */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Đang chờ", value: pendingCount, bg: "linear-gradient(135deg,#fff59d,#fbc02d)" },
          { label: "Được chấp nhận", value: approvedCount, bg: "linear-gradient(135deg,#81c784,#43a047)" },
          { label: "Bị từ chối", value: rejectedCount, bg: "linear-gradient(135deg,#ef9a9a,#e53935)" },
        ].map((item, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                background: item.bg,
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": { transform: "translateY(-4px)", transition: "0.3s" },
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
              <Typography variant="body1">{item.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Danh sách ứng viên */}
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress color="success" />
          </Box>
        ) : applicants.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            py={5}
          >
            Chưa có ứng viên nào ứng tuyển.
          </Typography>
        ) : (
          <List disablePadding>
            {applicants.map((a, idx) => (
              <React.Fragment key={a.id || idx}>
                <ListItem
                  sx={{
                    bgcolor: idx % 2 === 0 ? "#f9fbe7" : "#ffffff",
                    borderRadius: 2,
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#f1f8e9" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "#2e7d32",
                        width: 48,
                        height: 48,
                        fontWeight: "bold",
                      }}
                    >
                      {a.fullName ? a.fullName[0].toUpperCase() : <PersonOutline />}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold" color="#1b5e20">
                        {a.fullName || "Ứng viên ẩn danh"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <WorkOutline sx={{ fontSize: 18, color: "#757575" }} />
                          <Typography variant="body2" color="text.secondary">
                            Ứng tuyển vào: {a.jobTitle || "Không xác định"}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <CalendarMonthOutlined sx={{ fontSize: 18, color: "#757575" }} />
                          <Tooltip title={a.appliedAt ? new Date(a.appliedAt).toLocaleString("vi-VN") : ""}>
                            <Typography variant="body2" color="text.secondary">
                              {a.appliedAt ? `Ứng tuyển ${formatTimeAgo(a.appliedAt)}` : "Không rõ"}
                            </Typography>
                          </Tooltip>
                        </Box>

                        {a.status && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={
                                a.status === "PENDING"
                                  ? "Đang chờ duyệt"
                                  : a.status === "APPROVED"
                                  ? "Đã chấp nhận"
                                  : a.status === "REJECTED"
                                  ? "Đã từ chối"
                                  : "Không xác định"
                              }
                              sx={{
                                fontWeight: 500,
                                background:
                                  a.status === "APPROVED"
                                    ? "linear-gradient(45deg,#81c784,#43a047)"
                                    : a.status === "REJECTED"
                                    ? "linear-gradient(45deg,#ef9a9a,#e53935)"
                                    : "linear-gradient(45deg,#fff59d,#fbc02d)",
                                color: a.status === "REJECTED" ? "#fff" : "#000",
                              }}
                            />
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {idx < applicants.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
