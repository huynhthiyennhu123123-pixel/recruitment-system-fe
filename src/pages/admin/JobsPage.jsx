import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Paper,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "firstName", headerName: "First name", flex: 1 },
  { field: "lastName", headerName: "Last name", flex: 1 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    flex: 1,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    flex: 1,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
  {
    field: "actions",
    headerName: "Thao tác",
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <IconButton size="small" onClick={() => alert(`Edit ${params.row.id}`)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => alert(`Delete ${params.row.id}`)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function JobsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Tuyển dụng
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "#f0f4f8",
              "&:hover fieldset": {
                borderColor: "#058551ff",
              },
            },
            "& .MuiInputBase-input": {
              color: "#000", // màu chữ trong input
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            startIcon={<UploadIcon />}
            sx={{
              backgroundColor: "#e0f7fa",
              color: "#00796b",
              "&:hover": {
                backgroundColor: "#b2dfdb",
              },
            }}
          >
            Import
          </Button>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: "#e0f7fa",
              color: "#00796b",
              "&:hover": {
                backgroundColor: "#b2dfdb",
              },
            }}
          >
            Export
          </Button>
          <IconButton>
            <FilterListIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#058551ff",
              color: "#dcf1e7fa",
            }}
          >
            Thêm mới
          </Button>
        </Box>
      </Box>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}
