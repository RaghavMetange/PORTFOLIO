'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Award } from 'lucide-react';
import { SEMESTER_JOURNEY, PERSONAL_INFO } from '@/data/portfolioData';
import { sound } from '@/lib/sound';

export default function AboutSection() {
  const [activeSemIndex, setActiveSemIndex] = useState(0);
  const activeMilestone = SEMESTER_JOURNEY[activeSemIndex];

  return (
    <section id="journey" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic & Systems Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Semester 5 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Milestone Track</span>
          </h2>
        </div>
        <p className="text-sm text-gray-400 max-w-md">
          How 5 semesters of rigorous CS theory, systems programming, and sleepless hackathon sprints shaped my engineering foundation.
        </p>
      </div>

      {/* Interactive Semester Selector Pills */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {SEMESTER_JOURNEY.map((item, index) => {
          const isActive = index === activeSemIndex;
          return (
            <button
              key={item.semester}
              onClick={() => {
                sound.playClick();
                setActiveSemIndex(index);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-lg shadow-cyan-500/20 border border-cyan-400/50 scale-[1.02]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {item.status === 'in-progress' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{item.semester}</span>
            </button>
          );
        })}
      </div>

      {/* Asymmetric Milestone Detail Display */}
      <motion.div
        key={activeMilestone.semester}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Main Details Card */}
        <div className="lg:col-span-8 p-6 sm:p-8 organic-card-1 bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                {activeMilestone.year} • {activeMilestone.period}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">{activeMilestone.semester}</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono ${
                activeMilestone.status === 'in-progress'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
              }`}
            >
              {activeMilestone.status === 'in-progress' ? '⚡ CURRENT TERM' : 'COMPLETED'}
            </span>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Core Technical Breakthroughs
            </h4>
            <div className="space-y-2.5">
              {activeMilestone.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm text-gray-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Subjects Grid */}
          <div>
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2.5">
              Targeted Curriculum Subjects
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeMilestone.coreSubjects.map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Side Highlight Card */}
        <div className="lg:col-span-4 p-6 sm:p-7 organic-card-2 bg-gradient-to-b from-indigo-950/30 to-[#0e1124] border border-indigo-500/30 backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                Flagship Milestone Project
              </span>
              <h4 className="text-lg font-bold text-white mt-1">{activeMilestone.keyProject}</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Synthesizing theoretical semester concepts directly into low-overhead, production-grade code.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span>ACADEMIC CGPA</span>
              <span className="text-emerald-400 font-bold">{PERSONAL_INFO.cgpa}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full w-[75%]" />
            </div>
            <span className="text-[10px] text-gray-500 font-mono block">Symbiosis Institute of Technology</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
