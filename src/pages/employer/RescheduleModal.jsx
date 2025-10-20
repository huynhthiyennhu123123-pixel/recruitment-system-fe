import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  rescheduleInterview,
  getMyInterviews,
} from "../../services/interviewService";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { toast } from "react-toastify";

dayjs.locale("vi");

export default function RescheduleModal({
  open,
  onClose,
  interview,
  onSuccess,
}) {
  const [form, setForm] = useState({
    newScheduledAt: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);

  //  Lấy danh sách phỏng vấn và lọc theo id
  useEffect(() => {
    if (!open || !interview?.id) return;
    const fetchInterview = async () => {
      try {
        const res = await getMyInterviews(0, 50);
        const all = res?.data?.data?.content || res?.data?.content || [];
        const found = all.find((i) => i.id === interview.id);
        setInterviewData(found || interview);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin phỏng vấn:", err);
      }
    };
    fetchInterview();
  }, [open, interview]);

  const handleSubmit = async () => {
    if (!form.newScheduledAt) {
      toast.warn(" Vui lòng chọn thời gian mới!");
      return;
    }
    setLoading(true);
    try {
      await rescheduleInterview(interview.id, form);
      toast.success(" Đổi lịch phỏng vấn thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi đổi lịch:", error);
      toast.error("Không thể đổi lịch phỏng vấn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 20 }}>
        🔁 Đổi lịch phỏng vấn #{interview?.id}
      </DialogTitle>

      <DialogContent dividers>
        {!interviewData ? (
          <Box textAlign="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Thông tin lịch cũ */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Thời gian hiện tại:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#058551" }}
              >
                {dayjs(interviewData.scheduledAt).format(
                  "HH:mm, ngày DD/MM/YYYY"
                )}{" "}
                ({interviewData.durationMinutes} phút)
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {interviewData.interviewType === "VIDEO"
                  ? `Hình thức: Phỏng vấn trực tuyến (${
                      interviewData.meetingLink || "chưa có link"
                    })`
                  : interviewData.interviewType === "PHONE"
                  ? "Hình thức: Qua điện thoại"
                  : `Địa điểm: ${interviewData.location || "Chưa xác định"}`}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Nhập lịch mới */}
            <TextField
              label="⏰ Thời gian mới"
              type="datetime-local"
              value={form.newScheduledAt}
              onChange={(e) =>
                setForm({ ...form, newScheduledAt: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="📝 Lý do đổi lịch"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              fullWidth
              multiline
              minRows={2}
              margin="normal"
            />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={loading || !interviewData}
        >
          {loading ? "Đang cập nhật..." : "Xác nhận đổi lịch"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
