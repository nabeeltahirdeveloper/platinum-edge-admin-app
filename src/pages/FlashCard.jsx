import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle2, TrendingUp, Shield, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function FlashCard() {
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
    { icon: Globe, title: 'Global Acceptance', description: 'Use anywhere in 190+ countries' },
    { icon: Shield, title: 'Bank-Level Security', description: '3D Secure & fraud protection' },
    { icon: Zap, title: 'Instant Issuance', description: 'Virtual cards in seconds' },
    { icon: TrendingUp, title: 'Cashback Rewards', description: 'Earn up to 3% on purchases' }
  ];

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
          <CreditCard className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium">Flash Card</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Premium Cards for Modern Life
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Virtual and physical cards with global acceptance, real-time controls, and premium rewards
        </p>
      </motion.div>

      {/* Access Status Banner */}
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
              <p className="text-slate-400 text-sm">This is a preview. Complete your KYC verification to issue real cards and access all features.</p>
            </div>
            <Link to={createPageUrl('KYCVerification')} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all whitespace-nowrap">
              Verify Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Card Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative max-w-md mx-auto mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30"></div>
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl aspect-[1.586]">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-white/80 text-xs mb-1">Flash Card</p>
              <p className="text-white font-semibold">{isVerified ? 'Active' : 'Demo'}</p>
            </div>
            <CreditCard className="w-10 h-10 text-white/90" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-white/60 text-xs mb-2">Card Number</p>
              <p className="text-white text-xl font-mono tracking-wider">
                {isVerified ? '**** **** **** 4829' : '**** **** **** ****'}
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-white/60 text-xs mb-1">Cardholder</p>
                <p className="text-white text-sm font-medium">{user?.full_name || 'NAME'}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Expires</p>
                <p className="text-white text-sm font-medium">{isVerified ? '12/28' : 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      {isVerified ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Issue Your Card</h3>
          <p className="text-slate-400 mb-6">Your account is verified. You can now issue virtual and physical cards.</p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
            Issue New Card
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-slate-900/50 border border-white/10 rounded-2xl p-8"
        >
          <p className="text-slate-400 mb-6">Complete your KYC verification to access real card issuance and management features</p>
          <Link to={createPageUrl('KYCVerification')} className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
            Complete Verification
          </Link>
        </motion.div>
      )}
    </div>
  );
}