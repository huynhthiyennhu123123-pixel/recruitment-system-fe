import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Language,
  LocationOnOutlined,
  GroupsOutlined,
  ApartmentOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { getCompanyDetailById } from "../../services/adminService";

export default function AdminCompanyDetailPage() {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await getCompanyDetailById(id);
        setCompanyData(res);
      } catch (err) {
        console.error("❌ Lỗi khi tải công ty:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="success" />
      </Box>
    );

  if (!companyData?.company)
    return (
      <Typography textAlign="center" color="text.secondary" mt={5}>
        Không tìm thấy thông tin công ty.
      </Typography>
    );

  const { company, jobs } = companyData;

  // Chỉ lấy công việc đang tuyển
  const activeJobs = jobs?.filter((job) => job.status === "ACTIVE") || [];

  return (
    <Box sx={{ bgcolor: "#f9fef9", minHeight: "100vh" }}>
      {/* Cover section */}
      <Box sx={{ position: "relative", backgroundColor: "#f9fef9", mb: 8 }}>
        <Box
          sx={{
            height: 200,
            backgroundImage: `url(${
              company.coverPhoto ||
              company.companyPhotos?.[0] ||
              "/assets/default-cover.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            transform: "scale(1.1)",
            borderRadius: 2,
          }}
        />
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
            bottom: -60,
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
            <Typography variant="h6" color="#2e7d32" sx={{ marginTop: 2 }}>
              {company.address || "Chưa có địa chỉ"}
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
        {/* Thông tin công ty */}
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
                  <strong>Ngành nghề:</strong>{" "}
                  {company.industry || "Chưa có thông tin"}
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
                    : "Chưa có thông tin"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnOutlined color="success" />
                <Typography>
                  <strong>Địa chỉ:</strong>{" "}
                  {company.address || "Chưa có thông tin"}
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
                    "Chưa có thông tin"
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Thống kê */}
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
              🌱 Việc đang tuyển: <strong>{company.activeJobsCount || 0}</strong>
            </Typography>
            <Typography variant="body2">
              🧩 Tổng tin đăng: <strong>{company.jobPostingCount || 0}</strong>
            </Typography>
            <Typography variant="body2">
              💬 Tỉ lệ tuyển thành công:{" "}
              <strong>{company.hiringSuccessRate || 0}%</strong>
            </Typography>
          </Box>

          {/* Liên hệ */}
          <Box
            mt={3}
            p={3}
            bgcolor="#f9fef9"
            borderRadius={2}
            border="1px solid #c8e6c9"
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="#2e7d32"
              gutterBottom
            >
              Thông tin liên hệ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">
              <strong>Điện thoại:</strong>{" "}
              {company.phoneNumber || "Chưa có thông tin"}
              <br />
              <strong>Email:</strong>{" "}
              {company.contactEmail ? (
                <a
                  href={`mailto:${company.contactEmail}`}
                  style={{ color: "#2e7d32" }}
                >
                  {company.contactEmail}
                </a>
              ) : (
                "Chưa có thông tin"
              )}
            </Typography>
          </Box>
        </Paper>

        {/* Danh sách việc đang tuyển (chỉ hiển thị) */}
        <Box mt={5}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#2e7d32"
            gutterBottom
          >
            Việc đang tuyển
          </Typography>

          {activeJobs.length > 0 ? (
            <Grid container spacing={2}>
              {activeJobs.map((job) => (
                <Grid item xs={12} md={6} key={job.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #c8e6c9",
                      bgcolor: "#fff",
                      transition: "0.3s",
                      "&:hover": { bgcolor: "#f9fff9" },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#000">
                      {job.title || "Chưa có tiêu đề"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📅 Ngày đăng:{" "}
                      {job.createdAt
                        ? dayjs(job.createdAt).format("DD/MM/YYYY")
                        : "Chưa cập nhật"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ⏰ Hạn tuyển:{" "}
                      {job.deadline
                        ? dayjs(job.deadline).format("DD/MM/YYYY")
                        : "Chưa cập nhật"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      💰 Mức lương:{" "}
                      {job.salaryMin && job.salaryMax
                        ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} VND`
                        : "Thỏa thuận"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 Địa điểm: {job.location || "Chưa có thông tin"}
                    </Typography>
                    <Chip
                      label="Đang tuyển"
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              Hiện tại chưa có việc làm nào.
            </Typography>
          )}
        </Box>

        {/* Hình ảnh công ty */}
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
                      height: 200,
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt={`Ảnh ${i + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
  );
}
