import React, { useEffect, useState } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Avatar,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material"
import {
  Language,
  LocationOnOutlined,
  GroupsOutlined,
  ApartmentOutlined,
  CheckCircleOutline,
} from "@mui/icons-material"
import { useParams } from "react-router-dom"
import { getPublicCompanyById } from "../../services/employerService"
import JobList from "../../components/employer/JobList"

export default function CompanyProfilePage() {
  const { id } = useParams()
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchCompany = async () => {
    try {
      const res = await getPublicCompanyById(id)
      setCompanyData(res)  // ✅ sửa lại
    } catch (err) {
      console.error("❌ Lỗi khi tải công ty:", err)
    } finally {
      setLoading(false)  // ✅ đừng quên set loading false khi xong
    }
  }

  if (id) fetchCompany()
}, [id])


  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="success" />
      </Box>
    )

  if (!companyData)
    return (
      <Typography textAlign="center" color="text.secondary" mt={5}>
        Không tìm thấy thông tin công ty.
      </Typography>
    )

  const { company, jobs } = companyData

  return (
    <Box sx={{ bgcolor: "#f9fef9", minHeight: "100vh" }}>
      {/* Cover section */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#f9fef9",
          mb: 8,
        }}
      >
        {/* Nền mờ */}
        <Box
          sx={{
            height: 200,
            backgroundImage: `url(${company.coverPhoto || company.companyPhotos?.[0] || "/assets/default-cover.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            transform: "scale(1.1)",
            borderRadius: 2,
          }}
        />

        {/* Overlay mờ sáng */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.4)",
            borderRadius: 2,
          }}
        />

        {/* Thông tin công ty */}
        <Container
          sx={{
            position: "absolute",
            bottom: -60, // avatar nhô ra khỏi cover
            left: 24,
            display: "flex",
            alignItems: "center",
            gap: 2,
            zIndex: 2,
          }}
        >
          <Avatar
            src={
              company.logoUrl ||
              company.avatarUrl ||
              company.companyPhotos?.[0] ||
              "/assets/default-logo.png"
            }
            alt={company.name}
            sx={{
              width: 150,
              height: 150,
              border: "5px solid white",
              bgcolor: "#2e7d32",
              fontSize: 40,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {company.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight="bold" color="#000000">
              {company.name}
            </Typography>
            <Typography variant="h6" color="#2e7d32" sx={{marginTop:2}}>
              {company.address}
            </Typography>
            {company.isVerified && (
              <Chip
                icon={<CheckCircleOutline />}
                label="Đã xác minh"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Container>
      </Box>


      {/* Body */}
      <Container sx={{ mt: 10 }}>
        {/* Info */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            backgroundColor: "#fff",
            border: "1px solid #c8e6c9",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Về công ty
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {company.description || "Chưa có mô tả chi tiết."}
          </Typography>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <ApartmentOutlined color="success" />
                <Typography>
                  <strong>Ngành nghề:</strong> {company.industry || "—"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <GroupsOutlined color="success" />
                <Typography>
                  <strong>Nhân viên:</strong>{" "}
                  {company.employeeCount
                    ? `${company.employeeCount} người`
                    : "—"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnOutlined color="success" />
                <Typography>
                  <strong>Địa chỉ:</strong> {company.address || "—"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Language color="success" />
                <Typography>
                  <strong>Website:</strong>{" "}
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2e7d32" }}
                    >
                      {company.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Stats */}
          <Box
            mt={3}
            p={2}
            bgcolor="#f1f8f4"
            borderRadius={2}
            border="1px solid #a5d6a7"
          >
            <Typography variant="subtitle1" fontWeight="bold" color="#2e7d32">
              Thống kê tuyển dụng
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">
              🌱 Việc đang tuyển: <strong>{company.activeJobsCount}</strong>
            </Typography>
            <Typography variant="body2">
              🧩 Tổng tin đăng: <strong>{company.jobPostingCount}</strong>
            </Typography>
            <Typography variant="body2">
              💬 Tỉ lệ tuyển thành công:{" "}
              <strong>{company.hiringSuccessRate || 0}%</strong>
            </Typography>
          </Box>

          {/* ✅ Thông tin thêm */}
          <Box
            mt={3}
            p={3}
            bgcolor="#f9fef9"
            borderRadius={2}
            border="1px solid #c8e6c9"
          >
            <Typography variant="subtitle1" fontWeight="bold" color="#2e7d32" gutterBottom>
              Thông tin thêm
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Lợi ích công ty */}
            {company.benefits?.length > 0 && (
              <Box mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  🌟 Phúc lợi công ty:
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {company.benefits.map((benefit, i) => (
                    <Chip key={i} label={benefit} color="success" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Giờ làm việc */}
            {company.workingHours && (
              <Box mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  ⏰ Giờ làm việc:
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {company.workingHours}
                </Typography>
              </Box>
            )}

            {/* Liên hệ */}
            <Box mb={2}>
              <Typography variant="body1" fontWeight="bold">
                📞 Liên hệ:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {company.phoneNumber && (
                  <>
                    <strong>Điện thoại:</strong> {company.phoneNumber}
                    <br />
                  </>
                )}
                {company.contactEmail && (
                  <>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${company.contactEmail}`} style={{ color: "#2e7d32" }}>
                      {company.contactEmail}
                    </a>
                  </>
                )}
              </Typography>
            </Box>

            {/* Mạng xã hội */}
            {company.socialLinks && (
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  🌐 Mạng xã hội:
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={2}>
                  {company.socialLinks.facebook && (
                    <Button
                      variant="outlined"
                      color="success"
                      href={company.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </Button>
                  )}
                  {company.socialLinks.linkedin && (
                    <Button
                      variant="outlined"
                      color="success"
                      href={company.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>

        </Paper>

        {/* Job list */}
        <Box mt={5}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#2e7d32"
            gutterBottom
          >
            Việc đang tuyển
          </Typography>
          {jobs?.length > 0 ? (
            <JobList jobs={jobs} />
          ) : (
            <Typography color="text.secondary">
              Hiện tại chưa có việc làm nào.
            </Typography>
          )}
        </Box>

        {/* Gallery */}
        {company.companyPhotos?.length > 0 && (
          <Box mt={5}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#2e7d32"
              gutterBottom
            >
              Hình ảnh công ty
            </Typography>
            <Grid container spacing={2}>
              {company.companyPhotos.map((img, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                      height: 200, // 👈 Chiều cao cố định
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt={`Ảnh ${i + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // 👈 Đảm bảo ảnh không méo
                        borderRadius: 2,
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

      </Container>
    </Box>
  )
}
