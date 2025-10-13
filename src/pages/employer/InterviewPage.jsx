import React, { useEffect, useState } from "react"
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Avatar, Divider,
  Button, Chip, CircularProgress, Stack
} from "@mui/material"
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined"
import PersonOutline from "@mui/icons-material/PersonOutline"
import { getMyInterviews, cancelInterview, completeInterview } from "../../services/interviewService"
import InterviewFormDialog from "./InterviewFormDialog"
import InterviewDetailDialog from "./InterviewDetailDialog"

export default function InterviewPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [openDetail, setOpenDetail] = useState(null)

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true)
      try {
        const res = await getInterviews()
        setInterviews(
          Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.data)
              ? res.data.data
              : []
        )

      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách phỏng vấn:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleComplete = async (id) => {
    if (window.confirm("Xác nhận hoàn tất phỏng vấn này?")) {
      await completeInterview(id, "Phỏng vấn thành công")
      fetchData()
    }
  }

  const colorMap = {
    SCHEDULED: "info",
    COMPLETED: "success",
    CANCELLED: "error",
    RESCHEDULED: "warning"
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold" color="#2e7d32" sx={{ display: "flex", gap: 1 }}>
          <EventAvailableOutlined /> Lịch phỏng vấn
        </Typography>
        <Button variant="contained" color="success" onClick={() => setOpenForm(true)}>
          + Tạo lịch
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mt: 2, borderRadius: 3 }}>
        {loading ? (
          <Box textAlign="center" py={5}><CircularProgress color="success" /></Box>
        ) : interviews.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={5}>
            Chưa có lịch phỏng vấn nào.
          </Typography>
        ) : (
          <List>
            {interviews.map((i, idx) => (
              <React.Fragment key={i.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => setOpenDetail(i)}>Chi tiết</Button>
                      {i.status === "SCHEDULED" && (
                        <>
                          <Button size="small" color="success" onClick={() => handleComplete(i.id)}>Hoàn tất</Button>
                          <Button size="small" color="error" onClick={() => handleCancel(i.id)}>Hủy</Button>
                        </>
                      )}
                    </Stack>
                  }
                >
                  <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
                    <PersonOutline />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight="bold">
                        📞 {i.interviewType} – {new Date(i.scheduledAt).toLocaleString("vi-VN")}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Địa điểm: {i.location || "Trực tuyến"}  
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
                {idx < interviews.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Dialogs */}
      <InterviewFormDialog open={openForm} onClose={() => { setOpenForm(false); fetchData() }} />
      {openDetail && (
        <InterviewDetailDialog interview={openDetail} onClose={() => setOpenDetail(null)} />
      )}
    </Box>
  )
}
