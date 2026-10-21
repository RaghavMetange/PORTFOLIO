'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Shield,
  X,
  Search,
  Download,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Globe,
  Monitor,
  Smartphone,
  Eye,
  UserCheck,
  PlusCircle,
  Mail,
} from 'lucide-react';
import { VisitorLog } from '@/types';
import { sound } from '@/lib/sound';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [stats, setStats] = useState<{
    totalVisits: number;
    uniqueVisitors: number;
    namedVisitors: number;
    last24hCount: number;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'named' | 'anon'>('all');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorLog | null>(null);
  const [testingResend, setTestingResend] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleTestResend = async () => {
    setTestingResend(true);
    setResendStatus(null);
    sound.playClick();
    try {
      const res = await fetch('/api/admin/resend-test', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        sound.playSuccess();
        setResendStatus('Resend Alert dispatched successfully to raghavmetange14@gmail.com!');
      } else {
        setResendStatus(data.error || 'Resend dispatch failed');
      }
    } catch {
      setResendStatus('Failed to send test email');
    } finally {
      setTestingResend(false);
      setTimeout(() => setResendStatus(null), 6000);
    }
  };

  const fetchVisitorData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/visitors');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setIsAuthenticated(true);
          setVisitors(json.data.visitors);
          setStats(json.data.stats);
        }
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check existing session or load visitors on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;
    fetch('/api/admin/visitors')
      .then((res) => {
        if (!isSubscribed) return null;
        if (res.ok) return res.json();
        if (res.status === 401) {
          setIsAuthenticated(false);
        }
        return null;
      })
      .then((json) => {
        if (!isSubscribed || !json?.success) return;
        setIsAuthenticated(true);
        setVisitors(json.data.visitors);
        setStats(json.data.stats);
      })
      .catch(() => {
        if (isSubscribed) {
          setIsAuthenticated(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    sound.playClick();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playSuccess();
        setIsAuthenticated(true);
        setPassword('');
        fetchVisitorData();
      } else {
        setErrorMsg(data.error || 'Invalid passcode. Default is "cse2026"');
      }
    } catch {
      setErrorMsg('Authentication request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    await fetch('/api/admin/login', { method: 'DELETE' });
    setIsAuthenticated(false);
    setVisitors([]);
  };

  const handleCopyIp = (ip: string) => {
    sound.playClick();
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleDeleteVisitor = async (id: string) => {
    if (!confirm('Remove this visitor log entry?')) return;
    sound.playClick();
    try {
      const res = await fetch(`/api/admin/visitors?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVisitors((prev) => prev.filter((v) => v.id !== id));
        if (selectedVisitor?.id === id) setSelectedVisitor(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear ALL visitor logs? This cannot be undone.')) return;
    sound.playClick();
    try {
      const res = await fetch('/api/admin/visitors', { method: 'DELETE' });
      if (res.ok) {
        setVisitors([]);
        setSelectedVisitor(null);
        if (stats) setStats({ ...stats, totalVisits: 0, uniqueVisitors: 0, namedVisitors: 0, last24hCount: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSimulatedVisitor = async () => {
    sound.playClick();
    try {
      const mockNames = ['Alex Morgan (Meta Recruiter)', 'Vikram Malhotra (Lead SWE)', 'Elena Rostova (OpenAI)', 'Devansh K. (Alum)'];
      const mockCities = ['San Francisco', 'Bengaluru', 'London', 'Seattle', 'New York'];
      const mockName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const mockCity = mockCities[Math.floor(Math.random() * mockCities.length)];

      const res = await fetch('/api/admin/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mockName,
          city: mockCity,
          country: 'United States',
          notes: 'Simulated portfolio reviewer interested in systems role',
        }),
      });

      if (res.ok) {
        sound.playSuccess();
        fetchVisitorData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ip.includes(searchQuery) ||
      (v.city && v.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.country && v.country.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterType === 'named') return matchesSearch && v.isNamed;
    if (filterType === 'anon') return matchesSearch && !v.isNamed;
    return matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            className="relative w-full max-w-5xl h-[88vh] flex flex-col rounded-3xl bg-[#090b16] border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.2)] text-white overflow-hidden z-10"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base tracking-wide">Host Telemetry & Visitor Audit</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      ADMIN ONLY
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Confidential IP addresses & names of visitors to your portfolio
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  >
                    Lock Session
                  </button>
                )}
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isAuthenticated ? (
              /* Login Form */
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Owner Authentication</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Enter your admin passcode to decrypt and view IP addresses & visitor records.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin passcode (default: cse2026)"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 transition-all text-center tracking-widest"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-rose-400 bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !password}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'Authenticating...' : 'Unlock Host Dashboard'}
                    </button>
                  </form>

                  <div className="text-[11px] text-gray-500 font-mono">
                    🔑 Default Passcode: <span className="text-cyan-400">cse2026</span> (Changeable in .env)
                  </div>
                </div>
              </div>
            ) : (
              /* Authenticated Dashboard View */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Stats ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 border-b border-white/10 bg-white/[0.01]">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] font-mono text-gray-400">TOTAL VISITS</span>
                    <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {stats?.totalVisits || visitors.reduce((a, c) => a + c.visitCount, 0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] font-mono text-cyan-400">UNIQUE IP VISITORS</span>
                    <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-0.5">
                      {visitors.length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] font-mono text-emerald-400">IDENTIFIED NAMES</span>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5">
                      {visitors.filter((v) => v.isNamed).length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] font-mono text-indigo-400">ACTIVE IN 24H</span>
                    <div className="text-xl sm:text-2xl font-bold text-indigo-300 mt-0.5">
                      {stats?.last24hCount || 0}
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-white/10 bg-black/20">
                  <div className="flex items-center space-x-2 flex-1 max-w-sm">
                    <div className="relative w-full">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, IP, or city..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg text-xs">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      All ({visitors.length})
                    </button>
                    <button
                      onClick={() => setFilterType('named')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        filterType === 'named' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Named ({visitors.filter((v) => v.isNamed).length})
                    </button>
                    <button
                      onClick={() => setFilterType('anon')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        filterType === 'anon' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Anonymous
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleTestResend}
                      disabled={testingResend}
                      title="Dispatch test visitor email via Resend"
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs border border-emerald-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{testingResend ? 'Sending...' : 'Test Resend'}</span>
                    </button>

                    <button
                      onClick={handleAddSimulatedVisitor}
                      title="Add a test visitor to verify tracking"
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs border border-indigo-500/30 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Test Log</span>
                    </button>

                    <a
                      href="/api/admin/export?format=csv"
                      download
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs border border-cyan-500/30 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </a>

                    <button
                      onClick={fetchVisitorData}
                      title="Refresh Logs"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={handleClearAll}
                      title="Clear All Logs"
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Resend Status Banner */}
                {resendStatus && (
                  <div
                    className={`px-6 py-2 text-xs font-mono border-b flex items-center justify-between ${
                      resendStatus.includes('successfully')
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{resendStatus}</span>
                    </div>
                    <button
                      onClick={() => setResendStatus(null)}
                      className="text-gray-400 hover:text-white ml-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Visitor Log Table */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                  {filteredVisitors.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 space-y-2">
                      <Eye className="w-8 h-8 mx-auto text-gray-600" />
                      <p className="text-sm">No visitor records matching your search.</p>
                    </div>
                  ) : (
                    filteredVisitors.map((visitor) => (
                      <div
                        key={visitor.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          visitor.isNamed
                            ? 'bg-gradient-to-r from-cyan-950/20 to-indigo-950/20 border-cyan-500/30 hover:border-cyan-400/50'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          {/* Left: Name and Location */}
                          <div className="flex items-start space-x-3.5">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                visitor.isNamed
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                  : 'bg-white/10 text-gray-400'
                              }`}
                            >
                              {visitor.isNamed ? <UserCheck className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-white">
                                  {visitor.name}
                                </span>
                                {visitor.isNamed && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                                    VERIFIED GUEST
                                  </span>
                                )}
                              </div>

                              {visitor.email && (
                                <div className="flex items-center space-x-1.5 text-xs text-cyan-300 font-mono mt-0.5">
                                  <Mail className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                  <span className="truncate">{visitor.email}</span>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
                                <span className="flex items-center">
                                  <Globe className="w-3 h-3 mr-1 text-gray-500" />
                                  {visitor.city || 'Unknown City'}, {visitor.country || 'Unknown'}
                                </span>
                                <span className="flex items-center">
                                  {visitor.deviceType === 'mobile' ? (
                                    <Smartphone className="w-3 h-3 mr-1 text-gray-500" />
                                  ) : (
                                    <Monitor className="w-3 h-3 mr-1 text-gray-500" />
                                  )}
                                  {visitor.browser} on {visitor.os}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Center: IP Address Box */}
                          <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs text-cyan-300">
                            <span className="text-gray-400 text-[10px]">IP:</span>
                            <span>{visitor.ip}</span>
                            <button
                              onClick={() => handleCopyIp(visitor.ip)}
                              className="text-gray-400 hover:text-white transition-colors ml-1 p-0.5"
                              title="Copy IP"
                            >
                              {copiedIp === visitor.ip ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Right: Visits & Timestamps */}
                          <div className="flex items-center justify-between md:justify-end space-x-4 text-xs text-gray-400">
                            <div className="text-right">
                              <span className="block font-medium text-white">
                                {visitor.visitCount} {visitor.visitCount === 1 ? 'Visit' : 'Visits'}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {new Date(visitor.lastActiveAt).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteVisitor(visitor.id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Optional Notes / Message left by visitor */}
                        {visitor.notes && (
                          <div className="mt-2.5 pt-2 border-t border-white/5 text-xs text-cyan-200/90 bg-cyan-950/20 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                            <span className="text-gray-400 font-mono text-[10px]">NOTE:</span>
                            <span>&ldquo;{visitor.notes}&rdquo;</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
