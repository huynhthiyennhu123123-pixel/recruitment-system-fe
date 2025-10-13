import React, { useState, useEffect } from "react"
import JobSearchSection from "../../layout/JobSearchSection"
import { searchJobs } from "../../services/jobService"
import JobCard from "../../components/job/JobCard"
import { Box, Typography, CircularProgress } from "@mui/material"

export default function JobListPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async (filters = {}) => {
    setLoading(true)
    try {
      const res = await searchJobs({ ...filters, page: 0, size: 12 })
      setJobs(res.data.data.content || [])
    } catch (err) {
      console.error("Lỗi khi tải danh sách việc làm:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <Box>
      <JobSearchSection onSearch={fetchJobs} />
      <Typography variant="h5" mt={3}>
        Danh sách việc làm
      </Typography>
      {loading ? (
        <Box textAlign="center" py={4}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit,minmax(280px,1fr))"
          gap={2}
          mt={2}
        >
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </Box>
      )}
    </Box>
  )
}
