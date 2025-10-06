import { Outlet, Link } from "react-router-dom"
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
  Grid
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import WorkIcon from "@mui/icons-material/Work"
import PeopleIcon from "@mui/icons-material/People"
import EventIcon from "@mui/icons-material/Event"
import BusinessIcon from "@mui/icons-material/Business"
import AccountCircle from "@mui/icons-material/AccountCircle"
import { ReactTyped } from "react-typed"
import { useState } from "react"
import logo from "../assets/images/logo.png"

export default function EmployerLayout() {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ bgcolor: "#2a9d8f" }}>
        <Toolbar>
           {/* Logo + Typed text */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: 1
            }}
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
                  "Kết nối ứng viên nhanh chóng"
                ]}
                typeSpeed={100}
                backSpeed={100}
                loop
              />
            </Typography>
          </Box>


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
            to="/employer/applicants"
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
            to="/employer/profile"
            startIcon={<BusinessIcon />}
          >
            Hồ sơ công ty
          </Button>

          {/* Dropdown tài khoản */}
          <IconButton color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} to="/employer/profile">
              Tài khoản của tôi
            </MenuItem>
            <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
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
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Cột 1: logo + giới thiệu */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                JobRecruit Employer
              </Typography>
              <Typography variant="body2">
                Nền tảng giúp Nhà tuyển dụng đăng tin, quản lý ứng viên và
                phỏng vấn nhanh chóng, hiệu quả.
              </Typography>
            </Grid>

            {/* Cột 2: liên kết nhanh */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Liên kết nhanh
              </Typography>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>
                  <Link to="/employer/dashboard" style={{ color: "white", textDecoration: "none" }}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/employer/jobs" style={{ color: "white", textDecoration: "none" }}>
                    Tin tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link to="/employer/applicants" style={{ color: "white", textDecoration: "none" }}>
                    Ứng viên
                  </Link>
                </li>
              </ul>
            </Grid>

            {/* Cột 3: liên hệ */}
            <Grid item xs={12} md={4}>
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
    </Box>
  )
}
