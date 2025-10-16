import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import CancelIcon from "@mui/icons-material/Cancel"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import { DataGrid } from "@mui/x-data-grid"
import dayjs from "dayjs"

import {
  getMyInterviews,
  cancelInterview,
  completeInterview,
} from "../../services/interviewService"
import ScheduleModal from "./ScheduleModal"
import RescheduleModal from "./RescheduleModal"
import ParticipantModal from "./ParticipantModal"

export default function InterviewPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [openSchedule, setOpenSchedule] = useState(false)
  const [openReschedule, setOpenReschedule] = useState(null)
  const [openParticipants, setOpenParticipants] = useState(null)

  // 🔹 Lấy danh sách phỏng vấn
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getMyInterviews({ page: 0, size: 10 })
      if (res?.data?.success) setInterviews(res.data.data.content || [])
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách phỏng vấn:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ✅ Hoàn tất phỏng vấn
  const handleComplete = async (row) => {
    const notes = prompt("Nhập ghi chú hoàn tất:")
    if (!notes) return
    await completeInterview(row.id, { notes })
    fetchData()
  }

  // ✅ Hủy phỏng vấn
  const handleCancel = async (row) => {
    const reason = prompt("Nhập lý do hủy lịch:")
    if (!reason) return
    await cancelInterview(row.id, { reason })
    fetchData()
  }

  // ✅ Chuẩn hóa dữ liệu phỏng vấn trước khi mở modal
  const handleOpenParticipants = (interview) => {
    
  const jobPostingId =
    interview?.jobPostingId ||
    interview?.jobPosting?.id ||
    interview?.application?.jobPosting?.id ||
    null

  const applicationId =
    interview?.applicationId || interview?.application?.id || null

  const fullInterview = {
    ...interview,
    jobPostingId,
    applicationId,
    participants: interview?.participants || [],
  }

  
  setOpenParticipants(fullInterview)
}


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
      field: "scheduledAt",
      headerName: "Thời gian phỏng vấn",
      width: 200,
      renderCell: (p) =>
        p.value ? dayjs(p.value).format("Ngày DD/MM/YYYY vào HH:mm") : "—",
    },
    { field: "location", headerName: "Địa điểm", width: 200 },
    { field: "meetingLink", headerName: "Link meeting", width: 240 },
    { field: "interviewType", headerName: "Hình thức", width: 130 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "SCHEDULED"
              ? "info"
              : params.value === "COMPLETED"
              ? "success"
              : "error"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 260,
      renderCell: (params) => (
        <>
          {/* 👥 Quản lý ứng viên phỏng vấn */}
          <Tooltip title="Thêm / Xóa ứng viên phỏng vấn">
            <IconButton
              color="secondary"
              onClick={() => handleOpenParticipants(params.row)}
            >
              <GroupAddIcon />
            </IconButton>
          </Tooltip>

          {/* ✏️ Đổi lịch */}
          <Tooltip title="Đổi lịch phỏng vấn">
            <IconButton
              color="primary"
              onClick={() => setOpenReschedule(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          {/* ✅ Hoàn tất */}
          <Tooltip title="Đánh dấu hoàn tất">
            <IconButton
              color="success"
              onClick={() => handleComplete(params.row)}
            >
              <DoneAllIcon />
            </IconButton>
          </Tooltip>

          {/* ❌ Hủy lịch */}
          <Tooltip title="Hủy phỏng vấn">
            <IconButton
              color="error"
              onClick={() => handleCancel(params.row)}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ]

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý lịch phỏng vấn
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenSchedule(true)}
        >
          Tạo lịch
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={interviews}
          columns={columns}
          getRowId={(r) => r.id}
          autoHeight
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": { background: "#f1f5f9" },
            "& .MuiDataGrid-cell": { alignItems: "center" },
          }}
        />
      )}

      {/* Modal: Tạo lịch */}
      {openSchedule && (
        <ScheduleModal
          open={openSchedule}
          onClose={() => setOpenSchedule(false)}
          onSuccess={fetchData}
        />
      )}

      {/* Modal: Đổi lịch */}
      {openReschedule && (
        <RescheduleModal
          open={!!openReschedule}
          onClose={() => setOpenReschedule(null)}
          interview={openReschedule}
          onSuccess={fetchData}
        />
      )}

      {/* Modal: Quản lý ứng viên */}
      {openParticipants && (
        <ParticipantModal
          open={!!openParticipants}
          onClose={() => setOpenParticipants(null)}
          interview={openParticipants}
          onUpdated={fetchData}
        />
      )}
    </Box>
  )
}
