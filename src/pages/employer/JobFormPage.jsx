import { Container, TextField, Button, Typography, Box } from "@mui/material"

export default function JobFormPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        📝 Thêm / Sửa Tin tuyển dụng
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <TextField label="Tên công việc" fullWidth margin="normal" required />
        <TextField label="Mô tả công việc" fullWidth margin="normal" multiline rows={4} />
        <TextField label="Yêu cầu ứng viên" fullWidth margin="normal" multiline rows={3} />
        <TextField label="Mức lương" fullWidth margin="normal" />
        <TextField label="Địa điểm làm việc" fullWidth margin="normal" />
        <TextField label="Hạn nộp hồ sơ" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />

        <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
          Lưu tin tuyển dụng
        </Button>
      </Box>
    </Container>
  )
}
