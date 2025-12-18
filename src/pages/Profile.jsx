import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceManagement from '../components/admin/ServiceManagement';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Mock user data - replace with your actual auth implementation
      const userData = {
        full_name: 'Demo User',
        email: 'demo@platinum-edge.ca',
        kyc_status: 'pending',
        created_date: new Date().toISOString(),
        role: 'user'
      };
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateServices = async (updateData) => {
    // Mock update - replace with your actual update implementation
    console.log('Update services:', updateData);
    await loadUserData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    in_review: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    verified: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
    rejected: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' }
  };

  const status = user?.kyc_status || 'pending';
  const statusColor = statusColors[status];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-3">Profile</h1>
        <p className="text-slate-400 text-lg">Your account information and verification status</p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10 backdrop-blur-xl mb-6">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{user?.full_name}</h2>
                <p className="text-slate-300 mb-4">{user?.email}</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusColor.bg} border ${statusColor.border}`}>
                  {status === 'verified' && <CheckCircle2 className="w-4 h-4" />}
                  <span className={`text-sm font-medium ${statusColor.text}`}>
                    {status === 'pending' && 'KYC Pending'}
                    {status === 'in_review' && 'KYC Under Review'}
                    {status === 'verified' && 'Verified Account'}
                    {status === 'rejected' && 'KYC Rejected'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-indigo-400" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.firstName && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">First Name</p>
                    <p className="text-white">{user.firstName}</p>
                  </div>
                </div>
              )}

              {user?.lastName && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Name</p>
                    <p className="text-white">{user.lastName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email Address</p>
                  <p className="text-white">{user?.email}</p>
                </div>
              </div>
              
              {(user?.phoneNumber || user?.phone) && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                    <p className="text-white">{user.phoneNumber || user.phone}</p>
                  </div>
                </div>
              )}

              {user?.date_of_birth && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Date of Birth</p>
                    <p className="text-white">{new Date(user.date_of_birth).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {user?.occupation && (
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Occupation</p>
                    <p className="text-white">{user.occupation}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Address Information */}
      {user?.address && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-indigo-400" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-1">{user.address}</p>
              <p className="text-slate-400">
                {user.city}, {user.country} {user.postal_code}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Account Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-indigo-400" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Account Type</p>
                <p className="text-white font-medium">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Member Since</p>
                <p className="text-white font-medium">
                  {user?.created_date ? new Date(user.created_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
              {user?.kyc_submitted_date && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">KYC Submitted</p>
                  <p className="text-white font-medium">
                    {new Date(user.kyc_submitted_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ServiceManagement
          user={user}
          isAdmin={user?.role === 'admin'}
          onUpdate={handleUpdateServices}
        />
      </motion.div>
    </div>
  );
}