import React, { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Autocomplete,
} from "@mui/material"
import { AddCircleOutline } from "@mui/icons-material"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import { MuiChipsInput } from "mui-chips-input"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import dayjs from "dayjs"
import {
  getEmployerCompanyId,
  getPublicCompanyById,
  updateCompanyProfile,
} from "../../services/employerService"
import { uploadToCloudinary } from "../../utils/cloudinaryUpload"


export default function CompanyProfileEdit() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    workingHours: "",
    benefits: [],
    companyPhotos: [],
    socialLinks: { facebook: "", linkedin: "" },
    companySize: "STARTUP",
    website: "",
    industry: "",
    address: "",
    city: "",
    country: "",
    phoneNumber: "",
    contactEmail: "",
  })
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [images, setImages] = useState([])
  const [countries, setCountries] = useState([])
  const [provinces, setProvinces] = useState([])
  const [startTime, setStartTime] = useState(dayjs("08:00", "HH:mm"))
  const [endTime, setEndTime] = useState(dayjs("17:00", "HH:mm"))

  // ✅ Lấy thông tin công ty khi vào trang
  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true)
      try {
        const companyId = await getEmployerCompanyId()
        if (!companyId) throw new Error("Không tìm thấy ID công ty!")

        const res = await getPublicCompanyById(companyId)
        if (res?.company) {
          const c = res.company
          setForm({
            name: c.name || "",
            description: c.description || "",
            workingHours: c.workingHours || "",
            benefits: c.benefits || [],
            companyPhotos: c.companyPhotos || [],
            socialLinks: c.socialLinks || { facebook: "", linkedin: "" },
            companySize: c.companySize || "STARTUP",
            website: c.website || "",
            industry: c.industry || "",
            address: c.address || "",
            city: c.city || "",
            country: c.country || "",
            phoneNumber: c.phoneNumber || "",
            contactEmail: c.contactEmail || "",
          })

          // ⏰ Tách giờ làm việc
          if (c.workingHours) {
            const [start, end] = c.workingHours.split("-")
            if (start) setStartTime(dayjs(start, "HH:mm"))
            if (end) setEndTime(dayjs(end, "HH:mm"))
          }

          // 🖼 Ảnh công ty
          if (c.companyPhotos?.length > 0) {
            setImages(c.companyPhotos.map((url) => ({ preview: url })))
          }
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin công ty:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [])

  // ✅ Load quốc gia và tỉnh/thành
  useEffect(() => {
  // 🌍 Lấy danh sách quốc gia
  axios
  .get("https://restcountries.com/v3.1/all?fields=name")
  .then((res) => {
    const sorted = res.data.map((c) => c.name.common).sort()
    setCountries(sorted)
  })
  .catch((err) => {
    console.error("❌ Lỗi tải quốc gia:", err)
    setCountries(["Việt Nam", "Thailand", "Singapore", "Malaysia"])
  })

  // 🏙 Lấy danh sách tỉnh/thành GHN
  const ghnToken = import.meta.env.VITE_GHN_TOKEN || "YOUR_GHN_TOKEN"

  if (!ghnToken || ghnToken === "YOUR_GHN_TOKEN") {
    console.warn("⚠️ GHN token chưa được cấu hình, dùng dữ liệu demo.")
    setProvinces([
      { ProvinceID: 1, ProvinceName: "Hà Nội" },
      { ProvinceID: 2, ProvinceName: "TP. Hồ Chí Minh" },
      { ProvinceID: 3, ProvinceName: "Đà Nẵng" },
      { ProvinceID: 4, ProvinceName: "Cần Thơ" },
      { ProvinceID: 5, ProvinceName: "An Giang" },
    ])
    return
  }

  axios
    .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
      headers: { token: ghnToken },
    })
    .then((res) => {
      const data = res.data?.data || []
      setProvinces(data)
      console.log("✅ Provinces loaded:", data.length)
    })
    .catch((err) => {
      console.error("❌ Lỗi tải tỉnh/thành từ GHN:", err)
      // Fallback demo khi lỗi API
      setProvinces([
        { ProvinceID: 1, ProvinceName: "Hà Nội" },
        { ProvinceID: 2, ProvinceName: "TP. Hồ Chí Minh" },
        { ProvinceID: 3, ProvinceName: "Đà Nẵng" },
        { ProvinceID: 4, ProvinceName: "Cần Thơ" },
        { ProvinceID: 5, ProvinceName: "Bình Dương" },
      ])
    })
}, [])

  //  Xóa ảnh khỏi danh sách
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleDrop = async (acceptedFiles) => {
  try {
    const uploadedImages = await Promise.all(
      acceptedFiles.map(async (file) => {
        const url = await uploadToCloudinary(file)
        return { preview: url }
      })
    )
    setImages((prev) => [...prev, ...uploadedImages])
  } catch (err) {
    console.error("❌ Lỗi khi upload ảnh:", err)
  }
}


  const handleSocialChange = (key, value) => {
    setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: value } })
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
  name: form.name || "",
  description: form.description || "",
  workingHours: `${startTime.format("HH:mm")}-${endTime.format("HH:mm")}`,
  benefits: form.benefits?.length ? form.benefits : [],
  companyPhotos: images.map((f) => f.preview) || [],
  socialLinks: {
    facebook: form.socialLinks?.facebook || "",
    linkedin: form.socialLinks?.linkedin || "",
  },
  companySize: form.companySize || "STARTUP",
  website: form.website || "",
  industry: form.industry || "",
  address: form.address || "",
  city: form.city || "",
  country: form.country || "",
  phoneNumber: form.phoneNumber || "",
  contactEmail: form.contactEmail || "",
}

    setLoading(true)
    try {
      console.log("📦 Payload gửi lên:", JSON.stringify(payload, null, 2))
      const res = await updateCompanyProfile(payload)
      setSnackbar({
        open: true,
        message: res.message || "Cập nhật thông tin công ty thành công!",
        severity: "success",
      })
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err)
      setSnackbar({
        open: true,
        message: "Không thể cập nhật thông tin công ty!",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 1300, mx: "auto", my: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#2e7d32"
            mb={3}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            🏢 Cập nhật thông tin công ty
          </Typography>

          {loading ? (
            <Box textAlign="center" py={10}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={12} sm={6} md={3}>
                 <TextField label="Tên công ty" name="name" value={form.name || ""} onChange={handleChange} fullWidth />

                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Website"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Email liên hệ"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Quy mô"
                    name="companySize"
                    value={form.companySize}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="STARTUP">Startup</MenuItem>
                    <MenuItem value="SMALL">Nhỏ (10-50)</MenuItem>
                    <MenuItem value="MEDIUM">Vừa (50-200)</MenuItem>
                    <MenuItem value="LARGE">Lớn (200+)</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Ngành"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Địa chỉ cụ thể"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    options={countries}
                    value={form.country}
                    onChange={(_, val) => setForm({ ...form, country: val || "" })}
                    renderInput={(params) => <TextField {...params} label="Quốc gia" />}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    options={provinces.map((p) => p.ProvinceName)}
                    value={form.city}
                    onChange={(_, val) => setForm({ ...form, city: val || "" })}
                    renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" />}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TimePicker
                    label="Giờ bắt đầu"
                    value={startTime}
                    onChange={(v) => setStartTime(v)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TimePicker
                    label="Giờ kết thúc"
                    value={endTime}
                    onChange={(v) => setEndTime(v)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <MuiChipsInput
                    label="Phúc lợi"
                    value={form.benefits}
                    onChange={(chips) => setForm({ ...form, benefits: chips })}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Facebook"
                    value={form.socialLinks.facebook}
                    onChange={(e) => handleSocialChange("facebook", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="LinkedIn"
                    value={form.socialLinks.linkedin}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    fullWidth
                  />
                </Grid>

                {/* Upload ảnh */}
                <Grid item xs={12}>
                  <Typography fontWeight="bold" color="#2e7d32" mb={1}>
                    Ảnh công ty
                  </Typography>
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #83c5be",
                      p: 3,
                      borderRadius: 2,
                      textAlign: "center",
                      bgcolor: isDragActive ? "#e0f2f1" : "#fafafa",
                      cursor: "pointer",
                    }}
                  >
                    <input {...getInputProps()} />
                    <Typography color="#264653">
                      {isDragActive
                        ? "Thả ảnh vào đây..."
                        : "Kéo & thả ảnh hoặc nhấn để chọn"}
                    </Typography>
                    <Grid container spacing={2} mt={2}>
  {images.map((file, i) => (
    <Grid item key={i}>
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <img
          src={file.preview}
          alt="preview"
          width={100}
          height={100}
          style={{
            borderRadius: "8px",
            objectFit: "cover",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        />
        <Button
          onClick={() => handleRemoveImage(i)}
          size="small"
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            minWidth: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            borderRadius: "50%",
            "&:hover": { bgcolor: "rgba(255,0,0,0.8)" },
          }}
        >
          ✕
        </Button>
      </Box>
    </Grid>
  ))}
</Grid>

                  </Box>
                </Grid>
              </Grid>

              <Box textAlign="center" mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  sx={{
                    bgcolor: "#2e7d32",
                    "&:hover": { bgcolor: "#1b5e20" },
                    px: 5,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  )
}
