import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Shield, DollarSign, MessageSquare, Lock, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('unread');
  const [notifications, setNotifications] = useState([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Refresh every 10 seconds
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      // Mock notifications - replace with your actual API call
      const notificationList = [];
      setNotifications(notificationList);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Mock update - replace with your actual API call
      console.log('Mark notification as read:', id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      // Mock update - replace with your actual API call
      const unreadNotifications = notifications.filter(n => !n.read);
      console.log('Mark all notifications as read:', unreadNotifications);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      // Mock delete - replace with your actual API call
      console.log('Delete notification:', id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const notificationIcons = {
    kyc_submission: Shield,
    kyc_approved: CheckCircle,
    kyc_rejected: AlertCircle,
    high_risk_transaction: DollarSign,
    support_request: MessageSquare,
    account_suspended: Lock,
    system_alert: AlertTriangle
  };

  const notificationColors = {
    kyc_submission: 'text-blue-400 bg-blue-500/10',
    kyc_approved: 'text-green-400 bg-green-500/10',
    kyc_rejected: 'text-red-400 bg-red-500/10',
    high_risk_transaction: 'text-amber-400 bg-amber-500/10',
    support_request: 'text-purple-400 bg-purple-500/10',
    account_suspended: 'text-red-400 bg-red-500/10',
    system_alert: 'text-orange-400 bg-orange-500/10'
  };

  const priorityColors = {
    low: 'border-slate-500/20',
    medium: 'border-blue-500/20',
    high: 'border-amber-500/20',
    critical: 'border-red-500/20 animate-pulse'
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
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
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-96 max-h-[600px] bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-400" />
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'unread'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredNotifications.map((notification) => {
                      const Icon = notificationIcons[notification.type] || Bell;
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer border-l-2 ${
                            priorityColors[notification.priority]
                          } ${!notification.read ? 'bg-slate-800/30' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-lg ${notificationColors[notification.type]} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              {notification.user_email && (
                                <p className="text-xs text-slate-500 mb-2">
                                  User: {notification.user_email}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                  {getTimeAgo(notification.created_date)}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-slate-500 hover:text-red-400 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {unreadCount > 0 && (
                <div className="p-3 border-t border-white/10">
                  <Button
                    onClick={markAllAsRead}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm"
                    disabled={isMarkingAll}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isMarkingAll ? 'Marking...' : 'Mark All as Read'}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}