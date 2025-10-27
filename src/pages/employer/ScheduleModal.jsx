import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import LinkIcon from "@mui/icons-material/Link"
import NotesIcon from "@mui/icons-material/Notes"
import { getManagedApplications } from "../../services/employerService"
import { scheduleInterview } from "../../services/interviewService"
import dayjs from "dayjs"
import Slide from "@mui/material/Slide"

const INTERVIEW_METHODS = [
  { value: "ONSITE", label: "Phỏng vấn trực tiếp tại công ty" },
  { value: "VIDEO", label: "Phỏng vấn trực tuyến (Video)" },
  { value: "PHONE", label: "Phỏng vấn qua điện thoại" },
];

export default function ScheduleModal({ open, onClose, onSuccess }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [form, setForm] = useState({
    applicationId: "",
    scheduledAt: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    durationMinutes: 60,
    interviewType: "ONSITE",
    location: "",
    meetingLink: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear lỗi khi nhập lại
  };

  // ======== Lấy danh sách ứng viên ở trạng thái INTERVIEW ========
  useEffect(() => {
    if (open) {
      getManagedApplications(0, 100, "INTERVIEW")
        .then((data) => setApplications(data?.data?.content || []))
        .catch((err) => console.error("  Lỗi lấy ứng viên:", err));
    }
  }, [open]);

  // ======== Kiểm tra hợp lệ ========
  const validateForm = () => {
    const newErrors = {};

    if (!form.applicationId)
      newErrors.applicationId = "Vui lòng chọn ứng viên!";
    if (!form.scheduledAt)
      newErrors.scheduledAt = "Vui lòng chọn thời gian phỏng vấn!";
    if (!form.durationMinutes || form.durationMinutes <= 0)
      newErrors.durationMinutes = "Thời lượng phải lớn hơn 0!";
    if (form.interviewType === "VIDEO" && !form.meetingLink.trim())
      newErrors.meetingLink = "Vui lòng nhập link họp!";
    if (form.interviewType === "ONSITE" && !form.location.trim())
      newErrors.location = "Vui lòng nhập địa điểm phỏng vấn!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======== Gửi API ========
  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: " Vui lòng kiểm tra lại thông tin trước khi tạo lịch!",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await scheduleInterview({
        applicationId: Number(form.applicationId),
        scheduledAt: form.scheduledAt,
        durationMinutes: Number(form.durationMinutes),
        interviewType: form.interviewType,
        location: form.location,
        meetingLink: form.meetingLink,
        notes: form.notes,
      });

      const ok = res?.success || res?.data?.success;
      const message =
        res?.message ||
        res?.data?.message ||
        (ok
          ? "Tạo lịch phỏng vấn thành công!"
          : "Không thể tạo lịch phỏng vấn.");

      if (ok) {
        setSnackbar({
          open: true,
          message: `🎉 ${message}`,
          severity: "success",
        });
        onSuccess?.();
        setTimeout(() => onClose(), 1200);
      } else {
        setSnackbar({
          open: true,
          message: ` ${message}`,
          severity: "error",
        });
      }
    } catch (err) {
      console.error(" Lỗi khi tạo lịch:", err);
      setSnackbar({
        open: true,
        message: "Lỗi hệ thống, vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  function SlideTransition(props) {
    return <Slide {...props} direction="left" />
  }

  
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: "bold", fontSize: 25 }}>
          📅 Tạo lịch phỏng vấn
        </DialogTitle>

        <DialogContent>
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 2, bgcolor: "#fafafa" }}
          >
            <Grid container spacing={2}>
              {/* Ứng viên */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Ứng viên & công việc"
                  name="applicationId"
                  value={form.applicationId}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginInlineEnd: 100 }}
                  required
                  error={!!errors.applicationId}
                  helperText={errors.applicationId}
                >
                  {applications.length === 0 && (
                    <MenuItem disabled>
                      Không có ứng viên nào ở trạng thái INTERVIEW
                    </MenuItem>
                  )}
                  {applications.map((app) => (
                    <MenuItem key={app.id} value={app.id}>
                      {`${app.applicantName} — ${app.jobTitle}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Thời gian */}
              <Grid item xs={6} md={4}>
                <TextField
                  label="Thời gian phỏng vấn"
                  type="datetime-local"
                  name="scheduledAt"
                  value={form.scheduledAt}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.scheduledAt}
                  helperText={errors.scheduledAt}
                />
              </Grid>

              {/* Thời lượng */}
              <Grid item xs={6} md={4}>
                <TextField
                  label="Thời lượng (phút)"
                  name="durationMinutes"
                  type="number"
                  value={form.durationMinutes}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginInlineEnd: -11 }}
                  error={!!errors.durationMinutes}
                  helperText={errors.durationMinutes}
                />
              </Grid>

              {/* Hình thức */}
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Hình thức phỏng vấn"
                  name="interviewType"
                  value={form.interviewType}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VideoCameraFrontIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginInlineEnd: 10 }}
                >
                  {INTERVIEW_METHODS.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Link / Địa điểm */}
              <Grid item xs={12} md={6}>
                {form.interviewType === "ONSITE" ? (
                  <TextField
                    label="Địa điểm phỏng vấn"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ marginInlineEnd: 75 }}
                    error={!!errors.location}
                    helperText={errors.location}
                  />
                ) : (
                  <TextField
                    label="Link họp (Google Meet / Zoom)"
                    name="meetingLink"
                    value={form.meetingLink}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.meetingLink}
                    helperText={errors.meetingLink}
                    sx={{ marginInlineEnd: 75 }}
                  />
                )}
              </Grid>

              {/* Ghi chú */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ghi chú (nếu có)"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NotesIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginInlineEnd: 75 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            color="success"
            sx={{ px: 3, borderRadius: 2 }}
          >
            {loading ? "Đang lưu..." : "Tạo lịch"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} 
        TransitionComponent={SlideTransition}
        sx={{
          mt: 2, 
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          variant="filled" 
          sx={{
            width: "100%",
            fontSize: "16px",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>
  );
}
