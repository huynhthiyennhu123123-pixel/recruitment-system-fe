import { Grid, Card, CardContent, Typography } from "@mui/material"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DashboardPage() {
  const stats = { jobs: 5, applicants: 42, interviews: 7, hires: 3 }

  const chartData = {
    labels: ["Th1", "Th2", "Th3", "Th4", "Th5"],
    datasets: [
      { label: "Ứng viên", data: [5, 12, 8, 20, 15], backgroundColor: "#2e7d32" }
    ]
  }

  return (
    <Grid container spacing={3}>
      {Object.entries(stats).map(([key, value]) => (
        <Grid item xs={12} md={3} key={key}>
          <Card sx={{ bgcolor: "#e8f5e9" }}>
            <CardContent>
              <Typography variant="h6">{key.toUpperCase()}</Typography>
              <Typography variant="h4" color="primary">{value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Bar data={chartData} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
