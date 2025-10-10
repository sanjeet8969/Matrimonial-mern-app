import axios from './axiosConfig';

export const getSuggestedMatches = () => {
  return axios.get('/matches/suggested');
};

export const searchProfiles = (params) => {
  return axios.get('/matches/search', { params });
};

export const getRecentProfiles = () => {
  return axios.get('/matches/recent');
};

export const getNearbyProfiles = () => {
  return axios.get('/matches/nearby');
};
