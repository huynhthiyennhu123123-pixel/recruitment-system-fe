import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';

const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    salaryRange: '',
    jobType: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobsData = await jobService.searchJobs(filters);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tìm kiếm việc làm</h1>
      </div>

      {/* Bộ lọc nâng cao */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Từ khóa, chức danh..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Địa điểm..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Tất cả ngành</option>
            <option value="it">IT</option>
            <option value="marketing">Marketing</option>
          </select>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Loại hình</option>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Danh sách việc làm */}
      <div className="grid gap-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          <Link to={`/jobs/${job.id}`} className="hover:text-blue-600">
            {job.title}
          </Link>
        </h3>
        <p className="text-gray-600">{job.company}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
            {job.location}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
            {job.salary}
          </span>
        </div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Ứng tuyển
      </button>
    </div>
  </div>
);

export default JobSearchPage;