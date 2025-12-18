import React, { useState, useMemo } from 'react';
import { X, Mail, Phone, MapPin, Briefcase, Calendar, Shield, User, Lock, FileText, CheckCircle, XCircle, AlertCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import ServiceManagement from './ServiceManagement';

export default function UserDetailsModal({ user, onClose, onUserUpdate }) {
  const [localUser, setLocalUser] = useState(user);
  const [notes, setNotes] = useState(user.notes || '');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Extract country from phone number prefix
  const extractedCountry = useMemo(() => {
    const phoneNumber = localUser.phoneNumber || localUser.phone;
    if (!phoneNumber) return null;
    
    const phonePrefixMap = {
      '+1': 'United States/Canada',
      '+44': 'United Kingdom',
      '+91': 'India',
      '+86': 'China',
      '+81': 'Japan',
      '+49': 'Germany',
      '+33': 'France',
      '+39': 'Italy',
      '+34': 'Spain',
      '+7': 'Russia/Kazakhstan',
      '+61': 'Australia',
      '+55': 'Brazil',
      '+52': 'Mexico',
      '+82': 'South Korea',
      '+62': 'Indonesia',
      '+90': 'Turkey',
      '+966': 'Saudi Arabia',
      '+971': 'United Arab Emirates',
      '+27': 'South Africa',
      '+234': 'Nigeria',
      '+20': 'Egypt',
      '+92': 'Pakistan',
      '+880': 'Bangladesh',
      '+63': 'Philippines',
      '+84': 'Vietnam',
      '+66': 'Thailand',
      '+65': 'Singapore',
      '+60': 'Malaysia',
      '+94': 'Sri Lanka',
      '+98': 'Iran',
      '+212': 'Morocco',
      '+213': 'Algeria',
      '+216': 'Tunisia',
      '+218': 'Libya',
      '+220': 'Gambia',
      '+221': 'Senegal',
      '+223': 'Mali',
      '+224': 'Guinea',
      '+225': 'Ivory Coast',
      '+226': 'Burkina Faso',
      '+227': 'Niger',
      '+228': 'Togo',
      '+229': 'Benin',
      '+231': 'Liberia',
      '+233': 'Ghana',
      '+237': 'Cameroon',
      '+241': 'Gabon',
      '+243': 'Congo',
      '+244': 'Angola',
      '+249': 'Sudan',
      '+250': 'Rwanda',
      '+251': 'Ethiopia',
      '+253': 'Djibouti',
      '+254': 'Kenya',
      '+255': 'Tanzania',
      '+256': 'Uganda',
      '+257': 'Burundi',
      '+258': 'Mozambique',
      '+260': 'Zambia',
      '+261': 'Madagascar',
      '+263': 'Zimbabwe',
      '+264': 'Namibia',
      '+265': 'Malawi',
      '+267': 'Botswana',
      '+30': 'Greece',
      '+31': 'Netherlands',
      '+32': 'Belgium',
      '+351': 'Portugal',
      '+352': 'Luxembourg',
      '+353': 'Ireland',
      '+354': 'Iceland',
      '+355': 'Albania',
      '+356': 'Malta',
      '+357': 'Cyprus',
      '+358': 'Finland',
      '+359': 'Bulgaria',
      '+36': 'Hungary',
      '+370': 'Lithuania',
      '+371': 'Latvia',
      '+372': 'Estonia',
      '+373': 'Moldova',
      '+374': 'Armenia',
      '+375': 'Belarus',
      '+376': 'Andorra',
      '+377': 'Monaco',
      '+380': 'Ukraine',
      '+381': 'Serbia',
      '+382': 'Montenegro',
      '+385': 'Croatia',
      '+386': 'Slovenia',
      '+387': 'Bosnia and Herzegovina',
      '+40': 'Romania',
      '+41': 'Switzerland',
      '+420': 'Czech Republic',
      '+421': 'Slovakia',
      '+423': 'Liechtenstein',
      '+43': 'Austria',
      '+45': 'Denmark',
      '+46': 'Sweden',
      '+47': 'Norway',
      '+48': 'Poland',
      '+501': 'Belize',
      '+502': 'Guatemala',
      '+503': 'El Salvador',
      '+504': 'Honduras',
      '+505': 'Nicaragua',
      '+506': 'Costa Rica',
      '+507': 'Panama',
      '+509': 'Haiti',
      '+51': 'Peru',
      '+53': 'Cuba',
      '+54': 'Argentina',
      '+56': 'Chile',
      '+57': 'Colombia',
      '+58': 'Venezuela',
      '+591': 'Bolivia',
      '+593': 'Ecuador',
      '+595': 'Paraguay',
      '+598': 'Uruguay',
      '+673': 'Brunei',
      '+675': 'Papua New Guinea',
      '+679': 'Fiji',
      '+853': 'Macau',
      '+852': 'Hong Kong',
      '+855': 'Cambodia',
      '+856': 'Laos',
      '+886': 'Taiwan',
      '+960': 'Maldives',
      '+961': 'Lebanon',
      '+962': 'Jordan',
      '+963': 'Syria',
      '+964': 'Iraq',
      '+965': 'Kuwait',
      '+967': 'Yemen',
      '+968': 'Oman',
      '+970': 'Palestine',
      '+972': 'Israel',
      '+973': 'Bahrain',
      '+974': 'Qatar',
      '+975': 'Bhutan',
      '+976': 'Mongolia',
      '+977': 'Nepal',
      '+992': 'Tajikistan',
      '+993': 'Turkmenistan',
      '+994': 'Azerbaijan',
      '+995': 'Georgia',
      '+996': 'Kyrgyzstan',
      '+998': 'Uzbekistan',
      '+1876': 'Jamaica'
    };

    // Try to match phone prefix
    for (const [prefix, country] of Object.entries(phonePrefixMap)) {
      if (phoneNumber.startsWith(prefix)) {
        return country;
      }
    }
    
    return null;
  }, [localUser.phoneNumber, localUser.phone]);
  
  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    in_review: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    verified: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const accountStatusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
    closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const handleUpdateServices = async (updateData) => {
    // Mock update - replace with your actual API call
    console.log('Update services:', localUser.id, updateData);
    const updatedUser = { ...localUser, ...updateData };
    setLocalUser(updatedUser);
    if (onUserUpdate) onUserUpdate(updatedUser);
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      // Mock update - replace with your actual API call
      console.log('Save notes:', localUser.id, notes);
      const updatedUser = { ...localUser, notes };
      setLocalUser(updatedUser);
      if (onUserUpdate) onUserUpdate(updatedUser);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAccountStatus = async (newStatus) => {
    // Mock update - replace with your actual API call
    console.log('Update account status:', localUser.id, newStatus);
    const updatedUser = { ...localUser, account_status: newStatus };
    setLocalUser(updatedUser);
    if (onUserUpdate) onUserUpdate(updatedUser);
  };

  const handleUpdateKYCStatus = async (newStatus) => {
    // Mock update - replace with your actual API call
    console.log('Update KYC status:', localUser.id, newStatus);
    const updatedUser = { ...localUser, kyc_status: newStatus };
    setLocalUser(updatedUser);
    if (onUserUpdate) onUserUpdate(updatedUser);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {localUser.firstName && localUser.lastName 
                    ? `${localUser.firstName} ${localUser.lastName}` 
                    : localUser.full_name}
                </h2>
                <p className="text-slate-400">{localUser.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white bg-slate-800 hover:bg-red-500 p-2 rounded-lg transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Status Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge className={`${statusColors[localUser.kyc_status]} border`}>
              KYC: {localUser.kyc_status}
            </Badge>
            <Badge className={`${accountStatusColors[localUser.account_status || 'active']} border`}>
              Account: {localUser.account_status || 'active'}
            </Badge>
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 border">
              Role: {localUser.role}
            </Badge>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b border-white/10">
            {['overview', 'services', 'actions', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Personal Information */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">First Name</p>
                      <p className="text-white">{localUser.firstName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Last Name</p>
                      <p className="text-white">{localUser.lastName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Email</p>
                      <p className="text-white">{localUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Phone Number</p>
                      <p className="text-white">{localUser.phoneNumber || localUser.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Country (from phone)</p>
                      <p className="text-white">{extractedCountry || 'N/A'}</p>
                    </div>
                  </div>
                  {localUser.date_of_birth && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-indigo-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Date of Birth</p>
                        <p className="text-white">{new Date(localUser.date_of_birth).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {localUser.occupation && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-indigo-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Occupation</p>
                        <p className="text-white">{localUser.occupation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {(localUser.address || localUser.city || localUser.country) && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    Address
                  </h3>
                  <div className="space-y-2 text-slate-300">
                    {localUser.address && <p>{localUser.address}</p>}
                    <p>
                      {[localUser.city, localUser.postal_code, localUser.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Account Details */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">User ID</p>
                    <p className="text-white font-mono text-xs">{localUser.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Role</p>
                    <p className="text-white capitalize">{localUser.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Member Since</p>
                    <p className="text-white">{new Date(localUser.created_date).toLocaleDateString()}</p>
                  </div>
                  {localUser.last_login && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Last Login</p>
                      <p className="text-white">{new Date(localUser.last_login).toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Services Accessed</p>
                    <p className="text-white">{localUser.accessed_services?.length || 0}</p>
                  </div>
                  {localUser.kyc_submitted_date && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">KYC Submitted</p>
                      <p className="text-white">{new Date(localUser.kyc_submitted_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Accessed Services */}
              {localUser.accessed_services && localUser.accessed_services.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Services Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {localUser.accessed_services.map((service, idx) => (
                      <Badge key={idx} className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <ServiceManagement
              user={localUser}
              isAdmin={true}
              onUpdate={handleUpdateServices}
            />
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <>
              {/* KYC Documents & Review */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    KYC Documents & Review
                  </h3>
                  <Badge className={`${statusColors[localUser.kyc_status]} border`}>
                    {localUser.kyc_status}
                  </Badge>
                </div>

                {/* Documents Grid */}
                {(localUser.id_document_url || localUser.selfie_url) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* ID Document */}
                    {localUser.id_document_url && (
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          ID Document
                        </h4>
                        <div className="relative rounded-lg overflow-hidden bg-slate-950 group">
                          <img
                            src={localUser.id_document_url}
                            alt="ID Document"
                            className="w-full h-auto max-h-64 object-contain"
                          />
                          <a
                            href={localUser.id_document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Button className="bg-white text-slate-900 hover:bg-slate-100">
                              View Full Size
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Selfie Photo */}
                    {localUser.selfie_url && (
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-400" />
                          Selfie Photo
                        </h4>
                        <div className="relative rounded-lg overflow-hidden bg-slate-950 group">
                          <img
                            src={localUser.selfie_url}
                            alt="Selfie"
                            className="w-full h-auto max-h-64 object-contain"
                          />
                          <a
                            href={localUser.selfie_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Button className="bg-white text-slate-900 hover:bg-slate-100">
                              View Full Size
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900/50 rounded-xl p-8 border border-white/10 mb-6 text-center">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No documents uploaded yet</p>
                  </div>
                )}

                {/* Submission Info */}
                {localUser.kyc_submitted_date && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-300">
                      <strong>Submitted:</strong> {new Date(localUser.kyc_submitted_date).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-3">
                  <p className="text-sm text-slate-400 font-medium">Quick Actions:</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => handleUpdateKYCStatus('verified')}
                      disabled={localUser.kyc_status === 'verified'}
                      className="bg-green-500 hover:bg-green-600 text-white border-0"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve KYC
                    </Button>
                    <Button
                      onClick={() => handleUpdateKYCStatus('rejected')}
                      disabled={localUser.kyc_status === 'rejected'}
                      className="bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject KYC
                    </Button>
                    <Button
                      onClick={() => handleUpdateKYCStatus('in_review')}
                      disabled={localUser.kyc_status === 'in_review'}
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Mark In Review
                    </Button>
                    <Button
                      onClick={() => handleUpdateKYCStatus('pending')}
                      disabled={localUser.kyc_status === 'pending'}
                      className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Reset to Pending
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Status Management */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  Account Status
                </h3>
                <p className="text-sm text-slate-400 mb-4">Current Status: <span className="text-white font-medium">{localUser.account_status || 'active'}</span></p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleUpdateAccountStatus('active')}
                    disabled={localUser.account_status === 'active' || !localUser.account_status}
                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                  <Button
                    onClick={() => handleUpdateAccountStatus('suspended')}
                    disabled={localUser.account_status === 'suspended'}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Suspend
                  </Button>
                  <Button
                    onClick={() => handleUpdateAccountStatus('closed')}
                    disabled={localUser.account_status === 'closed'}
                    className="bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 border border-slate-500/30"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Close Account
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Admin Notes
              </h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this user..."
                className="min-h-[200px] bg-slate-900/50 border-white/10 text-white mb-4"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={saving || notes === (localUser.notes || '')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {saving ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6 flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-slate-800 text-white hover:bg-slate-700 border border-white/20"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
}