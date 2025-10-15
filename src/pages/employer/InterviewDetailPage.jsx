// pages/employer/InterviewDetailPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Stack, Chip, TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { addParticipants, removeParticipants } from "../../services/interviewService";
// Giả sử bạn có API get chi tiết; nếu chưa, có thể lấy từ list hoặc bổ sung endpoint /interviews/{id}

export default function InterviewDetailPage() {
  const { id } = useParams();
  const [userIds, setUserIds] = useState(""); // nhập csv "21,1,2"
  const [role, setRole] = useState("INTERVIEWER");

  const onAdd = async () => {
    const ids = userIds.split(",").map(s => Number(s.trim())).filter(Boolean);
    await addParticipants(id, { userIds: ids, role });
    alert("Đã thêm người tham gia");
  };

  const onRemove = async () => {
    const ids = userIds.split(",").map(s => Number(s.trim())).filter(Boolean);
    await removeParticipants(id, { userIds: ids });
    alert("Đã xoá người tham gia");
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", my: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">Chi tiết lịch #{id}</Typography>
        <Stack direction="row" spacing={1} my={1}><Chip label="Quản lý người tham gia"/></Stack>
        <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
          <TextField
            fullWidth
            label="User IDs (phân tách bởi dấu phẩy)"
            value={userIds}
            onChange={(e)=>setUserIds(e.target.value)}
          />
          <TextField
            label="Vai trò"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            placeholder="INTERVIEWER / OBSERVER / ... "
          />
          <Button variant="contained" onClick={onAdd}>Thêm</Button>
          <Button variant="outlined" color="error" onClick={onRemove}>Xoá</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
