'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Lock,
  Sparkles,
  Menu,
  X,
  FileText,
  User,
} from 'lucide-react';
import { sound } from '@/lib/sound';

interface NavbarProps {
  onOpenVisitorModal: () => void;
  onOpenAdminModal: () => void;
  onOpenResumeModal: () => void;
  visitorName?: string;
  isNamed?: boolean;
}

export default function Navbar({
  onOpenVisitorModal,
  onOpenAdminModal,
  onOpenResumeModal,
  visitorName,
  isNamed,
}: NavbarProps) {
  const [isMuted, setIsMuted] = useState(() => (typeof window !== 'undefined' ? sound.getMuted() : false));
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Secret shortcut: Ctrl + Shift + A to open Admin modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        onOpenAdminModal();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenAdminModal]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const navLinks = [
    { label: 'Journey', href: '#journey' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Terminal', href: '#terminal' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-4 transition-all duration-300">
      <div
        className={`max-w-6xl mx-auto rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 flex items-center justify-between border ${
          scrolled
            ? 'bg-[#080a14]/80 backdrop-blur-xl border-cyan-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
            : 'bg-white/[0.03] backdrop-blur-md border-white/10'
        }`}
      >
        {/* Left: Brand logo & secret admin trigger */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdminModal();
            }}
            title="Double-click or press Ctrl+Shift+A for Admin Telemetry"
            className="group flex items-center space-x-2 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="font-mono text-xs font-black">RM</span>
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold tracking-wider text-white">RAGHAV METANGE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-gray-400 block -mt-0.5">CSE • SYMBIOSIS</span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Nav items */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/[0.04] px-3 py-1 rounded-full border border-white/5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => sound.playHover()}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions (Resume, Visitor Pass, Audio, Admin, Mobile Toggle) */}
        <div className="flex items-center space-x-2">
          {/* Resume Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenResumeModal();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-all cursor-pointer shadow-sm shadow-indigo-500/20"
            title="View Raghav's Resume"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Resume</span>
          </button>

          {/* Visitor Pass Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenVisitorModal();
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              isNamed
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
            }`}
          >
            {isNamed ? (
              <>
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[90px] sm:max-w-[120px] truncate">
                  {visitorName}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guest Pass</span>
              </>
            )}
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
            title={isMuted ? 'Sound FX Off' : 'Sound FX On'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Admin Lock Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdminModal();
            }}
            aria-label="Admin Portal"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-300 border border-white/5 transition-colors cursor-pointer"
            title="Owner Dashboard (Ctrl+Shift+A)"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-full bg-white/5 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 p-4 rounded-2xl bg-[#090b16]/95 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl space-y-2 text-white"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onOpenResumeModal();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-indigo-300 hover:bg-white/5 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Resume</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
