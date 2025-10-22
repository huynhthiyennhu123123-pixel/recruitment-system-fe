import React, { useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import logo from "../../assets/images/logo.png"
import { registerEmployer } from "../../services/authService"
import { toast } from "react-toastify"

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
    companyDescription: "",
    companyWebsite: "",
    companyIndustry: "",
    companyAddress: "",
    role: "EMPLOYER",
    agree: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword)
      return toast.error("Mật khẩu nhập lại không khớp")
    if (!formData.agree)
      return toast.warning("Bạn cần đồng ý với điều khoản sử dụng")
    setLoading(true)
    try {
      const res = await registerEmployer(formData)
      if (res?.success) {
        toast.success("Đăng ký thành công! Vui lòng xác thực email.")
        navigate("/auth/login", { state: { email: formData.email } })
      } else toast.error(res?.message || "Đăng ký thất bại.")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Lỗi khi đăng ký.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Bên trái - Banner */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-[40%] bg-gradient-to-br from-[#004d40] via-[#00332c] to-[#001f1f] text-white flex-col justify-center items-center px-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center leading-snug">
          Tham gia cùng <br />
          <span className="text-green-400">Hàng ngàn Nhà tuyển dụng</span>
        </h2>
        <p className="max-w-md text-center text-gray-300 text-sm">
          JobRecruit giúp bạn kết nối nhanh chóng với ứng viên tiềm năng —
          đăng tin miễn phí và quản lý tuyển dụng chuyên nghiệp.
        </p>
      </motion.div>

      {/* Bên phải - Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[60%] flex items-center justify-center bg-white px-8 lg:px-16 py-8"
      >
        <Box className="w-full max-w-lg">
          {/* Logo + tiêu đề */}
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Đăng ký{" "}
              <span className="text-green-600">Nhà tuyển dụng</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Tạo tài khoản để bắt đầu tuyển dụng nhân tài cùng JobRecruit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <TextField
              fullWidth
              size="small"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2
              }}
            />

            {/* Mật khẩu */}
            <TextField
              fullWidth
              size="small"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Nhập lại mật khẩu */}
            <TextField
              fullWidth
              size="small"
              label="Nhập lại mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Họ & Tên */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Họ"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  sx={{
                marginBottom: 2
              }}
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
                  sx={{
                marginBottom: 2,
                marginInlineEnd:10
              }}
                />
              </Grid>
            </Grid>

            {/* SĐT & Giới tính */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Số điện thoại"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  sx={{
                marginBottom: 2,
                
              }}
                />
              </Grid>
              <Grid item xs={6} sx={{
                marginBottom: 2,
                marginLeft: 10
              }}>
                <FormLabel component="legend" sx={{ fontSize: 13 }}>
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
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio size="small" />}
                    label="Nữ"
                  />
                </RadioGroup>
              </Grid>
            </Grid>

            {/* Công ty */}
            <TextField
              fullWidth
              size="small"
              label="Tên công ty"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2,
                marginInlineEnd: 32,
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Mô tả công ty"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              multiline
              rows={2}
              sx={{
                marginBottom: 2
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Website công ty"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              sx={{
                marginBottom: 2
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Ngành nghề"
              name="companyIndustry"
              value={formData.companyIndustry}
              onChange={handleChange}
              sx={{
                marginBottom: 2
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Địa chỉ công ty"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2
              }}
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
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-green-700 hover:underline">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-green-700 hover:underline">
                    Chính sách bảo mật
                  </a>
                </Typography>
              }
            />

            {/* Nút đăng ký */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 1.5,
                py: 1,
                fontSize: 15,
                background: "linear-gradient(45deg,#2e7d32,#43a047)",
                "&:hover": {
                  background: "linear-gradient(45deg,#1b5e20,#2e7d32)",
                },
              }}
            >
              {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
            </Button>
          </form>

          {/* Liên kết đăng nhập */}
          <p className="mt-5 text-sm text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/auth/login" className="text-green-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </Box>
      </motion.div>
    </div>
  )
}
