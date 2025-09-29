import * as React from "react";

import { Outlet, NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // chừa chỗ cho icon search
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
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#2A9D8F",
          color: "#fff",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Logo" style={{ height: 75 }} />
          </Box>
          {/* Search */}
          <Box sx={{ flexGrow: 1, mx: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "rgba(255,255,255,0.2)",
                px: 2,
                py: 0.5,
                borderRadius: 5,
                maxWidth: 400,
                mx: "auto",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              <InputBase
                placeholder="Search…"
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
            <Tooltip title="Open settings">
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
                  bgcolor: "#3E3E3E", // nền xám đậm
                  color: "#fff",
                },
                "& .MuiMenuItem-root:hover": {
                  bgcolor: "#F5EDD7", // be nhạt hover
                  color: "#000",
                },
              }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>Account</MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>Dashboard</MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>Logout</MenuItem>
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
            bgcolor: "#264653",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/dashboard"
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontWeight: "bold",
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/users"
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontWeight: "bold",
                },
              }}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/companies"
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontWeight: "bold",
                },
              }}
            >
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Companies" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/jobs"
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontWeight: "bold",
                },
              }}
            >
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Jobs" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin/roles"
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontWeight: "bold",
                },
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Roles" />
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
