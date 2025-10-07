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

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 4 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#2e7d32"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <PersonOutline sx={{ fontSize: 28 }} />
        Ứng viên đã ứng tuyển
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
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
          <List>
            {applicants.map((a, idx) => (
              <React.Fragment key={a.id || idx}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#2e7d32" }}>
                      <PersonOutline />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
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
                          <Typography variant="body2" color="text.secondary">
                            Ngày ứng tuyển:{" "}
                            {a.appliedAt
                              ? new Date(a.appliedAt).toLocaleDateString("vi-VN")
                              : "Không rõ"}
                          </Typography>
                        </Box>
                        {a.status && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={a.status === "PENDING" ? "Đang chờ" : a.status}
                              color={
                                a.status === "APPROVED"
                                  ? "success"
                                  : a.status === "REJECTED"
                                  ? "error"
                                  : "default"
                              }
                              size="small"
                            />
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {idx < applicants.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
