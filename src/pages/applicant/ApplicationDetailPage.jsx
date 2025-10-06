import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import applicantService from '../../services/applicantService';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetchApplicationDetail();
  }, [id]);

  const fetchApplicationDetail = async () => {
    try {
      const appData = await applicantService.getApplicationDetail(id);
      setApplication(appData);
      setTimeline(generateTimeline(appData));
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const generateTimeline = (app) => {
    return [
      { date: app.appliedDate, status: 'Đã nộp đơn', description: 'Ứng viên đã gửi đơn ứng tuyển' },
      { date: app.viewedDate, status: 'Đã xem', description: 'Nhà tuyển dụng đã xem hồ sơ' },
      { date: app.interviewDate, status: 'Phỏng vấn', description: 'Được mời phỏng vấn' },
      { date: app.resultDate, status: 'Kết quả', description: 'Có kết quả tuyển dụng' }
    ].filter(item => item.date);
  };

  if (!application) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/applicant/applications" className="text-blue-600 hover:text-blue-500">
        ← Quay lại danh sách
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">{application.jobTitle}</h1>
        <p className="text-gray-600">{application.companyName}</p>
        
        <div className="flex items-center justify-between mt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {application.status}
          </span>
          <span className="text-gray-500">Ngày nộp: {application.appliedDate}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Lịch sử ứng tuyển</h2>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                {index < timeline.length - 1 && <div className="w-0.5 h-full bg-gray-300"></div>}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium">{item.status}</p>
                <p className="text-gray-500 text-sm">{item.date}</p>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin ứng tuyển */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Thông tin ứng tuyển</h3>
          <div className="space-y-2">
            <p><span className="text-gray-500">Vị trí:</span> {application.jobTitle}</p>
            <p><span className="text-gray-500">Công ty:</span> {application.companyName}</p>
            <p><span className="text-gray-500">Ngày nộp:</span> {application.appliedDate}</p>
            <p><span className="text-gray-500">CV đã nộp:</span> {application.resumeName}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Thư giới thiệu</h3>
          <p className="text-gray-600">{application.coverLetter || 'Không có thư giới thiệu'}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;