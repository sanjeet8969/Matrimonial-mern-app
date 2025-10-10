import axios from './axiosConfig';

export const register = (email, password, confirmPassword) => {
  return axios.post('/auth/register', { email, password, confirmPassword });
};

export const verifyOTP = (userId, otp) => {
  return axios.post('/auth/verify-otp', { userId, otp });
};

export const resendOTP = (userId) => {
  return axios.post('/auth/resend-otp', { userId });
};

export const login = (email, password) => {
  return axios.post('/auth/login', { email, password });
};

export const forgotPassword = (email) => {
  return axios.post('/auth/forgot-password', { email });
};

export const resetPassword = (token, password, confirmPassword) => {
  return axios.post(`/auth/reset-password/${token}`, { password, confirmPassword });
};

export const getMe = () => {
  return axios.get('/auth/me');
};

export const logout = () => {
  return axios.post('/auth/logout');
};
