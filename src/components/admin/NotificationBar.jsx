import React, { useState, useEffect } from 'react';
import { Bell, X, ChevronDown, ChevronUp, AlertTriangle, Shield, DollarSign, MessageSquare, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    // Mock - empty notifications for design only
    setNotifications([]);
  };

  const markAsRead = async (id) => {
    // Mock - just update local state
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissAll = async () => {
    setIsDismissing(true);
    // Mock - just update local state
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setIsDismissing(false);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const criticalNotifications = unreadNotifications.filter(n => n.priority === 'critical');
  const highNotifications = unreadNotifications.filter(n => n.priority === 'high');

  const notificationIcons = {
    kyc_submission: Shield,
    kyc_approved: CheckCircle,
    kyc_rejected: AlertCircle,
    high_risk_transaction: DollarSign,
    support_request: MessageSquare,
    account_suspended: Lock,
    system_alert: AlertTriangle
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className={`rounded-xl overflow-hidden backdrop-blur-xl ${
        unreadNotifications.length > 0 
          ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-l-4 border-indigo-500' 
          : 'bg-slate-800/50 border border-white/10'
      }`}>
        {/* Summary Bar */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 relative">
                <Bell className="w-6 h-6 text-white" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                {unreadNotifications.length > 0 ? (
                  <>
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      {unreadNotifications.length} Active Alert{unreadNotifications.length !== 1 ? 's' : ''}
                      {criticalNotifications.length > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          {criticalNotifications.length} CRITICAL
                        </span>
                      )}
                    </h3>
                    <div className="flex gap-4 mt-1">
                      {criticalNotifications.length > 0 && (
                        <span className="text-sm text-red-300">
                          {criticalNotifications.length} Critical
                        </span>
                      )}
                      {highNotifications.length > 0 && (
                        <span className="text-sm text-amber-300">
                          {highNotifications.length} High Priority
                        </span>
                      )}
                      <span className="text-sm text-slate-300">
                        {unreadNotifications.length - criticalNotifications.length - highNotifications.length} Other
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-white font-semibold text-lg">All Clear</h3>
                    <p className="text-sm text-slate-400 mt-1">No active notifications</p>
                  </>
                )}
              </div>
            </div>

            {unreadNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={dismissAll}
                  disabled={isDismissing}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl"
                >
                  {isDismissing ? 'Dismissing...' : 'Dismiss All'}
                </Button>
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      View All
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Notifications */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl"
            >
              <div className="max-h-96 overflow-y-auto">
                {unreadNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Bell;
                  return (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.action_url) {
                          window.location.href = notification.action_url;
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          notification.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                          notification.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-white">
                              {notification.title}
                            </h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              notification.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                              notification.priority === 'high' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-1">
                            {notification.message}
                          </p>
                          {notification.user_email && (
                            <p className="text-xs text-slate-400 mb-1">
                              User: {notification.user_email}
                            </p>
                          )}
                          <span className="text-xs text-slate-500">
                            {getTimeAgo(notification.created_date)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}