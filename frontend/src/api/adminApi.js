import axios from './axiosConfig';

export const getAllUsers = (page = 1) => {
  return axios.get('/admin/users', { params: { page } });
};

export const getVerificationRequests = () => {
  return axios.get('/admin/verification-requests');
};

export const approveVerification = (profileId) => {
  return axios.put(`/admin/verification/${profileId}/approve`);
};

export const rejectVerification = (profileId, reason) => {
  return axios.put(`/admin/verification/${profileId}/reject`, { reason });
};

export const getAllReports = (status) => {
  return axios.get('/admin/reports', { params: { status } });
};

export const resolveReport = (reportId, actionTaken, adminNotes) => {
  return axios.put(`/admin/reports/${reportId}/resolve`, { actionTaken, adminNotes });
};

export const getDashboardStats = () => {
  return axios.get('/admin/stats');
};

export const banUser = (userId) => {
  return axios.put(`/admin/users/${userId}/ban`);
};

export const unbanUser = (userId) => {
  return axios.put(`/admin/users/${userId}/unban`);
};
