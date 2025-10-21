import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getManagedApplications,
  getEmployerJobs,
} from "../../services/employerService";
import ApplicationDetailDialog from "./ApplicationDetailDialog";

export default function ApplicationListPage() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  //  Lấy danh sách công việc
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getEmployerJobs(0, 100);
        if (res?.data?.content) setJobs(res.data.content);
      } catch (err) {
        console.error(" Lỗi tải danh sách công việc:", err);
      }
    };
    fetchJobs();
  }, []);

  //  Lấy danh sách ứng viên
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getManagedApplications(0, 20, status, jobId);
      const raw = res?.data?.content || [];
      const mapped = raw.map((a) => ({
        id: a.id,
        applicantName: a.applicant?.fullName || "—",
        jobTitle: a.jobPosting?.title || "—",
        status: a.status,
        createdAt: a.createdAt,
      }));
      setApplications(mapped);
    } catch (err) {
      console.error("Lỗi tải danh sách ứng viên:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [status, jobId]);

  //  Cấu hình bảng
  const columns = [
    {
      field: "stt",
      headerName: "STT",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.api
          ? params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1
          : params.rowIndex + 1,
    },
    {
      field: "applicantName",
      headerName: "Ứng viên",
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="500">
          {params.row.applicantName}
        </Typography>
      ),
    },
    {
      field: "jobTitle",
      headerName: "Vị trí ứng tuyển",
      flex: 1.6,
      renderCell: (params) => (
        <Typography variant="body2">{params.row.jobTitle}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const colorMap = {
          RECEIVED: "#9e9e9e",
          REVIEWED: "#1976d2",
          INTERVIEW: "#0288d1",
          OFFER: "#388e3c",
          HIRED: "#2e7d32",
          REJECTED: "#d32f2f",
        };
        return (
          <Box
            sx={{
              bgcolor: colorMap[params.value] || "#ccc",
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.8rem",
              fontWeight: 500,
              textAlign: "center",
              textTransform: "capitalize",
            }}
          >
            {params.value || "—"}
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Ngày nộp",
      width: 180,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        if (!params.row?.createdAt) return "—";
        const d = new Date(params.row.createdAt);
        return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString(
          "vi-VN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`;
      },
    },
  ];

  // Khi click mở chi tiết
  const handleRowClick = (params) => {
    setSelectedId(params.id);
    setOpenDetail(true);
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#2e7d32" }}
      >
        Quản lý ứng viên
      </Typography>

      {/* Bộ lọc */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Lọc theo trạng thái */}
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="RECEIVED">Đã nhận</MenuItem>
            <MenuItem value="REVIEWED">Đã xem</MenuItem>
            <MenuItem value="INTERVIEW">Phỏng vấn</MenuItem>
            <MenuItem value="OFFER">Đề nghị</MenuItem>
            <MenuItem value="HIRED">Đã tuyển</MenuItem>
            <MenuItem value="REJECTED">Từ chối</MenuItem>
          </Select>
        </FormControl>

        {/* Lọc theo công việc */}
        <FormControl sx={{ minWidth: 240 }} size="small">
          <InputLabel>Công việc</InputLabel>
          <Select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            label="Công việc"
          >
            <MenuItem value="">Tất cả công việc</MenuItem>
            {jobs.map((job) => (
              <MenuItem key={job.id} value={job.id}>
                {job.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Bảng */}
      {loading ? (
        <Box textAlign="center" py={5}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Paper sx={{ height: 520 }}>
          <DataGrid
            rows={applications}
            columns={columns}
            pageSize={12}
            onRowClick={handleRowClick}
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: "Không có dữ liệu",
              footerRowSelected: (count) => `${count} mục được chọn`,
            }}
          />
        </Paper>
      )}

      {/* Dialog chi tiết */}
      {openDetail && (
        <ApplicationDetailDialog
          open={openDetail}
          id={selectedId}
          onClose={() => setOpenDetail(false)}
          onUpdated={() => fetchApplications()}
        />
      )}
    </Box>
  );
}
