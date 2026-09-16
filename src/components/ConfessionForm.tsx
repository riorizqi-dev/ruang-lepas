import React, { useState } from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/seedData';
import { FlameSvg, BatterySvg, SpiralSvg, RaindropSvg, SunSvg, ShieldSvg, SendSvg } from './Icons';

interface ConfessionFormProps {
  onSubmit: (pseudonym: string, content: string, category: Exclude<CategoryId, 'all'>) => void;
}

export const ConfessionForm: React.FC<ConfessionFormProps> = ({ onSubmit }) => {
  const [pseudonym, setPseudonym] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Exclude<CategoryId, 'all'>>('lelah');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxChars = 350;
  const charsLeft = maxChars - content.length;

  const getCategoryIcon = (catId: string, size = 16) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent = content.trim();

    if (!cleanContent) {
      setError('Uneg-uneg tidak boleh kosong. Tulis apa yang sedang membebani pikiranmu.');
      return;
    }

    if (cleanContent.length < 5) {
      setError('Tulis minimal 5 karakter agar ceritamu dapat dipahami.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit(pseudonym.trim() || 'Anonim', cleanContent, category);
      setContent('');
      setPseudonym('');
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 pt-8 pb-4">
      {/* Hero Headline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-4 backdrop-blur-md">
          <ShieldSvg size={14} className="text-sky-400" />
          <span>Kanal Anonim Tanpa Jejak Pribadi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
          Lepaskan Beban Pikiran, Amarah, dan Rasa Lelahmu.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Ruang aman untuk menumpahkan uneg-uneg tanpa takut dihakimi siapa pun. Tidak perlu dipendam sendiri hingga menguras kesehatanmu.
        </p>
      </div>

      {/* Main Form Hero Card */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Pseudonym Input */}
          <div>
            <label htmlFor="pseudonym" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nama Samaran (Opsional)
            </label>
            <input
              id="pseudonym"
              type="text"
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              maxLength={30}
              placeholder="Contoh: Karyawan Lembur, Pejuang Skripsi, Anonim #404"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white placeholder-slate-500 text-sm focus:border-sky-400/80 focus:bg-slate-900/90 transition-all"
            />
          </div>

          {/* Mood / Category Selector */}
          <div>
            <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Pilih Nuansa Perasaan
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as Exclude<CategoryId, 'all'>)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${cat.bgClass} ${cat.borderClass} ${cat.colorClass} ring-2 ring-sky-400/40 shadow-lg`
                        : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {getCategoryIcon(cat.id, 15)}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea Confession */}
          <div className="relative">
            <label htmlFor="confession" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Uneg-Uneg & Keluh Kesah
            </label>
            <textarea
              id="confession"
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              maxLength={maxChars}
              placeholder="Tuliskan apapun yang menyesakkan dada. Marahi sistem yang timpang, atasan yang tidak adil, tugas kuliah yang tak berujung, atau rasa sepi yang tak kunjung hilang..."
              className="w-full p-4 pb-9 rounded-2xl bg-slate-900/70 border border-slate-700/70 text-white placeholder-slate-500 text-sm leading-relaxed resize-none focus:border-sky-400/80 focus:bg-slate-900/90 transition-all"
            />
            <div className="absolute bottom-3 right-4 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className={charsLeft < 20 ? 'text-rose-400 font-bold' : ''}>
                {content.length}/{maxChars}
              </span>
            </div>
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Submit CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldSvg size={14} className="text-emerald-400 flex-shrink-0" />
              <span>Identitasmu terjaga. Tidak ada data pribadi yang disimpan.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] border border-sky-300/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendSvg size={16} />
              <span>{isSubmitting ? 'Melepaskan...' : 'Lepaskan Beban'}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
