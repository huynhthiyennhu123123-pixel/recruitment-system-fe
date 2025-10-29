import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import { me } from "../../services/authService";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await me();
        const data = res?.data?.data;
        if (data) setProfile(data);
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="success" />
      </Box>
    );

  if (!profile)
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Không thể tải thông tin tài khoản
      </Typography>
    );

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9 0%, #f9fbe7 100%)",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#2e7d32",
            color: "white",
            textAlign: "center",
            py: 4,
          }}
        >
          <Avatar
            src={profile.avatarUrl || ""}
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 2,
              fontSize: 40,
              bgcolor: "#43a047",
              border: "3px solid white",
            }}
          >
            {profile.fullName?.charAt(0) || "A"}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {profile.fullName}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {profile.role === "ADMIN" ? "Quản trị viên hệ thống" : "Người dùng"}
          </Typography>
        </Box>

        {/* Content */}
        <Card sx={{ borderRadius: 0 }}>
          <CardContent sx={{ px: 4, py: 3 }}>
            <Grid container spacing={3}>
              {/* Liên hệ */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  sx={{ color: "#2e7d32", fontWeight: 600, mb: 1 }}
                >
                  Liên hệ
                </Typography>
                <Divider
                  sx={{
                    mb: 2,
                    width: "40px",
                    borderBottomWidth: 2,
                    borderColor: "#66bb6a",
                  }}
                />
                <Typography sx={{ mb: 1 }}>
                  <strong>Email:</strong> {profile.email}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Điện thoại:</strong> {profile.phoneNumber || "—"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Email xác minh:</strong>{" "}
                  {profile.emailVerified ? "✅ Có" : "❌ Chưa"}
                </Typography>
              </Grid>

              {/* Thông tin hệ thống */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  sx={{ color: "#2e7d32", fontWeight: 600, mb: 1 }}
                >
                  Thông tin hệ thống
                </Typography>
                <Divider
                  sx={{
                    mb: 2,
                    width: "40px",
                    borderBottomWidth: 2,
                    borderColor: "#66bb6a",
                  }}
                />
                <Typography sx={{ mb: 1 }}>
                  <strong>Vai trò:</strong> {profile.role}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Trạng thái:</strong> {profile.status}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Lần đăng nhập cuối:</strong>{" "}
                  {profile.lastLogin
                    ? new Date(profile.lastLogin).toLocaleString("vi-VN")
                    : "—"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Ngày tạo tài khoản:</strong>{" "}
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>ID người dùng:</strong> {profile.id}
                </Typography>
              </Grid>
            </Grid>

            {/* Công ty */}
            <Divider sx={{ my: 3, borderColor: "#c8e6c9" }} />
            <Typography
              variant="h6"
              sx={{ color: "#2e7d32", fontWeight: 600, mb: 1 }}
            >
              Thông tin công ty
            </Typography>
            <Typography>
              {profile.company
                ? profile.company.name
                : "Không có thông tin công ty"}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
}
