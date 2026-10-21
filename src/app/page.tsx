'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import InteractiveTerminal from '@/components/InteractiveTerminal';
import ContactSection from '@/components/ContactSection';
import VisitorModal from '@/components/VisitorModal';
import AdminModal from '@/components/AdminModal';
import ResumeModal from '@/components/ResumeModal';
import { sound } from '@/lib/sound';

export default function Home() {
  const [visitorModalOpen, setVisitorModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState<string>('');
  const [isNamed, setIsNamed] = useState(false);
  const [visitorId, setVisitorId] = useState<string>('');
  const [showFloatingPassPrompt, setShowFloatingPassPrompt] = useState(false);

  // Initialize tracking on mount
  useEffect(() => {
    // 1. Get or create unique visitorId
    let storedId = localStorage.getItem('portfolio_visitor_id');
    if (!storedId) {
      storedId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      localStorage.setItem('portfolio_visitor_id', storedId);
    }

    // 2. Check if name and email were previously saved
    const storedName = localStorage.getItem('portfolio_visitor_name') || '';
    const storedEmail = localStorage.getItem('portfolio_visitor_email') || '';

    // 3. Send automatic tracking ping
    const trackVisit = async () => {
      setVisitorId(storedId);
      if (storedName && storedName !== 'Anonymous Visitor') {
        setVisitorName(storedName);
        setIsNamed(true);
      }

      try {
        const res = await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: storedId,
            name: storedName || undefined,
            email: storedEmail || undefined,
            page: window.location.pathname,
            screenResolution: `${window.innerWidth}x${window.innerHeight}`,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.visitor) {
            if (data.visitor.isNamed && data.visitor.name) {
              setVisitorName(data.visitor.name);
              setIsNamed(true);
            }
          }
        }
      } catch (err) {
        console.error('Initial tracking failed:', err);
      }
    };

    trackVisit();

    // 4. Show non-intrusive floating pass invitation after 3 seconds if not named
    const timer = setTimeout(() => {
      if (!storedName || storedName === 'Anonymous Visitor') {
        setShowFloatingPassPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateName = async (newName: string, notes?: string, email?: string) => {
    setVisitorName(newName);
    setIsNamed(true);
    localStorage.setItem('portfolio_visitor_name', newName);
    if (email) {
      localStorage.setItem('portfolio_visitor_email', email);
    }
    setShowFloatingPassPrompt(false);

    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          name: newName,
          email,
          notes,
          page: window.location.pathname,
        }),
      });
    } catch (err) {
      console.error('Failed to update visitor name:', err);
    }
  };

  return (
    <main className="relative min-h-screen text-white bg-[#05060b] selection:bg-cyan-500 selection:text-black">
      {/* Background Interactive Particles & Ambient Light Mesh */}
      <BackgroundCanvas />

      {/* Desktop Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Top Floating Glass Navigation */}
      <Navbar
        onOpenVisitorModal={() => setVisitorModalOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        onOpenResumeModal={() => setResumeModalOpen(true)}
        visitorName={visitorName}
        isNamed={isNamed}
      />

      {/* Main Sections */}
      <div className="relative z-10 flex flex-col space-y-16 sm:space-y-24">
        <HeroSection
          onOpenVisitorModal={() => setVisitorModalOpen(true)}
          onOpenResumeModal={() => setResumeModalOpen(true)}
          visitorName={visitorName}
          isNamed={isNamed}
        />

        <AboutSection />

        <ProjectsSection />

        <SkillsSection />

        <InteractiveTerminal
          visitorName={visitorName}
          isNamed={isNamed}
          onOpenAdminModal={() => setAdminModalOpen(true)}
          onOpenVisitorModal={() => setVisitorModalOpen(true)}
          onOpenResumeModal={() => setResumeModalOpen(true)}
        />

        <ContactSection
          onOpenAdminModal={() => setAdminModalOpen(true)}
          onOpenVisitorModal={() => setVisitorModalOpen(true)}
          visitorName={visitorName}
        />
      </div>

      {/* Floating Guest Pass Prompt (Bottom Right) */}
      <AnimatePresence>
        {showFloatingPassPrompt && !isNamed && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 max-w-xs p-4 rounded-2xl bg-[#0b0e20]/90 border border-cyan-500/40 backdrop-blur-xl shadow-[0_10px_35px_rgba(6,182,212,0.25)] flex items-start space-x-3"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-white block">Visiting as Guest?</span>
                <span className="text-gray-300 text-[11px] leading-tight block">
                  Introduce yourself to customize greetings & leave your mark in host logs.
                </span>
              </div>
              <div className="flex items-center space-x-2 pt-0.5">
                <button
                  onClick={() => {
                    sound.playClick();
                    setVisitorModalOpen(true);
                    setShowFloatingPassPrompt(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Introduce
                </button>
                <button
                  onClick={() => setShowFloatingPassPrompt(false)}
                  className="px-2 py-1.5 text-gray-400 hover:text-white text-[11px] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visitor / Guest Pass Modal */}
      <VisitorModal
        isOpen={visitorModalOpen}
        onClose={() => setVisitorModalOpen(false)}
        visitorName={visitorName}
        onUpdateName={handleUpdateName}
      />

      {/* Interactive Curriculum Vitae / Resume Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />

      {/* Confidential Host Telemetry / Admin Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </main>
  );
}
