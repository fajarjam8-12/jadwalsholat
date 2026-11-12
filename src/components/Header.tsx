import React from 'react';
import { Volume2, VolumeX, Battery, Zap, Smartphone, Sparkles, Moon } from 'lucide-react';
import { AppSettings } from '../hooks/useAppSettings';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { RubElHizbIcon } from './IslamicOrnaments';

interface HeaderProps {
  settings: AppSettings;
  onToggleMute: () => void;
  onToggleBatterySaver: () => void;
  onOpenWidgetMode: () => void;
  onOpenHijriCalendar: () => void;
  batteryLevel: number | null;
  isCharging: boolean | null;
  isOffline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onToggleMute,
  onToggleBatterySaver,
  onOpenWidgetMode,
  onOpenHijriCalendar,
  batteryLevel,
  isCharging,
  isOffline,
}) => {
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 w-full px-4 pt-3 pb-2 backdrop-blur-md bg-stone-950/85 dark:bg-black/90 border-b border-emerald-950/70 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo and Brand with Islamic Crescent & Minaret Crest */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 flex items-center justify-center shadow-md shadow-emerald-900/50 text-emerald-100 border border-emerald-400/40">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C10.5 4 8 7 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7 13.5 4 12 2M12 16C7.58 16 4 18.24 4 21V22H20V21C20 18.24 16.42 16 12 16Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
                Demi Waktu
              </h1>
              {isOffline && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Offline
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-400/80 leading-tight font-medium flex items-center gap-1">
              <span>Pengingat Sholat &amp; Istiqomah</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick Hijri button */}
          <button
            onClick={onOpenHijriCalendar}
            className="p-2 rounded-xl text-emerald-400 hover:text-emerald-200 hover:bg-emerald-950/60 active:scale-95 transition"
            title="Kalender Hijriah & Hari Besar"
          >
            <Moon className="w-4 h-4 text-emerald-400" />
          </button>

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-sm active:scale-95 transition border border-emerald-400/30"
              title="Install Aplikasi ke HP"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          {/* Mini Widget Launcher */}
          <button
            onClick={onOpenWidgetMode}
            className="p-2 rounded-xl text-stone-400 hover:text-emerald-400 hover:bg-emerald-950/40 active:scale-95 transition"
            title="Buka Mode Widget Mini"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Battery Saver Toggle */}
          <button
            onClick={onToggleBatterySaver}
            className={`p-2 rounded-xl transition active:scale-95 flex items-center gap-1 text-xs font-medium ${
              settings.batterySaver
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
            title={settings.batterySaver ? 'Mode Hemat Baterai Aktif' : 'Aktifkan Hemat Baterai'}
          >
            <Zap className={`w-4 h-4 ${settings.batterySaver ? 'text-amber-400 fill-amber-400' : ''}`} />
            {batteryLevel !== null && (
              <span className="text-[10px] font-mono opacity-80 hidden sm:inline">
                {batteryLevel}%
              </span>
            )}
          </button>

          {/* Mute All Sound Quick Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl transition active:scale-95 ${
              settings.muteAll
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-stone-400 hover:text-emerald-400 hover:bg-emerald-950/40'
            }`}
            title={settings.muteAll ? 'Suara Dinonaktifkan' : 'Suara Aktif'}
          >
            {settings.muteAll ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
