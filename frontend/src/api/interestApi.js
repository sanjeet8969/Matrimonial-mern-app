import axios from './axiosConfig';

export const sendInterest = (receiverId, message) => {
  return axios.post('/interests', { receiverId, message });
};

export const getReceivedInterests = () => {
  return axios.get('/interests/received');
};

export const getSentInterests = () => {
  return axios.get('/interests/sent');
};

export const acceptInterest = (interestId) => {
  return axios.put(`/interests/${interestId}/accept`);
};

export const rejectInterest = (interestId) => {
  return axios.put(`/interests/${interestId}/reject`);
};

export const cancelInterest = (interestId) => {
  return axios.delete(`/interests/${interestId}`);
};
