import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">JobFinder</h3>
            <p className="text-gray-400">
              Kết nối nhà tuyển dụng và ứng viên một cách hiệu quả nhất.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Ứng viên</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-400 hover:text-white">Tìm việc làm</Link></li>
              <li><Link to="/companies" className="text-gray-400 hover:text-white">Công ty</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white">Tạo hồ sơ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Nhà tuyển dụng</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-400 hover:text-white">Đăng ký</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white">Đăng nhập</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Đăng tin tuyển dụng</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@jobfinder.com</li>
              <li>Hotline: 1800-1234</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JobFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;