import React, { useState, useEffect } from 'react';
import applicantService from '../../services/applicantService';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    newsletter: false,
    privacy: 'public'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsData = await applicantService.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await applicantService.updateSettings(settings);
      setMessage('Đã lưu cài đặt thành công!');
    } catch (error) {
      setMessage('Lỗi khi lưu cài đặt');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded">{message}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Thông báo email */}
        <div>
          <h3 className="text-lg font-medium mb-4">Thông báo qua email</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev, emailNotifications: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="ml-2">Thông báo chung</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.jobAlerts}
                onChange={(e) => setSettings(prev => ({
                  ...prev, jobAlerts: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="ml-2">Cảnh báo việc làm phù hợp</span>
            </label>
          </div>
        </div>

        {/* Quyền riêng tư */}
        <div>
          <h3 className="text-lg font-medium mb-4">Quyền riêng tư</h3>
          <select
            value={settings.privacy}
            onChange={(e) => setSettings(prev => ({ ...prev, privacy: e.target.value }))}
            className="border rounded p-2"
          >
            <option value="public">Hiển thị với nhà tuyển dụng</option>
            <option value="private">Chỉ mình tôi</option>
          </select>
        </div>

        {/* Tài khoản */}
        <div>
          <h3 className="text-lg font-medium mb-4">Tài khoản</h3>
          <div className="space-y-2">
            <button className="text-red-600 hover:text-red-700">
              Xóa tài khoản
            </button>
            <p className="text-sm text-gray-500">
              Khi xóa tài khoản, mọi dữ liệu sẽ bị mất vĩnh viễn
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;