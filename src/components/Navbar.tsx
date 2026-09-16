import React from 'react';
import { LogoSvg, QrisIconSvg } from './Icons';

interface NavbarProps {
  totalCount: number;
  onOpenQris: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ totalCount, onOpenQris }) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl liquid-glass border border-slate-700/50 shadow-2xl">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <LogoSvg size={34} className="flex-shrink-0 drop-shadow-md" />
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-white leading-none">
              RuangLepas
            </span>
            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline-block mt-0.5">
              Katarsis Anonim Bebas Penghakiman
            </span>
          </div>
        </div>

        {/* Live Counter & QRIS Donate Action */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Live Count Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/60 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{totalCount} Suara Hati Dilepaskan</span>
          </div>

          {/* QRIS Donate Button */}
          <button
            onClick={onOpenQris}
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-sky-400/25 to-blue-600/20 hover:from-sky-500/30 hover:to-blue-600/30 border border-sky-400/40 hover:border-sky-300/70 text-sky-200 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_16px_rgba(56,189,248,0.15)] active:scale-95"
            aria-label="Buka donasi QRIS untuk mendukung server"
          >
            <QrisIconSvg size={16} className="text-sky-300 flex-shrink-0" />
            <span>Dukung Server (QRIS)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
