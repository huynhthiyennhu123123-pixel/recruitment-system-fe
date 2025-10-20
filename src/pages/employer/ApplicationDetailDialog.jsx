import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../../services/employerService";

export default function ApplicationDetailDialog({ open, id, onClose }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      const res = await getApplicationById(id);
      setApp(res?.data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleUpdate = async () => {
    if (!newStatus) return alert("Vui lòng chọn trạng thái mới.");
    setUpdating(true);
    const res = await updateApplicationStatus(id, newStatus, notes);
    if (res.success) {
      alert("Cập nhật trạng thái thành công!");
      setApp(res.data);
    } else alert(res.message || "Cập nhật thất bại.");
    setUpdating(false);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle fontWeight="bold">Chi tiết đơn ứng tuyển</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box textAlign="center" py={3}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" fontWeight="bold">
              Ứng viên: {app.applicant?.fullName}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Email: {app.applicant?.email}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Vị trí ứng tuyển: {app.jobPosting?.title}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Địa điểm: {app.jobPosting?.location}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Thư giới thiệu
            </Typography>
            <Typography variant="body2" mb={2}>
              {app.coverLetter || "Không có"}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Trạng thái hiện tại: {app.status}
            </Typography>

            <Box display="flex" gap={2} mt={1} mb={2}>
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
                sx={{ bgcolor: "#2e7d32" }}
                disabled={updating}
                onClick={handleUpdate}
              >
                Cập nhật
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight="bold">
              Lịch sử thay đổi trạng thái:
            </Typography>
            {app.timeline?.length ? (
              app.timeline.map((t, i) => (
                <Typography key={i} variant="body2" sx={{ my: 0.5 }}>
                  {new Date(t.changedAt).toLocaleString("vi-VN")} —{" "}
                  <b>{t.fromStatus}</b> → <b>{t.toStatus}</b>{" "}
                  {t.note && `(Ghi chú: ${t.note})`}
                </Typography>
              ))
            ) : (
              <Typography color="text.secondary">Chưa có lịch sử</Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
