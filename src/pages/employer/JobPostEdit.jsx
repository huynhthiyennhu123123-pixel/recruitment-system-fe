import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  WorkOutline,
  DescriptionOutlined,
  CheckCircleOutline,
  MonetizationOnOutlined,
  LocationOnOutlined,
  CalendarMonthOutlined,
  SchoolOutlined,
  GroupsOutlined,
  BuildCircleOutlined,
} from "@mui/icons-material";
import { getEmployerJobById, updateJob } from "../../services/employerService";
import { Snackbar, Alert } from "@mui/material";

export default function JobPostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    skillsRequired: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "VND",
    jobType: "FULL_TIME",
    numberOfPositions: 1,
    experienceRequired: "",
    educationRequired: "",
    location: "",
    applicationDeadline: "",
    status: "DRAFT",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  //  Load dữ liệu khi vào trang
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = await getEmployerJobById(id);
        if (job) {
          setForm({
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits,
            skillsRequired: job.skillsRequired,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            salaryCurrency: job.salaryCurrency,
            jobType: job.jobType,
            numberOfPositions: job.numberOfPositions,
            experienceRequired: job.experienceRequired,
            educationRequired: job.educationRequired,
            location: job.location,
            applicationDeadline: job.applicationDeadline?.split("T")[0],
            status: job.status,
          });
        } else {
          setErrorMsg("Không tìm thấy tin tuyển dụng này.");
        }
      } catch (err) {
        console.error("Fetch job failed:", err);
        setErrorMsg("Lỗi khi tải tin tuyển dụng.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        benefits: form.benefits,
        skillsRequired: form.skillsRequired,
        jobType: form.jobType,
        salaryMin: parseFloat(form.salaryMin || 0),
        salaryMax: parseFloat(form.salaryMax || 0),
        salaryCurrency: form.salaryCurrency,
        numberOfPositions: parseInt(form.numberOfPositions || 1),
        experienceRequired: form.experienceRequired,
        educationRequired: form.educationRequired,
        location: form.location,
        applicationDeadline: `${form.applicationDeadline}T00:00:00`,
        status: form.status,
      };

      const res = await updateJob(id, payload);
      if (res?.success) {
        setSnackbar({
          open: true,
          message: "Cập nhật tin tuyển dụng thành công!",
          severity: "success",
        });
        setTimeout(() => navigate(`/employer/jobs/${id}`), 1500);
      } else {
        setSnackbar({
          open: true,
          message: res?.message || "Không thể cập nhật tin.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Update job failed:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi kết nối đến server.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="success" />
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: "1300px",
        mx: "auto",
        my: 5,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
      }}
    >
      {/* FORM */}
      <Paper
        elevation={3}
        sx={{ flex: 2, p: 4, borderRadius: 3, bgcolor: "#fff" }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            color: "#2e7d32",
          }}
        >
          <WorkOutline sx={{ mr: 1, fontSize: 28 }} />
          Chỉnh sửa tin tuyển dụng
        </Typography>

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Hàng 1 */}
            <Grid item xs={12} md={6}>
              <TextField
                name="title"
                fullWidth
                label={
                  <Label icon={<WorkOutline />} text="Tiêu đề công việc *" />
                }
                value={form.title}
                onChange={handleChange}
                sx={{ marginInlineEnd: 20 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                name="jobType"
                label={
                  <Label
                    icon={<CheckCircleOutline />}
                    text="Loại hình công việc"
                  />
                }
                value={form.jobType}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="FULL_TIME">Toàn thời gian</MenuItem>
                <MenuItem value="PART_TIME">Bán thời gian</MenuItem>
                <MenuItem value="INTERNSHIP">Thực tập</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                name="numberOfPositions"
                type="number"
                label={
                  <Label icon={<GroupsOutlined />} text="Số lượng tuyển" />
                }
                fullWidth
                sx={{ marginInlineEnd: -4 }}
                value={form.numberOfPositions}
                onChange={handleChange}
              />
            </Grid>
            {/* Loại tiền */}

            {/* Hàng 2 */}
            <Grid item xs={12} md={4}>
              <TextField
                name="experienceRequired"
                fullWidth
                sx={{ marginInlineEnd: 20 }}
                label={
                  <Label icon={<SchoolOutlined />} text="Kinh nghiệm yêu cầu" />
                }
                value={form.experienceRequired}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                name="applicationDeadline"
                label={
                  <Label
                    icon={<CalendarMonthOutlined />}
                    text="Hạn nộp hồ sơ"
                  />
                }
                fullWidth
                sx={{ marginInlineEnd: -2 }}
                InputLabelProps={{ shrink: true }}
                value={form.applicationDeadline}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="educationRequired"
                fullWidth
                sx={{ marginInlineEnd: -4 }}
                label={
                  <Label icon={<SchoolOutlined />} text="Trình độ học vấn" />
                }
                value={form.educationRequired}
                onChange={handleChange}
              />
            </Grid>

            {/* Hàng 3 */}

            <Grid item xs={12} md={4}>
              <TextField
                name="salaryMin"
                type="number"
                label={
                  <Label
                    icon={<MonetizationOnOutlined />}
                    text="Lương tối thiểu"
                  />
                }
                fullWidth
                sx={{ marginInlineEnd: -6 }}
                value={form.salaryMin}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="salaryMax"
                type="number"
                label={
                  <Label
                    icon={<MonetizationOnOutlined />}
                    text="Lương tối đa"
                  />
                }
                fullWidth
                sx={{ marginInlineEnd: -2 }}
                value={form.salaryMax}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                required
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MonetizationOnOutlined
                      sx={{ color: "#2e7d32", fontSize: 20 }}
                    />
                    Loại tiền
                  </Box>
                }
                name="salaryCurrency"
                value={form.salaryCurrency}
                onChange={handleChange}
                fullWidth
                sx={{ marginInlineEnd: 6 }}
              >
                <MenuItem value="VND">VND (₫)</MenuItem>
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                name="status"
                label={<Label icon={<WorkOutline />} text="Trạng thái tin" />}
                value={form.status}
                onChange={handleChange}
                fullWidth
                sx={{ marginInlineEnd: 4 }}
              >
                <MenuItem value="DRAFT">Bản nháp</MenuItem>
                <MenuItem value="ACTIVE">Đang hiển thị</MenuItem>
              </TextField>
            </Grid>
            {/* Hàng 4 */}
            <Grid item xs={12} md={8}>
              <TextField
                name="skillsRequired"
                fullWidth
                multiline
                sx={{ marginInlineEnd: 24 }}
                rows={2}
                label={
                  <Label
                    icon={<BuildCircleOutlined />}
                    text="Kỹ năng yêu cầu"
                  />
                }
                value={form.skillsRequired}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="requirements"
                fullWidth
                multiline
                sx={{ marginInlineEnd: 19 }}
                rows={2}
                label={
                  <Label
                    icon={<CheckCircleOutline />}
                    text="Yêu cầu ứng viên"
                  />
                }
                value={form.requirements}
                onChange={handleChange}
              />
            </Grid>

            {/* Hàng 5 */}

            <Grid item xs={12} md={4}>
              <TextField
                name="benefits"
                fullWidth
                multiline
                sx={{ marginInlineEnd: 22 }}
                rows={2}
                label={
                  <Label icon={<MonetizationOnOutlined />} text="Phúc lợi" />
                }
                value={form.benefits}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="description"
                fullWidth
                multiline
                sx={{ marginInlineEnd: 19 }}
                rows={2}
                label={
                  <Label
                    icon={<DescriptionOutlined />}
                    text="Mô tả công việc"
                  />
                }
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="location"
                fullWidth
                sx={{ marginInlineEnd: 64 }}
                label={
                  <Label
                    icon={<LocationOnOutlined />}
                    text="Địa điểm làm việc"
                  />
                }
                value={form.location}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
                px: 6,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "LƯU TIN TUYỂN DỤNG"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
      {/* ---------------- PREVIEW ---------------- */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 3,
          bgcolor: "#f9fef9",
          border: "1px solid #a5d6a7",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: "#2e7d32",
            textAlign: "center",
          }}
        >
          Xem trước tin tuyển dụng
        </Typography>

        <Typography variant="h6" sx={{ color: "#2e7d32" }}>
          {form.title || "Tiêu đề công việc"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {form.location || "Địa điểm làm việc"}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "bold" }}>
          Lương: {form.salaryMin || "?"} - {form.salaryMax || "?"}{" "}
          {form.salaryCurrency}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Hạn nộp:</strong> {form.applicationDeadline || "Chưa đặt"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Loại hình:</strong>{" "}
          {form.jobType === "FULL_TIME"
            ? "Toàn thời gian"
            : form.jobType === "PART_TIME"
            ? "Bán thời gian"
            : "Thực tập"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Trạng thái:</strong>{" "}
          {form.status === "ACTIVE" ? "Đang hiển thị" : "Bản nháp"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Số lượng tuyển:</strong> {form.numberOfPositions || 1}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>Kinh nghiệm:</strong>{" "}
          {form.experienceRequired || "Không yêu cầu"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Trình độ:</strong> {form.educationRequired || "Không yêu cầu"}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#2e7d32">
            Kỹ năng yêu cầu
          </Typography>
          <Typography variant="body2">
            {form.skillsRequired || "Chưa có kỹ năng cụ thể"}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#2e7d32">
            Mô tả công việc
          </Typography>
          <Typography variant="body2">{form.description || "..."}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#2e7d32">
            Yêu cầu ứng viên
          </Typography>
          <Typography variant="body2">{form.requirements || "..."}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#2e7d32">
            Phúc lợi
          </Typography>
          <Typography variant="body2">{form.benefits || "..."}</Typography>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/** Component nhỏ cho label có icon */
function Label({ icon, text }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {React.cloneElement(icon, { color: "success", fontSize: "small" })}
      {text}
    </Box>
  );
}
