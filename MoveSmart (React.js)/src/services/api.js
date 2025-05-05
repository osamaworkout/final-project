import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: 'https://movesmartapi.runasp.net/api',
  timeout: 15000
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    authService.logout();
    window.location.reload(); 
  }
  return Promise.reject(error);
});

export default api;