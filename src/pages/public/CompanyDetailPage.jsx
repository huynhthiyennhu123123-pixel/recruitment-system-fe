import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getCompanyById } from "../../services/companyService"
import { Box, Typography, Divider, CircularProgress, Chip, Grid } from "@mui/material"
import JobCard from "../../components/job/JobCard"

export default function CompanyDetailPage() {
  const { id } = useParams()
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await getCompanyById(id)
        setCompanyData(res.data) // dữ liệu trả về đúng cấu trúc { company, jobs }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết công ty:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [id])

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress color="success" />
      </Box>
    )

  if (!companyData)
    return <Typography color="error">Không tìm thấy công ty</Typography>

  const { company, jobs } = companyData

  return (
    <Box sx={{ backgroundColor: "#fff", borderRadius: 2, p: 3 }}>
      {/* Header thông tin công ty */}
      <Grid container spacing={3}>
        {/* Logo công ty */}
        <Grid item xs={12} md={3} textAlign="center">
          <img
            src={
              company.logoUrl ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt={company.name}
            style={{
              width: "100%",
              maxWidth: "180px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </Grid>

        {/* Thông tin chính */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" fontWeight="bold">
            {company.name}
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            {company.industry} • {company.city}, {company.country}
          </Typography>

          {/* Thông tin nhanh */}
          <Box mt={2}>
            <Typography variant="body2">
              <b>Địa chỉ:</b> {company.address}
            </Typography>
            {company.website && (
              <Typography variant="body2">
                <b>Website:</b>{" "}
                <a href={company.website} target="_blank" rel="noreferrer">
                  {company.website}
                </a>
              </Typography>
            )}
            {company.phoneNumber && (
              <Typography variant="body2">
                <b>Liên hệ:</b> {company.phoneNumber}
              </Typography>
            )}
            {company.contactEmail && (
              <Typography variant="body2">
                <b>Email:</b> {company.contactEmail}
              </Typography>
            )}
          </Box>

          {/* Thống kê */}
          <Box mt={2} display="flex" gap={3} flexWrap="wrap">
            <Chip
              label={`Nhân viên: ${company.employeeCount ?? 0}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Việc đang tuyển: ${company.activeJobsCount ?? 0}`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`Quy mô: ${company.companySize || "Chưa cập nhật"}`}
              color="info"
              variant="outlined"
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Mô tả công ty */}
      <Typography variant="h6" mb={1}>
        Giới thiệu công ty
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
        {company.description || "Chưa có mô tả công ty."}
      </Typography>

      {/* Ảnh công ty */}
      {company.companyPhotos && company.companyPhotos.length > 0 && (
        <>
          <Typography variant="h6" mt={3} mb={1}>
            Hình ảnh công ty
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {company.companyPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`company-${idx}`}
                style={{
                  width: "240px",
                  height: "160px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            ))}
          </Box>
        </>
      )}

      {/* Quyền lợi công ty */}
      {company.benefits && company.benefits.length > 0 && (
        <>
          <Typography variant="h6" mt={3}>
            Quyền lợi khi làm việc
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {company.benefits.map((b, idx) => (
              <Chip key={idx} label={b} color="success" variant="outlined" />
            ))}
          </Box>
        </>
      )}

      {/* Giờ làm việc */}
      {company.workingHours && (
        <Typography mt={3}>
          <b>Giờ làm việc:</b> {company.workingHours}
        </Typography>
      )}

      {/* Liên kết mạng xã hội */}
      {company.socialLinks && (
        <Box mt={3}>
          <Typography variant="h6">Liên kết mạng xã hội</Typography>
          {company.socialLinks.facebook && (
            <Typography>
              {" "}
              <a href={company.socialLinks.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </Typography>
          )}
          {company.socialLinks.linkedin && (
            <Typography>
              {" "}
              <a href={company.socialLinks.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </Typography>
          )}
        </Box>
      )}

      {/* Danh sách việc làm */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" mb={2}>
        Các việc làm đang tuyển
      </Typography>

      {jobs && jobs.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit,minmax(280px,1fr))"
          gap={2}
        >
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </Box>
      ) : (
        <Typography>Hiện công ty chưa có việc làm nào đang tuyển.</Typography>
      )}
    </Box>
  )
}
