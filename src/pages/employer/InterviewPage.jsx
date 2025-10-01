import { DataGrid } from "@mui/x-data-grid"
import { Box, Button } from "@mui/material"

export default function InterviewPage() {
  const rows = [
    { id: 1, candidate: "Nguyễn Văn A", job: "Frontend Dev", date: "2025-10-02", result: "Chưa có" }
  ]

  const columns = [
    { field: "candidate", headerName: "Ứng viên", flex: 1 },
    { field: "job", headerName: "Vị trí", flex: 1 },
    { field: "date", headerName: "Ngày PV", width: 150 },
    { field: "result", headerName: "Kết quả", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: () => (
        <>
          <Button size="small">Cập nhật</Button>
          <Button size="small" color="error">Hủy</Button>
        </>
      )
    }
  ]

  return (
    <Box>
      <Button variant="contained" sx={{ mb: 2 }}>
        ➕ Tạo lịch phỏng vấn
      </Button>
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} />
    </Box>
  )
}
