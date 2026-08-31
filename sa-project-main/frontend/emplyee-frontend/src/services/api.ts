import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.url?.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  employeeLogin: (data: { email: string; password: string }) =>
    api.post('/auth/employee/login', data),
};

export const employeeApi = {
  getAllStalls: () => api.get('/employee/stalls'),
  getAllReservations: () => api.get('/reservations/organizer'),
  updateStatus: (id: number, status: string) => api.put(`/reservations/${id}/status`, { status }),
};

export default api;
