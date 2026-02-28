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
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 401 = token expired/invalid, 403 = role changed/email unverified
      // Both mean the session is stale — force re-login
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
  verifyEmail: (email: string, otp: string) => api.post('/auth/verify-email', { email, otp }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/auth/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
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
  getBySlug: (slug: string) => api.get(`/events/${slug}`),
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
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
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

// Projects API
export const projectsApi = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getFeatured: (limit?: number) => api.get('/projects/featured', { params: { limit } }),
  getById: (id: string) => api.get(`/projects/${id}`),
  getBySlug: (slug: string) => api.get(`/projects/${slug}`),
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

export const mediaApi = {
  uploadDriveImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/media/drive-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadDrivePdf: (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);

    return api.post('/media/drive-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const newsletterApi = {
  getSubscribers: () => api.get('/contact/newsletter/subscribers'),
  send: (data: { subject: string; description: string; coverImage?: string; pdfUrl?: string; pdfName?: string }) =>
    api.post('/contact/newsletter/send', data),
  getPosts: (params?: any) => api.get('/contact/newsletter/posts', { params }),
  getPostById: (id: string) => api.get(`/contact/newsletter/posts/${id}`),
  deletePost: (id: string) => api.delete(`/contact/newsletter/posts/${id}`),
};

export const membershipApi = {
  apply: (data: { paymentMethod: string; transactionId: string; amount: number; phoneNumber?: string }) =>
    api.post('/membership/apply', data),
  getMyStatus: () => api.get('/membership/my-status'),
  getApplications: (params?: any) => api.get('/membership/applications', { params }),
  getApplicationById: (id: string) => api.get(`/membership/applications/${id}`),
  approve: (id: string) => api.post(`/membership/applications/${id}/approve`),
  reject: (id: string, reason?: string) => api.post(`/membership/applications/${id}/reject`, { reason }),
  getStats: () => api.get('/membership/stats'),
  directApprove: (userId: string) => api.post(`/membership/direct-approve/${userId}`),
};

// Admin API (aggregated endpoints)
export const adminApi = {
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Members management
  getMembers: (params?: any) => api.get('/members', { params }),
  getMemberStats: () => api.get('/members/stats'),
  getMemberById: (id: string) => api.get(`/members/${id}`),
  updateMemberRole: (id: string, role: string) => api.patch(`/members/${id}/role`, { role }),
  deleteMember: (id: string) => api.delete(`/members/${id}`),

  // Events management
  getEvents: (params?: any) => api.get('/events/admin/all', { params }),
  createEvent: (data: any) => api.post('/events', data),
  updateEvent: (id: string, data: any) => api.put(`/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),

  // Blogs management
  getBlogs: (params?: any) => api.get('/blogs/admin/all', { params }),
  createBlog: (data: any) => api.post('/blogs', data),
  updateBlog: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete(`/blogs/${id}`),
  approveBlog: (id: string) => api.post(`/blogs/${id}/approve`),
  rejectBlog: (id: string) => api.post(`/blogs/${id}/reject`),

  // Projects management
  getProjects: (params?: any) => api.get('/projects', { params }),
  createProject: (data: any) => api.post('/projects', data),
  updateProject: (id: string, data: any) => api.put(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
  approveProject: (id: string) => api.post(`/projects/${id}/approve`),

  // Gallery management
  getGalleryImages: (params?: any) => api.get('/gallery', { params }),
  uploadGalleryImage: (data: any) => api.post('/gallery', data),
  uploadGalleryBulk: (images: any[]) => api.post('/gallery/bulk', { images }),
  deleteGalleryImage: (id: string) => api.delete(`/gallery/${id}`),

  // Messages/Contact management
  getMessages: (params?: any) => api.get('/contact', { params }),
  markMessageAsRead: (id: string) => api.patch(`/contact/${id}/read`),
  deleteMessage: (id: string) => api.delete(`/contact/${id}`),
};
