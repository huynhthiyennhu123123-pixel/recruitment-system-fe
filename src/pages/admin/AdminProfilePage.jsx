import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
} from "@mui/material";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    gender: "Male",
    facebookUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  // Giả lập API lấy profile
  useEffect(() => {
    setTimeout(() => {
      const mockProfile = {
        userFullName: "Nguyen Van Admin",
        userEmail: "admin@example.com",
        userPhone: "0123 456 789",
        summary: "Quản trị viên hệ thống",
        dateOfBirth: "1990-05-15",
        gender: "Male",
        address: "123 Đường Lê Lợi",
        city: "Hà Nội",
        country: "Việt Nam",
        linkedinUrl: "https://linkedin.com/in/admin",
        githubUrl: "https://github.com/admin",
        facebookUrl: "",
        twitterUrl: "",
      };
      setProfile(mockProfile);
      setFormData({
        fullName: mockProfile.userFullName,
        email: mockProfile.userEmail,
        dateOfBirth: mockProfile.dateOfBirth,
        gender: mockProfile.gender,
        facebookUrl: mockProfile.facebookUrl,
        twitterUrl: mockProfile.twitterUrl,
        linkedinUrl: mockProfile.linkedinUrl,
        githubUrl: mockProfile.githubUrl,
      });
    }, 600);
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    console.log("Dữ liệu đã lưu:", formData);
    alert("Thông tin đã được lưu (mock)");
  };

  if (!profile) return <Typography>Đang tải...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thông tin tài khoản
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}>
                {profile.userFullName.charAt(0)}
              </Avatar>
              <Typography variant="h6">{profile.userFullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.summary}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" color="primary" gutterBottom>
                Liên hệ
              </Typography>
              <Typography>Email: {profile.userEmail}</Typography>
              <Typography>Điện thoại: {profile.userPhone}</Typography>
              <Typography>Country: {profile.country}</Typography>
              <Typography>
                Địa chỉ: {profile.address}, {profile.city}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" color="primary" gutterBottom>
                Social Links
              </Typography>
              <Typography>
                LinkedIn:{" "}
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                  {profile.linkedinUrl}
                </a>
              </Typography>
              <Typography>
                Github:{" "}
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  {profile.githubUrl}
                </a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Cập nhật thông tin
              </Typography>

              <TextField
                fullWidth
                label="Họ tên"
                sx={{ mb: 2 }}
                value={formData.fullName}
                onChange={handleChange("fullName")}
              />

              <TextField
                fullWidth
                label="Email"
                sx={{ mb: 2 }}
                value={formData.email}
                onChange={handleChange("email")}
              />

              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                value={formData.dateOfBirth}
                onChange={handleChange("dateOfBirth")}
              />

              <Typography sx={{ mb: 1 }}>Giới tính</Typography>
              <RadioGroup
                row
                value={formData.gender}
                onChange={handleChange("gender")}
                sx={{ mb: 2 }}
              >
                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
              </RadioGroup>

              {/* Social */}

              <Typography variant="subtitle1" color="primary" gutterBottom>
                Cập nhật Social Media Links
              </Typography>

              <TextField
                fullWidth
                label="Facebook URL"
                sx={{ mb: 2 }}
                value={formData.facebookUrl}
                onChange={handleChange("facebookUrl")}
              />
              <TextField
                fullWidth
                label="Twitter URL"
                sx={{ mb: 2 }}
                value={formData.twitterUrl}
                onChange={handleChange("twitterUrl")}
              />
              <TextField
                fullWidth
                label="LinkedIn URL"
                sx={{ mb: 2 }}
                value={formData.linkedinUrl}
                onChange={handleChange("linkedinUrl")}
              />
              <TextField
                fullWidth
                label="Github URL"
                sx={{ mb: 2 }}
                value={formData.githubUrl}
                onChange={handleChange("githubUrl")}
              />

              <Button variant="contained" onClick={handleSave}>
                Lưu cập nhật
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
