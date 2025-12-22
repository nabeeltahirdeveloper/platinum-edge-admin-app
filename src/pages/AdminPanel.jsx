import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, CheckCircle, XCircle, Clock, AlertCircle, 
  Eye, Shield, CreditCard, Wallet, Building2, ArrowLeftRight, ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import KYCReviewModal from '../components/admin/KYCReviewModal';
import NotificationBar from '../components/admin/NotificationBar';
import AdvancedFilters from '../components/admin/AdvancedFilters';
import { useAuth } from '../contexts/AuthContext';
import { getUsers as fetchUsers } from '../services/admin';

export default function AdminPanel() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [kycReviewUser, setKycReviewUser] = useState(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState({
    searchQuery: '',
    kycStatus: 'all',
    accountStatus: 'all',
    services: [],
    createdFrom: '',
    createdTo: '',
    notesQuery: ''
  });

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Build API params
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortField === 'created_date' ? 'createdAt' : sortField,
        sortOrder: sortDirection
      };
      
      if (filters.searchQuery) {
        params.search = filters.searchQuery;
      }
      
      if (filters.kycStatus !== 'all') {
        params.kyc_status = filters.kycStatus;
      }
      
      if (filters.accountStatus !== 'all') {
        params.account_status = filters.accountStatus;
      }
      
      const response = await fetchUsers(params);
      
      if (response.success) {
        // Map backend user data to frontend format
        const mappedUsers = response.users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          full_name: user.full_name || user.name,
          phone: user.phone,
          phoneNumber: user.phone, // For compatibility
          date_of_birth: user.date_of_birth,
          occupation: user.occupation,
          address: user.address,
          city: user.city,
          postal_code: user.postal_code,
          country: user.country,
          kyc_status: user.kyc_status || 'pending',
          kyc_submitted_date: user.kyc_submitted_date,
          account_status: user.account_status || 'active',
          enabled_services: user.enabled_services,
          service_access_dates: user.service_access_dates,
          created_date: user.createdAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // Map enabled_services to accessed_services for compatibility
          accessed_services: user.enabled_services 
            ? Object.keys(user.enabled_services).filter(key => user.enabled_services[key])
            : []
        }));
        
        setUsers(mappedUsers);
        setTotalUsers(response.total);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total || 0,
          totalPages: response.pagination.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Show error message to user
      alert(error.message || 'Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.searchQuery, filters.kycStatus, filters.accountStatus, pagination.page, pagination.limit, sortField, sortDirection]);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      // Redirect to login if not authenticated
      window.location.href = '/Login';
      return;
    }
    
    if (currentUser) {
      setIsLoading(false);
    }
  }, [currentUser, authLoading]);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    if (!currentUser) return;
    
    const timeoutId = setTimeout(() => {
      // Reset to page 1 when filters change
      setPagination(prev => {
        if (prev.page !== 1) {
          return { ...prev, page: 1 };
        }
        return prev;
      });
    }, filters.searchQuery ? 500 : 0); // 500ms delay for search, immediate for other filters
    
    return () => clearTimeout(timeoutId);
  }, [filters.searchQuery, filters.kycStatus, filters.accountStatus, sortField, sortDirection, currentUser]);

  // Load users when pagination or filters change
  useEffect(() => {
    if (currentUser && pagination.page > 0) {
      loadUsers();
    }
  }, [pagination.page, currentUser, loadUsers]);

  const updateUser = async (id, data) => {
    // Mock update - just update local state
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === id ? { ...user, ...data } : user)
    );
  };

  const handleKYCAction = async (userId, status) => {
    await updateUser(userId, { kyc_status: status });
    setKycReviewUser(null);
  };

  // Since filtering and sorting is done on the backend, we just use the users directly
  // But we can still do client-side filtering for services, date range, and notes if needed
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Services filter (client-side since backend doesn't support it yet)
      const matchesServices = filters.services.length === 0 || 
        filters.services.some(service => user.accessed_services?.includes(service));
      
      // Created Date Range (client-side)
      const matchesCreatedFrom = !filters.createdFrom || 
        new Date(user.createdAt || user.created_date) >= new Date(filters.createdFrom);
      
      const matchesCreatedTo = !filters.createdTo || 
        new Date(user.createdAt || user.created_date) <= new Date(filters.createdTo + 'T23:59:59');
      
      // Notes Search (client-side - if notes field exists)
      const matchesNotes = !filters.notesQuery || 
        user.notes?.toLowerCase().includes(filters.notesQuery.toLowerCase());
      
      return matchesServices && matchesCreatedFrom && matchesCreatedTo && matchesNotes;
    });

    return filtered;
  }, [users, filters.services, filters.createdFrom, filters.createdTo, filters.notesQuery]);

  // Calculate stats from all users (we need to fetch all users for stats or get stats from backend)
  // For now, we'll calculate from current page users, but ideally backend should provide stats endpoint
  const stats = {
    total: totalUsers || users.length,
    filtered: filteredAndSortedUsers.length,
    verified: users.filter(u => u.kyc_status === 'verified').length,
    pending: users.filter(u => u.kyc_status === 'pending').length,
    in_review: users.filter(u => u.kyc_status === 'in_review').length,
    rejected: users.filter(u => u.kyc_status === 'rejected').length
  };

  const handleSort = (field) => {
    // Map frontend field names to backend field names
    const fieldMap = {
      'name': 'name',
      'email': 'email',
      'kyc_status': 'kyc_status',
      'created_date': 'createdAt',
      'services': 'createdAt' // Backend doesn't support sorting by services count
    };
    
    const backendField = fieldMap[field] || 'createdAt';
    
    if (sortField === backendField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(backendField);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      kycStatus: 'all',
      accountStatus: 'all',
      services: [],
      createdFrom: '',
      createdTo: '',
      notesQuery: ''
    });
  };

  const statusConfig = {
    pending: { icon: AlertCircle, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    in_review: { icon: Clock, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    verified: { icon: CheckCircle, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    rejected: { icon: XCircle, color: 'bg-red-500/10 text-red-400 border-red-500/20' }
  };

  const serviceIcons = {
    'FlashCard': CreditCard,
    'FlashPay': Wallet,
    'FlashAccount': Building2,
    'FlashExchange': ArrowLeftRight
  };

  if (authLoading || isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Admin Panel</h1>
        <p className="text-slate-400 text-lg">Manage users, KYC verification, and service access</p>
      </div>

      {/* Notification Bar */}
      <NotificationBar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-xl"
        >
          <Users className="w-5 h-5 text-indigo-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-slate-400">Total Users</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-xl"
        >
          <CheckCircle className="w-5 h-5 text-green-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{stats.verified}</p>
          <p className="text-sm text-slate-400">Verified</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-6 backdrop-blur-xl"
        >
          <Clock className="w-5 h-5 text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{stats.in_review}</p>
          <p className="text-sm text-slate-400">In Review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 border border-amber-500/20 rounded-xl p-6 backdrop-blur-xl"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{stats.pending}</p>
          <p className="text-sm text-slate-400">Pending</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/50 border border-red-500/20 rounded-xl p-6 backdrop-blur-xl"
        >
          <XCircle className="w-5 h-5 text-red-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{stats.rejected}</p>
          <p className="text-sm text-slate-400">Rejected</p>
        </motion.div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters 
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
        isExpanded={isFiltersExpanded}
        setIsExpanded={setIsFiltersExpanded}
      />

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-slate-400 text-sm">
          Showing {filteredAndSortedUsers.length} of {totalUsers} total users
          {pagination.totalPages > 1 && (
            <span className="ml-2">
              (Page {pagination.page} of {pagination.totalPages})
            </span>
          )}
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="bg-slate-800/50 border border-white/10 text-white hover:bg-slate-700"
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="bg-slate-800/50 border border-white/10 text-white hover:bg-slate-700"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th 
                  className="text-left p-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    User
                    <ArrowUpDown className={`w-4 h-4 ${sortField === 'name' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  </div>
                </th>
                <th 
                  className="text-left p-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Contact
                    <ArrowUpDown className={`w-4 h-4 ${sortField === 'email' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  </div>
                </th>
                <th 
                  className="text-left p-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('kyc_status')}
                >
                  <div className="flex items-center gap-2">
                    KYC Status
                    <ArrowUpDown className={`w-4 h-4 ${sortField === 'kyc_status' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  </div>
                </th>
                <th 
                  className="text-left p-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('services')}
                >
                  <div className="flex items-center gap-2">
                    Services
                    <ArrowUpDown className={`w-4 h-4 ${sortField === 'services' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  </div>
                </th>
                <th 
                  className="text-left p-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('created_date')}
                >
                  <div className="flex items-center gap-2">
                    Joined
                    <ArrowUpDown className={`w-4 h-4 ${sortField === 'createdAt' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  </div>
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAndSortedUsers.map((user, index) => {
                const StatusIcon = statusConfig[user.kyc_status]?.icon || AlertCircle;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{user.full_name}</p>
                        <p className="text-sm text-slate-400">{user.role}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-slate-300 text-sm">{user.email}</p>
                        <p className="text-slate-400 text-xs">{user.phone || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${statusConfig[user.kyc_status]?.color} border flex items-center gap-1 w-fit`}>
                        <StatusIcon className="w-3 h-3" />
                        {user.kyc_status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {user.accessed_services?.length > 0 ? (
                          user.accessed_services.map((service, idx) => {
                            const ServiceIcon = serviceIcons[service];
                            return ServiceIcon ? (
                              <div key={idx} className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center" title={service}>
                                <ServiceIcon className="w-4 h-4 text-indigo-400" />
                              </div>
                            ) : null;
                          })
                        ) : (
                          <span className="text-slate-500 text-sm">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300 text-sm">
                        {new Date(user.createdAt || user.created_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="bg-slate-800/50 border border-white/10 text-white hover:bg-slate-700 hover:border-indigo-500/30"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {user.kyc_status === 'in_review' && (
                          <Button
                            size="sm"
                            onClick={() => setKycReviewUser(user)}
                            className="bg-indigo-500 hover:bg-indigo-600"
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdate={(updatedUser) => {
            loadUsers();
          }}
        />
      )}

      {kycReviewUser && (
        <KYCReviewModal
          user={kycReviewUser}
          onClose={() => setKycReviewUser(null)}
          onApprove={() => handleKYCAction(kycReviewUser.id, 'verified')}
          onReject={() => handleKYCAction(kycReviewUser.id, 'rejected')}
        />
      )}
    </div>
  );
}