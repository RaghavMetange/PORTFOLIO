'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, Send, Sparkles, MessageSquare, Shield } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { sound } from '@/lib/sound';

interface ContactSectionProps {
  onOpenAdminModal: () => void;
  onOpenVisitorModal: () => void;
  visitorName?: string;
}

export default function ContactSection({
  onOpenAdminModal,
  onOpenVisitorModal,
  visitorName,
}: ContactSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState(visitorName || '');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    sound.playClick();

    try {
      // Send note and email directly to tracking telemetry & Resend
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || visitorName || 'Anonymous Visitor',
          email: email.trim() || undefined,
          notes: message.trim(),
          page: '#contact',
        }),
      });

      sound.playSuccess();
      setSent(true);
      setMessage('');
    } catch {
      // Handled
    } finally {
      setSending(false);
    }
  };

  return (
    <footer id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
          Let&apos;s Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Something Bold</span>
        </h2>
        <p className="text-sm text-gray-400">
          Open for Summer 2027 SWE Internships, systems programming collaborations, or deep tech discussions.
        </p>
      </div>

      {/* Organic Curved Contact Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
        {/* Left Column: Direct channels */}
        <div className="lg:col-span-5 p-8 organic-card-1 bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Direct Transmission</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Whether you are a recruiter reviewing my 5th-semester work, an open-source contributor, or an engineer, my inbox is always open.
            </p>

            {/* Email pill */}
            <div className="pt-2">
              <span className="text-xs font-mono text-gray-400 block mb-1.5 uppercase">Primary Email:</span>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 text-cyan-300 font-mono text-xs sm:text-sm">
                <span className="truncate mr-2">{PERSONAL_INFO.socials.email}</span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div className="pt-6 border-t border-white/10">
            <span className="text-xs font-mono text-gray-400 block mb-3 uppercase">Social Profiles:</span>
            <div className="flex items-center space-x-3">
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenVisitorModal();
                }}
                className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors flex items-center space-x-2 text-xs font-mono"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Guest Pass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Message Box (Sends straight to host telemetry) */}
        <div className="lg:col-span-7 p-8 organic-card-2 bg-gradient-to-br from-indigo-950/20 via-[#0b0e20] to-[#070914] border border-cyan-500/30 backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Instant Message to Raghav</h3>
              <p className="text-xs text-gray-400">Recorded instantly on my host telemetry dashboard</p>
            </div>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white">Transmission Delivered!</h4>
              <p className="text-xs text-gray-300 max-w-sm mx-auto">
                Thank you! Your note has been logged directly to my host dashboard. I will reply to you shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-cyan-400 underline pt-2 cursor-pointer"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5">
                  Your Name or Entity
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex (Meta) or Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Say hello, share feedback on my systems projects, or discuss internship opportunities..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>{sending ? 'Transmitting...' : 'Dispatch Message to Raghav'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>
          © 2026 Raghav • CSE 3rd Year (Sem 5) • Department of Computer Science & Engineering.
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdminModal();
            }}
            className="flex items-center space-x-1 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Press Ctrl+Shift+A"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span>Host Admin Portal</span>
          </button>
          <span>•</span>
          <span className="font-mono text-[10px]">Built with Next.js 16 & Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
