import axios from './axiosConfig';

export const getChats = () => {
  return axios.get('/chats');
};

export const getOrCreateChat = (receiverId) => {
  return axios.post('/chats', { receiverId });
};

export const getMessages = (chatId, page = 1) => {
  return axios.get(`/chats/${chatId}/messages`, { params: { page } });
};

export const sendMessage = (chatId, content, messageType = 'text') => {
  return axios.post(`/chats/${chatId}/messages`, { content, messageType });
};

export const markAsRead = (chatId) => {
  return axios.put(`/chats/${chatId}/read`);
};

export const deleteMessage = (chatId, messageId) => {
  return axios.delete(`/chats/${chatId}/messages/${messageId}`);
};
