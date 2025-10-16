import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  CircularProgress,
  Typography,
  Divider,
  Box,
  Tooltip,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { getManagedApplications, getApplicationById } from "../../services/employerService"
import { addParticipants, removeParticipants, cancelInterview } from "../../services/interviewService"
import { toast } from "react-toastify"

export default function ParticipantModal({ open, onClose, interview, onUpdated }) {
  const [loading, setLoading] = useState(true)
  const [applicants, setApplicants] = useState([]) // ứng viên có thể thêm
  const [participants, setParticipants] = useState([]) // ứng viên hiện tại
  const [selectedIds, setSelectedIds] = useState(new Set())

  // 🧩 1️⃣ Lấy danh sách ứng viên hiện tại
  useEffect(() => {
    if (!open || !interview?.applicationId) return

    const fetchCurrentParticipants = async () => {
      try {
        const res = await getApplicationById(interview.applicationId)
        const applicant = res?.data?.applicant
        const job = res?.data?.jobPosting

        if (applicant) {
          setParticipants([
            {
              id: applicant.id,
              name:
                applicant.fullName ||
                `${applicant.firstName || ""} ${applicant.lastName || ""}`.trim(),
              email: applicant.email,
              jobTitle: job?.title || "Không rõ vị trí",
              role: "APPLICANT",
            },
          ])
        }

        if (!interview.jobPostingId && job?.id) {
          interview.jobPostingId = job.id
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy ứng viên của cuộc phỏng vấn:", err)
        toast.error("Không thể tải thông tin ứng viên hiện tại.")
      }
    }

    fetchCurrentParticipants()
  }, [open, interview])

  // 🧩 2️⃣ Lấy danh sách ứng viên có thể thêm
  useEffect(() => {
    if (!open) return
    setLoading(true)

    if (!interview?.jobPostingId) {
      console.warn("❗ Thiếu jobPostingId trong interview object")
      setApplicants([])
      setLoading(false)
      return
    }

    const fetchApplicants = async () => {
      try {
        const res = await getManagedApplications(0, 100, "INTERVIEW", interview.jobPostingId)
        const list = res?.data?.content || []
        const filtered = list.filter(
          (a) => !participants.some((p) => p.id === a.applicant?.id)
        )
        setApplicants(filtered)
      } catch (err) {
        console.error("❌ Lỗi khi tải ứng viên INTERVIEW:", err)
        toast.error("Không thể tải danh sách ứng viên phỏng vấn cùng công việc.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [open, interview, participants])

  // ✅ 3️⃣ Tick chọn ứng viên để thêm
  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  // ✅ 4️⃣ Thêm ứng viên
  const handleAdd = async () => {
    if (selectedIds.size === 0) {
      toast.warn("Vui lòng chọn ít nhất một ứng viên để thêm vào phỏng vấn.")
      return
    }

    try {
      const userIds = Array.from(selectedIds)
      const res = await addParticipants(interview.id, { userIds, role: "APPLICANT" })
      if (res?.success || res?.data?.success) {
        toast.success("🎉 Đã thêm ứng viên vào buổi phỏng vấn thành công!")
        const newlyAdded = applicants
          .filter((a) => selectedIds.has(a.id))
          .map((a) => ({
            id: a.id,
            name: a.applicantName,
            email: a.applicantEmail,
            jobTitle: a.jobTitle,
            role: "APPLICANT",
          }))
        setParticipants((prev) => [...prev, ...newlyAdded])
        setApplicants((prev) => prev.filter((a) => !selectedIds.has(a.id)))
        setSelectedIds(new Set())
        onUpdated?.()
      } else {
        toast.error(res?.message || "Không thể thêm ứng viên.")
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm ứng viên:", err)
      toast.error("Lỗi hệ thống, vui lòng thử lại.")
    }
  }

  const handleRemove = async (userId) => {
  try {
    await removeParticipants(interview.id, { userIds: [userId] })
    toast.success("Đã xóa ứng viên khỏi buổi phỏng vấn.")

    const removed = participants.find((p) => p.id === userId)
    const newList = participants.filter((p) => p.id !== userId)
    setParticipants(newList)

    if (removed) {
      setApplicants((prev) => [
        ...prev,
        {
          id: removed.id,
          applicantName: removed.name,
          applicantEmail: removed.email,
          jobTitle: removed.jobTitle,
        },
      ])
    }

    // ⚡ Nếu không còn ứng viên nào → gọi API HỦY phỏng vấn
    if (newList.length === 0) {
      try {
        await cancelInterview(interview.id, { reason: "Không còn ứng viên nào tham gia" })
        toast.info("🟡 Buổi phỏng vấn đã được hủy vì không còn ứng viên nào.")
        onUpdated?.()
        onClose()
      } catch (err) {
        console.error("❌ Lỗi khi hủy buổi phỏng vấn:", err)
        toast.error("Không thể hủy buổi phỏng vấn.")
      }
    }

    onUpdated?.()
  } catch (err) {
    console.error("❌ Lỗi khi xóa ứng viên:", err)
    toast.error("Không thể xóa ứng viên.")
  }
}

  // ======================================================
  // 🧩 UI
  // ======================================================
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 20, pb: 1 }}>
        👥 Quản lý ứng viên tham gia phỏng vấn
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Ứng viên hiện tại:
        </Typography>

        {participants.length > 0 ? (
          <List dense>
            {participants.map((p) => (
              <ListItem
                key={p.id}
                secondaryAction={
                  <Tooltip title="Xóa ứng viên khỏi phỏng vấn">
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRemove(p.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={`${p.name} — ${p.jobTitle}`}
                  secondary={`Email: ${p.email}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Chưa có ứng viên nào trong cuộc phỏng vấn này.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thêm ứng viên cùng công việc (trạng thái INTERVIEW):
        </Typography>

        {loading ? (
          <Box textAlign="center" py={2}>
            <CircularProgress size={28} />
          </Box>
        ) : applicants.length === 0 ? (
          <Typography color="text.secondary">Không có ứng viên phù hợp.</Typography>
        ) : (
          <List dense>
            {applicants.map((a) => (
              <ListItem
                key={a.id}
                button
                onClick={() => handleToggle(a.id)}
                sx={{
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#f9fafb" },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={selectedIds.has(a.id)}
                    tabIndex={-1}
                    disableRipple
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={`${a.applicantName} — ${a.jobTitle}`}
                  secondary={`Email: ${a.applicantEmail || "Không có"}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleAdd}
          disabled={selectedIds.size === 0}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  )
}
