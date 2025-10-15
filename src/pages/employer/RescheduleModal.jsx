import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material"
import { rescheduleInterview } from "../../services/interviewService"

export default function RescheduleModal({
  open,
  onClose,
  interview,
  onSuccess,
}) {
  const [form, setForm] = useState({ newScheduledAt: "", reason: "" })

  const handleSubmit = async () => {
    await rescheduleInterview(interview.id, form)
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đổi lịch phỏng vấn #{interview.id}</DialogTitle>
      <DialogContent>
        <TextField
          label="Thời gian mới"
          type="datetime-local"
          value={form.newScheduledAt}
          onChange={(e) => setForm({ ...form, newScheduledAt: e.target.value })}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Lý do đổi"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}
