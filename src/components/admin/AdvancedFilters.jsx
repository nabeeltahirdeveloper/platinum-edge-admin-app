import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, CreditCard, Wallet, Building2, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedFilters({ filters, setFilters, onReset, isExpanded, setIsExpanded }) {
  const services = [
    { key: 'FlashCard', label: 'FlashCard', icon: CreditCard },
    { key: 'FlashPay', label: 'FlashPay', icon: Wallet },
    { key: 'FlashAccount', label: 'FlashAccount', icon: Building2 },
    { key: 'FlashExchange', label: 'FlashExchange', icon: ArrowLeftRight }
  ];

  const handleServiceToggle = (service) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const hasActiveFilters = () => {
    return filters.searchQuery || 
           filters.kycStatus !== 'all' || 
           filters.accountStatus !== 'all' ||
           filters.services.length > 0 ||
           filters.createdFrom ||
           filters.createdTo ||
           filters.notesQuery;
  };

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden mb-6">
      {/* Basic Search Bar */}
      <div className="p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="pl-11 bg-slate-800/50 border-white/10 text-white h-12"
            />
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${
              hasActiveFilters() 
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white border-0' 
                : 'bg-slate-800/50 border border-white/10 text-white hover:bg-slate-700'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            {hasActiveFilters() && (
              <span className="ml-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                {[
                  filters.kycStatus !== 'all',
                  filters.accountStatus !== 'all',
                  filters.services.length > 0,
                  filters.createdFrom,
                  filters.createdTo,
                  filters.notesQuery
                ].filter(Boolean).length}
              </span>
            )}
          </Button>
          {hasActiveFilters() && (
            <Button
              onClick={onReset}
              variant="outline"
              className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-slate-800/30"
          >
            <div className="p-6 space-y-6">
              {/* Row 1: KYC Status & Account Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">KYC Status</Label>
                  <Select value={filters.kycStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, kycStatus: value }))}>
                    <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                      <SelectValue placeholder="All KYC Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="all" className="text-white hover:bg-slate-700">All Status</SelectItem>
                      <SelectItem value="pending" className="text-white hover:bg-slate-700">Pending</SelectItem>
                      <SelectItem value="in_review" className="text-white hover:bg-slate-700">In Review</SelectItem>
                      <SelectItem value="verified" className="text-white hover:bg-slate-700">Verified</SelectItem>
                      <SelectItem value="rejected" className="text-white hover:bg-slate-700">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">Account Status</Label>
                  <Select value={filters.accountStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, accountStatus: value }))}>
                    <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                      <SelectValue placeholder="All Account Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="all" className="text-white hover:bg-slate-700">All Status</SelectItem>
                      <SelectItem value="active" className="text-white hover:bg-slate-700">Active</SelectItem>
                      <SelectItem value="suspended" className="text-white hover:bg-slate-700">Suspended</SelectItem>
                      <SelectItem value="closed" className="text-white hover:bg-slate-700">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Services */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-sm font-medium">Enabled Services</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {services.map(service => {
                    const Icon = service.icon;
                    const isSelected = filters.services.includes(service.key);
                    return (
                      <button
                        key={service.key}
                        onClick={() => handleServiceToggle(service.key)}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-indigo-500/20 border-indigo-500/40 shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-800/30 border-white/10 hover:border-indigo-500/30 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-indigo-500/30' : 'bg-slate-700/50'
                          }`}>
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {service.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Date Ranges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">Created From</Label>
                  <Input
                    type="date"
                    value={filters.createdFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, createdFrom: e.target.value }))}
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">Created To</Label>
                  <Input
                    type="date"
                    value={filters.createdTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, createdTo: e.target.value }))}
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Row 4: Notes Search */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium">Search in Notes</Label>
                <Input
                  placeholder="Search admin notes..."
                  value={filters.notesQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, notesQuery: e.target.value }))}
                  className="bg-slate-800/50 border-white/10 text-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}