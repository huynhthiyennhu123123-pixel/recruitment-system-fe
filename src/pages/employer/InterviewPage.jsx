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
import { DataGrid } from "@mui/x-data-grid"
import dayjs from "dayjs"
import {
  getMyInterviews,
  cancelInterview,
  completeInterview,
} from "../../services/interviewService"
import ScheduleModal from "./ScheduleModal"
import RescheduleModal from "./RescheduleModal"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import ParticipantModal from "./ParticipantModal"

export default function InterviewPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [openSchedule, setOpenSchedule] = useState(false)
  const [openReschedule, setOpenReschedule] = useState(null)
  const [openParticipants, setOpenParticipants] = useState(null);

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getMyInterviews({ page: 0, size: 20 })
      if (res.data.success) setInterviews(res.data.data.content)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleComplete = async (row) => {
    const notes = prompt("Nhập ghi chú hoàn tất:")
    if (!notes) return
    await completeInterview(row.id, { notes })
    fetchData()
  }

  const handleCancel = async (row) => {
    const reason = prompt("Nhập lý do hủy lịch:")
    if (!reason) return
    await cancelInterview(row.id, { reason })
    fetchData()
  }

  const columns = [
    {
      field: "stt",
      headerName: "STT",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.api ? params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1 : params.rowIndex + 1,
    },
    {
      field: "scheduledAt",
      headerName: "Thời gian phỏng vấn",
      width: 200,
      renderCell: (p) => dayjs(p.value).format("DD/MM/YYYY HH:mm"),
    },
    { field: "location", headerName: "Địa điểm", width: 150 },
    { field: "meetingLink", headerName: "Link meeting", width: 200 },
    { field: "interviewType", headerName: "Hình thức", width: 130 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
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
          {/* 👥 Quản lý người phỏng vấn */}
          <Tooltip title="Thêm / Xóa người phỏng vấn">
            <IconButton
              color="secondary"
              onClick={() => setOpenParticipants(params.row)}
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

    {
      field: "participants",
      headerName: "Người tham gia",
      flex: 1.2,
      renderCell: (params) => {
        const list = params.row.participants || [];
        if (list.length === 0)
          return <Typography variant="body2" color="text.secondary">—</Typography>;
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {list.map((p, idx) => (
              <Chip key={idx} label={p.name || p.email || p} size="small" />
            ))}
          </Box>
        );
      },
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
        />
      )}

      {openSchedule && (
        <ScheduleModal
          open={openSchedule}
          onClose={() => setOpenSchedule(false)}
          onSuccess={fetchData}
        />
      )}
      {openReschedule && (
        <RescheduleModal
          open={!!openReschedule}
          onClose={() => setOpenReschedule(null)}
          interview={openReschedule}
          onSuccess={fetchData}
        />
      )}
      {openParticipants && (
        <ParticipantModal
          open={!!openParticipants}
          onClose={() => setOpenParticipants(null)}
          interview={openParticipants}
          existingParticipants={openParticipants.participants || []}
          onUpdated={fetchData}
        />
      )}

    </Box>
  )
}
