import React from "react"
import { Box, Typography, Grid, Card, CardContent, Avatar, Divider } from "@mui/material"

export default function JobList() {
  const jobs = [
    {
      id: 1,
      title: "Nhân Viên Phát Triển Thị Trường Thức Ăn Thủy Sản Tôm Giống",
      company: "Công Ty TNHH TM & DV Diên Khánh",
      location: "Bạc Liêu, Cà Mau, Cần Thơ",
      salary: "12 - 20 triệu",
      logo: "/assets/dienkhanh.png",
      updated: "4 giờ trước"
    },
    {
      id: 2,
      title: "Kỹ Sư Xây Dựng - Cần Thơ",
      company: "CÔNG TY CỔ PHẦN XÂY DỰNG ĐẦU TƯ VÀ PHÁT TRIỂN 209",
      location: "Cần Thơ",
      salary: "18 triệu",
      logo: "/assets/xaydung209.png",
      updated: "4 giờ trước"
    },
    {
      id: 3,
      title: "Nhân Viên Tư Vấn Bán Hàng Tại Showroom (Khu vực miền Tây)",
      company: "Công Ty Cổ Phần Tập Đoàn Thế Giới Điện Giải",
      location: "Cần Thơ, Đồng Tháp, Tiền Giang",
      salary: "12 triệu",
      logo: "/assets/diengiai.png",
      updated: "1 ngày trước"
    },
    {
      id: 4,
      title: "Cần Thơ - Nhân Viên Xử Lý Tín Dụng Tại Thực Địa",
      company: "FE CREDIT",
      location: "Cần Thơ",
      salary: "8 - 25 triệu",
      logo: "/assets/fe-logo.png",
      updated: "1 ngày trước"
    }
  ]

  return (
    <Box>
      {jobs.map((job, index) => (
        <Card key={job.id} sx={{ mb: 2, "&:hover": { boxShadow: 6 } }}>
          <CardContent>
            <Grid container spacing={2}>
              {/* Logo */}
              <Grid item>
                <Avatar src={job.logo} variant="square" sx={{ width: 56, height: 56 }} />
              </Grid>

              {/* Nội dung */}
              <Grid item xs>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.location}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  💰 {job.salary} | 👥 Nhân viên
                </Typography>
              </Grid>

              {/* Cập nhật */}
              <Grid item xs={12} md="auto" textAlign={{ xs: "left", md: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  Cập nhật: {job.updated}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          {index < jobs.length - 1 && <Divider />}
        </Card>
      ))}
    </Box>
  )
}
