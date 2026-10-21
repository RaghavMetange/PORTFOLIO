'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Mail,
  FileText,
} from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons';
import { sound } from '@/lib/sound';

interface HeroSectionProps {
  onOpenVisitorModal: () => void;
  onOpenResumeModal: () => void;
  visitorName?: string;
  isNamed?: boolean;
}

export default function HeroSection({
  onOpenVisitorModal,
  onOpenResumeModal,
  visitorName,
  isNamed,
}: HeroSectionProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[95vh] pt-28 sm:pt-36 pb-16 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background radial gradient aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Column: Raghav's Photo along with his name & Asymmetrical Typography */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Photo directly along with Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
          >
            {/* Raghav's Photo Frame */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden p-[2.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-black/60 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/raghav-profile.jpg"
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              {/* Online pulse dot */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#05060b] flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse border-2 border-[#05060b]" />
              </div>
            </div>

            {/* Status Pill & Name */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  3rd Year Undergrad • Semester 5
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                {PERSONAL_INFO.name}
              </h1>
            </div>
          </motion.div>

          {/* Holographic Subtitle Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 text-glow-cyan">
                Engineering Intelligent Systems
              </span>{' '}
              <br />
              &amp; Fluid Interfaces.
            </h2>
          </motion.div>

          {/* Dynamic CSE 5th Sem Description with Symbiosis & Current Focus */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed"
          >
            Undergraduate student at <span className="text-white font-semibold">{PERSONAL_INFO.college}</span>. Currently building a <span className="text-cyan-300 font-medium">Multilingual Fake News Detector</span> and a <span className="text-indigo-300 font-medium">FinTech Stock Market Simulator &amp; Portfolio Manager</span>.
          </motion.p>

          {/* Personalized Visitor Banner */}
          {isNamed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center space-x-3 text-xs text-cyan-200"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Personalized pass active for <strong className="text-white">{visitorName}</strong>. Your visit is authenticated in host logs!
              </span>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3.5 pt-2"
          >
            <a
              href="#projects"
              onClick={() => sound.playClick()}
              className="group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-semibold text-sm text-white shadow-xl shadow-cyan-500/25 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* View Resume Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenResumeModal();
              }}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-400/40 hover:border-indigo-400 font-semibold text-sm text-indigo-200 flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-indigo-500/15"
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              <span>View Resume</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenVisitorModal();
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-cyan-400/30 hover:border-cyan-400 font-medium text-sm text-cyan-300 flex items-center space-x-2 transition-all cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isNamed ? 'Update Pass' : 'Introduce'}</span>
            </button>

            <a
              href="#terminal"
              onClick={() => sound.playClick()}
              className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white flex items-center transition-colors"
              title="Open Interactive Shell"
            >
              <Terminal className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center space-x-4 pt-2 text-gray-400 text-xs"
          >
            <span className="font-mono text-gray-500 uppercase tracking-wider">Connect:</span>
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.socials.email}`}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Holographic Asymmetrical Developer HUD (Organic 3D Tilt Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          {/* Asymmetric Holographic Glass Card */}
          <div
            style={{
              transform: `perspective(1000px) rotateX(${mousePos.y * -12}deg) rotateY(${mousePos.x * 12}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative organic-card-1 p-6 sm:p-7 bg-gradient-to-b from-[#13162a]/80 to-[#0a0d1b]/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] space-y-5"
          >
            {/* Top decorative gradient edge */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500" />

            {/* Terminal Window Header with Photo Avatar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/50 shadow-sm shadow-cyan-500/30 flex-shrink-0 bg-black/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/raghav-profile.jpg"
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-mono text-gray-300 font-semibold block leading-tight">
                    raghav@symbiosis-cse
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 block">Semester 5 Core</span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-cyan-300 border border-white/5">
                SRC Treasurer
              </span>
            </div>

            {/* Live System Profile Status */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-500">Institution:</span>
                <span className="text-cyan-300 font-semibold truncate max-w-[190px]">Symbiosis Inst. of Tech</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-500">CGPA:</span>
                <span className="text-emerald-400 font-semibold">7.5 / 10.0</span>
              </div>
              <div className="flex items-start justify-between text-gray-300 gap-2">
                <span className="text-gray-500 flex-shrink-0">Current Focus:</span>
                <span className="text-white text-right text-[11px] leading-tight font-medium text-cyan-200">
                  Multilingual Fake News Detector &amp; FinTech Stock Market Simulator &amp; Portfolio Manager
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-500">Primary Stack:</span>
                <span className="text-indigo-300">Python • Streamlit • SQL • C++</span>
              </div>
            </div>

            {/* Quick Live Indicators (200+ Solved & Status) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">QUESTIONS SOLVED</span>
                <span className="text-sm font-bold text-cyan-300">200+ Solved</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">STATUS</span>
                <span className="text-sm font-bold text-emerald-400">Seeking 2027 Intern</span>
              </div>
            </div>
          </div>

          {/* Floating decorative tech orb badges around the card */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 px-3 py-1.5 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 shadow-lg shadow-cyan-500/20 backdrop-blur-md flex items-center space-x-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Python &amp; ML</span>
          </motion.div>

          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-2xl bg-indigo-950/80 border border-indigo-400/40 text-[11px] font-mono text-indigo-300 shadow-lg shadow-indigo-500/20 backdrop-blur-md flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>FinTech &amp; NLP</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Asymmetric Bottom Metrics Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl w-full mx-auto mt-16 p-5 sm:p-6 organic-card-2 bg-white/[0.02] border border-white/10 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left"
      >
        {PERSONAL_INFO.stats.map((stat) => (
          <div key={stat.label} className="space-y-0.5">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              {stat.label}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              {stat.value}
            </div>
            <span className="text-[11px] text-cyan-400/90 block">{stat.detail}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
