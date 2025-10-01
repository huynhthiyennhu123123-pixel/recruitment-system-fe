import { DataGrid } from "@mui/x-data-grid"
import { Box, Button } from "@mui/material"

export default function ApplicantsPage() {
  const rows = [
    { id: 1, name: "Nguyễn Văn A", job: "Frontend Developer", status: "Pending" },
    { id: 2, name: "Trần Thị B", job: "Backend Developer", status: "Interview" }
  ]

  const columns = [
    { field: "name", headerName: "Tên ứng viên", flex: 1 },
    { field: "job", headerName: "Vị trí ứng tuyển", flex: 1 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 250,
      renderCell: (params) => (
        <>
          <Button size="small">Xem CV</Button>
          <Button size="small" color="success">Mời PV</Button>
          <Button size="small" color="error">Từ chối</Button>
        </>
      )
    }
  ]

  return (
    <Box>
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} />
    </Box>
  )
}
