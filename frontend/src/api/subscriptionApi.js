import axios from './axiosConfig';

export const getPlans = () => {
  return axios.get('/subscriptions/plans');
};

export const getCurrentSubscription = () => {
  return axios.get('/subscriptions/current');
};

export const createSubscription = (data) => {
  return axios.post('/subscriptions', data);
};

export const cancelSubscription = () => {
  return axios.put('/subscriptions/cancel');
};

export const getSubscriptionHistory = () => {
  return axios.get('/subscriptions/history');
};

export const createPaymentOrder = (data) => {
  return axios.post('/payments/create-order', data);
};

export const verifyPayment = (data) => {
  return axios.post('/payments/verify', data);
};

export const getPaymentHistory = () => {
  return axios.get('/payments/history');
};
