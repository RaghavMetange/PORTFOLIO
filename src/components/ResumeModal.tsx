'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Mail, Phone, MapPin, Briefcase, GraduationCap, Code2, Award } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '@/data/portfolioData';
import { sound } from '@/lib/sound';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090b16] border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.2)] text-white overflow-hidden z-10"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
                  Curriculum Vitae
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-300">Raghav Metange</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Resume Body (Print-Optimized) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 print:p-0 print:bg-white print:text-black">
              {/* Header */}
              <div className="border-b border-white/10 pb-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-cyan-400/50 shadow-md flex-shrink-0 bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/raghav-profile.jpg"
                        alt={PERSONAL_INFO.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {PERSONAL_INFO.name}
                      </h1>
                      <p className="text-xs sm:text-sm font-medium text-cyan-300 mt-0.5">
                        {PERSONAL_INFO.role}
                      </p>
                      <p className="text-[11px] font-mono text-gray-400">
                        {PERSONAL_INFO.college}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-right font-mono text-gray-400 space-y-1">
                    <p className="flex items-center sm:justify-end gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{PERSONAL_INFO.location}</span>
                    </p>
                    <p className="flex items-center sm:justify-end gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{PERSONAL_INFO.phone}</span>
                    </p>
                    <p className="flex items-center sm:justify-end gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{PERSONAL_INFO.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div className="space-y-2">
                <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  ABOUT ME
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {PERSONAL_INFO.bio}
                </p>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>EDUCATION</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PERSONAL_INFO.education.map((edu) => (
                    <div
                      key={edu.institution}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1"
                    >
                      <span className="text-[11px] font-mono text-cyan-400 block">{edu.period}</span>
                      <h3 className="font-bold text-sm text-white">{edu.institution}</h3>
                      <p className="text-xs text-gray-300">{edu.degree}</p>
                      <p className="text-[11px] text-emerald-400 font-semibold">{edu.score}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center space-x-2">
                  <Code2 className="w-4 h-4" />
                  <span>TECHNICAL SKILLS</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-white block mb-1">Programming Skills:</span>
                    <span className="text-gray-300">Python, Java, C, C++</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-white block mb-1">Database & SQL:</span>
                    <span className="text-gray-300">SQL, MySQL, Database Design & Query Optimization</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-white block mb-1">Web Development:</span>
                    <span className="text-gray-300">HTML, CSS, JavaScript, Streamlit, React, Next.js</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-white block mb-1">Data Science & Analytics:</span>
                    <span className="text-gray-300">Data Analysis, Data Warehousing, Data Cleaning, Visualization, EDA</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-white block mb-1">Problem Solving:</span>
                    <span className="text-emerald-300 font-medium">Data Structures & Algorithms, Competitive Problem Solving (200+ on LeetCode & HackerRank)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-white block mb-1">Tools & Platforms:</span>
                    <span className="text-gray-300">Git & GitHub, Linux, Basics of AWS & Azure</span>
                  </div>
                </div>
              </div>

              {/* Flagship Projects */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>PROJECTS & SYSTEMS</span>
                </h2>
                <div className="space-y-3.5">
                  {PROJECTS.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-bold text-sm text-white">{proj.title}</h3>
                        <span className="text-[11px] font-mono text-cyan-400/90">{proj.technologies.join(' • ')}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{proj.description}</p>
                      {proj.metrics && (
                        <p className="text-[11px] font-mono text-emerald-400">⚡ {proj.metrics}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience & Leadership */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>EXPERIENCE & LEADERSHIP ROLES</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PERSONAL_INFO.experience.map((exp) => (
                    <div
                      key={exp.role}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-white">{exp.role}</h3>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-full">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300">{exp.organization}</p>
                      <p className="text-xs text-gray-400 leading-relaxed pt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
