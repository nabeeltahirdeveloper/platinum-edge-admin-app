import apiClient from './api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

/**
 * Get all users with pagination and filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10, max: 100)
 * @param {string} params.search - Search by name or email
 * @param {string} params.account_status - Filter by account status (active, suspended, closed)
 * @param {string} params.kyc_status - Filter by KYC status (pending, in_review, verified, rejected)
 * @param {string} params.sortBy - Field to sort by (default: createdAt)
 * @param {string} params.sortOrder - Sort order (asc, desc) (default: desc)
 * @returns {Promise<Object>} Response with users and pagination data
 */
export const getUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.account_status) queryParams.append('account_status', params.account_status);
    if (params.kyc_status) queryParams.append('kyc_status', params.kyc_status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    
    // Backend response structure: { success: true, message: "...", data: [...], pagination: {...} }
    return {
      success: true,
      users: response.data.data || [],
      pagination: response.data.pagination || {},
      total: response.data.pagination?.total || 0
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to fetch users';
    throw new Error(errorMessage);
  }
};

