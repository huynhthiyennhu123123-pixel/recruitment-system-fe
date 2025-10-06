import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ roles }) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  if (!token || !user) {
    // chưa đăng nhập → quay về login
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location, error: "Vui lòng đăng nhập để tiếp tục." }}
        replace
      />
    );
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // đăng nhập rồi nhưng không đúng quyền
    return <Navigate to="/" replace />;
  }

  // hợp lệ → render các route con
  return <Outlet />;
}
