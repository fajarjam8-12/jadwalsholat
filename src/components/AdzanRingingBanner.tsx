import React from 'react';
import { VolumeX, Clock, BellOff, BookOpen, Sparkles } from 'lucide-react';
import { PrayerName, PRAYER_DISPLAY_NAMES } from '../utils/prayerEngine';

interface AdzanRingingBannerProps {
  ringingPrayer: PrayerName | null;
  ringingTime: string;
  onStopAdzan: () => void;
  onSnooze: () => void;
  onOpenDoa: () => void;
}

export const AdzanRingingBanner: React.FC<AdzanRingingBannerProps> = ({
  ringingPrayer,
  ringingTime,
  onStopAdzan,
  onSnooze,
  onOpenDoa,
}) => {
  if (!ringingPrayer) return null;

  const displayName = PRAYER_DISPLAY_NAMES[ringingPrayer];

  return (
    <div className="fixed top-3 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border-2 border-emerald-400 shadow-2xl shadow-emerald-900/80 text-white">
        <div className="flex items-center gap-3">
          {/* Animated Mosque icon */}
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xl flex-shrink-0 animate-bounce">
            🕌
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-400 text-stone-950">
                Waktu Sholat
              </span>
              <span className="text-xs text-emerald-300 font-mono font-bold">
                {ringingTime} WIB
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white truncate mt-0.5">
              Adzan {displayName} Berkumandang
            </h3>
            <p className="text-xs text-emerald-200/90 truncate">
              Mari bersegera menunaikan sholat berjamaah
            </p>
          </div>
        </div>

        {/* Buttons for Quick Mute / Snooze / Doa */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-800/60">
          <button
            onClick={onStopAdzan}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold active:scale-95 transition shadow-sm"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Matikan</span>
          </button>

          <button
            onClick={onSnooze}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold active:scale-95 transition"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Snooze</span>
          </button>

          <button
            onClick={onOpenDoa}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 text-xs font-semibold active:scale-95 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Doa Adzan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
