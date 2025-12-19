import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, Lock, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPageUrl } from '../utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === 'demo@platinum-edge.ca' && password === 'demo123!') {
      // Store demo token for authentication
      localStorage.setItem('token', 'demo-token-' + Date.now());
      localStorage.setItem('demoUser', JSON.stringify({
        email: 'demo@platinum-edge.ca',
        role: 'admin',
        full_name: 'Demo Admin User'
      }));
      window.location.href = createPageUrl('AdminPanel');
    } else {
      setError('Invalid credentials. Use demo@platinum-edge.ca / demo123!');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@platinum-edge.ca');
    setPassword('demo123!');
  };

  const features = [
    { icon: Shield, text: 'Bank-level encryption' },
    { icon: Zap, text: 'Instant access' },
    { icon: Globe, text: 'Global platform' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Platinum Edge Technologies
              </h1>
              <p className="text-slate-400">Financial Ecosystem Platform</p>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Your Gateway to
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Premium Finance
            </span>
          </h2>

          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Access four powerful platforms unified in one secure ecosystem. 
            Cards, payments, banking, and exchange - all at your fingertips.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-slate-300">{feature.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Platinum Edge Technologies
                </h1>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
            <p className="text-slate-400 mb-8">Sign in to access the admin panel</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-11 bg-slate-800/50 border-white/10 text-white h-12 focus:border-indigo-500/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-11 bg-slate-800/50 border-white/10 text-white h-12 focus:border-indigo-500/50"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold h-12 rounded-xl shadow-lg shadow-indigo-500/30 group"
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                onClick={handleDemoLogin}
                className="w-full text-center text-sm text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Try Demo Account →
              </button>
            </div>
          </div>

          {/* Demo Credentials Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 backdrop-blur-xl"
          >
            <p className="text-sm text-indigo-300 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-400 font-mono">demo@platinum-edge.ca</p>
            <p className="text-xs text-slate-400 font-mono">demo123!</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
