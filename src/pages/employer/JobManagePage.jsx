import React, { useState, useEffect } from "react"
import { Box, Button, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Link } from "react-router-dom"
import { employerService } from "../../services/employerService"

export default function JobManagePage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await employerService.getMyJobs(0, 20)
      setJobs(res.data.content || [])
    } catch (err) {
      console.error("Error fetching jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá tin này?")) return
    const res = await employerService.deleteJob(id)
    alert(res.message)
    fetchJobs()
  }

  const columns = [
    { field: "title", headerName: "Tiêu đề", flex: 1 },
    { field: "location", headerName: "Địa điểm", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 250,
      renderCell: (params) => (
        <>
          <Button component={Link} to={`/employer/jobs/${params.row.id}/edit`}>
            Sửa
          </Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>
            Xoá
          </Button>
        </>
      )
    }
  ]

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Quản lý tin tuyển dụng</Typography>
        <Button variant="contained" component={Link} to="/employer/jobs/new">
          Đăng tin mới
        </Button>
      </Box>
      <DataGrid rows={jobs} columns={columns} autoHeight pageSize={10} loading={loading} />
    </Box>
  )
}
