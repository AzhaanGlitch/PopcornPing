import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  googleLogin: () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  },
};

export const roomAPI = {
  createRoom: (data) => api.post('/rooms/create', data),
  getRoom: (roomId) => api.get(`/rooms/${roomId}`),
  joinRoom: (roomId) => api.post(`/rooms/${roomId}/join`),
  endRoom: (roomId) => api.post(`/rooms/${roomId}/end`),
  getUserRooms: () => api.get('/rooms/user/rooms'),
};

export default api;