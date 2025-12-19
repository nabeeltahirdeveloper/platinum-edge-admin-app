import apiClient from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

/**
 * Admin Login
 * @param {string} email - Admin email address
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Response with token and user data
 */
export const adminLogin = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    // Backend response structure: { success: true, message: "...", data: { user: {...}, accessToken: "...", refreshToken: "..." } }
    const responseData = response.data.data || response.data;
    
    // Store token and user data
    if (responseData.accessToken) {
      localStorage.setItem('token', responseData.accessToken);
    }
    if (responseData.refreshToken) {
      localStorage.setItem('refreshToken', responseData.refreshToken);
    }
    if (responseData.user) {
      localStorage.setItem('user', JSON.stringify(responseData.user));
    }
    
    return responseData;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify Admin Token
 * Validates the current token and returns user data
 * For now, returns stored user if token exists (backend doesn't have a verify endpoint)
 * @returns {Promise<Object>} User data
 */
export const verifyAdminToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    // Return stored user data if available
    const storedUser = getStoredUser();
    if (storedUser) {
      return { user: storedUser };
    }
    
    // If no stored user, throw error to trigger re-login
    throw new Error('No user data found');
  } catch (error) {
    // If verification fails, clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

/**
 * Get Current Admin User
 * Returns stored user data (backend profile endpoint requires specific action type)
 * @returns {Promise<Object>} Current admin user data
 */
export const getCurrentAdmin = async () => {
  try {
    const storedUser = getStoredUser();
    if (storedUser) {
      return { user: storedUser };
    }
    throw new Error('No user data found');
  } catch (error) {
    throw error;
  }
};

/**
 * Admin Logout
 * @returns {Promise<void>}
 */
export const adminLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiClient.post('/auth/logout', {
        refreshToken,
      });
    }
  } catch (error) {
    // Even if API call fails, clear local storage
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

/**
 * Refresh Admin Token
 * @returns {Promise<Object>} New token
 */
export const refreshAdminToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    
    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    });
    
    // Backend response structure: { success: true, message: "...", data: { accessToken: "...", refreshToken: "..." } }
    const responseData = response.data.data || response.data;
    
    if (responseData.accessToken) {
      localStorage.setItem('token', responseData.accessToken);
    }
    if (responseData.refreshToken) {
      localStorage.setItem('refreshToken', responseData.refreshToken);
    }
    
    return responseData;
  } catch (error) {
    // If refresh fails, logout user
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored user data
 * @returns {Object|null}
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};
