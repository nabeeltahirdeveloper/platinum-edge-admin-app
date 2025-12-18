import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Lock, CheckCircle2, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';

export default function FlashExchange() {
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
    { icon: Zap, title: 'Lightning Fast', description: 'Execute trades in milliseconds' },
    { icon: Shield, title: 'Bank-Grade Security', description: 'Cold storage & 2FA protection' },
    { icon: TrendingUp, title: 'Best Rates', description: 'Competitive pricing guaranteed' },
    { icon: BarChart3, title: 'Advanced Charts', description: 'Professional trading tools' }
  ];

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$42,150', change: '+2.4%', color: 'from-orange-500 to-yellow-500' },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,250', change: '+1.8%', color: 'from-blue-500 to-purple-500' },
    { symbol: 'EUR', name: 'Euro', price: '$1.08', change: '-0.2%', color: 'from-green-500 to-emerald-500' },
    { symbol: 'GBP', name: 'Pound', price: '$1.26', change: '+0.5%', color: 'from-indigo-500 to-blue-500' }
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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
          <ArrowLeftRight className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-sm font-medium">Flash Exchange</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
          Trade Like a Pro
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Trade currencies and crypto with institutional-grade security and lightning-fast execution
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
              <p className="text-slate-400 text-sm">This is a preview. Complete your KYC verification to start trading with real funds.</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
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
          <h2 className="text-2xl font-bold text-white mb-6">Live Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${asset.color} rounded-xl flex items-center justify-center font-bold text-white text-sm`}>
                      {asset.symbol}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{asset.name}</h3>
                      <p className="text-slate-400 text-sm">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{asset.price}</p>
                    <p className={`text-sm font-medium ${asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change}
                    </p>
                  </div>
                </div>
                <button className={`w-full py-3 bg-gradient-to-r ${asset.color} text-white rounded-xl font-medium hover:shadow-lg transition-all`}>
                  Trade {asset.symbol}
                </button>
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
          <h3 className="text-2xl font-bold text-white mb-2">Trading Active</h3>
          <p className="text-slate-400 mb-6">Start trading currencies and crypto assets with full market access</p>
          <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all">
            Open Trading Terminal
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-slate-900/50 border border-white/10 rounded-2xl p-8"
        >
          <p className="text-slate-400 mb-6">Complete your KYC verification to access the trading platform</p>
          <Link to={createPageUrl('KYCVerification')} className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all">
            Complete Verification
          </Link>
        </motion.div>
      )}
    </div>
  );
}