import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Button
} from "@mui/material"

export default function CompanyProfilePage() {
  const company = {
    name: "FE CREDIT",
    logo: "/assets/fe-logo.png",
    cover: "/assets/fe-cover.jpg",
    address: "Lầu 3B, REE Tower, 9 Đoàn Văn Bơ, Quận 4, Hồ Chí Minh",
    employees: "10.000 - 19.999 nhân viên",
    website: "https://www.fecredit.com.vn",
    description: `Công ty Tài Chính TNHH MTV Ngân Hàng Việt Nam Thịnh Vượng SMBC (FE CREDIT)
                  dẫn đầu thị trường Tài chính tiêu dùng từ năm 2010, cung cấp các sản phẩm 
                  dịch vụ vay tiêu dùng cá nhân an toàn, minh bạch.`,
    jobs: [
      { id: 1, title: "Nhân Viên Hỗ Trợ Thanh Toán", location: "TP.HCM", salary: "12-15 triệu", updated: "21 phút trước" },
      { id: 2, title: "Nhân Viên Xử Lý Nợ Quá Hạn", location: "Tiền Giang", salary: "Thỏa thuận", updated: "2 giờ trước" },
      { id: 3, title: "Nhân Viên Kinh Doanh Tín Chấp", location: "Bạc Liêu", salary: "8-12 triệu", updated: "1 ngày trước" }
    ],
    gallery: [
      "/assets/award1.jpg",
      "/assets/award2.jpg",
      "/assets/office.jpg",
      "/assets/team.jpg"
    ]
  }

  return (
    <Box>
      {/* Cover */}
      <Box
        sx={{
          backgroundImage: `url(${company.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 250,
          position: "relative"
        }}
      >
        <Container sx={{ position: "absolute", bottom: -40, display: "flex", alignItems: "center" }}>
          <Avatar src={company.logo} sx={{ width: 80, height: 80, border: "3px solid white" }} />
          <Box ml={2}>
            <Typography variant="h5" fontWeight="bold" color="white">
              {company.name}
            </Typography>
            <Typography variant="body2" color="white">{company.address}</Typography>
            <Typography variant="body2" color="white">{company.employees}</Typography>
          </Box>
        </Container>
      </Box>

      <Container sx={{ mt: 8 }}>
        {/* Giới thiệu */}
        <Typography variant="h6" gutterBottom>Về công ty</Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {company.description}
        </Typography>
        <Box mt={2}>
          <Button variant="outlined" href={company.website} target="_blank">
            Website: {company.website}
          </Button>
        </Box>

        {/* Việc đang tuyển */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>Việc đang tuyển</Typography>
          <Grid container spacing={2}>
            {company.jobs.map((job) => (
              <Grid item xs={12} md={4} key={job.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">{job.title}</Typography>
                    <Typography variant="body2">{job.location}</Typography>
                    <Typography variant="body2">💰 {job.salary}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Cập nhật: {job.updated}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Hình ảnh công ty */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>Hình ảnh công ty</Typography>
          <Grid container spacing={2}>
            {company.gallery.map((img, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Card>
                  <CardMedia component="img" height="150" image={img} alt="Company image" />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
