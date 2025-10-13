import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobSearchSection() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);

  const [salary, setSalary] = useState("");
  const [level, setLevel] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  const categoryOptions = [
    "Bán hàng / Kinh doanh",
    "Dịch vụ khách hàng / CSKH",
    "Kế toán / Kiểm toán",
    "Khách sạn / Nhà hàng",
  ];

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
      setOpenCategoryDropdown(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setCategories([]);
    setLocation("");
    setSalary("");
    setLevel("");
    setJobType("");
    setExperience("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append("keyword", query);
    if (categories.length > 0)
      params.append("category", categories.join(","));
    if (location) params.append("location", location);
    if (salary) params.append("salary", salary);
    if (level) params.append("level", level);
    if (jobType) params.append("jobType", jobType);
    if (experience) params.append("experience", experience);

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section
      style={{
        padding: "40px 20px",
        background: "#2a9d8f",
        color: "white",
        borderRadius: "10px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
            VIỆC LÀM CẦN THƠ
          </h1>
          <p
            style={{
              fontStyle: "italic",
              fontSize: "18px",
              marginTop: "5px",
            }}
          >
            Tuyển Dụng Việc Làm Tại Cần Thơ
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "14px" }}>
            <b>Việc làm hôm nay:</b>{" "}
            <span style={{ color: "#ffd166", fontWeight: "bold" }}>16</span> |{" "}
            <b>Ngày:</b> {new Date().toLocaleDateString("vi-VN")}
          </p>
          <p style={{ margin: "5px 0 0", fontSize: "14px" }}>
            Việc làm đang tuyển{" "}
            <span style={{ color: "#ffd166", fontWeight: "bold" }}>1.593</span> | Hồ sơ ứng viên{" "}
            <span style={{ color: "#ffd166", fontWeight: "bold" }}>32.248</span>
          </p>
        </div>
      </div>

      {/* Search row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "25px",
          marginBottom: "15px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Ô tìm kiếm + dropdown ngành nghề */}
        <div
          style={{
            flex: 1,
            background: "white",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            border: "1px solid #ccc",
            position: "relative",
            color: "black",
            height: "42px",
          }}
        >
          <span style={{ marginRight: 8 }}></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tiêu đề công việc, vị trí..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              color: "black",
              height: "100%",
            }}
          />

          <span
            style={{
              width: "1px",
              background: "#ccc",
              height: "24px",
              margin: "0 8px",
            }}
          />

          <div
            onClick={() => setOpenCategoryDropdown((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              minWidth: "200px",
              color: "black",
            }}
          >
            <span style={{ marginRight: "6px" }}></span>
            {categories.length === 0 ? (
              <span style={{ color: "#999" }}>Lọc theo ngành nghề</span>
            ) : (
              categories.map((cat) => (
                <span
                  key={cat}
                  style={{
                    background: "#e0e0e0",
                    borderRadius: "14px",
                    padding: "2px 8px",
                    margin: "2px",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {cat}
                  <button
                    onClick={() => toggleCategory(cat)}
                    style={{
                      marginLeft: "6px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    ✖
                  </button>
                </span>
              ))
            )}
            <span style={{ marginLeft: "auto" }}>
              {openCategoryDropdown ? "▲" : "▼"}
            </span>
          </div>

          {openCategoryDropdown && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: "40px",
                right: "10px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "6px",
                boxShadow: "0 4px 10px rgba(0,0,0,.1)",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {categoryOptions.map((cat) => (
                <div
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    background: categories.includes(cat)
                      ? "#f0f9ff"
                      : "transparent",
                    color: categories.includes(cat) ? "#0077cc" : "#000",
                  }}
                >
                  {cat} {categories.includes(cat) && "✓"}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Địa điểm */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            height: "42px",
            padding: "0 10px",
            borderRadius: "6px",
            border: "none",
            minWidth: "160px",
            color: "black",
          }}
        >
          <option value="">Lọc theo địa điểm</option>
          <option value="cantho">Cần Thơ</option>
          <option value="hcm">Hồ Chí Minh</option>
          <option value="hanoi">Hà Nội</option>
          <option value="danang">Đà Nẵng</option>
        </select>

        {/* Nút tìm kiếm */}
        <button
          onClick={handleSearch}
          style={{
            background: "#118ab2",
            border: "none",
            height: "42px",
            padding: "0 20px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Tìm kiếm
        </button>
      </div>

      {/* Bộ lọc nâng cao */}
      {showAdvanced && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            background: "rgba(255,255,255,0.1)",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              minWidth: "180px",
              color: "black",
            }}
          >
            <option value="">Mức lương</option>
            <option value="10-15tr">10-15 triệu</option>
            <option value="15-20tr">15-20 triệu</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              minWidth: "180px",
              color: "black",
            }}
          >
            <option value="">👤 Cấp bậc</option>
            <option value="fresher">Fresher</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              minWidth: "180px",
              color: "black",
            }}
          >
            <option value="">Loại hình</option>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time</option>
            <option value="intern">Thực tập</option>
          </select>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              minWidth: "180px",
              color: "black",
            }}
          >
            <option value="">Kinh nghiệm</option>
            <option value="0-1y">0-1 năm</option>
            <option value="1-3y">1-3 năm</option>
            <option value="3-5y">3-5 năm</option>
          </select>
        </div>
      )}
    </section>
  );
}
