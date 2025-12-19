
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, User, Shield, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { name: 'Admin Panel', path: 'AdminPanel', icon: Shield },
    { name: 'KYC Verification', path: 'KYCVerification', icon: Shield },
    { name: 'Profile', path: 'Profile', icon: User },
  ];

  // Hide layout for Login page
  if (currentPageName === 'Login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <style>{`
        :root {
          --primary: #6366f1;
          --primary-dark: #4f46e5;
          --secondary: #06b6d4;
          --accent: #f59e0b;
          --success: #10b981;
        }
      `}</style>
      
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <Link to={createPageUrl('AdminPanel')} className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Platinum Edge
                </h1>
                <p className="text-xs text-slate-400">Financial Ecosystem</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="hidden xl:block text-right min-w-[120px]">
                    <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/10 transition-all flex-shrink-0"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/30 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400 text-sm">
            <p>© 2024 Platinum Edge. All rights reserved.</p>
            <p className="mt-2 text-xs">Secure • Trusted • Innovative</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
