'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Mail, MessageSquare, X, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/sound';

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorName: string;
  onUpdateName: (name: string, notes?: string, email?: string) => void;
}

export default function VisitorModal({
  isOpen,
  onClose,
  visitorName,
  onUpdateName,
}: VisitorModalProps) {
  const [nameInput, setNameInput] = useState(visitorName || '');
  const [emailInput, setEmailInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const [prevVisitorName, setPrevVisitorName] = useState(visitorName);
  if (visitorName !== prevVisitorName) {
    setPrevVisitorName(visitorName);
    if (visitorName && visitorName !== 'Anonymous Visitor') {
      setNameInput(visitorName);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setSubmitting(true);
    sound.playClick();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981'],
      });
      sound.playSuccess();
    } catch {
      // Ignored if confetti fails
    }

    await onUpdateName(nameInput.trim(), notesInput.trim(), emailInput.trim());
    setClaimed(true);
    setSubmitting(false);

    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0d1021]/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-white overflow-hidden z-10"
          >
            {/* Top decorative glow beam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            
            {/* Close button */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {claimed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-3"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Visitor Pass Generated!</h3>
                <p className="text-sm text-gray-300">
                  Welcome to my portfolio, <span className="text-cyan-300 font-semibold">{nameInput}</span>!
                </p>
                <p className="text-xs text-gray-400">
                  Your visit has been recorded in the host logbook.
                </p>
              </motion.div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Interactive Guestbook</span>
                    <h3 className="text-xl font-bold tracking-tight">Introduce Yourself</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  I love seeing who visits my work! Drop your name or role (e.g. recruiter, developer, peer), and leave your mark on my host visit log.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5">
                      Your Name or Role *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Sarah Chen (Google Recruiter) or Alex"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5">
                      Your Email Address (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. alex@company.com or your email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5">
                      Quick Note or Message (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        rows={2}
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="Say hello or mention what caught your eye..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 mr-1.5 flex-shrink-0" />
                    <span>Your session & IP are logged privately for the host only.</span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      disabled={submitting || !nameInput.trim()}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-medium text-sm text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                    >
                      <span>{submitting ? 'Minting Pass...' : 'Claim Pass & Leave Mark'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onClose();
                      }}
                      className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Explore as Guest
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
