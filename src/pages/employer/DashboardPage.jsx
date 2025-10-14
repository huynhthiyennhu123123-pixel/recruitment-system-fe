import React, { useEffect, useState } from "react"
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material"
import WorkOutline from "@mui/icons-material/WorkOutline"
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined"
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined"
import ShowChartOutlined from "@mui/icons-material/ShowChartOutlined"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"
import { DataGrid } from "@mui/x-data-grid"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const API_URL = "http://localhost:8081/api/employer/dashboard"

export default function EmployerDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        const json = await res.json()
        setData(json.data)
      } catch (err) {
        console.error("❌ Lỗi khi tải dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading)
    return (
      <Box textAlign="center" py={5}>
        <CircularProgress color="success" />
      </Box>
    )

  if (!data)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Không có dữ liệu hiển thị.
      </Typography>
    )

  /* ========== 1️⃣ Thẻ tổng quan nhanh ========== */
  const summaryCards = [
    {
      title: "Tin tuyển dụng",
      value: data?.topPerformingJobs?.length || 0,
      color: "#2e7d32",
      icon: <WorkOutline sx={{ fontSize: 36, color: "#2e7d32" }} />,
    },
    {
      title: "Ứng viên nhận được",
      value: Object.values(data.applicationsByStatus || {}).reduce((a, b) => a + b, 0),
      color: "#0288d1",
      icon: <PeopleAltOutlined sx={{ fontSize: 36, color: "#0288d1" }} />,
    },
    {
      title: "Tỷ lệ tuyển dụng",
      value: `${(data.conversionRates.offerToHired * 100).toFixed(1)}%`,
      color: "#f57c00",
      icon: <ShowChartOutlined sx={{ fontSize: 36, color: "#f57c00" }} />,
    },
    {
      title: "Thời gian tuyển trung bình",
      value: `${data.averageTimeToHire} ngày`,
      color: "#7b1fa2",
      icon: <EventAvailableOutlined sx={{ fontSize: 36, color: "#7b1fa2" }} />,
    },
  ]

  /* ========== 2️⃣ Biểu đồ xu hướng tuyển dụng (Line chart) ========== */
  const hiringTrendData = {
    labels: data.hiringTrend.map((t) => t.date || "—"),
    datasets: [
      {
        label: "Số lượng ứng viên",
        data: data.hiringTrend.map((t) => t.applicationsCount || 0),
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46,125,50,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  }

  /* ========== 3️⃣ Biểu đồ Top Jobs hiệu quả (Bar chart) ========== */
  const topJobsData = {
    labels: data.topPerformingJobs.map((j) => j.jobTitle),
    datasets: [
      {
        label: "Ứng viên",
        data: data.topPerformingJobs.map((j) => j.applicationsCount),
        backgroundColor: "rgba(2,136,209,0.5)",
      },
      {
        label: "Phỏng vấn",
        data: data.topPerformingJobs.map((j) => j.interviewsCount),
        backgroundColor: "rgba(245,124,0,0.5)",
      },
      {
        label: "Tuyển thành công",
        data: data.topPerformingJobs.map((j) => j.hiresCount),
        backgroundColor: "rgba(46,125,50,0.5)",
      },
    ],
  }

  /* ========== 4️⃣ Bảng chi tiết top jobs ========== */
  const columns = [
    { field: "jobTitle", headerName: "Vị trí tuyển dụng", flex: 2 },
    {
      field: "applicationsCount",
      headerName: "Ứng viên",
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "interviewsCount",
      headerName: "Phỏng vấn",
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hiresCount",
      headerName: "Đã tuyển",
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "conversionRate",
      headerName: "Tỷ lệ chuyển đổi",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => `${(params.value * 100).toFixed(1)}%`,
    },
  ]

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#2e7d32" }}>
        Bảng điều khiển Nhà tuyển dụng
      </Typography>

      {/* 1️⃣ Tổng quan nhanh */}
      <Grid container spacing={3}>
        {summaryCards.map((card, idx) => (
          <Grid item xs={12} md={3} key={idx}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderLeft: `6px solid ${card.color}`,
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: card.color }}>
                  {card.value}
                </Typography>
              </Box>
              {card.icon}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* 2️⃣ Biểu đồ xu hướng */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Xu hướng tuyển dụng theo thời gian
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {data.hiringTrend?.length > 0 ? (
          <Line
            data={hiringTrendData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "bottom" } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        ) : (
          <Typography color="text.secondary">Chưa có dữ liệu xu hướng</Typography>
        )}
      </Paper>

      {/* 3️⃣ Biểu đồ top jobs */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Top tin tuyển dụng hiệu quả
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Bar
          data={topJobsData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: { display: false },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </Paper>

      {/* 4️⃣ Bảng chi tiết */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Chi tiết tin tuyển dụng
      </Typography>
      <Paper sx={{ p: 2 }}>
        <div style={{ width: "100%", height: 400 }}>
          <DataGrid
            rows={data.topPerformingJobs.map((j, i) => ({ id: i, ...j }))}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
          />
        </div>
      </Paper>
    </Box>
  )
}
