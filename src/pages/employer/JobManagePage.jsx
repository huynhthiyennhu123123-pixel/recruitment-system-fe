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
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getMyJobs(0, 20);
      setJobs(res?.data?.content || []);
    } catch (err) {
      console.error(" Lỗi khi tải danh sách tin tuyển dụng:", err);
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
  const newStatus = job.status === "ACTIVE" ? "DRAFT" : "ACTIVE"
  if (!window.confirm(`Bạn có chắc muốn chuyển tin "${job.title}" sang trạng thái ${newStatus}?`))
    return

  try {
    const res = await updateJobStatus(job.id, newStatus)
    if (res?.success) {
      setSnackbar({ open: true, message: res.message, severity: "success" })
      fetchJobs()
    } else {
      setSnackbar({ open: true, message: res?.message || "Không thể cập nhật trạng thái", severity: "error" })
    }
  } catch (err) {
    console.error("❌ Lỗi cập nhật trạng thái:", err)
    setSnackbar({ open: true, message: "Lỗi khi cập nhật trạng thái", severity: "error" })
  }
}


const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "success" // Màu xanh lá
    case "DRAFT":
      return "info" // Màu vàng
      case "EXPIRED":
        return "warning";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Tiêu đề công việc",
      flex: 1.5,
     
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" fontSize={18} color="#1b5e20">
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
      renderCell: (params) => (
        <Chip
          label={
            params.row.status === "ACTIVE"
              ? "Đang hiển thị"
              : params.row.status === "DRAFT"
              ? "Bản nháp"
              : params.row.status === "EXPIRED"
              ? "Hết hạn"
              : params.row.status === "CLOSED"
              ? "Đã xóa mềm"
              : "Không xác định"
          }
          color={getStatusColor(params.row.status)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    { field: "applicationsCount", headerName: "Ứng viên", width: 110,align: "center", headerAlign: "center" },
    { field: "viewsCount", headerName: "Lượt xem", width: 110,align: "center", headerAlign: "center" },
    

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

  const activeCount = jobs.filter((j) => j.status === "ACTIVE").length;
  const draftCount = jobs.filter((j) => j.status === "DRAFT").length;
  const expiredCount = jobs.filter((j) => j.status === "EXPIRED").length;
  const closeCount = jobs.filter((j) => j.status === "CLOSED").length;

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

      <Grid container spacing={2} mb={3}>
        {[
          { label: "Đang hiển thị", value: activeCount, color: "#2e7d32", bg: "linear-gradient(135deg,#a5d6a7,#66bb6a)"},
          { label: "Bản nháp", value: draftCount, color: "#0288d1", bg: "linear-gradient(135deg,#81d4fa,#4fc3f7)" },
          { label: "Hết hạn", value: expiredCount, color: "#f9a825", bg: "linear-gradient(135deg,#fff176,#fdd835)" },
          { label: "Đã xóa mềm", value: closeCount, color: "#c62828", bg: "linear-gradient(135deg,#ef9a9a,#e57373)" },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              sx={{
                p: 2.5,
                textAlign: "center",
                borderRadius: 3,
                background: item.bg,
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
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

      {/* Data table */}
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={jobs}
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
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
                
              },
              // 🌿 Hàng xen kẽ màu
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#ecf0f5ff", // xanh nhạt
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#f7fadaff", // trắng
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f8e9", // hiệu ứng hover
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
