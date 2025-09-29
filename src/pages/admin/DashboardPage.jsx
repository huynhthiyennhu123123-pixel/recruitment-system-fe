import React from "react";
import { Container, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dasboard
      </Typography>

      <Typography variant="body1">Ddaya la trang dasboard</Typography>
    </Container>
  );
}
