'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import AdminModal from '@/components/AdminModal';

export default function AdminPage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#05060b] text-white flex flex-col items-center justify-center p-6 relative">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        <p className="text-sm text-gray-400">
          Private dashboard displaying client IP addresses, visitor names, and access analytics.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all"
          >
            Open Host Dashboard
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
