import React, { useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  InputAdornment
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { registerEmployer } from "../../services/authService"

export default function EmployerRegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    companyName: "",
    companyAddress: "",
    role: "EMPLOYER",
    agree: false
  })
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Mật khẩu nhập lại không khớp")
      return
    }
    if (!formData.agree) {
      setMessage("❌ Bạn cần đồng ý với điều khoản")
      return
    }

    try {
      const res = await registerEmployer(formData)
      setMessage(res.success ? "✅ " + res.message : "❌ " + res.message)
      if (res.success) {
        localStorage.setItem("token", res.data.token)
      }
    } catch (err) {
      setMessage("❌ " + (err.message || "Đăng ký thất bại"))
    }
  }

  return (
    <Container 
  maxWidth="sm" 
  sx={{ 
    mt: 5, 
    mb: 5, 
    p: 4, 
    borderRadius: 2, 
    backgroundColor: "#e8f5e9" // xanh lá nhạt
  }}
>
  {/* Tiêu đề */}
  <Typography 
    variant="h5" 
    gutterBottom 
    align="center" 
    sx={{ 
      fontWeight: "bold", 
      color: "#2e7d32" // xanh lá đậm
    }}
  >
    ĐĂNG KÝ NHÀ TUYỂN DỤNG
  </Typography>


      <form onSubmit={handleSubmit}>
        {/* Tài khoản */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold", color: "#2e7d32" }}>
          Thông Tin Tài Khoản:
        </Typography>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
           sx={{ backgroundColor: "white", borderRadius: 1 }}
        />

        {/* Mật khẩu */}
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Mật khẩu"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
           sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Nhập lại mật khẩu */}
        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          required
           sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Thông tin nhà tuyển dụng */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1,fontWeight: "bold", color: "#2e7d32"}}>
          Thông Tin Nhà Tuyển Dụng:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Họ"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
               sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tên"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
               sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
               sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormLabel component="legend" sx={{fontWeight: "bold"}}>Giới tính</FormLabel>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="male" control={<Radio />} label="Nam" />
              <FormControlLabel value="female" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Tên công ty"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          margin="normal"
          required
           sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
        <TextField
          fullWidth
          label="Địa điểm làm việc"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={handleChange}
          margin="normal"
          required
           sx={{ backgroundColor: "white", borderRadius: 1 }}
        />

        {/* Điều khoản */}
        <FormControlLabel
          control={<Checkbox name="agree" checked={formData.agree} onChange={handleChange} />}
          label={
            <span>
              Tôi đã đọc và đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>
            </span>
          }
        />

        {/* Submit */}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="success" fullWidth>
            Hoàn tất
          </Button>
        </Box>
      </form>

      {message && (
        <Typography variant="body2" sx={{ mt: 2 }} color="error">
          {message}
        </Typography>
      )}
    </Container>
  )
}
