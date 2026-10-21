'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Code2, Layers, TerminalSquare } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';
import { sound } from '@/lib/sound';

export default function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Code2':
        return <Code2 className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      default:
        return <TerminalSquare className="w-5 h-5" />;
    }
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Mastery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Core CS Radar</span>
          </h2>
        </div>
        <p className="text-sm text-gray-400 max-w-md">
          A blend of foundational computer science principles, low-level systems programming, and high-velocity web engineering.
        </p>
      </div>

      {/* Asymmetric Orbital Category Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SKILL_CATEGORIES.map((category, idx) => {
          const isSelected = selectedCategory === idx;
          return (
            <button
              key={category.category}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(idx);
              }}
              className={`p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/40 via-indigo-950/30 to-[#0c0f22] border-cyan-400/50 shadow-[0_10px_30px_rgba(6,182,212,0.15)] scale-[1.02]'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {getIcon(category.iconName)}
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    ACTIVE
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{category.category}</h3>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{category.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Skills Cluster */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-8 sm:p-10 organic-card-3 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
      >
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{SKILL_CATEGORIES[selectedCategory].category}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {SKILL_CATEGORIES[selectedCategory].description}
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {SKILL_CATEGORIES[selectedCategory].skills.length} Competencies
          </span>
        </div>

        {/* Skill Pills Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_CATEGORIES[selectedCategory].skills.map((skill) => (
            <div
              key={skill.name}
              onMouseEnter={() => sound.playHover()}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2.5 group"
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    skill.level === 'Advanced'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : skill.level === 'Proficient'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {skill.level}
                </span>
              </div>
              <div className="text-[11px] font-mono text-gray-400 flex items-center space-x-1">
                <span className="text-cyan-400/80">#</span>
                <span>{skill.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
