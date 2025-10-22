import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";

export default function AboutPage() {
  const coreValues = [
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 34, color: "#2e7d32" }} />,
    title: "Tin cậy",
    desc: "Xây dựng niềm tin với ứng viên và doanh nghiệp qua chất lượng dịch vụ vượt trội.",
  },
  {
    icon: <EmojiObjectsOutlinedIcon sx={{ fontSize: 34, color: "#2e7d32" }} />,
    title: "Đổi mới",
    desc: "Ứng dụng công nghệ AI, dữ liệu lớn và trải nghiệm người dùng hiện đại trong tuyển dụng.",
  },
  {
    icon: <AutoGraphOutlinedIcon sx={{ fontSize: 34, color: "#2e7d32" }} />,
    title: "Hiệu quả",
    desc: "Giúp doanh nghiệp tuyển đúng người, giúp ứng viên tìm đúng việc.",
  },
  {
    icon: <FavoriteBorderOutlinedIcon sx={{ fontSize: 34, color: "#2e7d32" }} />,
    title: "Tận tâm",
    desc: "Luôn đồng hành, lắng nghe và hỗ trợ khách hàng trong suốt hành trình nghề nghiệp.",
  },
];


  const team = [
    {
      name: "Huỳnh Thị Yến Như",
      role: "Frontend",
      img: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    {
      name: "Nguyễn Trần Tiểu Lam",
      role: "Backend",
      img: "https://randomuser.me/api/portraits/women/64.jpg",
    },
    {
      name: "Trần Trường Giang",
      role: "Frontend",
      img: "https://randomuser.me/api/portraits/men/24.jpg",
    },
    {
      name: "Đoàn Chí Nguyễn",
      role: "Backend",
      img: "https://randomuser.me/api/portraits/men/24.jpg",
    },
  ];
// const team = [
//     {
//       name: "Huỳnh Thị Yến Như",
//       role: "Frontend",
//       img: "https://res.cloudinary.com/dcekwruai/image/upload/v1761123505/companies/tpruheytctyytpjd87yp.png",
//     },
//     {
//       name: "Nguyễn Trần Tiểu Lam",
//       role: "Backend",
//       img: "https://res.cloudinary.com/dcekwruai/image/upload/v1761123496/companies/mm3ldwqvv8eurfrjjtzs.png",
//     },
//     {
//       name: "Trần Trường Giang",
//       role: "Frontend",
//       img: "https://res.cloudinary.com/dcekwruai/image/upload/v1761123476/companies/fkdo8s7a7lbovrc06svd.png",
//     },
//     {
//       name: "Đoàn Chí Nguyễn",
//       role: "Backend",
//       img: "https://res.cloudinary.com/dcekwruai/image/upload/v1761123486/companies/ijavtdwfbwlzh8agew4m.png",
//     },
//   ];
 

  return (
    <Box sx={{ bgcolor: "#fafafa" }}>
      {/* 1️⃣ Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          background:
            "linear-gradient(135deg, rgba(46,125,50,0.95), rgba(56,142,60,0.9)), url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1500&q=80') center/cover",
          color: "white",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Giới thiệu về JobRecruit
          </Typography>
          <Typography variant="h6" color="#e8f5e9" sx={{ maxWidth: 700, mx: "auto" }}>
            Nền tảng tuyển dụng và tìm việc thông minh — kết nối nhân tài với nhà tuyển dụng
            nhanh chóng, hiệu quả và minh bạch.
          </Typography>
        </motion.div>
      </Box>

      {/* 2️⃣ Giới thiệu tổng quan */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
              alt="team"
              style={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Sứ mệnh của chúng tôi
            </Typography>
            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
              JobRecruit được thành lập với mục tiêu tạo ra một cầu nối hiệu quả giữa doanh
              nghiệp và người tìm việc. Chúng tôi không chỉ là nền tảng đăng tin tuyển dụng,
              mà là hệ sinh thái nhân sự hiện đại — nơi ứng viên, nhà tuyển dụng và công nghệ
              cùng nhau phát triển.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* 3️⃣ Giá trị cốt lõi */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            textAlign="center"
            gutterBottom
          >
            Giá trị cốt lõi của JobRecruit
          </Typography>

          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
            sx={{ mt: 2 }}
          >
            {coreValues.map((val, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    width: "100%",
                    maxWidth: 320,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#e8f5e9",
                      borderRadius: "50%",
                      width: 70,
                      height: 70,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    {val.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "#2e7d32" }}
                  >
                    {val.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {val.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      

      {/* 5️⃣ Đội ngũ phát triển */}
      <Box sx={{ bgcolor: "#f0fdf4", py: 6 }}>
        <Container>
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Đội ngũ phát triển
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Những con người trẻ trung, sáng tạo, đầy nhiệt huyết – cùng kiến tạo hệ sinh thái tuyển dụng số.
          </Typography>
          <Grid container spacing={3}>
            {team.map((member, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                  }}
                >
                  <Avatar
                    src={member.img}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      border: "3px solid #43a047",
                    }}
                  />
                  <Typography fontWeight="bold">{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6️⃣ CTA */}
      <Divider sx={{ my: 6 }} />
      <Container sx={{ textAlign: "center", pb: 6 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Cùng chúng tôi xây dựng tương lai nghề nghiệp Việt Nam
        </Typography>
        <Typography color="text.secondary" mb={3}>
          JobRecruit — nơi kết nối cơ hội, phát triển nhân tài, và lan toả giá trị tích cực.
        </Typography>
      </Container>
    </Box>
  );
}
