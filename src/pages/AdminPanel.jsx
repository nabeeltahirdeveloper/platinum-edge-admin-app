import React, { useState, useEffect, useMemo } from 'react';
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
import authAPI from '@/apiBridge/auth';
import usersAPI from '@/apiBridge/users';

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [kycReviewUser, setKycReviewUser] = useState(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [sortField, setSortField] = useState('created_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    searchQuery: '',
    kycStatus: 'all',
    accountStatus: 'all',
    services: [],
    createdFrom: '',
    createdTo: '',
    notesQuery: ''
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  const checkAdminAccess = async () => {
    try {
      const response = await authAPI.checkAdminAccess({});
      const user = response.data;
      
      if (!user || user.role !== 'admin') {
        window.location.href = '/Login';
        return;
      }
      setCurrentUser(user);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      // If authentication fails, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = '/Login';
      } else {
        // For other errors, still set loading to false to show error state
        setIsLoading(false);
      }
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getUsers({});
      const userList = response.data?.users || response.data || [];
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      // Set empty array on error to prevent UI issues
      setUsers([]);
    }
  };

  const updateUser = async (id, data) => {
    try {
      await usersAPI.updateUser({ userId: id, ...data });
      // Update local state after successful API call
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === id ? { ...user, ...data } : user)
      );
      // Reload users to ensure data consistency
      await loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; // Re-throw to allow caller to handle
    }
  };

  const handleKYCAction = async (userId, status) => {
    await updateUser(userId, { kyc_status: status });
    setKycReviewUser(null);
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Search query (name, email, phone)
      const matchesSearch = !filters.searchQuery || 
        user.full_name?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      // KYC Status
      const matchesKYC = filters.kycStatus === 'all' || user.kyc_status === filters.kycStatus;
      
      // Account Status
      const matchesAccount = filters.accountStatus === 'all' || 
        (user.account_status || 'active') === filters.accountStatus;
      
      // Services
      const matchesServices = filters.services.length === 0 || 
        filters.services.some(service => user.accessed_services?.includes(service));
      
      // Created Date Range
      const matchesCreatedFrom = !filters.createdFrom || 
        new Date(user.created_date) >= new Date(filters.createdFrom);
      
      const matchesCreatedTo = !filters.createdTo || 
        new Date(user.created_date) <= new Date(filters.createdTo + 'T23:59:59');
      
      // Notes Search
      const matchesNotes = !filters.notesQuery || 
        user.notes?.toLowerCase().includes(filters.notesQuery.toLowerCase());
      
      return matchesSearch && matchesKYC && matchesAccount && matchesServices && 
             matchesCreatedFrom && matchesCreatedTo && matchesNotes;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortField) {
        case 'name':
          aVal = a.full_name?.toLowerCase() || '';
          bVal = b.full_name?.toLowerCase() || '';
          break;
        case 'email':
          aVal = a.email?.toLowerCase() || '';
          bVal = b.email?.toLowerCase() || '';
          break;
        case 'kyc_status':
          aVal = a.kyc_status || '';
          bVal = b.kyc_status || '';
          break;
        case 'created_date':
          aVal = new Date(a.created_date).getTime();
          bVal = new Date(b.created_date).getTime();
          break;
        case 'services':
          aVal = a.accessed_services?.length || 0;
          bVal = b.accessed_services?.length || 0;
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, filters, sortField, sortDirection]);

  const stats = {
    total: users.length,
    filtered: filteredAndSortedUsers.length,
    verified: users.filter(u => u.kyc_status === 'verified').length,
    pending: users.filter(u => u.kyc_status === 'pending').length,
    in_review: users.filter(u => u.kyc_status === 'in_review').length,
    rejected: users.filter(u => u.kyc_status === 'rejected').length
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
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

  if (isLoading || !currentUser) {
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
      {filteredAndSortedUsers.length !== users.length && (
        <div className="mb-4 text-slate-400 text-sm">
          Showing {filteredAndSortedUsers.length} of {users.length} users
        </div>
      )}

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
                    <ArrowUpDown className={`w-4 h-4 ${sortField === 'created_date' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
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
                        {new Date(user.created_date).toLocaleDateString()}
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