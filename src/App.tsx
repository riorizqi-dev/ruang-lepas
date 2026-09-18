import React, { useState, useEffect, useCallback } from 'react';
import { Confession, CategoryId, ToastMessage } from './types';
import { INITIAL_CONFESSIONS } from './data/seedData';
import { Navbar } from './components/Navbar';
import { ConfessionForm } from './components/ConfessionForm';
import { FeedSection } from './components/FeedSection';
import { QrisModal } from './components/QrisModal';
import { Footer } from './components/Footer';
import { ShieldSvg, CheckSvg } from './components/Icons';
import { supabase } from './lib/supabase';

// Helper format ISO string to human relative Indonesian time
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Baru saja';
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffSec) || diffSec < 60) return 'Baru saja';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

interface DbConfession {
  id: string;
  pseudonym: string;
  content: string;
  category: string;
  created_at: string;
  relates_count: number;
  supports_count: number;
  song_track_id?: string | null;
}

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

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // User personal reactions saved in localStorage
  const getStoredReactions = () => {
    try {
      const relates = JSON.parse(localStorage.getItem('ruanglepas_relates') || '[]');
      const supports = JSON.parse(localStorage.getItem('ruanglepas_supports') || '[]');
      return { relates: new Set<string>(relates), supports: new Set<string>(supports) };
    } catch {
      return { relates: new Set<string>(), supports: new Set<string>() };
    }
  };

  const transformDbItem = useCallback(
    (item: DbConfession, userRelates: Set<string>, userSupports: Set<string>): Confession => ({
      id: item.id,
      pseudonym: item.pseudonym || 'Anonim',
      content: item.content,
      category: item.category as Exclude<CategoryId, 'all'>,
      createdAt: formatRelativeTime(item.created_at),
      relatesCount: item.relates_count || 0,
      supportsCount: item.supports_count || 0,
      songTrackId: item.song_track_id || undefined,
      userReactedRelate: userRelates.has(item.id),
      userReactedSupport: userSupports.has(item.id),
    }),
    []
  );

  // Load confessions from Supabase
  const loadSupabaseConfessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('Supabase fetch notice:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const { relates, supports } = getStoredReactions();
        const mapped = data.map((item) => transformDbItem(item as DbConfession, relates, supports));
        setConfessions(mapped);
        localStorage.setItem('ruanglepas_confessions_v1', JSON.stringify(mapped));
      }
    } catch (err) {
      console.warn('Database offline or configuring:', err);
    }
  }, [transformDbItem]);

  useEffect(() => {
    loadSupabaseConfessions();

    // Subscribe to Realtime Postgres Changes
    const channel = supabase
      .channel('public:confessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'confessions' },
        (payload) => {
          const { relates, supports } = getStoredReactions();
          if (payload.eventType === 'INSERT') {
            const newItem = transformDbItem(payload.new as DbConfession, relates, supports);
            setConfessions((prev) => {
              if (prev.some((p) => p.id === newItem.id)) return prev;
              return [newItem, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedItem = payload.new as DbConfession;
            setConfessions((prev) =>
              prev.map((c) =>
                c.id === updatedItem.id
                  ? {
                      ...c,
                      relatesCount: updatedItem.relates_count,
                      supportsCount: updatedItem.supports_count,
                    }
                  : c
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadSupabaseConfessions, transformDbItem]);

  // Sync state to local storage backup
  useEffect(() => {
    localStorage.setItem('ruanglepas_confessions_v1', JSON.stringify(confessions));
  }, [confessions]);

  const handleAddConfession = async (
    pseudonym: string,
    content: string,
    category: Exclude<CategoryId, 'all'>,
    songTrackId?: string | null
  ) => {
    const tempId = `c-${Date.now()}`;
    const newConfession: Confession = {
      id: tempId,
      pseudonym,
      content,
      category,
      songTrackId: songTrackId || undefined,
      createdAt: 'Baru saja',
      relatesCount: 0,
      supportsCount: 0,
    };

    // Optimistic UI update
    setConfessions((prev) => [newConfession, ...prev]);
    showToast('Uneg-unegmu telah dilepaskan ke ruang terbuka.', 'success');

    // Persist to Supabase
    try {
      const payload: Record<string, unknown> = {
        pseudonym,
        content,
        category,
        relates_count: 0,
        supports_count: 0,
      };
      if (songTrackId) {
        payload.song_track_id = songTrackId;
      }

      let { data, error } = await supabase
        .from('confessions')
        .insert([payload])
        .select();

      // If column song_track_id doesn't exist yet in Supabase schema, retry without it
      if (error && songTrackId) {
        console.warn('Supabase insert with song_track_id failed, attempting fallback insert:', error.message);
        const fallback = await supabase
          .from('confessions')
          .insert([
            {
              pseudonym,
              content,
              category,
              relates_count: 0,
              supports_count: 0,
            },
          ])
          .select();
        data = fallback.data;
        error = fallback.error;
      }

      if (!error && data && data.length > 0) {
        const dbId = data[0].id;
        // Replace temp ID with Supabase ID
        setConfessions((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, id: dbId } : c))
        );
      }
    } catch (err) {
      console.warn('Post fallback to local storage:', err);
    }
  };

  const handleReactRelate = async (id: string) => {
    const target = confessions.find((c) => c.id === id);
    if (!target) return;

    const willReact = !target.userReactedRelate;
    const newCount = willReact ? target.relatesCount + 1 : Math.max(0, target.relatesCount - 1);

    // Save reaction to local storage
    const { relates } = getStoredReactions();
    if (willReact) relates.add(id);
    else relates.delete(id);
    localStorage.setItem('ruanglepas_relates', JSON.stringify(Array.from(relates)));

    // Optimistic UI update
    setConfessions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              relatesCount: newCount,
              userReactedRelate: willReact,
            }
          : item
      )
    );

    // Sync to Supabase
    try {
      await supabase
        .from('confessions')
        .update({ relates_count: newCount })
        .eq('id', id);
    } catch (err) {
      console.warn('Reaction synced locally:', err);
    }
  };

  const handleReactSupport = async (id: string) => {
    const target = confessions.find((c) => c.id === id);
    if (!target) return;

    const willReact = !target.userReactedSupport;
    const newCount = willReact ? target.supportsCount + 1 : Math.max(0, target.supportsCount - 1);

    // Save reaction to local storage
    const { supports } = getStoredReactions();
    if (willReact) supports.add(id);
    else supports.delete(id);
    localStorage.setItem('ruanglepas_supports', JSON.stringify(Array.from(supports)));

    // Optimistic UI update
    setConfessions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              supportsCount: newCount,
              userReactedSupport: willReact,
            }
          : item
      )
    );

    // Sync to Supabase
    try {
      await supabase
        .from('confessions')
        .update({ supports_count: newCount })
        .eq('id', id);
    } catch (err) {
      console.warn('Reaction synced locally:', err);
    }
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
