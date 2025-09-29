import { Link } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      {/* Logo */}
      <div className="header-left">
        <Link to="/" className="logo">
          JobRecruit
        </Link>
      </div>

      {/* Menu giữa */}
      <nav className="header-center">
        <Link to="/jobs">Việc làm ▾</Link>
        <Link to="/cv">Tạo CV ▾</Link>
        <Link to="/tools">Công cụ ▾</Link>
        <Link to="/career">Cẩm nang nghề nghiệp ▾</Link>
        <Link to="/pro" className="pro">
          JobRecruit Pro
        </Link>
      </nav>

      {/* Nút bên phải */}
      <div className="header-right">
        <Link to="/auth/register" className="btn-outline">
          Đăng ký
        </Link>
        <Link to="/auth/login" className="btn-fill">
          Đăng nhập
        </Link>
        <Link to="/employer/post-job" className="btn-outline">
          Đăng tuyển & tìm hồ sơ
        </Link>
      </div>
    </header>
  );
}
