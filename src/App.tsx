import React, { useState, useEffect } from 'react';
import { Confession, CategoryId, ToastMessage } from './types';
import { INITIAL_CONFESSIONS } from './data/seedData';
import { Navbar } from './components/Navbar';
import { ConfessionForm } from './components/ConfessionForm';
import { FeedSection } from './components/FeedSection';
import { QrisModal } from './components/QrisModal';
import { Footer } from './components/Footer';
import { ShieldSvg, CheckSvg } from './components/Icons';

export const App: React.FC = () => {
  const [confessions, setConfessions] = useState<Confession[]>(() => {
    const saved = localStorage.getItem('ruanglepas_confessions_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CONFESSIONS;
      }
    }
    return INITIAL_CONFESSIONS;
  });

  const [isQrisOpen, setIsQrisOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync confessions to localStorage
  useEffect(() => {
    localStorage.setItem('ruanglepas_confessions_v1', JSON.stringify(confessions));
  }, [confessions]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleAddConfession = (
    pseudonym: string,
    content: string,
    category: Exclude<CategoryId, 'all'>
  ) => {
    const newConfession: Confession = {
      id: `c-${Date.now()}`,
      pseudonym,
      content,
      category,
      createdAt: 'Baru saja',
      relatesCount: 0,
      supportsCount: 0,
    };

    setConfessions((prev) => [newConfession, ...prev]);
    showToast('Uneg-unegmu telah dilepaskan ke ruang terbuka.', 'success');
  };

  const handleReactRelate = (id: string) => {
    setConfessions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const reacted = !item.userReactedRelate;
          return {
            ...item,
            relatesCount: reacted ? item.relatesCount + 1 : Math.max(0, item.relatesCount - 1),
            userReactedRelate: reacted,
          };
        }
        return item;
      })
    );
  };

  const handleReactSupport = (id: string) => {
    setConfessions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const reacted = !item.userReactedSupport;
          return {
            ...item,
            supportsCount: reacted ? item.supportsCount + 1 : Math.max(0, item.supportsCount - 1),
            userReactedSupport: reacted,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#06090f] text-slate-100 overflow-x-hidden">
      {/* Hardware-Accelerated Ambient Glowing Backdrops */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] bg-sky-900/15 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-900/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50rem] h-[50rem] bg-slate-800/15 rounded-full blur-[160px]" />
      </div>

      {/* Subtle Halftone Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07] z-0"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Ticker / Announcement Banner */}
      <div className="relative z-30 w-full bg-slate-950/80 border-b border-slate-800/80 py-2 px-4 text-center text-xs text-slate-300 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <ShieldSvg size={14} className="text-sky-400 flex-shrink-0" />
          <span>
            Seluruh suara hati disimpan secara anonim. Ruang ini bebas dari algoritma pelacak identitas.
          </span>
        </div>
      </div>

      {/* Floating Liquid Glass Header */}
      <Navbar totalCount={confessions.length} onOpenQris={() => setIsQrisOpen(true)} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col">
        <ConfessionForm onSubmit={handleAddConfession} />
        <FeedSection
          confessions={confessions}
          onReactRelate={handleReactRelate}
          onReactSupport={handleReactSupport}
          onShowToast={(msg) => showToast(msg, 'info')}
        />
      </main>

      {/* QRIS Donation Modal */}
      <QrisModal
        isOpen={isQrisOpen}
        onClose={() => setIsQrisOpen(false)}
        onShowToast={(msg) => showToast(msg, 'success')}
      />

      {/* Footer */}
      <Footer onOpenQris={() => setIsQrisOpen(true)} />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="liquid-glass pointer-events-auto px-4 py-3 rounded-xl border border-sky-500/40 text-xs sm:text-sm font-semibold text-white shadow-2xl flex items-center gap-2.5 animate-bounce-short"
          >
            <CheckSvg size={16} className="text-sky-400 flex-shrink-0" />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
