import React, { useState } from 'react';
import {
  X,
  Volume2,
  Zap,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Play,
  Square,
  Check,
  Vibrate,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppSettings } from '../hooks/useAppSettings';
import { AdzanSoundType, audioEngine } from '../utils/audioEngine';
import { requestNotificationPermission } from '../utils/notificationService';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { RubElHizbIcon } from './IslamicOrnaments';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onOpenWidgetGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenWidgetGuide,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string>(() => {
    if (typeof Notification !== 'undefined') {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const { isInstallable, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleTestSound = (soundType: AdzanSoundType) => {
    if (isPlayingAudio) {
      audioEngine.stopAll();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioEngine.playSound(soundType, () => setIsPlayingAudio(false));
    }
  };

  const handleRequestNotification = async () => {
    const granted = await requestNotificationPermission();
    setNotificationStatus(granted ? 'granted' : 'denied');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-emerald-500/40 shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-stone-800 bg-emerald-950/40">
          <div className="flex items-center gap-2">
            <RubElHizbIcon size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Pengaturan Aplikasi</h3>
          </div>
          <button
            onClick={() => {
              audioEngine.stopAll();
              setIsPlayingAudio(false);
              onClose();
            }}
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grouped Settings List (Compact Thin Rows) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs no-scrollbar">
          {/* GROUP 1: TAMPILAN & HEMAT DAYA */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-1">
              Tampilan &amp; Layar
            </span>

            <div className="rounded-2xl bg-stone-950/80 border border-stone-800/80 overflow-hidden divide-y divide-stone-800/60">
              {/* Theme Selector: 3 compact buttons */}
              <div className="p-2.5 flex items-center justify-between gap-2">
                <span className="font-semibold text-stone-200">Tema Warna</span>
                <div className="flex rounded-xl bg-stone-900 p-0.5 border border-stone-800">
                  <button
                    onClick={() => onUpdateSettings({ theme: 'amoled' })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                      settings.theme === 'amoled'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    AMOLED
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                      settings.theme === 'dark'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Slate
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                      settings.theme === 'light'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Terang
                  </button>
                </div>
              </div>

              {/* Battery Saver Toggle */}
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <span className="font-semibold text-stone-200 block leading-tight">
                      Mode Hemat Baterai Ekstra
                    </span>
                    <span className="text-[10px] text-stone-400 leading-none">
                      Meredam animasi dan siklus komputasi saat latar belakang
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onUpdateSettings({ batterySaver: !settings.batterySaver })}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    settings.batterySaver ? 'bg-amber-500' : 'bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                      settings.batterySaver ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* GROUP 2: SUARA & ADZAN OTOMATIS */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-1">
              Alarm Adzan Otomatis
            </span>

            <div className="rounded-2xl bg-stone-950/80 border border-stone-800/80 overflow-hidden divide-y divide-stone-800/60">
              {/* Sound Selector Dropdown/Grid */}
              <div className="p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-200">Pilihan Nada Adzan</span>
                  <button
                    onClick={() => handleTestSound(settings.prayerAlerts.maghrib?.soundType || 'adzan_default')}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-600/50 text-emerald-300 active:scale-95 transition"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Square className="w-2.5 h-2.5 fill-current text-red-400" />
                        <span className="text-red-400">Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Uji Suara</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    ...(audioEngine.hasCustomAudio()
                      ? [{ id: 'adzan_custom', label: `🎧 Kustom: ${audioEngine.getCustomAudioName()?.slice(0, 20)}` }]
                      : []),
                    { id: 'adzan_default', label: 'Adzan Merdu (Default)' },
                    { id: 'adzan_melodic', label: 'Adzan Melodik (Sintetis)' },
                    { id: 'bedug_takbir', label: 'Bedug Nusantara' },
                    { id: 'adzan_short', label: 'Adzan Pendek (4s)' },
                    { id: 'soft_chime', label: 'Notifikasi Halus' },
                  ].map((s) => {
                    const isSelected = settings.prayerAlerts.maghrib?.soundType === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          const updated = { ...settings.prayerAlerts };
                          (Object.keys(updated) as (keyof typeof updated)[]).forEach((p) => {
                            updated[p].soundType = s.id as AdzanSoundType;
                          });
                          onUpdateSettings({ prayerAlerts: updated });
                        }}
                        className={`py-1.5 px-2 rounded-xl text-left border text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                        } ${s.id === 'adzan_default' ? 'col-span-2 flex items-center justify-between' : ''}`}
                      >
                        <span>{s.label}</span>
                        {s.id === 'adzan_default' && isSelected && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-bold">
                            Aktif
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Adzan File Upload */}
              <div className="p-2.5 bg-emerald-950/30 border-t border-b border-emerald-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-200 block text-xs">
                      Unggah File Adzan Sendiri
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Format MP3 / WAV / MPEG (rekaman adzan favorit Anda)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-[11px] shadow-sm transition active:scale-95 border border-emerald-400/30 text-center">
                      <span>📁 Pilih File Audio Adzan</span>
                    </div>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.ogg,.m4a,.mpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              audioEngine.setCustomAudio(result, file.name);
                              // set all prayer alerts to adzan_custom
                              const updated = { ...settings.prayerAlerts };
                              (Object.keys(updated) as (keyof typeof updated)[]).forEach((p) => {
                                updated[p].soundType = 'adzan_custom';
                              });
                              onUpdateSettings({ prayerAlerts: updated });
                              audioEngine.triggerVibration([50, 50, 100]);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {audioEngine.hasCustomAudio() && (
                    <button
                      onClick={() => {
                        audioEngine.removeCustomAudio();
                        // fallback to adzan_default
                        const updated = { ...settings.prayerAlerts };
                        (Object.keys(updated) as (keyof typeof updated)[]).forEach((p) => {
                          if (updated[p].soundType === 'adzan_custom') {
                            updated[p].soundType = 'adzan_default';
                          }
                        });
                        onUpdateSettings({ prayerAlerts: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-[10px] font-bold hover:bg-red-900 transition"
                      title="Hapus file audio kustom"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                {audioEngine.hasCustomAudio() && (
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40">
                    <span className="truncate">🎵 Terpasang: {audioEngine.getCustomAudioName()}</span>
                    <span className="font-bold uppercase text-[9px] text-emerald-400 ml-1">Kustom Aktif</span>
                  </div>
                )}
              </div>

              {/* Volume Slider */}
              <div className="p-2.5 flex items-center justify-between gap-3">
                <span className="font-semibold text-stone-200 flex-shrink-0">
                  Volume ({Math.round(settings.volume * 100)}%)
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.volume}
                  onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5"
                />
              </div>
            </div>
          </div>

          {/* GROUP 3: NOTIFIKASI & PERINGATAN AWAL */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-1">
              Notifikasi &amp; Peringatan Dini
            </span>

            <div className="rounded-2xl bg-stone-950/80 border border-stone-800/80 overflow-hidden divide-y divide-stone-800/60">
              {/* Early Prayer Alert (7 Menit Sebelum Waktu Sholat) */}
              <label className="p-2.5 flex items-center justify-between cursor-pointer bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <span className="font-semibold text-stone-200 block leading-tight">
                      Peringatan 7 Menit Sebelum Sholat
                    </span>
                    <span className="text-[10px] text-stone-400 leading-none">
                      Waktu bersiap wudhu &amp; menyegerakan ke masjid
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.earlyPrayerReminder}
                  onChange={(e) => onUpdateSettings({ earlyPrayerReminder: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Early Islamic Event Alert (1 Hari Sebelum Hari Besar) */}
              <label className="p-2.5 flex items-center justify-between cursor-pointer bg-teal-950/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <div>
                    <span className="font-semibold text-stone-200 block leading-tight">
                      Peringatan H-1 Hari Besar Islam
                    </span>
                    <span className="text-[10px] text-stone-400 leading-none">
                      Pengingat 1 hari sebelum puasa sunnah &amp; hari raya
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.earlyEventReminder}
                  onChange={(e) => onUpdateSettings({ earlyEventReminder: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Native Push Notification */}
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-stone-200">Notifikasi Banner HP</span>
                </div>
                {notificationStatus !== 'granted' ? (
                  <button
                    onClick={handleRequestNotification}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                  >
                    Izinkan
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Aktif
                  </span>
                )}
              </div>

              {/* Haptic Vibration */}
              <label className="p-2.5 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-semibold text-stone-200">Getar Saat Adzan &amp; Kiblat</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.vibrationEnabled}
                  onChange={(e) => onUpdateSettings({ vibrationEnabled: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
              </label>

              {/* Show Imsak */}
              <label className="p-2.5 flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-stone-200 pl-5">Tampilkan Waktu Imsak</span>
                <input
                  type="checkbox"
                  checked={settings.showImsak}
                  onChange={(e) => onUpdateSettings({ showImsak: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
              </label>

              {/* Show Sunrise */}
              <label className="p-2.5 flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-stone-200 pl-5">Tampilkan Waktu Terbit (Syuruq)</span>
                <input
                  type="checkbox"
                  checked={settings.showSunrise}
                  onChange={(e) => onUpdateSettings({ showSunrise: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* GROUP 4: SHORTCUT & HOMESCREEN WIDGET */}
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white block text-xs">Pasang ke Layar Utama</span>
                <span className="text-[10px] text-stone-400">PWA &amp; Widget Homescreen Android</span>
              </div>
            </div>

            <div className="flex gap-1.5">
              {isInstallable && (
                <button
                  onClick={install}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                >
                  Install
                </button>
              )}
              <button
                onClick={onOpenWidgetGuide}
                className="px-2.5 py-1 rounded-lg bg-stone-800 text-emerald-300 font-bold text-[10px]"
              >
                Panduan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
