import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import HomePage from "./pages/public/HomePage";
import JobSearchSection from "./components/JobSearchSection";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Sau này thêm các trang khác */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
