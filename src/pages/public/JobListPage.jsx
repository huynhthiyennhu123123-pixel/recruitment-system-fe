import React, { useEffect, useState } from "react"
import { searchJobs } from "../../services/jobService"
import JobSearchSection from "../../layout/JobSearchSection"
import JobCard from "../../components/job/JobCard"
import { CircularProgress, Box, Typography, Grid, TextField, MenuItem, Button } from "@mui/material"

export default function JobListPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
    salaryRange: "",
  })

  const fetchJobs = async (params = {}) => {
    setLoading(true)
    try {
      const res = await searchJobs(params)
      const content =
        res?.data?.data?.content ||
        res?.data?.content ||
        res?.content ||
        []
      setJobs(content)
    } catch (err) {
      console.error("❌ Lỗi khi tải việc làm:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(filters)
  }, [])

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    fetchJobs(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters = {
      location: "",
      jobType: "",
      experience: "",
      salaryRange: "",
    }
    setFilters(defaultFilters)
    fetchJobs(defaultFilters)
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Thanh tìm kiếm */}
      <JobSearchSection onSearch={fetchJobs} />

      {/* Bộ lọc */}
      <Box sx={{ mt: 3, mb: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          select
          label="Địa điểm"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="Cần Thơ">Cần Thơ</MenuItem>
          <MenuItem value="Hồ Chí Minh">Hồ Chí Minh</MenuItem>
          <MenuItem value="Hà Nội">Hà Nội</MenuItem>
          <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
        </TextField>

        <TextField
          select
          label="Hình thức"
          value={filters.jobType}
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="FULL_TIME">Toàn thời gian</MenuItem>
          <MenuItem value="PART_TIME">Bán thời gian</MenuItem>
          <MenuItem value="INTERNSHIP">Thực tập</MenuItem>
        </TextField>

        <TextField
          select
          label="Kinh nghiệm"
          value={filters.experience}
          onChange={(e) => handleFilterChange("experience", e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="0-1y">0-1 năm</MenuItem>
          <MenuItem value="1-3y">1-3 năm</MenuItem>
          <MenuItem value="3-5y">3-5 năm</MenuItem>
        </TextField>

        <TextField
          select
          label="Mức lương"
          value={filters.salaryRange}
          onChange={(e) => handleFilterChange("salaryRange", e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="10-15tr">10-15 triệu</MenuItem>
          <MenuItem value="15-20tr">15-20 triệu</MenuItem>
          <MenuItem value="20-30tr">20-30 triệu</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          color="success"
          onClick={resetFilters}
        >
          ⟳ Làm mới
        </Button>
      </Box>

      {/* Danh sách việc làm */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Danh sách việc làm
      </Typography>

      {loading ? (
        <Box textAlign="center" py={5}>
          <CircularProgress color="success" />
        </Box>
      ) : jobs.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" py={5}>
          Không tìm thấy việc làm phù hợp.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
