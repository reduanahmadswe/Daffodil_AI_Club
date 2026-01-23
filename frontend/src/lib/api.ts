import axios from 'axios';
import { store } from './redux/store';
import { logout } from './redux/slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispatch logout action to Redux store
      store.dispatch(logout());
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  resendVerification: (email: string) => api.post('/auth/resend-verification', { email }),
};

// Events API
export const eventsApi = {
  getAll: (params?: any) => api.get('/events', { params }),
  getUpcoming: (limit?: number) => api.get('/events/upcoming', { params: { limit } }),
  getById: (id: string) => api.get(`/events/${id}`),
  getBySlug: (slug: string) => api.get(`/events/slug/${slug}`), // Added
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  register: (id: string) => api.post(`/events/${id}/register`),
  cancelRegistration: (id: string) => api.delete(`/events/${id}/register`),
  getMyRegistrations: () => api.get('/events/my/registrations'),
  markAttendance: (id: string, uniqueId: string) => api.post(`/events/${id}/attendance`, { uniqueId }),
};

// Blogs API
export const blogsApi = {
  getAll: (params?: any) => api.get('/blogs', { params }),
  getById: (id: string) => api.get(`/blogs/${id}`),
  getBySlug: (slug: string) => api.get(`/blogs/slug/${slug}`), // Added
  create: (data: any) => api.post('/blogs', data),
  update: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
  getMyBlogs: () => api.get('/blogs/my/posts'),
  approve: (id: string) => api.post(`/blogs/${id}/approve`),
  reject: (id: string) => api.post(`/blogs/${id}/reject`),
  like: (id: string) => api.post(`/blogs/${id}/like`), // Added
  unlike: (id: string) => api.delete(`/blogs/${id}/like`), // Added
  addComment: (id: string, content: string) => api.post(`/blogs/${id}/comments`, { content }), // Added
};

// Members API
export const membersApi = {
  getAll: (params?: any) => api.get('/members', { params }),
  getById: (id: string) => api.get(`/members/${id}`),
  getLeaderboard: (limit?: number) => api.get('/members/leaderboard', { params: { limit } }),
  getExecutives: () => api.get('/members/executives'),
  getStats: () => api.get('/members/stats'),
  updateRole: (id: string, role: string) => api.patch(`/members/${id}/role`, { role }),
};

// Workshops API
export const workshopsApi = {
  getAll: (params?: any) => api.get('/workshops', { params }),
  getById: (id: string) => api.get(`/workshops/${id}`),
  getBySlug: (slug: string) => api.get(`/workshops/slug/${slug}`), // Added
  create: (data: any) => api.post('/workshops', data),
  update: (id: string, data: any) => api.put(`/workshops/${id}`, data),
  delete: (id: string) => api.delete(`/workshops/${id}`),
  register: (id: string) => api.post(`/workshops/${id}/register`),
  getMyWorkshops: () => api.get('/workshops/my'),
};

// Projects API
export const projectsApi = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getFeatured: (limit?: number) => api.get('/projects/featured', { params: { limit } }),
  getById: (id: string) => api.get(`/projects/${id}`),
  getBySlug: (slug: string) => api.get(`/projects/slug/${slug}`), // Added
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  getMyProjects: () => api.get('/projects/my'),
  approve: (id: string) => api.post(`/projects/${id}/approve`),
};

// Gallery API
export const galleryApi = {
  getAll: (params?: any) => api.get('/gallery', { params }),
  getYears: () => api.get('/gallery/years'),
  getEvents: () => api.get('/gallery/events'),
  upload: (data: any) => api.post('/gallery', data),
  uploadBulk: (images: any[]) => api.post('/gallery/bulk', { images }),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

// Contact API
export const contactApi = {
  submit: (data: any) => api.post('/contact', data),
  getAll: (params?: any) => api.get('/contact', { params }),
  markAsRead: (id: string) => api.patch(`/contact/${id}/read`),
  delete: (id: string) => api.delete(`/contact/${id}`),
  subscribeNewsletter: (email: string) => api.post('/contact/newsletter/subscribe', { email }),
  unsubscribeNewsletter: (email: string) => api.post('/contact/newsletter/unsubscribe', { email }),
  send: (data: any) => api.post('/contact/send', data), // Added alias for submit
};
