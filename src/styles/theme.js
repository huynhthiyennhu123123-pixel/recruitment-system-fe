import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#058551" }, // xanh chủ đạo bạn đang dùng
    secondary: { main: "#2a9d8f" }, // xanh phụ (nếu muốn)
    background: {
      default: "#f7faf9", // nền tổng thể
      paper: "#ffffff", // nền thẻ Paper/Card
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563",
    },
  },
  typography: {
    // Quan trọng: đặt font cho toàn bộ MUI components
    fontFamily: `"Nunito", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
});

export default theme;
