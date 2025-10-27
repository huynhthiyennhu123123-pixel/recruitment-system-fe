import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import {
  AddCircleOutline,
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  WorkOutline,
  FilterAltOutlined,
} from "@mui/icons-material";
import {
  getMyJobs,
  deleteJob,
  updateJobStatus,
} from "../../services/employerService";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function JobManagePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filter, setFilter] = useState("ALL"); // 🔹 Trạng thái lọc hiện tại

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // 🔹 Lấy danh sách tin và tự kiểm tra hết hạn
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getMyJobs(0, 20);
      const today = new Date();

      const jobsWithExpiry = (res?.data?.content || []).map((job) => {
        const deadline = job.applicationDeadline
          ? new Date(job.applicationDeadline)
          : null;
        const isExpired = deadline && deadline < today;
        return { ...job, isExpired };
      });

      setJobs(jobsWithExpiry);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách tin tuyển dụng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá tin này?")) return;
    try {
      const res = await deleteJob(id);
      setSnackbar({
        open: true,
        message: res.message || "Đã xoá tin tuyển dụng.",
        severity: res.success ? "success" : "error",
      });
      fetchJobs();
    } catch (err) {
      console.error("Lỗi khi xoá tin:", err);
      setSnackbar({
        open: true,
        message: "Không thể xoá tin tuyển dụng.",
        severity: "error",
      });
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    if (
      !window.confirm(
        `Bạn có chắc muốn chuyển tin "${job.title}" sang trạng thái ${newStatus}?`
      )
    )
      return;

    try {
      const res = await updateJobStatus(job.id, newStatus);
      if (res?.success) {
        setSnackbar({
          open: true,
          message: res.message,
          severity: "success",
        });
        // 🔹 Cập nhật tại FE không cần reload toàn bộ
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id ? { ...j, status: newStatus } : j
          )
        );
      } else {
        setSnackbar({
          open: true,
          message: res?.message || "Không thể cập nhật trạng thái",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái:", err);
      setSnackbar({
        open: true,
        message: "Lỗi khi cập nhật trạng thái",
        severity: "error",
      });
    }
  };

  // 🔹 Hàm xác định màu chip
  const getStatusColor = (job) => {
    if (job.isExpired) return "warning";
    switch (job.status) {
      case "ACTIVE":
        return "success";
      case "DRAFT":
        return "info";
      case "CLOSED":
        return "error";
      default:
        return "default";
    }
  };

  // 🔹 Cấu hình các cột DataGrid
  const columns = [
    {
      field: "title",
      headerName: "Tiêu đề công việc",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            fontSize={18}
            color="#1b5e20"
          >
            {params.row.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {params.row.location}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const job = params.row;
        const label = job.isExpired
          ? "Hết hạn"
          : job.status === "ACTIVE"
          ? "Đang hiển thị"
          : job.status === "DRAFT"
          ? "Bản nháp"
          : job.status === "CLOSED"
          ? "Đã xóa mềm"
          : "Không xác định";

        return (
          <Chip
            label={label}
            color={getStatusColor(job)}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      },
    },
    {
      field: "applicationDeadline",
      headerName: "Hạn nộp",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const deadline = params.row.applicationDeadline
          ? new Date(params.row.applicationDeadline)
          : null;
        return (
          <Typography
            color={params.row.isExpired ? "error" : "textPrimary"}
            fontWeight={params.row.isExpired ? "bold" : 400}
          >
            {deadline ? deadline.toLocaleDateString("vi-VN") : "-"}
          </Typography>
        );
      },
    },
    {
      field: "applicationsCount",
      headerName: "Ứng viên",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "viewsCount",
      headerName: "Lượt xem",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box>
          <Tooltip title="Xem chi tiết">
            <IconButton
              color="primary"
              component={Link}
              to={`/employer/jobs/${params.row.id}`}
            >
              <VisibilityOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              color="success"
              component={Link}
              to={`/employer/jobs/${params.row.id}/edit`}
            >
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Đổi trạng thái">
            <IconButton
              color={params.row.status === "ACTIVE" ? "warning" : "info"}
              onClick={() => handleToggleStatus(params.row)}
            >
              <WorkOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá tin">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // 🔹 Tính số lượng từng loại tin
  const activeCount = jobs.filter(
    (j) => j.status === "ACTIVE" && !j.isExpired
  ).length;
  const draftCount = jobs.filter((j) => j.status === "DRAFT").length;
  const expiredCount = jobs.filter((j) => j.isExpired).length;
  const closeCount = jobs.filter((j) => j.status === "CLOSED").length;

  // 🔹 Lọc danh sách hiển thị theo chip được chọn
  const filteredJobs = jobs.filter((j) => {
    switch (filter) {
      case "ACTIVE":
        return j.status === "ACTIVE" && !j.isExpired;
      case "DRAFT":
        return j.status === "DRAFT";
      case "EXPIRED":
        return j.isExpired;
      case "CLOSED":
        return j.status === "CLOSED";
      default:
        return true;
    }
  });

  const filterOptions = [
    { label: "Tất cả", value: "ALL" },
    { label: "Đang hiển thị", value: "ACTIVE" },
    { label: "Bản nháp", value: "DRAFT" },
    { label: "Hết hạn", value: "EXPIRED" },
    { label: "Đã xóa mềm", value: "CLOSED" },
  ];

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", my: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#2e7d32"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <WorkOutline sx={{ fontSize: 28 }} />
          Quản lý tin tuyển dụng
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircleOutline />}
          component={Link}
          to="/employer/jobs/new"
          sx={{ borderRadius: 2, fontWeight: "bold" }}
        >
          Đăng tin mới
        </Button>
      </Box>

      {/* Thống kê nhanh (lọc) */}
      <Grid container spacing={2} mb={3}>
        {[
          {
            label: "Đang hiển thị",
            value: activeCount,
            bg: "linear-gradient(135deg,#a5d6a7,#66bb6a)",
            type: "ACTIVE",
          },
          {
            label: "Bản nháp",
            value: draftCount,
            bg: "linear-gradient(135deg,#81d4fa,#4fc3f7)",
            type: "DRAFT",
          },
          {
            label: "Hết hạn",
            value: expiredCount,
            bg: "linear-gradient(135deg,#fff176,#fdd835)",
            type: "EXPIRED",
          },
          {
            label: "Đã xóa mềm",
            value: closeCount,
            bg: "linear-gradient(135deg,#ef9a9a,#e57373)",
            type: "CLOSED",
          },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              onClick={() => setFilter(item.type)}
              sx={{
                p: 2.5,
                textAlign: "center",
                borderRadius: 3,
                background:
                  filter === item.type
                    ? `${item.bg}, #00000033`
                    : item.bg,
                color: "#fff",
                boxShadow:
                  filter === item.type
                    ? "0 6px 16px rgba(0,0,0,0.25)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                },
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {item.value}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Nút hiển thị tất cả */}
      {filter !== "ALL" && (
        <Box textAlign="right" mb={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterAltOutlined />}
            onClick={() => setFilter("ALL")}
          >
            Hiển thị tất cả
          </Button>
        </Box>
      )}

      {/* DataGrid hiển thị danh sách */}
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={filteredJobs}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
              border: "none",
              borderRadius: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#e8f5e9",
                color: "#1b5e20",
                fontWeight: "bold",
                fontSize: 15,
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#ecf0f5ff",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#f7fadaff",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f8e9",
                transition: "background-color 0.3s",
              },
            }}
          />
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
