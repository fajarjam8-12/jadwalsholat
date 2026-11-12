import React from 'react';
import { MapPin, Clock, Calendar, Navigation, Sparkles } from 'lucide-react';
import { NextPrayerInfo, PrayerTimesData } from '../utils/prayerEngine';
import { CityInfo } from '../data/cities';
import { IslamicStarPattern, IslamicArchBorder, RubElHizbIcon } from './IslamicOrnaments';

interface HeroCountdownProps {
  nextPrayer: NextPrayerInfo;
  prayers: PrayerTimesData;
  city: CityInfo;
  currentTime: Date;
  onOpenCitySelector: () => void;
  onOpenHijriCalendar?: () => void;
  batterySaver: boolean;
  gpsActive: boolean;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  nextPrayer,
  prayers,
  city,
  currentTime,
  onOpenCitySelector,
  onOpenHijriCalendar,
  batterySaver,
  gpsActive,
}) => {
  const pad = (n: number) => String(n).padStart(2, '0');

  // Format current clock: HH:mm:ss
  const clockHours = pad(currentTime.getHours());
  const clockMinutes = pad(currentTime.getMinutes());
  const clockSeconds = pad(currentTime.getSeconds());

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 border border-emerald-500/50 p-5 shadow-2xl shadow-emerald-950/60 text-white">
      {/* Decorative Islamic Star Pattern background */}
      <IslamicStarPattern opacity={0.12} />

      {/* Subtle emerald radial aura */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Location and Date Row */}
      <div className="relative z-10 flex items-start justify-between gap-2 mb-3">
        {/* City / Location button */}
        <button
          onClick={onOpenCitySelector}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-600/40 text-emerald-200 text-xs font-medium active:scale-95 transition shadow-sm"
        >
          {gpsActive ? (
            <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="truncate max-w-[150px] font-semibold">{city.name}</span>
          <span className="text-[10px] text-emerald-400 font-bold ml-0.5">Ubah</span>
        </button>

        {/* Current Time Badge */}
        <div className="flex items-center gap-1 text-xs font-mono text-stone-200 bg-black/60 px-2.5 py-1 rounded-full border border-emerald-800/60 shadow-inner">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span className="font-bold">{clockHours}:{clockMinutes}</span>
          {!batterySaver && (
            <span className="text-emerald-400/80 text-[10px]">:{clockSeconds}</span>
          )}
        </div>
      </div>

      {/* Next Prayer Highlight & Countdown */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
          <RubElHizbIcon size={14} className="text-emerald-400" />
          <span>Menuju Waktu {nextPrayer.displayName}</span>
          <span className="text-white font-extrabold">• {nextPrayer.timeString}</span>
        </div>

        {/* Main Countdown Numbers with Islamic-themed glow containers */}
        <div className="flex items-center justify-center gap-2 my-2 font-mono">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-black/75 border border-emerald-500/50 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-emerald-300 shadow-xl shadow-black/80">
              {pad(nextPrayer.hours)}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/90 mt-1 font-sans font-semibold">Jam</span>
          </div>

          <span className="text-2xl font-bold text-emerald-400/80 mb-4 animate-pulse">:</span>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-black/75 border border-emerald-500/50 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shadow-xl shadow-black/80">
              {pad(nextPrayer.minutes)}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/90 mt-1 font-sans font-semibold">Menit</span>
          </div>

          <span className="text-2xl font-bold text-emerald-400/80 mb-4 animate-pulse">:</span>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-black/75 border border-emerald-500/50 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-teal-300 shadow-xl shadow-black/80">
              {pad(nextPrayer.seconds)}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/90 mt-1 font-sans font-semibold">Detik</span>
          </div>
        </div>

        {/* Progress Bar towards next prayer */}
        <div className="w-full mt-2.5">
          <div className="flex justify-between text-[11px] text-emerald-200/80 mb-1 px-1">
            <span>Interval Waktu Sholat</span>
            <span className="text-emerald-300 font-semibold">{nextPrayer.progressPercent}% Berlalu</span>
          </div>
          <div className="w-full h-2 bg-stone-900/90 rounded-full overflow-hidden p-0.5 border border-emerald-900/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500 shadow-sm shadow-emerald-400/50"
              style={{ width: `${nextPrayer.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <IslamicArchBorder className="relative z-10 my-1" />

      {/* Hijri & Gregorian Date Footer */}
      <div className="relative z-10 pt-1 flex items-center justify-between text-xs text-stone-200">
        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{prayers.dateFormatted}</span>
        </div>
        <button
          onClick={onOpenHijriCalendar}
          className="font-arabic text-base text-emerald-300 font-bold whitespace-nowrap ml-2 hover:text-emerald-200 transition active:scale-95 flex items-center gap-1"
          title="Buka Kalender Hijriyah"
        >
          <span>{prayers.hijriFormatted}</span>
          <span className="text-[10px] text-emerald-400 font-sans font-normal ml-0.5">➔</span>
        </button>
      </div>
    </div>
  );
};
