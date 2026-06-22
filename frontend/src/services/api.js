import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillswap_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('skillswap_token');
      localStorage.removeItem('skillswap_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Users
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (imageBase64) => api.post('/users/avatar', { image: imageBase64 }),
  getLeaderboard: () => api.get('/users/leaderboard/top'),
};

// Matches
export const matchesAPI = {
  getSuggestions: () => api.get('/matches/suggestions'),
  getMatches: () => api.get('/matches'),
  sendRequest: (id, data) => api.post(`/matches/request/${id}`, data),
  respond: (id, status) => api.put(`/matches/${id}/respond`, { status }),
};

// Sessions
export const sessionsAPI = {
  getSessions: () => api.get('/sessions'),
  bookSession: (data) => api.post('/sessions', data),
  completeSession: (id) => api.put(`/sessions/${id}/complete`),
  cancelSession: (id) => api.put(`/sessions/${id}/cancel`),
};

// Messages
export const messagesAPI = {
  getRooms: () => api.get('/messages/rooms'),
  getMessages: (roomId) => api.get(`/messages/rooms/${roomId}`),
};

// Courses
export const coursesAPI = {
  getCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
};

// Reviews
export const reviewsAPI = {
  createReview: (data) => api.post('/reviews', data),
  getUserReviews: (id) => api.get(`/reviews/user/${id}`),
};

// Notifications
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleBan: (id) => api.put(`/admin/users/${id}/toggle-ban`),
};

// Video
export const videoAPI = {
  getToken: (channelName) => api.post('/video/token', { channelName }),
};

// Skills
export const skillsAPI = {
  getSkills: () => api.get('/skills'),
};

export default api;
