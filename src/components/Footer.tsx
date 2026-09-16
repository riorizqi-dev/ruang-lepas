import React from 'react';
import { LogoSvg, ShieldSvg, QrisIconSvg } from './Icons';

interface FooterProps {
  onOpenQris: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQris }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#06090f]/90 mt-16 pt-12 pb-14">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Brand Information */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <LogoSvg size={28} />
            <span className="font-heading font-bold text-lg text-white">RuangLepas</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Kanal digital untuk melepaskan beban mental dan uneg-uneg secara anonim. Tanpa sensor algoritma pengenal, tanpa pelacakan data, dan tanpa penghakiman.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
            <ShieldSvg size={13} className="text-emerald-400" />
            <span>Kerahasiaan terjaga. Data tidak dijual ke pihak ketiga.</span>
          </div>
        </div>

        {/* Community Principles & Ethics */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-slate-300">
            Prinsip RuangLepas
          </h4>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
              <span>Dilarang menyebarkan data pribadi (doxxing) pihak lain.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
              <span>Dilarang ujaran kebencian berbasis SARA atau ancaman kekerasan fisik.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
              <span>Gunakan ruang ini untuk saling menguatkan dan melepas beban.</span>
            </li>
          </ul>
        </div>

        {/* QRIS Server Support Card */}
        <div className="liquid-glass rounded-2xl p-5 border border-slate-700/60 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
            <QrisIconSvg size={16} className="text-sky-400" />
            <span>Dukungan Operasional Server</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Platform ini dirawat secara independen. Bantuan donasi via QRIS membantu biaya hosting dan penyimpanan agar ruang ini tetap gratis selamanya.
          </p>
          <button
            onClick={onOpenQris}
            className="mt-1 w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 text-center"
          >
            Buka Donasi QRIS
          </button>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
        <span>RuangLepas. Dibuat dengan etika privasi dan transparansi penuh.</span>
        <span>Jika kamu sedang dalam krisis emosional darurat, hubungi layanan konseling profesional terdekat.</span>
      </div>
    </footer>
  );
};
