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
  register: (data: {
    username: string;
    email: string;
    password: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
};

export const stallApi = {
  getAll: () => api.get('/stalls'),
  getAvailable: () => api.get('/stalls/available'),
};

export interface ReservationPayload {
  eventName: string;
  reservationDate: string;
  stallType: string;
  preferredStallSize: string;
  numberOfStalls: number;
  businessCategory: string;
  specialRequirements: string;
}

export const reservationApi = {
  create: (data: ReservationPayload) => api.post('/reservations', data),
  getMyReservations: () => api.get('/reservations/my-reservations'),
};

export const genreApi = {
  add: (genreName: string) => api.post('/genres', { genreName }),
  getMyGenres: () => api.get('/genres/my-genres'),
};

export default api;
