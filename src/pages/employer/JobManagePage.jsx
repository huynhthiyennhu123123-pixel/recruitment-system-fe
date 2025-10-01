import { DataGrid } from "@mui/x-data-grid"
import { Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function JobManagePage() {
  const navigate = useNavigate()

  const rows = [
    { id: 1, title: "Frontend Developer", applicants: 10, status: "Open" },
    { id: 2, title: "Backend Developer", applicants: 7, status: "Closed" }
  ]

  const columns = [
    { field: "title", headerName: "Tên công việc", flex: 1 },
    { field: "applicants", headerName: "Ứng viên", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => navigate(`/employer/jobs/${params.row.id}/edit`)}>Sửa</Button>
          <Button size="small" color="error">Xóa</Button>
        </>
      )
    }
  ]

  return (
    <Box>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate("/employer/jobs/new")}>
        ➕ Thêm tin mới
      </Button>
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} />
    </Box>
  )
}
