import React from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Navigation,
  Volume2,
  VolumeX,
  Zap,
  Smartphone,
  Sparkles,
  Moon,
  Bell,
  BellOff,
} from 'lucide-react';
import { NextPrayerInfo, PrayerTimesData, PrayerName } from '../utils/prayerEngine';
import { CityInfo } from '../data/cities';
import { AppSettings } from '../hooks/useAppSettings';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IslamicStarPattern, RubElHizbIcon } from './IslamicOrnaments';

interface CompactMainCardProps {
  nextPrayer: NextPrayerInfo;
  prayers: PrayerTimesData;
  city: CityInfo;
  currentTime: Date;
  settings: AppSettings;
  onOpenCitySelector: () => void;
  onOpenHijriCalendar: () => void;
  onToggleMute: () => void;
  onToggleBatterySaver: () => void;
  onOpenWidgetMode: () => void;
  batteryLevel: number | null;
  isOffline: boolean;
  gpsActive: boolean;
}

export const CompactMainCard: React.FC<CompactMainCardProps> = ({
  nextPrayer,
  prayers,
  city,
  currentTime,
  settings,
  onOpenCitySelector,
  onOpenHijriCalendar,
  onToggleMute,
  onToggleBatterySaver,
  onOpenWidgetMode,
  batteryLevel,
  isOffline,
  gpsActive,
}) => {
  const { isInstallable, install } = usePWAInstall();

  const pad = (n: number) => String(n).padStart(2, '0');
  const clockHours = pad(currentTime.getHours());
  const clockMinutes = pad(currentTime.getMinutes());
  const clockSeconds = pad(currentTime.getSeconds());

  // Main 5 prayers list for the quick overview strip
  const mainPrayers: { key: PrayerName; label: string }[] = [
    { key: 'fajr', label: 'Subuh' },
    { key: 'dhuhr', label: 'Dzuhur' },
    { key: 'asr', label: 'Ashar' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isya' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 border border-emerald-500/50 p-4 shadow-xl shadow-emerald-950/50 text-white">
      {/* Decorative Islamic Star Pattern */}
      <IslamicStarPattern opacity={0.08} />

      {/* 1. TOP BAR: APP BRAND, SALAM, AND QUICK CONTROLS */}
      <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-emerald-900/60">
        {/* Brand & Salam */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm border border-emerald-400/30">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C10.5 4 8 7 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7 13.5 4 12 2M12 16C7.58 16 4 18.24 4 21V22H20V21C20 18.24 16.42 16 12 16Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black tracking-tight text-white leading-none">
                Demi Waktu
              </h1>
              {isOffline && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Offline
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-300/80 leading-tight">
              Assalamu&apos;alaikum
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Quick Hijri Calendar button */}
          <button
            onClick={onOpenHijriCalendar}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/50 transition active:scale-95"
            title="Kalender Hijriah & Masehi"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95 transition"
              title="Install ke Layar HP"
            >
              <Smartphone className="w-3 h-3" />
              <span>Install</span>
            </button>
          )}

          {/* Mini Widget button */}
          <button
            onClick={onOpenWidgetMode}
            className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition active:scale-95"
            title="Buka Widget Mengambang"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Battery Saver */}
          <button
            onClick={onToggleBatterySaver}
            className={`p-1.5 rounded-lg transition active:scale-95 flex items-center gap-0.5 text-[10px] font-mono ${
              settings.batterySaver
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
            title={settings.batterySaver ? 'Hemat Baterai Aktif' : 'Mode Hemat Baterai'}
          >
            <Zap className={`w-3.5 h-3.5 ${settings.batterySaver ? 'text-amber-400 fill-amber-400' : ''}`} />
            {batteryLevel !== null && <span>{batteryLevel}%</span>}
          </button>

          {/* Mute All Sound */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg transition active:scale-95 ${
              settings.muteAll
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-stone-400 hover:text-emerald-300 hover:bg-emerald-950/50'
            }`}
            title={settings.muteAll ? 'Suara Dibisukan' : 'Suara Aktif'}
          >
            {settings.muteAll ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* 2. SUB-ROW: LOCATION & DUAL DATE CHIP */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-2 pb-1.5 text-xs">
        {/* City button */}
        <button
          onClick={onOpenCitySelector}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-600/40 text-emerald-200 text-[11px] font-semibold active:scale-95 transition truncate max-w-[170px]"
        >
          {gpsActive ? (
            <Navigation className="w-3 h-3 text-emerald-400 animate-pulse flex-shrink-0" />
          ) : (
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          )}
          <span className="truncate">{city.name}</span>
          <span className="text-[9px] text-emerald-400 font-bold ml-0.5">Ubah</span>
        </button>

        {/* Date Chip */}
        <button
          onClick={onOpenHijriCalendar}
          className="flex items-center gap-1 text-[11px] text-stone-300 bg-black/50 hover:bg-black/70 px-2.5 py-1 rounded-full border border-emerald-900/50 active:scale-95 transition"
        >
          <Calendar className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          <span className="font-medium truncate max-w-[150px]">{prayers.hijriFormatted.split(' ')[0]} {prayers.hijriFormatted.split(' ')[1]}</span>
          <span className="text-[10px] text-emerald-400 font-bold">➔</span>
        </button>
      </div>

      {/* 3. CORE COUNTDOWN & CLOCK BLOCK */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 items-center py-2 px-1">
        {/* Left: Next Prayer & Progress */}
        <div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <RubElHizbIcon size={12} className="text-emerald-400" />
            <span>Berikutnya: {nextPrayer.displayName}</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-white tracking-tight">
              {nextPrayer.timeString}
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold">WIB</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono mt-0.5">
            <Clock className="w-2.5 h-2.5 text-emerald-400" />
            <span>Kini: {clockHours}:{clockMinutes}</span>
            {!settings.batterySaver && (
              <span className="text-emerald-500 text-[9px]">:{clockSeconds}</span>
            )}
          </div>

          {/* Mini progress bar */}
          <div className="w-full mt-1.5">
            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden p-0.2 border border-emerald-900/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${nextPrayer.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: High-Contrast Countdown Digits */}
        <div className="flex flex-col items-end justify-center">
          <span className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-bold mb-1">
            Hitung Mundur
          </span>
          <div className="flex items-center gap-1 font-mono">
            <div className="px-2 py-1.5 rounded-xl bg-black/75 border border-emerald-500/40 text-center shadow-inner">
              <span className="text-base sm:text-lg font-black text-emerald-300 block leading-none">
                {pad(nextPrayer.hours)}
              </span>
              <span className="text-[8px] uppercase tracking-tight text-stone-400 font-sans block mt-0.5">
                Jam
              </span>
            </div>

            <span className="text-emerald-400 font-bold text-sm">:</span>

            <div className="px-2 py-1.5 rounded-xl bg-black/75 border border-emerald-500/40 text-center shadow-inner">
              <span className="text-base sm:text-lg font-black text-white block leading-none">
                {pad(nextPrayer.minutes)}
              </span>
              <span className="text-[8px] uppercase tracking-tight text-stone-400 font-sans block mt-0.5">
                Mnt
              </span>
            </div>

            <span className="text-emerald-400 font-bold text-sm">:</span>

            <div className="px-2 py-1.5 rounded-xl bg-black/75 border border-emerald-500/40 text-center shadow-inner">
              <span className="text-base sm:text-lg font-black text-teal-300 block leading-none">
                {pad(nextPrayer.seconds)}
              </span>
              <span className="text-[8px] uppercase tracking-tight text-stone-400 font-sans block mt-0.5">
                Dtk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM 5-PRAYER QUICK RIBBON (Single glance for all prayers) */}
      <div className="relative z-10 pt-2 border-t border-emerald-900/60 mt-1">
        <div className="grid grid-cols-5 gap-1 text-center">
          {mainPrayers.map((p) => {
            const isNext = nextPrayer.name === p.key;
            const timeStr = prayers[p.key] || '--:--';
            const alertCfg = settings.prayerAlerts[p.key] || { enabled: true };

            return (
              <div
                key={p.key}
                className={`py-1.5 px-0.5 rounded-xl transition ${
                  isNext
                    ? 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white font-extrabold shadow-md shadow-emerald-950 ring-1 ring-emerald-300'
                    : 'bg-black/40 text-stone-300 border border-emerald-950/60'
                }`}
              >
                <span className={`text-[10px] block leading-none truncate ${isNext ? 'text-white font-black' : 'text-stone-400'}`}>
                  {p.label}
                </span>
                <span className={`font-mono text-xs block leading-tight mt-0.5 ${isNext ? 'text-emerald-100 font-extrabold' : 'text-stone-200'}`}>
                  {timeStr}
                </span>
                <div className="flex items-center justify-center mt-0.5">
                  {!alertCfg.enabled || settings.muteAll ? (
                    <BellOff className="w-2.5 h-2.5 text-stone-500" />
                  ) : (
                    <Bell className={`w-2.5 h-2.5 ${isNext ? 'text-white' : 'text-emerald-400'}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
