import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getJobDetail } from "../../services/jobService"
import { Box, Typography, Divider, CircularProgress } from "@mui/material"

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobDetail(id)
        setJob(res.data.data)
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết việc làm:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress color="success" />
      </Box>
    )

  if (!job)
    return <Typography color="error">Không tìm thấy việc làm</Typography>

  return (
    <Box maxWidth={800} mx="auto">
      <Typography variant="h4">{job.title}</Typography>
      <Typography color="text.secondary">
        {job.company?.name} • {job.location}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Mô tả công việc</Typography>
      <Typography sx={{ whiteSpace: "pre-line" }}>{job.description}</Typography>

      <Typography variant="h6" mt={3}>
        Yêu cầu
      </Typography>
      <Typography sx={{ whiteSpace: "pre-line" }}>{job.requirements}</Typography>

      <Typography variant="h6" mt={3}>
        Quyền lợi
      </Typography>
      <Typography sx={{ whiteSpace: "pre-line" }}>{job.benefits}</Typography>
    </Box>
  )
}
