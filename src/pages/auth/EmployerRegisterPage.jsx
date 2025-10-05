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
import { useNavigate } from "react-router-dom"

export default function EmployerRegisterPage() {
  const navigate = useNavigate()
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
    setMessage("")

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

      if (res?.success) {
        setMessage("✅ Đăng ký thành công! Vui lòng xác thực email.")
        //  chuyển hướng đến trang xác thực email
        navigate("/auth/check-email", { state: { email: formData.email } })
      } else {
        setMessage("❌ " + (res?.message || "Đăng ký thất bại"))
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ " + (err.response?.data?.message || "Lỗi khi đăng ký"))
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: -3,
        mb: 5,
        p: 3,
        borderRadius: 2,
        backgroundColor: "#ffffff"
      }}
    >
      {/* Tiêu đề */}
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#2e7d32",
          mb: 2
        }}
      >
        ĐĂNG KÝ NHÀ TUYỂN DỤNG
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Tài khoản */}
        <Typography
          variant="subtitle2"
          sx={{ mt: 1, mb: 0.5, fontWeight: "bold", color: "#2e7d32" }}
        >
          Thông Tin Tài Khoản:
        </Typography>

        {/* Email */}
        <TextField
          fullWidth
          size="small"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="dense"
          required
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{ sx: { height: 36 } }}
        />

        {/* Mật khẩu */}
        <TextField
          fullWidth
          size="small"
          type={showPassword ? "text" : "password"}
          label="Mật khẩu"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="dense"
          required
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            sx: { height: 36 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Nhập lại mật khẩu */}
        <TextField
          fullWidth
          size="small"
          type={showConfirmPassword ? "text" : "password"}
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="dense"
          required
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            sx: { height: 36 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

       <Typography
  variant="subtitle2"
  sx={{ mt: 2, mb: 0.5, fontWeight: "bold", color: "#2e7d32" }}
>
  Thông Tin Nhà Tuyển Dụng:
</Typography>

{/* Hàng 1: Họ | Tên */}
<Grid container spacing={1}>
  <Grid item xs={6} >
    <TextField
      fullWidth
      size="small"
      label="Họ"
      name="firstName"
      value={formData.firstName}
      onChange={handleChange}
      required
      sx={{ backgroundColor: "white", borderRadius: 1, marginInlineEnd:5 }}
      InputProps={{ sx: { height: 36 } }}
    />
  </Grid>
  <Grid item xs={6}>
    <TextField
      fullWidth
      size="small"
      label="Tên"
      name="lastName"
      value={formData.lastName}
      onChange={handleChange}
      required
      sx={{ backgroundColor: "white", borderRadius: 1, marginInlineEnd:3}}
      InputProps={{ sx: { height: 36, } }}
    />
  </Grid>
</Grid>

{/* Hàng 2: Số điện thoại | Giới tính */}
<Grid container spacing={1} sx={{ mt: 1, alignItems: "center" }}>
  <Grid item xs={6}>
    <TextField
      fullWidth
      size="small"
      label="Số điện thoại"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleChange}
      required
      sx={{ backgroundColor: "white", borderRadius: 1,marginInlineEnd:5 }}
      InputProps={{ sx: { height: 36 } }}
    />
  </Grid>

  <Grid item xs={6}
        sx={{marginInlineStart:6 }}
>
    <FormLabel component="legend" sx={{ fontSize: 13, mb: 0.3 }}>
      Giới tính
    </FormLabel>
    <RadioGroup
      row
      name="gender"
      value={formData.gender}
      onChange={handleChange}
    >
      <FormControlLabel
        value="male"
        control={<Radio size="small" />}
        label={<Typography sx={{ fontSize: 13 }}>Nam</Typography>}
      />
      <FormControlLabel
        value="female"
        control={<Radio size="small" />}
        label={<Typography sx={{ fontSize: 13 }}>Nữ</Typography>}
      />
    </RadioGroup>
  </Grid>
</Grid>


        <TextField
          fullWidth
          size="small"
          label="Tên công ty"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          margin="dense"
          required
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{ sx: { height: 36 } }}
        />

        <TextField
          fullWidth
          size="small"
          label="Địa điểm làm việc"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={handleChange}
          margin="dense"
          required
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{ sx: { height: 36 } }}
        />

        {/* Điều khoản */}
        <FormControlLabel
          control={
            <Checkbox
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              size="small"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              Tôi đã đọc và đồng ý với{" "}
              <a href="#" style={{ color: "#1b5e20" }}>
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" style={{ color: "#1b5e20" }}>
                Chính sách bảo mật
              </a>
            </Typography>
          }
        />

        {/* Nút submit */}
        <Box mt={1.5}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 1,
              py: 0.8,
              fontSize: 14
            }}
          >
            Hoàn tất
          </Button>
        </Box>

        {message && (
          <Typography
            variant="body2"
            sx={{ mt: 1.5, textAlign: "center" }}
            color="error"
          >
            {message}
          </Typography>
        )}
      </form>
    </Container>
  )
}
