import React, { useState, useMemo } from 'react';
import { Confession, CategoryId } from '../types';
import { CATEGORIES } from '../data/seedData';
import {
  FlameSvg,
  BatterySvg,
  SpiralSvg,
  RaindropSvg,
  SunSvg,
  HeartSvg,
  HandshakeSvg,
  ShareSvg,
  SearchSvg,
  CheckSvg,
} from './Icons';

interface FeedSectionProps {
  confessions: Confession[];
  onReactRelate: (id: string) => void;
  onReactSupport: (id: string) => void;
  onShowToast: (message: string) => void;
}

export const FeedSection: React.FC<FeedSectionProps> = ({
  confessions,
  onReactRelate,
  onReactSupport,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'mostRelatable'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getCategoryIcon = (catId: string, size = 15) => {
    switch (catId) {
      case 'marah':
        return <FlameSvg size={size} />;
      case 'lelah':
        return <BatterySvg size={size} />;
      case 'resah':
        return <SpiralSvg size={size} />;
      case 'sesak':
        return <RaindropSvg size={size} />;
      case 'lega':
        return <SunSvg size={size} />;
      default:
        return null;
    }
  };

  const getCategoryMeta = (catId: string) => {
    return (
      CATEGORIES.find((c) => c.id === catId) || {
        label: catId,
        colorClass: 'text-slate-300',
        borderClass: 'border-slate-700',
        bgClass: 'bg-slate-800/40',
      }
    );
  };

  // Filter & Sort Logic
  const filteredConfessions = useMemo(() => {
    return confessions
      .filter((c) => {
        const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.pseudonym.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'mostRelatable') {
          return b.relatesCount + b.supportsCount - (a.relatesCount + a.supportsCount);
        }
        return 0; // Default order is newest first
      });
  }, [confessions, activeCategory, searchQuery, sortBy]);

  const handleShare = (confession: Confession) => {
    const shareText = `"${confession.content}" - ${confession.pseudonym} di RuangLepas`;
    if (navigator.share) {
      navigator
        .share({
          title: 'RuangLepas - Curahan Hati Anonim',
          text: shareText,
          url: window.location.href,
        })
        .then(() => onShowToast('Tautan berhasil dibagikan.'))
        .catch(() => {
          copyToClipboard(shareText, confession.id);
        });
    } else {
      copyToClipboard(shareText, confession.id);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      onShowToast('Curhatan berhasil disalin ke papan klip.');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Suara Hati yang Telah Lepas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Membaca dan menyadari bahwa kamu tidak sendirian menghadapi peliknya hidup.
          </p>
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <SearchSvg size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari uneg-uneg..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-sky-400/80 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'mostRelatable')}
            className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs sm:text-sm text-slate-300 focus:border-sky-400/80 transition-all cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="mostRelatable">Paling Relate</option>
          </select>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                isActive
                  ? 'bg-sky-500/20 border-sky-400/80 text-sky-200 shadow-md ring-1 ring-sky-400/30'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {cat.id !== 'all' && getCategoryIcon(cat.id, 14)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Confession Cards Grid */}
      {filteredConfessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConfessions.map((item) => {
            const meta = getCategoryMeta(item.category);
            return (
              <article
                key={item.id}
                className="liquid-glass rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between hover:border-slate-500/50 hover:shadow-2xl transition-all"
              >
                <div>
                  {/* Card Header: Pseudonym & Mood Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex flex-col min-w-0">
                      <span className="font-heading font-semibold text-sm sm:text-base text-white truncate">
                        {item.pseudonym}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{item.createdAt}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.bgClass} ${meta.borderClass} ${meta.colorClass}`}
                    >
                      {getCategoryIcon(item.category, 12)}
                      <span>{meta.label}</span>
                    </span>
                  </div>

                  {/* Confession Body */}
                  <p className="text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>

                {/* Card Actions: Relate, Support, Share */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Relate Button */}
                    <button
                      onClick={() => onReactRelate(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        item.userReactedRelate
                          ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                          : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                      title="Saya relate / mengalami hal serupa"
                    >
                      <HeartSvg
                        size={14}
                        className={item.userReactedRelate ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}
                      />
                      <span>{item.relatesCount}</span>
                    </button>

                    {/* Support Button */}
                    <button
                      onClick={() => onReactSupport(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        item.userReactedSupport
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                      title="Kirim dukungan moril"
                    >
                      <HandshakeSvg
                        size={14}
                        className={item.userReactedSupport ? 'text-emerald-400' : 'text-slate-400'}
                      />
                      <span>{item.supportsCount}</span>
                    </button>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(item)}
                    className="p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white transition-all"
                    title="Bagikan atau salin curhatan"
                  >
                    {copiedId === item.id ? (
                      <CheckSvg size={14} className="text-emerald-400" />
                    ) : (
                      <ShareSvg size={14} />
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="liquid-glass rounded-3xl p-12 text-center border border-slate-800 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <SearchSvg size={24} />
          </div>
          <h3 className="font-heading font-bold text-lg text-white mb-2">
            Belum Ada Curhatan Ditemukan
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Tidak ada suara hati yang cocok dengan filter atau kata kunci pencarian saat ini.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs sm:text-sm font-semibold text-white transition-all"
          >
            Reset Filter Pencarian
          </button>
        </div>
      )}
    </section>
  );
};
