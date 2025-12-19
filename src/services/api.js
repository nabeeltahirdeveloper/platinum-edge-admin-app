import axios from 'axios';

// Base API URL - Update this with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_SERVER || import.meta.env.VITE_API_BASE_URL;

// Warn if API base URL is not configured
if (!API_BASE_URL) {
  console.error('⚠️ API Base URL is not configured! Please set VITE_API_SERVER or VITE_API_BASE_URL in your .env file');
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/Login') {
        window.location.href = '/Login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
