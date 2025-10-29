import axiosClient from "../utils/axiosClient";

// ✅ Lấy danh sách công ty (lọc từ job)
export const getAllCompanies = async (
  page = 0,
  size = 50,
  sortBy = "createdAt",
  sortDir = "DESC"
) => {
  const res = await axiosClient.get(
    `/jobs/manage?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
  );

  const jobs = res.data?.data?.content || [];

  // 🔍 Lấy danh sách company duy nhất
  const map = new Map();
  const uniqueCompanies = [];

  for (const job of jobs) {
    const company = job.company;
    if (company && !map.has(company.id)) {
      map.set(company.id, true);
      uniqueCompanies.push({
        id: company.id,
        name: company.name,
        city: company.city,
        country: company.country,
      });
    }
  }

  return uniqueCompanies;
};

// ✅ Lấy chi tiết công ty (lọc từ danh sách job)
export const getCompanyDetailById = async (companyId) => {
  const res = await axiosClient.get(
    `/jobs/manage?page=0&size=100&sortBy=createdAt&sortDir=DESC`
  );

  const jobs = res.data?.data?.content || [];

  let selectedCompany = null;
  const jobListForCompany = [];

  for (const job of jobs) {
    if (job.company?.id === Number(companyId)) {
      selectedCompany = job.company;
      jobListForCompany.push(job);
    }
  }

  return {
    company: selectedCompany,
    jobs: jobListForCompany,
  };
};
