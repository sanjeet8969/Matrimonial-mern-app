import axios from './axiosConfig';

export const getNotifications = (page = 1) => {
  return axios.get('/notifications', { params: { page } });
};

export const getUnreadCount = () => {
  return axios.get('/notifications/unread-count');
};

export const markAsRead = (notificationId) => {
  return axios.put(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = () => {
  return axios.put('/notifications/read-all');
};

export const deleteNotification = (notificationId) => {
  return axios.delete(`/notifications/${notificationId}`);
};
