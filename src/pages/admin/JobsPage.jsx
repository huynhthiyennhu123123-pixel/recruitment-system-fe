import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Chip,
  Box,
  Paper,
  Button,
  IconButton,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  getManagedJobs,
  deleteJobPosting,
  updateJobStatus,
  getJobDetail,
} from "../../services/jobService";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getManagedJobs({ page: 0, size: 10 });
      const jobList = res?.data?.content || [];
      setJobs(jobList);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tin:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa tin tuyển dụng này?")) return;
    try {
      await deleteJobPosting(id, true);
      fetchJobs();
    } catch (err) {
      console.error("Lỗi khi xóa tin:", err);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getJobDetail(id);
      const job = res?.data?.data || res?.data;
      setSelectedJob(job);
      setOpen(true);
    } catch (err) {
      console.error("Lỗi khi xem chi tiết job:", err);
      const msg =
        err?.response?.data?.message ||
        "Không thể tải chi tiết job. Có thể tin đã hết hạn hoặc bị đóng.";
      alert(msg);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateJobStatus(id, newStatus);
      fetchJobs();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Tiêu đề",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "ACTIVE"
              ? "success"
              : params.value === "CLOSED"
              ? "warning"
              : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString("vi-VN") : "—",
    },
    {
      field: "applicationDeadline",
      headerName: "Hạn nộp",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) return "—";
        const date = new Date(params.value);
        const isExpired = date < new Date();
        return (
          <Typography
            variant="body2"
            sx={{
              color: isExpired ? "error.main" : "text.primary",
              fontWeight: isExpired ? 600 : 400,
            }}
          >
            {date.toLocaleDateString("vi-VN")}
            {isExpired && " (hết hạn)"}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 260,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { id, status } = params?.row || {};
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleViewDetail(id)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            {status === "ACTIVE" ? (
              <Button
                size="small"
                variant="outlined"
                color="warning"
                onClick={() => handleStatusChange(id, "CLOSED")}
              >
                Đóng
              </Button>
            ) : (
              <Button
                size="small"
                variant="outlined"
                color="success"
                onClick={() => handleStatusChange(id, "ACTIVE")}
              >
                Mở lại
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Quản lý tin tuyển dụng
      </Typography>

      <Paper sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pagination
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
              color: "#333",
              borderBottom: "2px solid #ddd",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiDataGrid-cell:focus": { outline: "none" },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              textAlign: "center",
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#f9f9f9" },
          }}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#058551ff",
            color: "white",
            fontWeight: "bold",
            py: 2,
            px: 3,
          }}
        >
          {selectedJob?.title || "Chi tiết công việc"}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Box sx={{ flex: "1 1 60%" }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Loại công việc:</strong> {selectedJob?.jobType || "—"}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Địa điểm:</strong> {selectedJob?.location || "—"}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Mức lương:</strong>{" "}
                {selectedJob?.salaryMin?.toLocaleString("vi-VN")} -{" "}
                {selectedJob?.salaryMax?.toLocaleString("vi-VN")}{" "}
                {selectedJob?.salaryCurrency || "VND"}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Hạn nộp hồ sơ:</strong>{" "}
                {selectedJob?.applicationDeadline
                  ? new Date(
                      selectedJob.applicationDeadline
                    ).toLocaleDateString("vi-VN")
                  : "—"}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Trạng thái:</strong>{" "}
                <Chip
                  label={selectedJob?.status || "Không xác định"}
                  color={
                    selectedJob?.status === "ACTIVE"
                      ? "success"
                      : selectedJob?.status === "CLOSED"
                      ? "warning"
                      : "default"
                  }
                  size="small"
                />
              </Typography>
            </Box>

            <Box
              sx={{
                flex: "1 1 35%",
                backgroundColor: "#f9fafb",
                borderRadius: 2,
                p: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedJob?.company?.name || "Công ty chưa xác định"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Ngành nghề: {selectedJob?.company?.industry || "—"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Thành phố: {selectedJob?.company?.city || "—"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Website:{" "}
                {selectedJob?.company?.website ? (
                  <a
                    href={selectedJob.company.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#058551ff", textDecoration: "none" }}
                  >
                    {selectedJob.company.website}
                  </a>
                ) : (
                  "—"
                )}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Email: {selectedJob?.company?.contactEmail || "—"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: "#058551ff", fontWeight: "bold", mb: 1 }}
            >
              Mô tả công việc
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {selectedJob?.description || "Chưa có mô tả công việc."}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: "#058551ff", fontWeight: "bold", mb: 1 }}
            >
              Yêu cầu công việc
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {selectedJob?.requirements || "Không có thông tin yêu cầu."}
            </Typography>
          </Box>

          {selectedJob?.skillsRequired && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#058551ff", fontWeight: "bold", mb: 1 }}
              >
                Kỹ năng yêu cầu
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {selectedJob.skillsRequired.split(",").map((skill, i) => (
                  <Chip
                    key={i}
                    label={skill.trim()}
                    variant="outlined"
                    color="success"
                    sx={{ borderRadius: "16px" }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {selectedJob?.benefits && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#058551ff", fontWeight: "bold", mb: 1 }}
              >
                Quyền lợi
              </Typography>
              <Typography variant="body1">{selectedJob.benefits}</Typography>
            </Box>
          )}

          {selectedJob?.company?.description && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#058551ff", fontWeight: "bold", mb: 1 }}
              >
                Giới thiệu công ty
              </Typography>
              <Typography variant="body1">
                {selectedJob.company.description}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
