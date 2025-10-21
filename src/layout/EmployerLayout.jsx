import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Container,
  Grid,
  Snackbar,
  Avatar,
  Divider,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import BusinessIcon from "@mui/icons-material/Business";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ReactTyped } from "react-typed";
import logo from "../assets/images/logo.png";
import { logout } from "../services/authService";
import { getEmployerCompanyId } from "../services/employerService";
import NotificationMenu from "../components/common/NotificationMenu";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EmployerLayout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [companyId, setCompanyId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyId = async () => {
      const id = await getEmployerCompanyId();
      setCompanyId(id);
    };
    fetchCompanyId();
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Hàm đăng xuất
  const handleLogout = async () => {
    try {
      await logout();
      setSnackbar({
        open: true,
        message: "Đăng xuất thành công!",
        severity: "success",
      });

      //  Chuyển hướng về trang public sau 1.2s
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (err) {
      console.error("❌ Lỗi khi đăng xuất:", err);
      setSnackbar({
        open: true,
        message: "Lỗi khi đăng xuất. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setAnchorEl(null);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ bgcolor: "#2a9d8f" }}>
        <Toolbar>
          {/* Logo + Typed text */}
          <Box
            sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1 }}
          >
            <img
              src={logo}
              alt="JobRecruit Logo"
              style={{ height: 70, borderRadius: "6px" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              <ReactTyped
                strings={[
                  "JobRecruit Employer",
                  "Quản lý dễ dàng",
                  "Kết nối ứng viên nhanh chóng",
                ]}
                typeSpeed={100}
                backSpeed={100}
                loop
              />
            </Typography>
          </Box>

          {/* Menu chính */}
          <Button
            color="inherit"
            component={Link}
            to="/employer/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/employer/jobs"
            startIcon={<WorkIcon />}
          >
            Tin tuyển dụng
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/employer/applications"
            startIcon={<PeopleIcon />}
          >
            Ứng viên
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/employer/interviews"
            startIcon={<EventIcon />}
          >
            Phỏng vấn
          </Button>

          <Button
            color="inherit"
            component={Link}
            to={`/employer/company/${companyId}`}
            startIcon={<BusinessIcon />}
          >
            Hồ sơ công ty
          </Button>

          <NotificationMenu />
          {/* Dropdown tài khoản */}
          <IconButton color="inherit" onClick={handleMenu}>
            {user?.avatarUrl || user?.company?.logoUrl ? (
              <Avatar
                src={user.avatarUrl || user.company.logoUrl}
                alt={user.fullName || "User Avatar"}
                sx={{ width: 36, height: 36 }}
              />
            ) : (
              <AccountCircle sx={{ fontSize: 36 }} />
            )}
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              disabled
              sx={{ opacity: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Avatar
                src={user?.avatarUrl || user?.company?.logoUrl}
                alt={user?.fullName || "User Avatar"}
                sx={{ width: 32, height: 32 }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {user?.fullName || "Người dùng"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />

            <MenuItem
              onClick={handleClose}
              component={Link}
              to={`/employer/company/${companyId}`}
            >
              Tài khoản của tôi
            </MenuItem>

            <MenuItem
              onClick={handleClose}
              component={Link}
              to="/employer/company/edit"
            >
              Cập nhật thông tin
            </MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Nội dung */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f9f9f9" }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#1a7265ff",
          color: "white",
          mt: "auto",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Cột 1: logo + giới thiệu */}
            <Grid  size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom>
                JobRecruit Employer
              </Typography>
              <Typography variant="body2">
                Nền tảng giúp Nhà tuyển dụng đăng tin, quản lý ứng viên và phỏng
                vấn nhanh chóng, hiệu quả.
              </Typography>
            </Grid>

            {/* Cột 2: liên kết nhanh */}
            <Grid  size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom>
                Liên kết nhanh
              </Typography>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>
                  <Link
                    to="/employer/dashboard"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employer/jobs"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Tin tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employer/applicants"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Ứng viên
                  </Link>
                </li>
              </ul>
            </Grid>

            {/* Cột 3: liên hệ */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom>
                Liên hệ
              </Typography>
              <Typography>Email: support@jobrecruit.vn</Typography>
              <Typography>Hotline: 0123 456 789</Typography>
              <Typography>Địa chỉ: Q. Ninh Kiều, TP. Cần Thơ</Typography>
            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              © {new Date().getFullYear()} JobRecruit. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
