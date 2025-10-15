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
  CircularProgress,
  Typography,
  Divider,
  Box
} from "@mui/material"
import { getManagedApplications } from "../../services/employerService"
import { addParticipants, removeParticipants } from "../../services/interviewService"
import { toast } from "react-toastify"

export default function ParticipantModal({ open, onClose, interview, onUpdated }) {
  const [loading, setLoading] = useState(true)
  const [applicants, setApplicants] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())

  // ✅ Lấy danh sách ứng viên ở trạng thái INTERVIEW
useEffect(() => {
  if (open) {
    setLoading(true)
    getManagedApplications(0, 100, "INTERVIEW")
      .then((res) => {
        if (res?.success) {
          setApplicants(res.data.content || [])
        } else {
          toast.warn(res?.message || "Không thể tải danh sách ứng viên.")
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi tải ứng viên:", err)
        toast.error("Lỗi khi tải danh sách ứng viên.")
      })
      .finally(() => setLoading(false))
  }
}, [open])


  // ✅ Khi tick chọn
  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  // ✅ Gửi danh sách đã chọn lên server
  const handleAdd = async () => {
    if (selectedIds.size === 0) {
      toast.warn("Vui lòng chọn ít nhất một ứng viên!")
      return
    }

    try {
      const userIds = Array.from(selectedIds)
      const res = await addParticipants(interview.id, { userIds, role: "INTERVIEWER" })

      if (res?.success || res?.data?.success) {
        toast.success("🎉 Đã thêm người phỏng vấn thành công!")
        onUpdated?.()
        onClose()
      } else {
        toast.error(res?.message || "Không thể thêm người phỏng vấn.")
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm người phỏng vấn:", err)
      toast.error("Lỗi hệ thống, vui lòng thử lại.")
    }
  }

  // ✅ Xóa tất cả người phỏng vấn hiện có
  const handleRemoveAll = async () => {
    if (!interview?.participants || interview.participants.length === 0) {
      toast.info("Chưa có người phỏng vấn để xóa.")
      return
    }

    const ids = interview.participants.map((p) => p.userId)
    try {
      await removeParticipants(interview.id, { userIds: ids })
      toast.success("Đã xóa tất cả người phỏng vấn.")
      onUpdated?.()
      onClose()
    } catch (err) {
      toast.error("Không thể xóa người phỏng vấn.")
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 20 }}>
        👥 Quản lý người phỏng vấn
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box textAlign="center" py={3}>
            <CircularProgress />
          </Box>
        ) : applicants.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            Không có ứng viên nào ở trạng thái INTERVIEW
          </Typography>
        ) : (
          <List>
            {applicants.map((a) => (
              <ListItem key={a.id} button onClick={() => handleToggle(a.id)}>
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

      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleRemoveAll} color="error">
          Xóa tất cả
        </Button>
        <Button onClick={handleAdd} variant="contained" color="success">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  )
}
