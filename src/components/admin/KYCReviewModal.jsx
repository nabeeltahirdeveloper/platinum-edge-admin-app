import React, { useState } from 'react';
import { X, FileText, Image, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function KYCReviewModal({ user, onClose, onApprove, onReject }) {
  const [imageLoading, setImageLoading] = useState({ id: true, selfie: true });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">KYC Review</h2>
            <p className="text-slate-400">{user.full_name} - {user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Details */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Submitted Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Full Name</p>
                <p className="text-white">{user.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Phone</p>
                <p className="text-white">{user.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Date of Birth</p>
                <p className="text-white">
                  {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Occupation</p>
                <p className="text-white">{user.occupation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Submitted Date</p>
                <p className="text-white">
                  {user.kyc_submitted_date ? new Date(user.kyc_submitted_date).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
            <div className="space-y-2 text-slate-300">
              <p>{user.address || 'N/A'}</p>
              <p>
                {[user.city, user.postal_code, user.country].filter(Boolean).join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          {/* Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Document */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                ID Document
              </h3>
              {user.id_document_url ? (
                <div className="relative rounded-lg overflow-hidden bg-slate-900">
                  {imageLoading.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={user.id_document_url}
                    alt="ID Document"
                    className="w-full h-auto"
                    onLoad={() => setImageLoading(prev => ({ ...prev, id: false }))}
                  />
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No document uploaded</p>
              )}
            </div>

            {/* Selfie */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-400" />
                Selfie Photo
              </h3>
              {user.selfie_url ? (
                <div className="relative rounded-lg overflow-hidden bg-slate-900">
                  {imageLoading.selfie && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={user.selfie_url}
                    alt="Selfie"
                    className="w-full h-auto"
                    onLoad={() => setImageLoading(prev => ({ ...prev, selfie: false }))}
                  />
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No photo uploaded</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6">
          <div className="flex gap-4">
            <Button
              onClick={onReject}
              className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Reject KYC
            </Button>
            <Button
              onClick={onApprove}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Approve KYC
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}