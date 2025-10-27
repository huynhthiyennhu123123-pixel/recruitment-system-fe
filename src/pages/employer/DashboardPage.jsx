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
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined"
import { DataGrid } from "@mui/x-data-grid"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
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

  /*  Thẻ tổng quan nhanh */
  const summaryCards = [
    {
      title: "Tin tuyển dụng",
      value: data?.topPerformingJobs?.length || 0,
      color: "#2e7d32",
      bg: "linear-gradient(135deg,#a5d6a7,#66bb6a)",
      icon: <WorkOutline sx={{ fontSize: 34, color: "#2e7d32" }} />,
    },
    {
      title: "Ứng viên nhận được",
      value: Object.values(data.applicationsByStatus || {}).reduce((a, b) => a + b, 0),
      color: "#0288d1",
      bg: "linear-gradient(135deg,#90caf9,#42a5f5)",
      icon: <PeopleAltOutlined sx={{ fontSize: 34, color: "#0288d1" }} />,
    },
    {
      title: "Tỷ lệ tuyển dụng",
      value: `${(data.conversionRates.offerToHired * 100).toFixed(1)}%`,
      color: "#f57c00",
      bg: "linear-gradient(135deg,#ffcc80,#ffb74d)",
      icon: <ShowChartOutlined sx={{ fontSize: 34, color: "#f57c00" }} />,
    },
    {
      title: "Thời gian tuyển trung bình",
      value: `${data.averageTimeToHire} ngày`,
      color: "#7b1fa2",
      bg: "linear-gradient(135deg,#ce93d8,#ab47bc)",
      icon: <EventAvailableOutlined sx={{ fontSize: 34, color: "#7b1fa2" }} />,
    },
  ]

  /*  Biểu đồ xu hướng */
  const hiringTrendData = {
    labels: data.hiringTrend.map((t) => t.date || "—"),
    datasets: [
      {
        label: "Số lượng ứng viên",
        data: data.hiringTrend.map((t) => t.applicationsCount || 0),
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46,125,50,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  }

  /*  Biểu đồ top jobs */
  const topJobsData = {
    labels: data.topPerformingJobs.map((j) => j.jobTitle),
    datasets: [
      {
        label: "Ứng viên",
        data: data.topPerformingJobs.map((j) => j.applicationsCount),
        backgroundColor: "rgba(66,165,245,0.7)",
      },
      {
        label: "Phỏng vấn",
        data: data.topPerformingJobs.map((j) => j.interviewsCount),
        backgroundColor: "rgba(255,167,38,0.7)",
      },
      {
        label: "Tuyển thành công",
        data: data.topPerformingJobs.map((j) => j.hiresCount),
        backgroundColor: "rgba(102,187,106,0.7)",
      },
    ],
  }

  /*  Bảng top job */
  const columns = [
    {
      field: "jobTitle",
      headerName: "Vị trí tuyển dụng",
      flex: 2,
    },
    {
      field: "applicationsCount",
      headerName: "Ứng viên",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "interviewsCount",
      headerName: "Phỏng vấn",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hiresCount",
      headerName: "Đã tuyển",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ]

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9fff9", minHeight: "100vh" }}>
      {/*  Tiêu đề */}
      <Box display="flex" alignItems="center" mb={3} gap={1}>
        <TrendingUpOutlined sx={{ fontSize: 32, color: "#2e7d32" }} />
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(45deg,#2e7d32,#66bb6a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Bảng điều khiển Nhà tuyển dụng
        </Typography>
      </Box>

      {/*  Cards */}
      <Grid container spacing={3} mb={4}>
        {summaryCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: card.color }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: card.bg,
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Biểu đồ xu hướng */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          sx={{ color: "#1b5e20" }}
        >
          Xu hướng tuyển dụng theo thời gian
        </Typography>
        {data.hiringTrend?.length > 0 ? (
          <Line
            data={hiringTrendData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        ) : (
          <Typography color="text.secondary">
            Chưa có dữ liệu xu hướng
          </Typography>
        )}
      </Paper>

      {/*  Biểu đồ top jobs */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          sx={{ color: "#1b5e20" }}
        >
          Top tin tuyển dụng hiệu quả
        </Typography>
        <Bar
          data={topJobsData}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </Paper>

      {/* Bảng chi tiết */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          sx={{ color: "#1b5e20" }}
        >
          Chi tiết tin tuyển dụng
        </Typography>
        <div style={{ width: "100%", height: 420 }}>
          <DataGrid
            rows={data.topPerformingJobs.map((j, i) => ({ id: i, ...j }))}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#e8f5e9",
                color: "#1b5e20",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#f9fbe7",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#ffffff",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f8e9",
                transition: "0.3s",
              },
            }}
          />
        </div>
      </Paper>
    </Box>
  )
}
