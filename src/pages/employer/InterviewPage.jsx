import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import EditIcon from "@mui/icons-material/Edit"
import CancelIcon from "@mui/icons-material/Cancel"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import { DataGrid } from "@mui/x-data-grid"
import dayjs from "dayjs"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import {
  getInterviewById,
  getInterviewParticipants,
  getMyInterviews,
  cancelInterview,
  completeInterview,
} from "../../services/interviewService"
import { getManagedApplications } from "../../services/employerService"
import ScheduleModal from "./ScheduleModal"
import RescheduleModal from "./RescheduleModal"
import ParticipantModal from "./ParticipantModal"

// 🗺️ Mapping tiếng Việt
const interviewTypeMap = {
  VIDEO: "Phỏng vấn trực tuyến",
  ONSITE: "Phỏng vấn trực tiếp",
  PHONE: "Phỏng vấn qua điện thoại",
}

const statusMap = {
  SCHEDULED: { label: "Đã lên lịch", color: "info" },
  COMPLETED: { label: "Đã hoàn tất", color: "success" },
  CANCELED: { label: "Đã hủy", color: "error" },
  WAITING: { label: "Đang chờ xác nhận", color: "warning" },
}

export default function InterviewPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [openSchedule, setOpenSchedule] = useState(false)
  const [openReschedule, setOpenReschedule] = useState(null)
  const [openParticipants, setOpenParticipants] = useState(null)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState(null)

  // 🔹 Lấy danh sách phỏng vấn
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getMyInterviews({ page: 0, size: 50 })
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
      width: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (p) =>
        p.value ? dayjs(p.value).format("DD/MM/YYYY • HH:mm") : "—",
    },
    {
      field: "location",
      headerName: "Địa điểm",
      width: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "meetingLink",
      headerName: "Link họp",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2a9d8f", textDecoration: "underline" }}
          >
            {params.value.length > 35
              ? params.value.slice(0, 35) + "..."
              : params.value}
          </a>
        ) : (
          <span style={{ color: "#888" }}>Không có link</span>
        ),
    },
    {
      field: "interviewType",
      headerName: "Hình thức",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => interviewTypeMap[params.value] || "Không xác định",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const s = statusMap[params.value] || {
          label: "Không xác định",
          color: "default",
        }
        return <Chip label={s.label} color={s.color} sx={{ fontWeight: 500 }} />
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 210,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Tooltip title="Thêm / Xóa ứng viên phỏng vấn">
            <IconButton
              color="secondary"
              onClick={() => handleOpenParticipants(params.row)}
            >
              <GroupAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Đổi lịch phỏng vấn">
            <IconButton
              color="primary"
              onClick={() => setOpenReschedule(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Đánh dấu hoàn tất">
            <IconButton
              color="success"
              onClick={() => handleComplete(params.row)}
            >
              <DoneAllIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hủy phỏng vấn">
            <IconButton color="error" onClick={() => handleCancel(params.row)}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ]


  return (
    <Box p={3}>
      {/* 🔹 Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Quản lý lịch phỏng vấn
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            onClick={() => setOpenCalendar(true)}
            sx={{ mr: 2 }}
          >
            Xem lịch phỏng vấn
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenSchedule(true)}
          >
            Tạo lịch
          </Button>
        </Box>
      </Box>

      {/* 📋 Bảng danh sách phỏng vấn */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box textAlign="center" mt={4} mb={4}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            className="interview-grid"
            rows={interviews}
            columns={columns}
            getRowId={(r) => r.id}
            autoHeight
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-row:nth-of-type(odd)": { backgroundColor: "#ecf0f5ff" },
              "& .MuiDataGrid-row:nth-of-type(even)": { backgroundColor: "#f7fadaff" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#c2e0dfff",
                transition: "background-color 0.2s ease-in-out",
              },
              "& .MuiDataGrid-cell": {
                alignItems: "center",
                borderBottom: "1px solid #e0e0e0",
                fontSize: "14px",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#fafafa",
                borderTop: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-columnHeaderTitleContainer": {
                justifyContent: "center",
              },
            }}
          />


        )}
      </Paper>

      {/* 📅 Modal xem lịch phỏng vấn */}
      <Dialog
        open={openCalendar}
        onClose={() => setOpenCalendar(false)}
        fullWidth
        maxWidth="lg"
        disableRestoreFocus
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          📅 Lịch phỏng vấn
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setOpenCalendar(false)}
          >
            Đóng
          </Button>
        </DialogTitle>
        <DialogContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            height="80vh"
            locale="vi"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={interviews.map((i) => ({
              id: String(i.id),
              title: `${interviewTypeMap[i.interviewType] || "Phỏng vấn"} (${
                statusMap[i.status]?.label || "Không rõ"
              })`,
              start: i.scheduledAt,
              end: dayjs(i.scheduledAt)
                .add(i.durationMinutes || 60, "minute")
                .toISOString(),
              color:
                i.status === "COMPLETED"
                  ? "#2ecc71"
                  : i.status === "CANCELED"
                  ? "#e74c3c"
                  : "#3498db",
            }))}
            eventClick={async (info) => {
              try {
                const id = parseInt(info.event.id)
                const interviewData = interviews.find((i) => i.id === id)
                if (!interviewData) return

                const resParticipants = await getInterviewParticipants(id)
                const participantList =
                  resParticipants?.data?.data || resParticipants?.data || []

                const appsRes = await getManagedApplications(0, 100)
                const allApps =
                  appsRes?.data?.data?.content ||
                  appsRes?.data?.content ||
                  appsRes?.data ||
                  []

                const formattedParticipants = participantList.map((p) => {
                  const matchApp = allApps.find((a) => a.applicant?.id === p.userId)
                  return {
                    id: p.userId,
                    fullName: matchApp?.applicant?.fullName || `Ứng viên #${p.userId}`,
                    email: matchApp?.applicant?.email || "Không có email",
                    role: p.role,
                  }
                })

                setSelectedInterview({
                  ...interviewData,
                  participants: formattedParticipants,
                })
              } catch (err) {
                console.error("❌ Lỗi khi lấy chi tiết phỏng vấn:", err)
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 🗓️ Popup chi tiết buổi phỏng vấn */}
      {selectedInterview && (
        <Dialog
          open={!!selectedInterview}
          onClose={() => setSelectedInterview(null)}
          maxWidth="sm"
          fullWidth
          disableRestoreFocus
        >
          <DialogTitle>🗓️ Chi tiết buổi phỏng vấn</DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              👥 Danh sách ứng viên
            </Typography>
            {selectedInterview.participants?.length > 0 ? (
              <Box mb={2}>
                {selectedInterview.participants.map((p, idx) => (
                  <Typography key={idx} sx={{ ml: 2 }}>
                    • {p.fullName} ({p.email}){" "}
                    <span style={{ color: "#888" }}>
                      — {p.role === "INTERVIEWER" ? "Người phỏng vấn" : "Ứng viên"}
                    </span>
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography sx={{ ml: 2, color: "text.secondary" }}>
                Không có ứng viên nào được mời tham gia
              </Typography>
            )}

            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              🧾 Thông tin chi tiết
            </Typography>

            <Typography>
              <strong>⏰ Thời gian:</strong>{" "}
              {selectedInterview.scheduledAt
                ? dayjs(selectedInterview.scheduledAt).format("HH:mm, DD/MM/YYYY")
                : "Chưa có thời gian"}
            </Typography>
            <Typography>
              <strong>🕒 Thời lượng:</strong>{" "}
              {selectedInterview.durationMinutes || 60} phút
            </Typography>
            <Typography>
              <strong>💼 Hình thức:</strong>{" "}
              {interviewTypeMap[selectedInterview.interviewType] || "Không xác định"}
            </Typography>

            {selectedInterview.interviewType === "ONSITE" && (
              <Typography>
                <strong>📍 Địa điểm:</strong>{" "}
                {selectedInterview.location || "Chưa có địa điểm"}
              </Typography>
            )}
            {selectedInterview.interviewType === "VIDEO" && (
              <Typography>
                <strong>🔗 Link họp:</strong>{" "}
                {selectedInterview.meetingLink ? (
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    {selectedInterview.meetingLink}
                  </a>
                ) : (
                  "Chưa có link họp"
                )}
              </Typography>
            )}
            {selectedInterview.interviewType === "PHONE" && (
              <Typography>
                <strong>📞 Số điện thoại:</strong>{" "}
                {selectedInterview.phoneNumber || "Chưa có số điện thoại"}
              </Typography>
            )}
            <Typography>
              <strong>📘 Ghi chú:</strong>{" "}
              {selectedInterview.notes || "Không có ghi chú"}
            </Typography>

            <Box mt={1}>
              <Chip
                label={statusMap[selectedInterview.status]?.label || "Không xác định"}
                color={statusMap[selectedInterview.status]?.color || "default"}
                sx={{ fontWeight: 500 }}
              />
            </Box>

            {/* 🎯 Hành động nhanh */}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => {
                  setOpenReschedule(selectedInterview)
                  setSelectedInterview(null)
                }}
              >
                Đổi lịch
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<DoneAllIcon />}
                onClick={() => {
                  handleComplete(selectedInterview)
                  setSelectedInterview(null)
                }}
              >
                Hoàn tất
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => {
                  handleCancel(selectedInterview)
                  setSelectedInterview(null)
                }}
              >
                Hủy
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* 🗓️ Modal: Tạo lịch */}
      {openSchedule && (
        <ScheduleModal
          open={openSchedule}
          onClose={() => setOpenSchedule(false)}
          onSuccess={fetchData}
        />
      )}

      {/* 🔁 Modal: Đổi lịch */}
      {openReschedule && (
        <RescheduleModal
          open={!!openReschedule}
          onClose={() => setOpenReschedule(null)}
          interview={openReschedule}
          onSuccess={fetchData}
        />
      )}

      {/* 👥 Modal: Quản lý ứng viên */}
      {openParticipants && (
        <ParticipantModal
          open={!!openParticipants}
          onClose={() => setOpenParticipants(null)}
          interview={{
            id: openParticipants.id,
            jobPostingId:
              openParticipants.jobPostingId ||
              openParticipants.jobPosting?.id ||
              null,
          }}
          onUpdated={fetchData}
        />
      )}
    </Box>
  )
}
