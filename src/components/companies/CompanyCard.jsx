import React from "react"
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material"
import { Link } from "react-router-dom"

export default function CompanyCard({ company }) {
  if (!company) return null

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Ảnh logo hoặc ảnh mặc định */}
      <CardMedia
        component="img"
        height="160"
        image={
          company.logoUrl ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
        alt={company.name}
        sx={{
          objectFit: "cover",
          backgroundColor: "#f4f4f4",
        }}
      />

      <CardContent>
        {/* Tên công ty */}
        <Typography
          variant="h6"
          component={Link}
          to={`/companies/${company.id}`}
          style={{
            textDecoration: "none",
            color: "#2a9d8f",
            fontWeight: "bold",
          }}
        >
          {company.name}
        </Typography>

        {/* Ngành nghề */}
        <Typography color="text.secondary" variant="body2" mt={0.5}>
          {company.industry || "Chưa cập nhật ngành nghề"}
        </Typography>

        {/* Địa điểm */}
        <Typography color="text.secondary" variant="body2">
          📍 {company.city || "Không rõ"}, {company.country || ""}
        </Typography>

        {/* Số việc làm */}
        <Box mt={1}>
          <Typography variant="body2" color="text.secondary">
            💼 Việc làm đang tuyển:{" "}
            <b style={{ color: "#2a9d8f" }}>
              {company.activeJobsCount ?? 0}
            </b>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
