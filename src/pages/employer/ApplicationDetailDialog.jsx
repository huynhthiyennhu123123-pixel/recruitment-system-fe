import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  Divider,
  CircularProgress,
  Avatar,
  Chip,
  Paper,
} from "@mui/material"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"
import { getApplicationById, updateApplicationStatus } from "../../services/employerService"

export default function ApplicationDetailDialog({ open, id, onClose }) {
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchDetail = async () => {
      setLoading(true)
      const res = await getApplicationById(id)
      setApp(res?.data)
      setLoading(false)
    }
    fetchDetail()
  }, [id])

  const handleUpdate = async () => {
    if (!newStatus) return alert("Vui lòng chọn trạng thái mới.")
    setUpdating(true)
    const res = await updateApplicationStatus(id, newStatus, notes)
    if (res.success) {
      alert("Cập nhật trạng thái thành công!")
      setApp(res.data)
    } else alert(res.message || "Cập nhật thất bại.")
    setUpdating(false)
  }

  const statusColor = {
    RECEIVED: "default",
    REVIEWED: "info",
    INTERVIEW: "primary",
    OFFER: "warning",
    HIRED: "success",
    REJECTED: "error",
  }

  const statusLabel = {
    RECEIVED: "Đã nhận",
    REVIEWED: "Đã xem",
    INTERVIEW: "Phỏng vấn",
    OFFER: "Đề nghị",
    HIRED: "Đã tuyển",
    REJECTED: "Từ chối",
  }

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      {/* 🟩 Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg,#2e7d32,#81c784)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: "bold",
        }}
      >
        <WorkOutlineIcon sx={{ fontSize: 26 }} />
        Chi tiết đơn ứng tuyển
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: "#fafdf9" }}>
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <>
            {/* 🧑‍💼 Thông tin ứng viên */}
            <Paper
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={app.applicant?.avatarUrl || undefined}
                alt={app.applicant?.fullName}
                sx={{
                  bgcolor: app.applicant?.avatarUrl ? "transparent" : "#2e7d32",
                  color: "#fff",
                  width: 64,
                  height: 64,
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {!app.applicant?.avatarUrl &&
                  (app.applicant?.fullName?.[0]?.toUpperCase() || "?")}
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight="bold" color="#1b5e20">
                  {app.applicant?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📧 {app.applicant?.email || "Không có email"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ứng tuyển: {app.jobPosting?.title || "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Địa điểm: {app.jobPosting?.location || "—"}
                </Typography>
              </Box>
            </Paper>

            {/* 📄 Thông tin thêm */}
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Trạng thái hiện tại:
            </Typography>
            <Chip
              label={statusLabel[app.status] || app.status}
              color={statusColor[app.status] || "default"}
              sx={{ mb: 2, fontWeight: 500 }}
            />

            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Thư giới thiệu
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="body2">
                {app.coverLetter || "Không có thư giới thiệu."}
              </Typography>
            </Paper>

            {/* ⚙️ Form cập nhật */}
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 1, color: "#1b5e20" }}
            >
              Cập nhật trạng thái
            </Typography>

            <Box display="flex" gap={2} mb={3} alignItems="center">
              <TextField
                select
                label="Trạng thái mới"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                size="small"
                sx={{ width: 200 }}
              >
                <MenuItem value="REVIEWED">Đã xem</MenuItem>
                <MenuItem value="INTERVIEW">Phỏng vấn</MenuItem>
                <MenuItem value="OFFER">Đề nghị</MenuItem>
                <MenuItem value="HIRED">Đã tuyển</MenuItem>
                <MenuItem value="REJECTED">Từ chối</MenuItem>
              </TextField>

              <TextField
                label="Ghi chú"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />

              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={updating}
                sx={{
                  background: "linear-gradient(45deg,#2e7d32,#43a047)",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 3,
                  "&:hover": { background: "linear-gradient(45deg,#388e3c,#1b5e20)" },
                }}
              >
                {updating ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ⏳ Timeline */}
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 1, color: "#1b5e20" }}
            >
              Lịch sử thay đổi trạng thái
            </Typography>

            {app.timeline?.length ? (
              <Box sx={{ pl: 2, position: "relative" }}>
                {app.timeline.map((t, i) => (
                  <Box key={i} sx={{ mb: 1.5, position: "relative" }}>
                    {/* Chấm tròn timeline */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: -15,
                        top: 7,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor:
                          statusColor[t.toStatus] === "success"
                            ? "#2e7d32"
                            : statusColor[t.toStatus] === "error"
                            ? "#d32f2f"
                            : "#9e9e9e",
                      }}
                    />
                    <Typography variant="body2">
                      <b>{new Date(t.changedAt).toLocaleString("vi-VN")}</b> —{" "}
                      {statusLabel[t.fromStatus] || t.fromStatus} ➜{" "}
                      <b>{statusLabel[t.toStatus] || t.toStatus}</b>
                      {t.note && (
                        <Typography
                          component="span"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({t.note})
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                Chưa có lịch sử thay đổi.
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ fontWeight: 600 }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
