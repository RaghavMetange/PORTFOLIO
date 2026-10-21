'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '@/data/portfolioData';
import { sound } from '@/lib/sound';

interface TerminalProps {
  visitorName?: string;
  isNamed?: boolean;
  onOpenAdminModal: () => void;
  onOpenVisitorModal: () => void;
  onOpenResumeModal: () => void;
}

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

export default function InteractiveTerminal({
  visitorName,
  isNamed,
  onOpenAdminModal,
  onOpenVisitorModal,
  onOpenResumeModal,
}: TerminalProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [logs, setLogs] = useState<CommandOutput[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1 text-gray-300">
          <p className="text-cyan-300 font-bold">Raghav Metange Shell v5.2.0 (Symbiosis-CSE)</p>
          <p className="text-gray-400">
            Type <span className="text-cyan-400 font-bold">&apos;help&apos;</span> to inspect commands, or run{' '}
            <span className="text-emerald-400 font-bold">&apos;resume&apos;</span> to inspect full CV.
          </p>
        </div>
      ),
    },
  ]);

  const [clientIp, setClientIp] = useState<string>('Detecting...');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch detected client IP
    fetch('/api/track')
      .then((r) => r.json())
      .then((d) => setClientIp(d.ip || '127.0.0.1'))
      .catch(() => setClientIp('127.0.0.1'));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    sound.playClick();

    if (!trimmed) return;

    setHistory((prev) => [...prev, cmdStr]);
    setHistoryIdx(-1);

    if (trimmed === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    let resultNode: React.ReactNode = null;

    switch (trimmed) {
      case 'help':
        resultNode = (
          <div className="space-y-1 text-gray-300">
            <p className="text-cyan-300 font-semibold">Available Shell Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-xs">
              <div>
                <span className="text-cyan-400 font-mono">whoami</span> - Display your session & IP details
              </div>
              <div>
                <span className="text-cyan-400 font-mono">about</span> - Background of Raghav Metange
              </div>
              <div>
                <span className="text-cyan-400 font-mono">focus</span> - Current active projects & engineering
              </div>
              <div>
                <span className="text-cyan-400 font-mono">resume</span> - Open full interactive resume viewer
              </div>
              <div>
                <span className="text-cyan-400 font-mono">projects</span> - List all software systems
              </div>
              <div>
                <span className="text-cyan-400 font-mono">pass</span> - Open Guest Pass / Introduce Yourself
              </div>
              <div>
                <span className="text-cyan-400 font-mono">sudo hire</span> - Direct recruiter contact pipeline
              </div>
              <div>
                <span className="text-cyan-400 font-mono">admin</span> - Access private IP telemetry dashboard
              </div>
              <div>
                <span className="text-cyan-400 font-mono">clear</span> - Clear terminal screen
              </div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        resultNode = (
          <div className="space-y-1 text-xs font-mono text-gray-300">
            <p>
              <span className="text-cyan-400">Visitor Identity:</span>{' '}
              <span className="text-white font-bold">{visitorName || 'Anonymous Visitor'}</span>
            </p>
            <p>
              <span className="text-cyan-400">Detected IP Address:</span>{' '}
              <span className="text-emerald-400 font-bold">{clientIp}</span>
            </p>
            <p>
              <span className="text-cyan-400">Session Status:</span>{' '}
              <span className="text-indigo-300">Logged privately to host telemetry</span>
            </p>
            {!isNamed && (
              <p className="text-gray-400 pt-1">
                Tip: Run <span className="text-cyan-300 underline cursor-pointer" onClick={onOpenVisitorModal}>&apos;pass&apos;</span> to introduce yourself!
              </p>
            )}
          </div>
        );
        break;

      case 'resume':
      case 'cv':
        resultNode = <p className="text-indigo-300 text-xs">Opening interactive resume modal...</p>;
        setTimeout(() => onOpenResumeModal(), 300);
        break;

      case 'about':
        resultNode = (
          <div className="space-y-1.5 text-xs text-gray-300">
            <p className="text-white font-bold">{PERSONAL_INFO.name} — {PERSONAL_INFO.role}</p>
            <p className="text-cyan-300">{PERSONAL_INFO.college} • CGPA: {PERSONAL_INFO.cgpa}</p>
            <p>{PERSONAL_INFO.bio}</p>
          </div>
        );
        break;

      case 'focus':
      case 'sem5':
        resultNode = (
          <div className="space-y-1.5 text-xs text-gray-300">
            <p className="text-cyan-300 font-bold">Current Engineering Focus:</p>
            <ul className="list-disc pl-4 space-y-1 text-gray-200">
              <li>
                <strong className="text-white">Multilingual Fake News Detector:</strong> NLP Transformer architectures for cross-lingual misinformation detection.
              </li>
              <li>
                <strong className="text-white">FinTech Stock Market Simulator & Portfolio Manager:</strong> High-frequency algorithmic backtesting, Sharpe ratio optimization, and real-time asset rebalancing.
              </li>
              <li>
                <strong className="text-white">Leadership:</strong> SRC Treasurer at Symbiosis Institute of Technology & Placement Committee Member.
              </li>
            </ul>
          </div>
        );
        break;

      case 'projects':
        resultNode = (
          <div className="space-y-2 text-xs">
            <p className="text-cyan-300 font-bold">All Featured Projects ({PROJECTS.length}):</p>
            {PROJECTS.map((p) => (
              <div key={p.id} className="border-l-2 border-cyan-400/50 pl-3">
                <span className="text-white font-bold">{p.title}</span> —{' '}
                <span className="text-gray-400">{p.subtitle}</span>
                <p className="text-gray-500 font-mono">{p.technologies.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'pass':
        resultNode = <p className="text-emerald-400 text-xs">Opening Guest Pass modal...</p>;
        setTimeout(() => onOpenVisitorModal(), 300);
        break;

      case 'admin':
        resultNode = <p className="text-cyan-400 text-xs">Launching Host Admin Telemetry portal...</p>;
        setTimeout(() => onOpenAdminModal(), 300);
        break;

      case 'sudo hire':
      case 'hire':
        sound.playSuccess();
        resultNode = (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
            <p className="font-bold">✨ ACCESS GRANTED: Offer Pipeline Initialized!</p>
            <p>
              Thank you for exploring! Let&apos;s build impactful software together. Feel free to email me at{' '}
              <a href={`mailto:${PERSONAL_INFO.socials.email}`} className="underline text-white font-mono">
                {PERSONAL_INFO.socials.email}
              </a>{' '}
              or call <span className="text-white font-mono">{PERSONAL_INFO.phone}</span>.
            </p>
          </div>
        );
        break;

      default:
        resultNode = (
          <p className="text-rose-400 text-xs font-mono">
            zsh: command not found: {cmdStr}. Type &apos;help&apos; for list of commands.
          </p>
        );
        break;
    }

    setLogs((prev) => [...prev, { command: cmdStr, output: resultNode }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[history.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  return (
    <section id="terminal" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>Hacker Shell Playground</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Interactive <span className="text-cyan-400">Terminal HUD</span>
        </h2>
        <p className="text-sm text-gray-400">
          Run commands, check your detected IP, inspect curriculum internals, or type <code className="text-indigo-300 font-mono">resume</code> to review my full credentials.
        </p>
      </div>

      {/* Terminal Window */}
      <div className="organic-card-1 bg-[#070913]/95 border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/[0.03] border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-mono text-gray-400 ml-2">raghav@symbiosis:~</span>
          </div>
          <div className="text-[11px] font-mono text-cyan-400/80 hidden sm:block">
            IP: {clientIp}
          </div>
        </div>

        {/* Console logs body */}
        <div className="p-4 sm:p-6 font-mono text-xs max-h-80 overflow-y-auto space-y-4">
          {logs.map((log, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center space-x-2 text-cyan-400">
                <span className="text-emerald-400">➜</span>
                <span className="text-indigo-300">~</span>
                <span className="text-white">{log.command}</span>
              </div>
              <div className="pl-4">{log.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Interactive input bar */}
        <div className="flex items-center px-4 sm:px-6 py-3 border-t border-white/10 bg-black/40">
          <span className="text-emerald-400 mr-2 font-mono text-xs">➜</span>
          <span className="text-indigo-300 mr-2 font-mono text-xs">~</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'whoami', 'focus', 'resume', or 'sudo hire'..."
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-gray-600"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
