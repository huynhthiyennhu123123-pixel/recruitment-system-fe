import React, { useState, useEffect } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import { employerService } from "../../services/employerService"

export default function JobFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salaryMin: "",
    salaryMax: ""
  })

  useEffect(() => {
    if (isEdit) {
      employerService.getJobById(id).then((res) => {
        const job = res.data
        setForm({
          title: job.title,
          description: job.description,
          location: job.location,
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || ""
        })
      })
    }
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = isEdit
      ? await employerService.updateJob(id, form)
      : await employerService.createJob(form)

    alert(res.message)
    if (res.success) navigate("/employer/jobs")
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Tiêu đề" name="title" value={form.title} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Mô tả" name="description" value={form.description} onChange={handleChange} margin="normal" multiline rows={4} required />
        <TextField fullWidth label="Địa điểm" name="location" value={form.location} onChange={handleChange} margin="normal" required />
        <Box display="flex" gap={2}>
          <TextField label="Lương tối thiểu" name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} />
          <TextField label="Lương tối đa" name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} />
        </Box>
        <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>
          {isEdit ? "Cập nhật" : "Đăng tin"}
        </Button>
      </form>
    </Box>
  )
}
