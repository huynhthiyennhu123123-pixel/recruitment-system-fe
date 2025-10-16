import * as React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";

import logo from "../assets/images/logo.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  IconButton,
  Badge,
  Menu,
  Tooltip,
  Avatar,
  ListItemButton,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import NotificationMenu from "../components/common/NotificationMenu";

const drawerWidth = 240;

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");

    handleCloseUserMenu();
    navigate("/auth/login");
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#e2f1e6ff",
          color: "#000",
          boxShadow: "none",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />

          {/* MAIL */}
          <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>

          <NotificationMenu />

          {/* AVATAR NGƯỜI DÙNG */}
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="Tài khoản">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Admin User"
                  src="/static/images/avatar/1.jpg"
                  sx={{ border: "2px solid white" }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{
                mt: "10px",
                "& .MuiPaper-root": {
                  bgcolor: "#fff",
                  color: "#000",
                  minWidth: 220,
                },
              }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Admin User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  admin@example.com
                </Typography>
              </Box>

              <ListItemButton component={Link} to="/admin/profile">
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Thông tin tài khoản
              </ListItemButton>
              <ListItemButton>
                <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                Đổi mật khẩu
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Đăng xuất
              </ListItemButton>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#041f24ff",
            color: "#fff",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <img src={logo} alt="Logo" style={{ height: 80 }} />
        </Box>

        <List>
          {[
            {
              to: "/admin/dashboard",
              icon: <DashboardIcon />,
              text: "Thống kê",
            },
            { to: "/admin/users", icon: <PeopleIcon />, text: "Người dùng" },
            { to: "/admin/companies", icon: <BusinessIcon />, text: "Công ty" },
            { to: "/admin/jobs", icon: <WorkIcon />, text: "Tuyển dụng" },
            { to: "/admin/roles", icon: <SettingsIcon />, text: "Roles" },
          ].map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                sx={{
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  "&.active": {
                    bgcolor: "#058551ff",
                    borderRadius: 2,
                    mx: 1,
                    fontWeight: "bold",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#dcf1e7fa" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText sx={{ color: "#dcf1e7fa" }} primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgColor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
