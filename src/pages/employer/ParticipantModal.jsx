import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  CircularProgress,
  Typography,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import {
  addParticipants,
  removeParticipants,
  cancelInterview,
} from "../../services/interviewService";
import { useInterviewApplicants } from "../../utils/useInterviewApplicants";

export default function ParticipantModal({
  open,
  onClose,
  interview,
  onUpdated,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const {
    participants = [],
    applicants = [],
    setParticipants,
    setApplicants,
    loading,
  } = useInterviewApplicants(interview);

  //  Toggle chọn ứng viên để thêm
  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  //Thêm ứng viên mới
  const handleAdd = async () => {
    if (selectedIds.size === 0) {
      toast.warn("Vui lòng chọn ít nhất một ứng viên.");
      return;
    }

    try {
      const userIds = Array.from(selectedIds);
      const res = await addParticipants(interview.id, {
        userIds,
        role: "APPLICANT",
      });

      if (res?.success || res?.data?.success) {
        toast.success("🎉 Đã thêm ứng viên vào buổi phỏng vấn!");

        const newlyAdded = applicants
          .filter((a) => selectedIds.has(a.id))
          .map((a) => ({
            id: a.id,
            name: a.applicantName || a.applicant?.fullName,
            email: a.applicantEmail || a.applicant?.email,
            jobTitle: a.jobTitle,
            role: "APPLICANT",
          }));

        setParticipants((prev) => [...prev, ...newlyAdded]);
        setApplicants((prev) => prev.filter((a) => !selectedIds.has(a.id)));
        setSelectedIds(new Set());
        onUpdated?.();
      } else {
        toast.error(res?.message || "Không thể thêm ứng viên.");
      }
    } catch (err) {
      console.error(" Lỗi khi thêm ứng viên:", err);
      toast.error("Lỗi hệ thống, vui lòng thử lại.");
    }
  };

  //  Xóa ứng viên (và có thể hủy phỏng vấn nếu rỗng)
  const handleRemove = async (userId) => {
    try {
      await removeParticipants(interview.id, { userIds: [userId] });
      toast.success("🗑️ Đã xóa ứng viên khỏi buổi phỏng vấn.");

      const removed = participants.find((p) => p.id === userId);
      const newList = participants.filter((p) => p.id !== userId);
      setParticipants(newList);

      // Thêm lại vào danh sách có thể thêm
      if (removed) {
        setApplicants((prev) => [
          ...prev,
          {
            id: removed.id,
            applicantName: removed.name,
            applicantEmail: removed.email,
            jobTitle: removed.jobTitle,
          },
        ]);
      }

      // ⚠️ Nếu không còn ứng viên nào → hủy phỏng vấn
      if (newList.length === 0) {
        await cancelInterview(interview.id, {
          reason: "Không còn ứng viên nào tham gia",
        });
        toast.info("🟡 Buổi phỏng vấn đã được hủy.");
        onUpdated?.();
        onClose();
      }

      onUpdated?.();
    } catch (err) {
      console.error(" Lỗi khi xóa ứng viên:", err);
      toast.error("Không thể xóa ứng viên.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 20 }}>
        👥 Quản lý ứng viên tham gia phỏng vấn
      </DialogTitle>

      <DialogContent dividers>
        {/* 🧍 Ứng viên hiện tại */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Ứng viên hiện tại:
        </Typography>

        {loading ? (
          <Box textAlign="center" py={2}>
            <CircularProgress size={28} />
          </Box>
        ) : participants.length > 0 ? (
          <List dense>
            {participants.map((p) => (
              <ListItem
                key={p.id}
                secondaryAction={
                  <Tooltip title="Xóa ứng viên khỏi phỏng vấn">
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRemove(p.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={`${p.name} — ${p.jobTitle || "Chưa xác định"}`}
                  secondary={`Email: ${p.email || "Không có"}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Chưa có ứng viên nào trong buổi phỏng vấn này.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* ➕ Ứng viên có thể thêm */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thêm ứng viên cùng công việc (trạng thái INTERVIEW):
        </Typography>

        {loading ? (
          <Box textAlign="center" py={2}>
            <CircularProgress size={28} />
          </Box>
        ) : applicants.length === 0 ? (
          <Typography color="text.secondary">
            Không có ứng viên phù hợp.
          </Typography>
        ) : (
          <List dense>
            {applicants.map((a) => (
              <ListItem
                key={a.id}
                button
                onClick={() => handleToggle(a.id)}
                sx={{
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#f9fafb" },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={selectedIds.has(a.id)}
                    tabIndex={-1}
                    disableRipple
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={`${a.applicantName || a.applicant?.fullName} — ${
                    a.jobTitle
                  }`}
                  secondary={`Email: ${
                    a.applicantEmail || a.applicant?.email || "Không có"
                  }`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleAdd}
          disabled={selectedIds.size === 0}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
