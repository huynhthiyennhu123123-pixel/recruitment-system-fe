import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getAllCompanies } from "../../services/adminService";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ============================
  // 📦 Gọi API lấy danh sách công ty
  // ============================
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getAllCompanies();

      // ✅ Gán số thứ tự (STT)
      const companiesWithIndex = (data || []).map((c, index) => ({
        ...c,
        stt: index + 1,
      }));

      setCompanies(companiesWithIndex);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách công ty:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔍 Lọc theo từ khóa
  const filteredCompanies = (companies || []).filter((c) =>
    c?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // 🧩 Cấu hình cột DataGrid
  const columns = [
    { field: "stt", headerName: "STT", width: 80 },
    {
      field: "name",
      headerName: "Tên công ty",
      flex: 1,
      renderCell: (params) =>
        params?.row?.name?.trim()
          ? params.row.name
          : "Chưa có thông tin",
    },
    {
      field: "city",
      headerName: "Thành phố",
      flex: 1,
      renderCell: (params) =>
        params?.row?.city?.trim()
          ? params.row.city
          : "Chưa có thông tin",
    },
    {
      field: "country",
      headerName: "Quốc gia",
      flex: 1,
      renderCell: (params) =>
        params?.row?.country?.trim()
          ? params.row.country
          : "Chưa có thông tin",
    },
  ];

  // 📍 Khi click vào dòng → sang trang chi tiết
  const handleRowClick = (params) => {
    if (params?.row?.id) {
      navigate(`/admin/companies/${params.row.id}`);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Danh sách công ty
      </Typography>

      {/* Thanh tìm kiếm */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm công ty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "#f0f4f8",
            },
          }}
        />
      </Box>

      {/* Bảng dữ liệu */}
      <Paper sx={{ height: 520, width: "100%", p: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredCompanies}
            columns={columns}
            getRowId={(row) => row?.id ?? Math.random()}
            onRowClick={handleRowClick}
            pageSizeOptions={[5, 10, 20]}
            sx={{
              border: 0,
              cursor: "pointer",
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#e0f7fa",
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
