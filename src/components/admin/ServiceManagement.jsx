import React, { useState } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Wallet, Building2, ArrowLeftRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceManagement({ user, isAdmin, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const services = [
    { 
      key: 'FlashCard', 
      name: 'Flash Card', 
      icon: CreditCard, 
      color: 'from-purple-500 to-pink-500',
      description: 'Virtual and physical cards'
    },
    { 
      key: 'FlashPay', 
      name: 'FlashPay', 
      icon: Wallet, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Payment gateway solution'
    },
    { 
      key: 'FlashAccount', 
      name: 'Flash Account', 
      icon: Building2, 
      color: 'from-green-500 to-emerald-500',
      description: 'Modern banking'
    },
    { 
      key: 'FlashExchange', 
      name: 'Flash Exchange', 
      icon: ArrowLeftRight, 
      color: 'from-amber-500 to-orange-500',
      description: 'Currency and crypto trading'
    }
  ];

  const handleToggleService = async (serviceKey, currentStatus) => {
    if (!isAdmin) return;
    
    setUpdating(true);
    try {
      const newEnabledServices = {
        ...(user.enabled_services || {}),
        [serviceKey]: !currentStatus
      };
      
      await onUpdate({ enabled_services: newEnabledServices });
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never accessed';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Service Access</span>
          {isAdmin && (
            <span className="text-sm text-indigo-400 font-normal">Admin Controls</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isEnabled = user?.enabled_services?.[service.key] || false;
          const firstAccessDate = user?.service_access_dates?.[service.key];

          return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border ${
                isEnabled ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/10 bg-slate-800/30'
              } p-4 transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold">{service.name}</h4>
                  <p className="text-sm text-slate-400">{service.description}</p>
                  {firstAccessDate && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <p className="text-xs text-slate-500">
                        First accessed: {formatDate(firstAccessDate)}
                      </p>
                    </div>
                  )}
                </div>

                {isAdmin ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-xs text-slate-400">
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggleService(service.key, isEnabled)}
                      disabled={updating}
                      className="data-[state=checked]:bg-indigo-500"
                    />
                  </div>
                ) : (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isEnabled 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/20'
                  }`}>
                    {isEnabled ? 'Active' : 'Inactive'}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </div>
  );
}