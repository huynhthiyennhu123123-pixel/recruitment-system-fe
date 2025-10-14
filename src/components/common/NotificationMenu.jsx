import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Badge,
  Menu,
  Typography,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  countUnread,
} from "../../services/notificationService";

// ======================
// Icon mapping
// ======================
const getNotificationIcon = (type) => {
  switch (type) {
    case "APPLICATION_STATUS_CHANGED":
      return <WorkOutlineIcon color="primary" />;
    case "NEW_APPLICATION_RECEIVED":
      return <NotificationsActiveIcon color="secondary" />;
    case "JOB_DEADLINE_REMINDER":
      return <ScheduleIcon color="warning" />;
    case "INTERVIEW_SCHEDULED":
      return <EventAvailableIcon color="success" />;
    case "INTERVIEW_RESCHEDULED":
      return <EventRepeatIcon color="info" />;
    case "INTERVIEW_CANCELLED":
      return <EventBusyIcon color="error" />;
    case "INTERVIEW_COMPLETED":
      return <DoneAllIcon color="success" />;
    default:
      return <NotificationsActiveIcon color="disabled" />;
  }
};

// ======================
// Component chính
// ======================
export default function NotificationMenu({ iconColor = "#00b14f", size = 22 }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // --- Fetch dữ liệu ---
  const fetchUnreadCount = async () => {
    try {
      const res = await countUnread();
      setUnreadCount(res.data.data.count);
    } catch (err) {
      console.error("Lỗi lấy số thông báo chưa đọc:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ page: 0, size: 1000 });
      setNotifications(res.data.content || []);
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const filtered =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <>
      {/* 🔔 ICON */}
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          fetchNotifications();
        }}
        sx={{
          color: iconColor,
          "&:hover": {
            backgroundColor: "rgba(0,177,79,0.08)", // nền xanh nhạt khi hover
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          overlap="circular"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: 11,
              height: 18,
              minWidth: 18,
            },
          }}
        >
          <NotificationsIcon sx={{ color: iconColor, fontSize: size }} />
        </Badge>
      </IconButton>

      {/* MENU */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: 360,
            borderRadius: 2,
            overflow: "visible",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow:
              "0px 4px 12px rgba(0,0,0,0.12), 0px 8px 20px rgba(0,0,0,0.10)", // 🌟 bóng kép mềm, sâu
            backdropFilter: "blur(4px)",
            backgroundColor: "#fff",
          },
        }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 1.5,
            borderBottom: "1px solid #eee",
            bgcolor: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <Typography fontWeight="bold" fontSize={15}>
            Thông báo
          </Typography>

          <Box sx={{ display: "flex", mt: 1 }}>
            {[
              { key: "all", label: "Tất cả" },
              { key: "unread", label: "Chưa đọc" },
            ].map((tab) => (
              <Typography
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                sx={{
                  mr: 2,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color:
                    activeTab === tab.key ? "primary.main" : "text.secondary",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === tab.key
                      ? "2px solid #058551"
                      : "2px solid transparent",
                  pb: 0.5,
                  fontSize: 14,
                }}
              >
                {tab.label}
              </Typography>
            ))}

            <Box sx={{ flexGrow: 1 }} />
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer", fontSize: 13 }}
              onClick={async () => {
                await markAllAsRead();
                fetchUnreadCount();
                setAnchorEl(null);
              }}
            >
              Đánh dấu đã đọc
            </Typography>
          </Box>
        </Box>

        {/* Danh sách */}
        <Box
          sx={{
            maxHeight: 360,
            minHeight: 360,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "3px",
            },
          }}
        >
          {loading ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress size={26} color="success" />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography sx={{ p: 2, textAlign: "center", fontSize: 14 }}>
              Không có thông báo
            </Typography>
          ) : (
            filtered.map((n) => (
              <Box
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  setAnchorEl(null);
                  if (n.actionUrl) setTimeout(() => navigate(n.actionUrl), 200);
                }}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.2,
                  py: 1,
                  px: 1.5,
                  borderBottom: "1px solid #f5f5f5",
                  bgcolor: n.read ? "inherit" : "rgba(5,133,81,0.08)",
                  "&:hover": {
                    bgcolor: "rgba(5,133,81,0.12)",
                    cursor: "pointer",
                  },
                }}
              >
                <Box sx={{ mt: 0.3 }}>{getNotificationIcon(n.type)}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={n.read ? 400 : 600} fontSize={14}>
                    {n.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.2, fontSize: 13 }}
                  >
                    {n.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: "block", mt: 0.3 }}
                  >
                    {new Date(n.createdAt).toLocaleString("vi-VN")}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Menu>
    </>
  );
}
