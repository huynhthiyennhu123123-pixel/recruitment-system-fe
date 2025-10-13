import React, { useState } from "react"
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Stack
} from "@mui/material"
import dayjs from "dayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { createInterview } from "../../services/interviewService"

const interviewTypes = ["ONLINE", "OFFLINE", "PHONE"]

export default function InterviewFormDialog({ open, onClose }) {
  const [form, setForm] = useState({
    applicationId: "",
    scheduledAt: dayjs(),
    durationMinutes: 30,
    location: "",
    meetingLink: "",
    interviewType: "ONLINE",
    notes: ""
  })

  const handleChange = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async () => {
    await createInterview(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tạo lịch phỏng vấn</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Mã Application ID" fullWidth value={form.applicationId}
                     onChange={(e) => handleChange("applicationId", e.target.value)} />
          <DateTimePicker label="Thời gian phỏng vấn"
                          value={form.scheduledAt}
                          onChange={(v) => handleChange("scheduledAt", v)} />
          <TextField label="Thời lượng (phút)" type="number"
                     value={form.durationMinutes}
                     onChange={(e) => handleChange("durationMinutes", e.target.value)} />
          <TextField label="Loại phỏng vấn" select value={form.interviewType}
                     onChange={(e) => handleChange("interviewType", e.target.value)}>
            {interviewTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField label="Địa điểm" fullWidth value={form.location}
                     onChange={(e) => handleChange("location", e.target.value)} />
          <TextField label="Link họp (nếu có)" fullWidth value={form.meetingLink}
                     onChange={(e) => handleChange("meetingLink", e.target.value)} />
          <TextField label="Ghi chú" fullWidth multiline rows={3} value={form.notes}
                     onChange={(e) => handleChange("notes", e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>Tạo</Button>
      </DialogActions>
    </Dialog>
  )
}
