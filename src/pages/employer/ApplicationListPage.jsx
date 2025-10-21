import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"
import {
  getManagedApplications,
  getEmployerJobs,
} from "../../services/employerService"
import ApplicationDetailDialog from "./ApplicationDetailDialog"

export default function ApplicationListPage() {
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [jobId, setJobId] = useState("")
  const [openDetail, setOpenDetail] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // 📦 Lấy danh sách công việc
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getEmployerJobs(0, 100)
        if (res?.data?.content) setJobs(res.data.content)
      } catch (err) {
        console.error("❌ Lỗi tải danh sách công việc:", err)
      }
    }
    fetchJobs()
  }, [])

  // 📄 Lấy danh sách ứng viên
  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await getManagedApplications(0, 20, status, jobId)
      const raw = res?.data?.content || []
      const mapped = raw.map((a) => ({
        id: a.id,
        applicantName: a.applicant?.fullName || "—",
        avatarUrl: a.applicant?.avatarUrl || null,
        jobTitle: a.jobPosting?.title || "—",
        status: a.status,
        createdAt: a.createdAt,
      }))
      setApplications(mapped)
    } catch (err) {
      console.error("❌ Lỗi tải danh sách ứng viên:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [status, jobId])

  // 🎨 Map trạng thái
  const statusLabelMap = {
    RECEIVED: "Đã nhận",
    REVIEWED: "Đã xem",
    INTERVIEW: "Phỏng vấn",
    OFFER: "Đề nghị",
    HIRED: "Đã tuyển",
    REJECTED: "Từ chối",
  }

  const colorMap = {
    RECEIVED: "linear-gradient(45deg,#bdbdbd,#9e9e9e)",
    REVIEWED: "linear-gradient(45deg,#64b5f6,#1976d2)",
    INTERVIEW: "linear-gradient(45deg,#4fc3f7,#0288d1)",
    OFFER: "linear-gradient(45deg,#81c784,#43a047)",
    HIRED: "linear-gradient(45deg,#66bb6a,#2e7d32)",
    REJECTED: "linear-gradient(45deg,#ef9a9a,#e53935)",
  }

  // ⚙️ Cấu hình DataGrid
  const columns = [
    {
      field: "stt",
      headerName: "STT",
      width: 70,
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
      flex: 1.6,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            src={params.row.avatarUrl || undefined}
            alt={params.row.applicantName}
            sx={{
              bgcolor: params.row.avatarUrl ? "transparent" : "#2e7d32",
              color: "#fff",
              width: 36,
              height: 36,
              fontSize: 15,
              fontWeight: "bold",
              marginLeft: 20,
            }}
          >
            {!params.row.avatarUrl &&
              (params.row.applicantName?.[0]?.toUpperCase() || "?")}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {params.row.applicantName}
          </Typography>
        </Box>
      ),
    },
    {
      field: "jobTitle",
      headerName: "Vị trí ứng tuyển",
      flex: 1.8,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.jobTitle}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            background: colorMap[params.value] || "#ccc",
            color: "#fff",
            px: 1.5,
            py: 0.6,
            borderRadius: 1,
            fontSize: "0.8rem",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {statusLabelMap[params.value] || "—"}
        </Box>
      ),
    },
    
  ]

  const handleRowClick = (params) => {
    setSelectedId(params.id)
    setOpenDetail(true)
  }

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", my: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <WorkOutlineIcon sx={{ fontSize: 30, color: "#2e7d32", mr: 1 }} />
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(45deg,#2e7d32,#81c784)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quản lý ứng viên ứng tuyển
        </Typography>
      </Box>

      {/* Bộ lọc */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          borderRadius: 3,
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#f9fff9",
        }}
      >
        <FormControl sx={{ minWidth: 200 }} size="small">
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

        <FormControl sx={{ minWidth: 260 }} size="small">
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
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <DataGrid
            rows={applications}
            columns={columns}
            onRowClick={handleRowClick}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: "Không có dữ liệu",
              footerRowSelected: (count) => `${count} mục được chọn`,
            }}
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
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#ecf0f5ff",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#f7fadaff",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f8e9",
                transition: "0.3s",
              },
            }}
          />
        )}
      </Paper>

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
  )
}
