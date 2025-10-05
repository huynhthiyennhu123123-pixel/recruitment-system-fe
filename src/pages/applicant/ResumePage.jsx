import React, { useState, useEffect } from 'react';
import applicantService from '../../services/applicantService';

const ResumePage = () => {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const resumeData = await applicantService.getResume();
      setResume(resumeData);
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage('Chỉ chấp nhận file PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      await applicantService.uploadResume(file);
      setMessage('Upload CV thành công!');
      fetchResume();
    } catch (error) {
      setMessage('Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const downloadResume = () => {
    if (resume?.fileUrl) {
      window.open(resume.fileUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý CV/Resume</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h2 className="mt-4 text-lg font-medium text-gray-900">CV/Resume của bạn</h2>
          <p className="mt-2 text-sm text-gray-500">
            Tải lên CV của bạn để nhà tuyển dụng dễ dàng tìm thấy bạn
          </p>

          {resume ? (
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-4">
                <span className="text-blue-600 font-medium">{resume.fileName}</span>
                <button
                  onClick={downloadResume}
                  className="text-blue-600 hover:text-blue-500"
                >
                  Xem CV
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cập nhật lần cuối: {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-red-500">Bạn chưa có CV nào được tải lên</p>
          )}

          <div className="mt-6">
            <label className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50">
              {uploading ? 'Đang tải lên...' : 'Tải lên CV mới'}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Định dạng cho phép: PDF, DOC, DOCX (tối đa 5MB)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Mẹo cho CV hoàn hảo</h3>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• Đảm bảo CV cập nhật đầy đủ thông tin liên hệ</li>
          <li>• Liệt kê các kỹ năng phù hợp với công việc mong muốn</li>
          <li>• Highlight các thành tích và kinh nghiệm nổi bật</li>
          <li>• Kiểm tra chính tả và ngữ pháp trước khi tải lên</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumePage;