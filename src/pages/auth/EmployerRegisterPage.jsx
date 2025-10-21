import React, { useState } from "react";
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
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerEmployer } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function EmployerRegisterPage() {
  const navigate = useNavigate();
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
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu nhập lại không khớp");
      return;
    }
    if (!formData.agree) {
      setMessage(" Bạn cần đồng ý với điều khoản");
      return;
    }

    try {
      const res = await registerEmployer(formData);
      if (res?.success) {
        setMessage(" Đăng ký thành công! Vui lòng xác thực email.");
        navigate("/auth/login", { state: { email: formData.email } });
      } else {
        setMessage(res?.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Lỗi khi đăng ký");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: -3,
        mb: 5,
        p: 3,
        borderRadius: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#2e7d32", mb: 2 }}
      >
        ĐĂNG KÝ NHÀ TUYỂN DỤNG
      </Typography>

      <form onSubmit={handleSubmit}>
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
          type={showConfirmPassword ? "text" : "password"}
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="dense"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Thông tin nhà tuyển dụng */}
        <Typography
          variant="subtitle2"
          sx={{ mt: 2, mb: 0.5, fontWeight: "bold", color: "#2e7d32" }}
        >
          Thông Tin Nhà Tuyển Dụng:
        </Typography>

        {/* Họ và Tên */}
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
              sx={{ marginInlineEnd: 5 }}
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
              sx={{ marginInlineEnd: 7 }}
            />
          </Grid>
        </Grid>

        {/* Số điện thoại + Giới tính */}
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              sx={{ marginInlineEnd: 5 }}
            />
          </Grid>
          <Grid item xs={6} sx={{ marginInlineStart: 9 }}>
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
          margin="dense"
          required
        />

        <TextField
          fullWidth
          size="small"
          label="Mô tả công ty"
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={2}
        />

        <TextField
          fullWidth
          size="small"
          label="Website công ty"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          margin="dense"
        />

        <TextField
          fullWidth
          size="small"
          label="Ngành nghề"
          name="companyIndustry"
          value={formData.companyIndustry}
          onChange={handleChange}
          margin="dense"
        />

        <TextField
          fullWidth
          size="small"
          label="Địa chỉ công ty"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={handleChange}
          margin="dense"
          required
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
              fontSize: 14,
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
      {message && (
          <Typography
            variant="body2"
            sx={{ mt: 1.5, textAlign: "center" }}
            color="error"
          >
            {message}
          </Typography>
        )}

        {/* 🔗 Liên kết đăng nhập */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Đã có tài khoản?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/auth/login")}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                color: "#2e7d32",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Đăng nhập ngay
            </Button>
          </Typography>
        </Box>
    </Container>
  );
}
