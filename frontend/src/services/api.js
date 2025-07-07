import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API
export const userApi = {
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error creating user' };
    }
  },

  async loginUser(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      // Store session token
      localStorage.setItem('session_token', response.data.session_token);
      localStorage.setItem('current_user', JSON.stringify(response.data.user));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  },

  async getUser(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error fetching user' };
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('current_user');
  }
};

// Score API
export const scoreApi = {
  async saveScore(scoreData) {
    try {
      const response = await apiClient.post('/scores', scoreData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error saving score' };
    }
  },

  async getLeaderboard(limit = 10) {
    try {
      const response = await apiClient.get(`/scores?limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error fetching leaderboard' };
    }
  },

  async getUserScores(userId, limit = 10) {
    try {
      const response = await apiClient.get(`/scores/user/${userId}?limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error fetching user scores' };
    }
  }
};

// Progress API
export const progressApi = {
  async saveProgress(progressData) {
    try {
      const response = await apiClient.post('/progress', progressData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error saving progress' };
    }
  },

  async getProgress(userId) {
    try {
      const response = await apiClient.get(`/progress/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'No progress found' };
    }
  },

  async deleteProgress(userId) {
    try {
      const response = await apiClient.delete(`/progress/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error deleting progress' };
    }
  }
};

// Stats API
export const statsApi = {
  async getGlobalStats() {
    try {
      const response = await apiClient.get('/stats/global');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error fetching stats' };
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'API not available' };
  }
};

export default apiClient;