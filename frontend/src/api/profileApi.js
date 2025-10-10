import axios from './axiosConfig';

export const createProfile = (data) => {
  return axios.post('/profiles', data);
};

export const getMyProfile = () => {
  return axios.get('/profiles/me');
};

export const getProfileById = (id) => {
  return axios.get(`/profiles/${id}`);
};

export const updateProfile = (data) => {
  return axios.put('/profiles', data);
};

export const uploadPhoto = (formData) => {
  return axios.post('/profiles/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deletePhoto = (photoId) => {
  return axios.delete(`/profiles/photos/${photoId}`);
};

export const setPrimaryPhoto = (photoId) => {
  return axios.put(`/profiles/photos/${photoId}/primary`);
};

export const uploadIdProof = (formData) => {
  return axios.post('/profiles/id-proof', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updatePrivacySettings = (data) => {
  return axios.put('/profiles/privacy', data);
};

export const getPreferences = () => {
  return axios.get('/preferences');
};

export const updatePreferences = (data) => {
  return axios.put('/preferences', data);
};
