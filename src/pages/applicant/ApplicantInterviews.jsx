import { useEffect, useState } from "react";
import axios from "axios";

export default function ApplicantInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  const baseUrl = "http://localhost:8081";

  // 🧭 Map song song giữa FE (EN) và BE (VN)
  const statusMap = {
    SCHEDULED: "XAC_NHAN",
    COMPLETED: "HOAN_TAT",
    CANCELLED: "HUY",
    RESCHEDULED: "MOI_TAO",
  };

  useEffect(() => {
    fetchInterviews();
  }, [page, statusFilter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      // 👉 Gửi tiếng Anh sang API để backend nhận đúng (giống Postman)
      const apiStatus = statusFilter || undefined;

      const res = await axios.get(`${baseUrl}/api/interviews/my`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          start: "2025-01-01T00:00:00",
          end: "2099-12-31T23:59:59",
          status: apiStatus,
          page,
          size: 10,
        },
      });

      const data = res.data?.data;
      setInterviews(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách lịch phỏng vấn.");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Hiển thị tiếng Việt khi render UI
  const renderStatus = (status) => {
    const mapToVN = {
      SCHEDULED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
      COMPLETED: { text: "Hoàn tất", color: "bg-green-100 text-green-700" },
      CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
      RESCHEDULED: {
        text: "Đã đặt lại lịch",
        color: "bg-yellow-100 text-yellow-700",
      },
      MOI_TAO: { text: "Mới tạo", color: "bg-gray-100 text-gray-700" },
      XAC_NHAN: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
      HOAN_TAT: { text: "Hoàn tất", color: "bg-green-100 text-green-700" },
      HUY: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          mapToVN[status]?.color || "bg-gray-100 text-gray-600"
        }`}
      >
        {mapToVN[status]?.text || status}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          📅 Lịch phỏng vấn của bạn
        </h1>

        {/* 🔽 Bộ lọc trạng thái (FE chọn tiếng Anh để khớp API) */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(0);
            setStatusFilter(e.target.value);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
        >
          <option value="">Tất cả</option>
          <option value="SCHEDULED">Đã xác nhận</option>
          <option value="COMPLETED">Hoàn tất</option>
          <option value="CANCELLED">Đã hủy</option>
          <option value="RESCHEDULED">Đặt lại lịch</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : interviews.length === 0 ? (
        <p className="text-gray-500 italic">
          Hiện bạn chưa có lịch phỏng vấn nào.
        </p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Ghi chú</th>
              <th className="p-3 text-left">Hình thức</th>
              <th className="p-3 text-left">Thời gian</th>
              <th className="p-3 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.note || "—"}</td>
                <td className="p-3">{item.method || "—"}</td>
                <td className="p-3">
                  {new Date(item.startTime).toLocaleString("vi-VN")} -{" "}
                  {new Date(item.endTime).toLocaleString("vi-VN")}
                </td>
                <td className="p-3">{renderStatus(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Trước
        </button>
        <span className="text-gray-600">
          Trang {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
