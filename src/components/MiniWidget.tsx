import React from 'react';
import { X, ExternalLink, Smartphone, Sparkles, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { NextPrayerInfo } from '../utils/prayerEngine';
import { CityInfo } from '../data/cities';

interface MiniWidgetFloatingProps {
  nextPrayer: NextPrayerInfo;
  city: CityInfo;
  isMuted: boolean;
  onToggleMute: () => void;
  onExpand: () => void;
  onCloseWidget: () => void;
}

export const MiniWidgetFloating: React.FC<MiniWidgetFloatingProps> = ({
  nextPrayer,
  city,
  isMuted,
  onToggleMute,
  onExpand,
  onCloseWidget,
}) => {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-sm mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between p-2.5 px-3.5 rounded-2xl bg-stone-900/95 dark:bg-black/95 border border-emerald-500/50 shadow-2xl shadow-emerald-950/80 backdrop-blur-md text-stone-100">
        {/* Left: Next Prayer & Countdown */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onExpand}>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white leading-none">
                {nextPrayer.displayName} ({nextPrayer.timeString})
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-medium">
                {city.name.split(' ')[0]}
              </span>
            </div>
            <div className="font-mono text-xs text-emerald-300 font-extrabold mt-0.5">
              -{pad(nextPrayer.hours)}:{pad(nextPrayer.minutes)}:{pad(nextPrayer.seconds)}
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white transition"
            title={isMuted ? 'Buka Suara' : 'Bisukan Suara'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <button
            onClick={onExpand}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white transition"
            title="Perbesar Layar Penuh"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onCloseWidget}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white transition"
            title="Tutup Widget Mengambang"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface WidgetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WidgetGuideModal: React.FC<WidgetGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden text-stone-100">
        <div className="flex items-center justify-between p-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Pasang Widget & Shortcut HP</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar">
          <p className="text-stone-300 leading-relaxed">
            Aplikasi ini mendukung teknologi <strong>Progressive Web App (PWA)</strong> dan hemat baterai tanpa perlu download APK berat di Play Store.
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Buka Menu Browser (Chrome Android)</h4>
                <p className="text-stone-400 mt-0.5">
                  Ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas browser Chrome Android Anda.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Pilih &ldquo;Tambahkan ke Layar Utama&rdquo;</h4>
                <p className="text-stone-400 mt-0.5">
                  Pilih opsi <em>&ldquo;Tambahkan ke Layar Utama&rdquo;</em> (Add to Home screen) atau <em>&ldquo;Install Aplikasi&rdquo;</em>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Aplikasi Siap di Homescreen</h4>
                <p className="text-stone-400 mt-0.5">
                  Ikon masjid hijau elegan akan muncul di beranda smartphone Anda. Buka kapan saja tanpa browser bar dan langsung menampilkan waktu sholat presisi!
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <strong>Keunggulan Ramah Baterai:</strong> Menggunakan tema AMOLED hitam pekat, kompresi audio sintetis Web Audio (0 MB download), serta interval adaptif saat aplikasi di latar belakang.
          </div>
        </div>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm active:scale-95 transition"
          >
            Mengerti, Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
