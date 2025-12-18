import React, { useState, useEffect } from 'react';
import { Wallet, Lock, CheckCircle2, Send, DollarSign, Clock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function FlashPay() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user data - replace with your actual auth implementation
    setUser({
      full_name: 'Demo User',
      email: 'demo@platinum-edge.ca',
      kyc_status: 'pending'
    });
    setLoading(false);
  }, []);

  const isVerified = user?.kyc_status === 'verified';

  const features = [
    { icon: Send, title: 'Instant Transfers', description: 'Send money in seconds globally' },
    { icon: DollarSign, title: 'Zero Fees', description: 'No hidden charges or commissions' },
    { icon: Clock, title: '24/7 Availability', description: 'Transfer anytime, anywhere' },
    { icon: Globe, title: 'Multi-Currency', description: 'Support for 50+ currencies' }
  ];

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
          <Wallet className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 text-sm font-medium">FlashPay</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Payments at the Speed of Light
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Send and receive money globally with zero fees and instant settlement
        </p>
      </motion.div>

      {!isVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <Lock className="w-8 h-8 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-amber-400 font-semibold mb-1">Demo Mode - Complete KYC to Unlock</h3>
              <p className="text-slate-400 text-sm">This is a preview. Complete your KYC verification to send and receive real payments.</p>
            </div>
            <Link to={createPageUrl('KYCVerification')} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all whitespace-nowrap">
              Verify Now
            </Link>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Balance</h3>
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {isVerified ? '$2,450.00' : '$0.00'}
            </p>
          </div>
          
          {isVerified && (
            <div className="grid grid-cols-2 gap-4">
              <button className="py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                Send Money
              </button>
              <button className="py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                Request Money
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {isVerified ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Account Active</h3>
          <p className="text-slate-400">Your FlashPay account is ready for instant transfers worldwide</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-slate-900/50 border border-white/10 rounded-2xl p-8"
        >
          <p className="text-slate-400 mb-6">Complete your KYC verification to activate your FlashPay account</p>
          <Link to={createPageUrl('KYCVerification')} className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
            Complete Verification
          </Link>
        </motion.div>
      )}
    </div>
  );
}