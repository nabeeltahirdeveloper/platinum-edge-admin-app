import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, CheckCircle2, FileText, User, Calendar, MapPin, Phone, Briefcase, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KYCVerification() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    occupation: ''
  });
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);

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
        phone: '',
        date_of_birth: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        occupation: ''
      };
      setUser(userData);
      setFormData({
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
        address: userData.address || '',
        city: userData.city || '',
        country: userData.country || '',
        postal_code: userData.postal_code || '',
        occupation: userData.occupation || ''
      });
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type, file) => {
    if (type === 'id') {
      setIdFile(file);
    } else {
      setSelfieFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let updateData = { ...formData, kyc_status: 'in_review', kyc_submitted_date: new Date().toISOString() };

      // Mock file upload - replace with your actual file upload implementation
      if (idFile) {
        // Mock upload result
        updateData.id_document_url = URL.createObjectURL(idFile);
      }

      // Mock file upload - replace with your actual file upload implementation
      if (selfieFile) {
        // Mock upload result
        updateData.selfie_url = URL.createObjectURL(selfieFile);
      }

      // Mock update - replace with your actual update implementation
      console.log('Update KYC data:', updateData);
      
      // Reload user data
      await loadUserData();
      
      alert('KYC documents submitted successfully! We will review your application within 24-48 hours.');
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert('Error submitting KYC. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading verification...</p>
        </div>
      </div>
    );
  }

  const isVerified = user?.kyc_status === 'verified';
  const isInReview = user?.kyc_status === 'in_review';

  if (isVerified) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Account Verified!</h1>
          <p className="text-slate-400 text-lg mb-8">Your identity has been successfully verified. You now have full access to all platforms.</p>
          
          <div className="grid grid-cols-2 gap-4 text-left bg-slate-900/50 border border-white/10 rounded-2xl p-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Verified On</p>
              <p className="text-white font-medium">{user.kyc_submitted_date ? new Date(user.kyc_submitted_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <p className="text-green-400 font-medium">Active</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Account Type</p>
              <p className="text-white font-medium">Premium</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Access Level</p>
              <p className="text-white font-medium">Full Access</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isInReview) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30 animate-pulse">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Under Review</h1>
          <p className="text-slate-400 text-lg mb-8">Your documents are being reviewed by our team. This typically takes 24-48 hours.</p>
          
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-left">
            <h3 className="text-white font-semibold mb-4">Submitted Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Submitted Date</span>
                <span className="text-white font-medium">{user.kyc_submitted_date ? new Date(user.kyc_submitted_date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ID Document</span>
                <span className="text-green-400 font-medium">✓ Uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selfie Photo</span>
                <span className="text-green-400 font-medium">✓ Uploaded</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-3">KYC Verification</h1>
        <p className="text-slate-400 text-lg">Complete your identity verification to unlock full platform access</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-indigo-400" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-slate-300">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="occupation" className="text-slate-300">Occupation *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-indigo-400" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-300">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-slate-800/50 border-white/10 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-300">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-300">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-slate-300">Postal Code *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5 text-indigo-400" />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Government ID (Passport, Driver's License, etc.) *</Label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-all">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-2">
                  {idFile ? idFile.name : 'Click to upload or drag and drop'}
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('id', e.target.files[0])}
                  className="hidden"
                  id="id-upload"
                  required
                />
                <label htmlFor="id-upload" className="cursor-pointer text-indigo-400 hover:text-indigo-300 text-sm">
                  Browse files
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Selfie Photo *</Label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-all">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-2">
                  {selfieFile ? selfieFile.name : 'Click to upload or drag and drop'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('selfie', e.target.files[0])}
                  className="hidden"
                  id="selfie-upload"
                  required
                />
                <label htmlFor="selfie-upload" className="cursor-pointer text-indigo-400 hover:text-indigo-300 text-sm">
                  Browse files
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/30"
        >
          {submitting ? 'Submitting...' : 'Submit for Verification'}
        </Button>
      </form>
    </div>
  );
}