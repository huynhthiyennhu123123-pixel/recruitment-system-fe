import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ roles }) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  if (!token || !user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location, error: "Vui lòng đăng nhập để tiếp tục." }}
        replace
      />
    );
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
