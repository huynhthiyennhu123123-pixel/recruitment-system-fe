import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material"
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined"
import PersonOutline from "@mui/icons-material/PersonOutline"
import { getInterviews } from "../../services/employerService"

export default function InterviewPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true)
      try {
        const res = await getInterviews()
        setInterviews(res?.data || [])
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách phỏng vấn:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInterviews()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "info"
      case "COMPLETED":
        return "success"
      case "CANCELED":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 4 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#2e7d32"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <EventAvailableOutlined sx={{ fontSize: 28 }} />
        Lịch phỏng vấn
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress color="success" />
          </Box>
        ) : interviews.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            py={5}
          >
            Hiện chưa có lịch phỏng vấn nào.
          </Typography>
        ) : (
          <List>
            {interviews.map((i, idx) => (
              <React.Fragment key={i.id || idx}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                      color="success"
                    >
                      Xem chi tiết
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#2e7d32" }}>
                      <PersonOutline />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {i.candidateName || "Ứng viên ẩn danh"} —{" "}
                        {i.jobTitle || "Không xác định"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          ⏰{" "}
                          {i.date
                            ? new Date(i.date).toLocaleString("vi-VN")
                            : "Chưa có thời gian"}
                        </Typography>
                        {i.status && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={
                                i.status === "SCHEDULED"
                                  ? "Đã lên lịch"
                                  : i.status === "COMPLETED"
                                  ? "Đã hoàn thành"
                                  : i.status === "CANCELED"
                                  ? "Đã huỷ"
                                  : i.status
                              }
                              color={getStatusColor(i.status)}
                              size="small"
                            />
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {idx < interviews.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
