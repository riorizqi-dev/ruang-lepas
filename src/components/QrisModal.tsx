import React, { useState, useEffect, useRef } from 'react';
import {
  CloseSvg,
  CopySvg,
  CheckSvg,
  DownloadSvg,
  GpnLogoSvg,
  ShieldSvg,
  QrisIconSvg,
} from './Icons';
import { DonationPreset } from '../types';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

const DONATION_PRESETS: DonationPreset[] = [
  { nominal: 5000, label: 'Rp 5.000', note: '1 Cangkir Teh' },
  { nominal: 10000, label: 'Rp 10.000', note: 'Kopi Hitam Server', isPopular: true },
  { nominal: 25000, label: 'Rp 25.000', note: 'Hosting Mingguan' },
  { nominal: 50000, label: 'Rp 50.000', note: 'Operasional Bulanan' },
];

export const QrisModal: React.FC<QrisModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(10000);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const qrisImage = '/qris.jpg';

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyNominal = (amount: number) => {
    navigator.clipboard.writeText(amount.toString()).then(() => {
      setCopiedField('nominal');
      onShowToast(`Nominal Rp ${amount.toLocaleString('id-ID')} disalin ke papan klip.`);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleDownloadQris = () => {
    const link = document.createElement('a');
    link.href = qrisImage;
    link.download = 'QRIS-Ryuuka-Store.jpg';
    link.click();
    onShowToast('Gambar QRIS sedang diunduh.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qris-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="liquid-glass w-full max-w-2xl rounded-3xl p-5 sm:p-7 border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] max-h-[95vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <QrisIconSvg size={18} />
            </div>
            <div>
              <h3 id="qris-modal-title" className="font-heading font-bold text-base sm:text-lg text-white">
                Donasi Server via QRIS
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Dukungan langsung agar server tetap hidup tanpa iklan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-white transition-all"
            aria-label="Tutup modal donasi"
          >
            <CloseSvg size={18} />
          </button>
        </div>

        {/* 2-Column Responsive Layout: Left QR Card, Right Controls */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: QRIS Poster & Direct Actions */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[270px] bg-slate-950 rounded-2xl p-3 shadow-2xl border border-slate-700/80 text-white flex flex-col items-center">
              {/* Top Banner */}
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs tracking-widest text-sky-400">QRIS</span>
                  <span className="text-[10px] font-semibold text-slate-400">PEMBAYARAN DIGITAL</span>
                </div>
                <GpnLogoSvg size={20} />
              </div>

              {/* QR Image */}
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center relative shadow-inner">
                <img
                  src={qrisImage}
                  alt="QRIS Donasi Ryuuka Store"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* WhatsApp Contact Confirmation */}
              <div className="w-full mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between px-1 text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Konfirmasi Admin</span>
                  <span className="font-mono font-semibold text-sky-300 text-xs">0858-1038-3881</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('085810383881').then(() => {
                      setCopiedField('wa');
                      onShowToast('Nomor WhatsApp disalin ke papan klip.');
                      setTimeout(() => setCopiedField(null), 2000);
                    });
                  }}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-all active:scale-95"
                >
                  {copiedField === 'wa' ? <CheckSvg size={12} className="text-emerald-400" /> : <CopySvg size={12} />}
                  <span>Salin WA</span>
                </button>
              </div>
            </div>

            {/* QR Download Button */}
            <div className="mt-3.5 w-full max-w-[270px]">
              <button
                onClick={handleDownloadQris}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 py-2.5 px-4 rounded-xl border border-slate-700 font-semibold transition-all active:scale-95 shadow-md"
              >
                <DownloadSvg size={14} />
                <span>Unduh Gambar QRIS</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Nominal Selection & Copy Button */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div>
              <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pilihan Nominal Donasi
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DONATION_PRESETS.map((p) => {
                  const isSelected = selectedPreset === p.nominal;
                  return (
                    <button
                      key={p.nominal}
                      onClick={() => setSelectedPreset(p.nominal)}
                      className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-400 text-white ring-1 ring-sky-400/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs sm:text-sm">{p.label}</span>
                        {p.isPopular && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Favorit
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{p.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Nominal Box + Copy Button */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nominal Terpilih</span>
                <span className="font-heading font-bold text-white text-base">
                  Rp {selectedPreset.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                onClick={() => handleCopyNominal(selectedPreset)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all active:scale-95 shadow-md"
              >
                {copiedField === 'nominal' ? <CheckSvg size={14} className="text-slate-950" /> : <CopySvg size={14} />}
                <span>Salin Nominal</span>
              </button>
            </div>

            {/* Step by step instructions */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 flex flex-col gap-2">
              <span className="font-semibold text-slate-200">Cara Berdonasi:</span>
              <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1">
                <li>Buka aplikasi m-Banking atau e-Wallet (GoPay, OVO, Dana, ShopeePay, BCA, dll).</li>
                <li>Pindai (scan) kode QRIS di samping atau gunakan gambar yang sudah diunduh.</li>
                <li>Masukkan nominal donasi yang kamu inginkan.</li>
                <li>Konfirmasi pembayaran selesai. Terima kasih banyak atas dukunganmu!</li>
              </ol>
            </div>

            {/* Transparency Note */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
              <ShieldSvg size={15} className="text-sky-400 flex-shrink-0 mt-0.5" />
              <span>
                100% donasi digunakan untuk biaya sewa server & domain agar RuangLepas tetap gratis selamanya.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
