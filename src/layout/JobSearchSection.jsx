import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobSearchSection() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [salary, setSalary] = useState("");
  const [level, setLevel] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  // 🔹 Danh sách loại công việc (enum)
  const jobTypeOptions = [
    { label: "Full-time", value: "FULL_TIME" },
    { label: "Part-time", value: "PART_TIME" },
    { label: "Hợp đồng", value: "CONTRACT" },
    { label: "Thực tập", value: "INTERNSHIP" },
    { label: "Freelance", value: "FREELANCE" },
  ];

  const handleReset = () => {
    setQuery("");
    setLocation("");
    setSalary("");
    setLevel("");
    setJobType("");
    setExperience("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append("keyword", query);
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
        padding: "40px 0",
        backgroundImage: `url("/src/assets/images/bg_search.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        borderRadius: "0",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        height: "300px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
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
              TÌM KIẾM VIỆC LÀM
            </h1>
            <p
              style={{
                fontStyle: "italic",
                fontSize: "18px",
                marginTop: "5px",
              }}
            >
              Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
            </p>
          </div>

          <div style={{ textAlign: "right", lineHeight: "1.6" }}>
            <p style={{ margin: 0, fontSize: "17px", fontWeight: "600" }}>
              Việc làm hôm nay:{" "}
              <span
                style={{
                  color: "#ffd166",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                16
              </span>{" "}
              | Ngày:{" "}
              <span style={{ fontWeight: "500" }}>
                {new Date().toLocaleDateString("vi-VN")}
              </span>
            </p>
            <p
              style={{ margin: "8px 0 0", fontSize: "17px", fontWeight: "500" }}
            >
              Việc làm đang tuyển:{" "}
              <span
                style={{
                  color: "#ffd166",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                1.593
              </span>{" "}
              | Hồ sơ ứng viên:{" "}
              <span
                style={{
                  color: "#ffd166",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                32.248
              </span>
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
          {/* 🔍 Ô tìm kiếm */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tiêu đề công việc, vị trí..."
            style={{
              flex: 1,
              height: "42px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              padding: "0 12px",
              color: "black",
              outline: "none",
              backgroundColor: "white",
            }}
          />

          {/* 📍 Địa điểm */}
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Nhập địa điểm"
            style={{
              height: "42px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "200px",
              color: "black",
              outline: "none",
              backgroundColor: "white",
            }}
          />

          {/* 🔽 Loại công việc */}
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            style={{
              height: "42px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "200px",
              color: "black",
              backgroundColor: "white",
            }}
          >
            <option value="">Loại công việc</option>
            {jobTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 🔍 Nút tìm kiếm */}
          <button
            onClick={handleSearch}
            style={{
              background: "#1a5837ff",
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
              <option value="">Cấp bậc</option>
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
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
      </div>
    </section>
  );
}
