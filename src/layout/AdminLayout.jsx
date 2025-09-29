import * as React from "react";

import { Outlet, NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

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
  InputBase,
  Button,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  ListItemButton,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SettingsIcon from "@mui/icons-material/Settings";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const drawerWidth = 240;
export default function AdminLayout() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#e2f1e6ff",
          color: "#000000ff",
          boxShadow: "none",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar>
          {/* Search */}
          <Box sx={{ flexGrow: 1, mx: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#fff",
                px: 2,
                py: 0.5,
                borderRadius: 5,
                maxWidth: 400,
                ml: 0,

                border: "2px solid #ccc",
              }}
            >
              <SearchIcon sx={{ mr: 1, color: "#888" }} />
              <InputBase
                placeholder="Tìm kiếm…"
                sx={{ color: "inherit", flex: 1 }}
              />
            </Box>
          </Box>

          {/* Icons */}
          <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Avatar + Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip>
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
                mt: "45px",
                "& .MuiPaper-root": {
                  bgcolor: "#fff",
                  color: "#000",
                  minWidth: 220,
                },
              }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* Header user info */}
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Admin User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  admin@example.com
                </Typography>
              </Box>

              {/* Menu items */}
              <MenuItem onClick={handleCloseUserMenu}>
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Thông tin tài khoản
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                Đổi mật khẩu
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Đăng xuất
              </MenuItem>
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
            borderBottom: "1px solid rghba(255, 255, 255, 0.1)",
          }}
        >
          <img src={logo} alt="Logo" style={{ height: 80 }} />
        </Box>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/dashboard"
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
              <ListItemIcon>
                <DashboardIcon sx={{ color: "#dcf1e7fa" }} />
              </ListItemIcon>
              <ListItemText sx={{ color: "#dcf1e7fa" }} primary="Trang chủ" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/users"
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
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: "#dcf1e7fa" }} primary="Người dùng" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/companies"
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
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: "#dcf1e7fa" }} primary="Công ty" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/jobs"
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
                <WorkIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: "#dcf1e7fa" }} primary="Tuyển dụng" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/roles"
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
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: "#dcf1e7fa" }} primary="Roles" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgColor: "background.defauth", p: 3 }}
      >
        <Toolbar />
        {/* Để nội dung không bị AppBar đè lên */}
        <Outlet />
      </Box>
    </Box>
  );
}
