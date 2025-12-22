import axios from 'axios';

// Base API URL - Update this with your backend URL
// Backend routes are mounted at /api/v1, so the base URL must include /api/v1
const API_BASE_URL = import.meta.env.VITE_API_SERVER || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Ensure the base URL includes /api/v1
const normalizedBaseURL = API_BASE_URL.endsWith('/api/v1') 
  ? API_BASE_URL 
  : API_BASE_URL.endsWith('/api') 
    ? `${API_BASE_URL}/v1`
    : API_BASE_URL.endsWith('/v1')
      ? API_BASE_URL.replace('/v1', '/api/v1')
      : `${API_BASE_URL.replace(/\/$/, '')}/api/v1`;

// Warn if using default (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log(`   Raw API Base URL: ${API_BASE_URL}`);
  console.log(`   Normalized API Base URL: ${normalizedBaseURL}`);
  if (!import.meta.env.VITE_API_SERVER && !import.meta.env.VITE_API_BASE_URL) {
    console.warn('⚠️ Using default API URL. For production, set VITE_API_SERVER or VITE_API_BASE_URL in your .env file');
  }
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: normalizedBaseURL,
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
