import { useState, useEffect } from 'react';
import { POPULAR_CITIES, DEFAULT_CITY, CityInfo } from '../data/cities';
import { AdzanSoundType, audioEngine } from '../utils/audioEngine';
import { PrayerName } from '../utils/prayerEngine';

export type AppTheme = 'amoled' | 'dark' | 'light';

export interface PrayerAlertConfig {
  enabled: boolean;
  soundType: AdzanSoundType;
}

export interface AppSettings {
  theme: AppTheme;
  batterySaver: boolean;
  muteAll: boolean;
  volume: number;
  locationMode: 'gps' | 'manual';
  selectedCity: CityInfo;
  customCoords: { lat: number; lng: number; label: string } | null;
  prayerAlerts: Record<PrayerName, PrayerAlertConfig>;
  earlyPrayerReminder: boolean; // Peringatan 7 menit sebelum masuk waktu sholat
  earlyPrayerReminderMinutes: number; // default 7
  earlyEventReminder: boolean; // Peringatan 1 hari sebelum hari besar Islam
  fajrTatswib: boolean; // "Ash-shalatu khairum minan naum" for Subuh
  vibrationEnabled: boolean;
  showImsak: boolean;
  showSunrise: boolean;
}

const SETTINGS_KEY = 'jadwal_sholat_settings_v2';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'amoled',
  batterySaver: false,
  muteAll: false,
  volume: 0.85,
  locationMode: 'manual',
  selectedCity: DEFAULT_CITY,
  customCoords: null,
  prayerAlerts: {
    imsak: { enabled: true, soundType: 'soft_chime' },
    fajr: { enabled: true, soundType: 'adzan_default' },
    sunrise: { enabled: false, soundType: 'soft_chime' },
    dhuhr: { enabled: true, soundType: 'adzan_default' },
    asr: { enabled: true, soundType: 'adzan_default' },
    maghrib: { enabled: true, soundType: 'adzan_default' },
    isha: { enabled: true, soundType: 'adzan_default' },
  },
  earlyPrayerReminder: true,
  earlyPrayerReminderMinutes: 7,
  earlyEventReminder: true,
  fajrTatswib: true,
  vibrationEnabled: true,
  showImsak: true,
  showSunrise: true,
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      let stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) {
        stored = localStorage.getItem('jadwal_sholat_settings_v1');
      }
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically migrate any prayer alert still set to adzan_melodic to new default adzan_default
        if (parsed.prayerAlerts) {
          (Object.keys(parsed.prayerAlerts) as PrayerName[]).forEach((p) => {
            if (parsed.prayerAlerts[p]?.soundType === 'adzan_melodic') {
              parsed.prayerAlerts[p].soundType = 'adzan_default';
            }
          });
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  // Sync settings to localStorage and apply theme
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}

    // Apply audio volume
    audioEngine.setVolume(settings.muteAll ? 0 : settings.volume);

    // Apply root classes
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-amoled', 'theme-light');

    if (settings.theme === 'amoled') {
      root.classList.add('dark', 'theme-amoled');
      document.body.style.backgroundColor = '#000000';
    } else if (settings.theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0c0a09';
    } else {
      root.classList.add('theme-light');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [settings]);

  // Battery API detection (helps automate battery saver)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<any> }).getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {});
    }
  }, []);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleMuteAll = () => {
    setSettings((prev) => ({ ...prev, muteAll: !prev.muteAll }));
  };

  const setPrayerAlert = (prayer: PrayerName, alertConfig: Partial<PrayerAlertConfig>) => {
    setSettings((prev) => ({
      ...prev,
      prayerAlerts: {
        ...prev.prayerAlerts,
        [prayer]: { ...prev.prayerAlerts[prayer], ...alertConfig },
      },
    }));
  };

  return {
    settings,
    updateSettings,
    toggleMuteAll,
    setPrayerAlert,
    batteryLevel,
    isCharging,
  };
}
