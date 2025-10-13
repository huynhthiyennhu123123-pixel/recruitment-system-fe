import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(res.data.data);
      } catch (err) {
        console.error(" Lỗi khi tải dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={5}>
        <CircularProgress color="success" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );

  if (!data)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Không thể tải dữ liệu thống kê
      </Typography>
    );

  const { systemOverview, performanceMetrics, growthTrends } = data;

  // Dữ liệu biểu đồ
  const userGrowthData = {
    labels: growthTrends.userGrowthChart.map((d) => `${d.month}/${d.year}`),
    datasets: [
      {
        label: "Người dùng mới",
        data: growthTrends.userGrowthChart.map((d) => d.count),
        backgroundColor: "#2a9d8f",
        borderRadius: 6,
      },
    ],
  };

  const jobTrendData = {
    labels: growthTrends.jobPostingTrend.map((d) => `${d.month}/${d.year}`),
    datasets: [
      {
        label: "Việc làm mới",
        data: growthTrends.jobPostingTrend.map((d) => d.count),
        backgroundColor: "#264653",
        borderRadius: 6,
      },
    ],
  };

  const appTrendData = {
    labels: growthTrends.applicationVolumeTrend.map(
      (d) => `${d.month}/${d.year}`
    ),
    datasets: [
      {
        label: "Đơn ứng tuyển",
        data: growthTrends.applicationVolumeTrend.map((d) => d.count),
        borderColor: "#e9c46a",
        backgroundColor: "#f4a261",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const popularJobData = {
    labels: performanceMetrics.mostPopularJobTypes.map((j) => j.jobType),
    datasets: [
      {
        label: "Loại việc làm",
        data: performanceMetrics.mostPopularJobTypes.map((j) => j.count),
        backgroundColor: ["#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
      },
    ],
  };

  const cards = [
    { title: "Tổng người dùng", value: systemOverview.totalUsers },
    { title: "Người dùng hoạt động", value: systemOverview.activeUsers },
    { title: "Công ty", value: systemOverview.totalCompanies },
    { title: "Công ty đã xác minh", value: systemOverview.verifiedCompanies },
    {
      title: "Việc làm đang hoạt động",
      value: systemOverview.totalJobsByStatus.ACTIVE,
    },
    {
      title: "Đơn ứng tuyển đã duyệt",
      value: systemOverview.totalApplicationsByStatus.REVIEWED,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, mb: 3, color: "#264653" }}
      >
        Thống kê
      </Typography>

      {/* ======== THẺ TỔNG QUAN ======== */}
      <Grid container spacing={2}>
        {cards.map((c, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: "#f4f1de",
              }}
            >
              <Typography variant="h5" color="#2a9d8f" fontWeight={600}>
                {c.value}
              </Typography>
              <Typography variant="body2" color="#555">
                {c.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ======== HIỆU SUẤT HỆ THỐNG ======== */}
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 600, color: "#264653" }}
      >
        Hiệu suất hệ thống
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Loại việc làm phổ biến
            </Typography>
            <Doughnut data={popularJobData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Công ty hoạt động tích cực
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f4f1de" }}>
                  <TableCell>Tên công ty</TableCell>
                  <TableCell align="right">Số đơn ứng tuyển</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performanceMetrics.mostActiveCompanies.map((c) => (
                  <TableRow key={c.companyId} hover>
                    <TableCell>{c.companyName}</TableCell>
                    <TableCell align="right">{c.applications}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ======== XU HƯỚNG TĂNG TRƯỞNG ======== */}
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 600, color: "#264653" }}
      >
        Xu hướng tăng trưởng
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Người dùng mới theo tháng
            </Typography>
            <Bar data={userGrowthData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Việc làm mới theo tháng
            </Typography>
            <Bar data={jobTrendData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Lượng đơn ứng tuyển
            </Typography>
            <Line data={appTrendData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
