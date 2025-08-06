// Fixed frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API methods
export const apiService = {
  // Dashboard
  getDashboard: () => api.get('/dashboard'),

  // Events
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  registerForEvent: (id, data) => api.post(`/events/${id}/register`, data),

  // News
  getNews: (params) => api.get('/news', { params }),
  getNewsArticle: (id) => api.get(`/news/${id}`),

  // Members
  getMembers: (params) => api.get('/members', { params }),
  registerMember: (data) => api.post('/members/register', data),

  // Scholarships
  getScholarships: (params) => api.get('/scholarships', { params }),
  applyScholarship: (data) => {
    // Fixed: Handle FormData properly
    return api.post('/scholarships/apply', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Contact
  sendContact: (data) => api.post('/contact', data),

  // Search
  search: (query, type) => api.get('/search', { params: { q: query, type } }),

  // Stats (for admin)
  getStats: () => api.get('/stats'),
};

export default api;