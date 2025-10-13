import React from "react"
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material"

export default function InterviewDetailDialog({ interview, onClose }) {
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chi tiết phỏng vấn</DialogTitle>
      <DialogContent dividers>
        <Typography><b>ID:</b> {interview.id}</Typography>
        <Typography><b>Application:</b> {interview.applicationId}</Typography>
        <Typography><b>Thời gian:</b> {new Date(interview.scheduledAt).toLocaleString("vi-VN")}</Typography>
        <Typography><b>Thời lượng:</b> {interview.durationMinutes} phút</Typography>
        <Typography><b>Loại:</b> {interview.interviewType}</Typography>
        <Typography><b>Địa điểm:</b> {interview.location || "Trực tuyến"}</Typography>
        {interview.meetingLink && <Typography><b>Link họp:</b> <a href={interview.meetingLink}>{interview.meetingLink}</a></Typography>}
        <Typography><b>Trạng thái:</b> {interview.status}</Typography>
        <Typography><b>Ghi chú:</b> {interview.notes || "Không có"}</Typography>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Đóng</Button></DialogActions>
    </Dialog>
  )
}
