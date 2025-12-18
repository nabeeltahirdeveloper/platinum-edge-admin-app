import React, { useState, useEffect } from 'react';
import { Building2, Lock, CheckCircle2, PieChart, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function FlashAccount() {
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
    { icon: DollarSign, title: 'Multi-Currency', description: 'Hold 20+ currencies in one account' },
    { icon: TrendingUp, title: 'Competitive Rates', description: 'Earn interest on your balance' },
    { icon: Shield, title: 'FDIC Insured', description: 'Your funds are protected' },
    { icon: PieChart, title: 'Smart Analytics', description: 'Track spending and savings' }
  ];

  const currencies = [
    { code: 'USD', balance: '2,450.00', flag: '🇺🇸' },
    { code: 'EUR', balance: '1,230.50', flag: '🇪🇺' },
    { code: 'GBP', balance: '890.25', flag: '🇬🇧' },
    { code: 'JPY', balance: '125,000', flag: '🇯🇵' }
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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
          <Building2 className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">Flash Account</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          Banking Without Borders
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Multi-currency accounts with competitive rates and complete financial control
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
              <p className="text-slate-400 text-sm">This is a preview. Complete your KYC verification to open real accounts and manage funds.</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currencies.map((currency, index) => (
              <motion.div
                key={currency.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{currency.flag}</span>
                  <span className="text-slate-400 font-medium">{currency.code}</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{currency.balance}</p>
                <p className="text-slate-400 text-sm">{currency.code} Balance</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {isVerified ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Accounts Active</h3>
          <p className="text-slate-400 mb-6">Manage multiple currencies with ease and flexibility</p>
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all">
            Open New Account
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-slate-900/50 border border-white/10 rounded-2xl p-8"
        >
          <p className="text-slate-400 mb-6">Complete your KYC verification to open multi-currency accounts</p>
          <Link to={createPageUrl('KYCVerification')} className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all">
            Complete Verification
          </Link>
        </motion.div>
      )}
    </div>
  );
}