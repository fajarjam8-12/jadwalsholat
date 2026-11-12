import React from 'react';
import { Volume2, Bell, BellOff, Play, Sun, Sunset, Moon, Sunrise } from 'lucide-react';
import { PrayerName, PrayerTimesData, NextPrayerInfo, PRAYER_DISPLAY_NAMES } from '../utils/prayerEngine';
import { AppSettings } from '../hooks/useAppSettings';
import { AdzanSoundType } from '../utils/audioEngine';
import { RubElHizbIcon } from './IslamicOrnaments';

interface PrayerListProps {
  prayers: PrayerTimesData;
  nextPrayer: NextPrayerInfo;
  settings: AppSettings;
  onUpdateAlert: (prayer: PrayerName, updates: { enabled: boolean; soundType?: AdzanSoundType }) => void;
  onPreviewSound: (type: AdzanSoundType) => void;
  isPlayingPreview: boolean;
}

export const PrayerList: React.FC<PrayerListProps> = ({
  prayers,
  nextPrayer,
  settings,
  onUpdateAlert,
  onPreviewSound,
  isPlayingPreview,
}) => {
  const prayerKeys: PrayerName[] = [
    ...(settings.showImsak ? (['imsak'] as PrayerName[]) : []),
    'fajr',
    ...(settings.showSunrise ? (['sunrise'] as PrayerName[]) : []),
    'dhuhr',
    'asr',
    'maghrib',
    'isha',
  ];

  const getPrayerIcon = (name: PrayerName) => {
    switch (name) {
      case 'imsak':
        return <Moon className="w-3.5 h-3.5 text-teal-400" />;
      case 'fajr':
        return <Sunrise className="w-3.5 h-3.5 text-emerald-400" />;
      case 'sunrise':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="w-3.5 h-3.5 text-emerald-300" />;
      case 'asr':
        return <Sun className="w-3.5 h-3.5 text-teal-400" />;
      case 'maghrib':
        return <Sunset className="w-3.5 h-3.5 text-emerald-400" />;
      case 'isha':
        return <Moon className="w-3.5 h-3.5 text-teal-300" />;
    }
  };

  const getTimeForPrayer = (name: PrayerName): string => {
    return prayers[name] || '--:--';
  };

  const handleCycleAlert = (name: PrayerName) => {
    const current = settings.prayerAlerts[name] || { enabled: true, soundType: 'adzan_default' };
    if (!current.enabled) {
      onUpdateAlert(name, { enabled: true, soundType: 'adzan_default' });
    } else if (current.soundType === 'adzan_default' || current.soundType === 'adzan_melodic') {
      onUpdateAlert(name, { enabled: true, soundType: 'soft_chime' });
    } else {
      onUpdateAlert(name, { enabled: false });
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-1 mb-0.5">
        <h2 className="text-[11px] font-bold text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
          <RubElHizbIcon size={12} className="text-emerald-400" />
          <span>Jadwal Waktu Sholat Lengkap</span>
        </h2>
        <button
          onClick={() => onPreviewSound(settings.prayerAlerts.maghrib?.soundType || 'adzan_default')}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 hover:border-emerald-500 text-emerald-300 text-[10px] font-semibold active:scale-95 transition"
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>{isPlayingPreview ? 'Berhenti' : 'Tes Adzan'}</span>
        </button>
      </div>

      <div className="space-y-1">
        {prayerKeys.map((name) => {
          const isNext = nextPrayer.name === name;
          const time = getTimeForPrayer(name);
          const alertConfig = settings.prayerAlerts[name] || { enabled: true, soundType: 'adzan_default' };
          const isAdzanSound =
            alertConfig.soundType === 'adzan_default' ||
            alertConfig.soundType === 'adzan_custom' ||
            alertConfig.soundType === 'adzan_melodic' ||
            alertConfig.soundType === 'adzan_short' ||
            alertConfig.soundType === 'bedug_takbir';

          return (
            <div
              key={name}
              className={`flex items-center justify-between py-2 px-3 rounded-xl border transition-all ${
                isNext
                  ? 'bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border-emerald-400/80 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400/50'
                  : 'bg-stone-900/60 dark:bg-stone-900/40 border-stone-800/80 hover:border-emerald-800/60'
              }`}
            >
              {/* Left: Icon & Name */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                    isNext
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50'
                      : 'bg-stone-800/70 text-stone-400'
                  }`}
                >
                  {getPrayerIcon(name)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold ${
                      isNext ? 'text-white' : 'text-stone-200'
                    }`}
                  >
                    {PRAYER_DISPLAY_NAMES[name]}
                  </span>
                  {isNext && (
                    <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-400 text-stone-950 animate-pulse">
                      Kini
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Time & Alert toggle */}
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <span
                    className={`font-mono text-sm font-extrabold tracking-tight ${
                      isNext ? 'text-emerald-300' : 'text-stone-100'
                    }`}
                  >
                    {time}
                  </span>
                  <span className="text-[9px] text-stone-400 ml-1">WIB</span>
                </div>

                {/* Alarm Bell Button */}
                <button
                  onClick={() => handleCycleAlert(name)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition active:scale-95 ${
                    !alertConfig.enabled || settings.muteAll
                      ? 'bg-stone-800/50 text-stone-500 hover:text-stone-300'
                      : isAdzanSound
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50'
                      : 'bg-teal-500/25 text-teal-300 border border-teal-400/50'
                  }`}
                  title={
                    !alertConfig.enabled || settings.muteAll
                      ? 'Bisu'
                      : isAdzanSound
                      ? 'Adzan'
                      : 'Notifikasi'
                  }
                >
                  {!alertConfig.enabled || settings.muteAll ? (
                    <BellOff className="w-3 h-3" />
                  ) : isAdzanSound ? (
                    <Volume2 className="w-3 h-3" />
                  ) : (
                    <Bell className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
