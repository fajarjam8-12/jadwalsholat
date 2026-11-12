/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CompactMainCard } from './components/CompactMainCard';
import { PrayerList } from './components/PrayerList';
import { IslamicStoriesView } from './components/IslamicStoriesView';
import { DzikirDoaSection } from './components/DzikirDoaSection';
import { ContextualSunnahCard } from './components/ContextualSunnahCard';
import { HijriCalendarView } from './components/HijriCalendarView';
import { IstiqomahTracker } from './components/IstiqomahTracker';
import { DailyHaditsCard } from './components/DailyHaditsCard';
import { CitySelectorModal } from './components/CitySelectorModal';
import { SettingsModal } from './components/SettingsModal';
import { MiniWidgetFloating, WidgetGuideModal } from './components/MiniWidget';
import { AdzanRingingBanner } from './components/AdzanRingingBanner';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { useAppSettings } from './hooks/useAppSettings';
import {
  getPrayerTimes,
  getNextPrayer,
  PrayerTimesData,
  NextPrayerInfo,
  calculateAstronomicalPrayerTimes,
  PrayerName,
  ADZAN_PRAYERS,
} from './utils/prayerEngine';
import { CityInfo, DEFAULT_CITY, POPULAR_CITIES } from './data/cities';
import { audioEngine, AdzanSoundType } from './utils/audioEngine';
import {
  sendPrayerNotification,
  sendEarlyPrayerNotification,
  sendEarlyEventNotification,
} from './utils/notificationService';
import { getDetailedHijriDate, getTomorrowIslamicEvents } from './data/islamicEvents';
import { getContextualSunnahPractices } from './data/sunnahPractices';
import { Volume2, VolumeX, Zap, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function App() {
  const {
    settings,
    updateSettings,
    toggleMuteAll,
    setPrayerAlert,
    batteryLevel,
  } = useAppSettings();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');

  // Sub-tab for compact home view: 'prayers' | 'sunnah' | 'hadits'
  const [homeSubTab, setHomeSubTab] = useState<'prayers' | 'sunnah' | 'hadits'>('prayers');

  // Time & Location
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [city, setCity] = useState<CityInfo>(settings.selectedCity || DEFAULT_CITY);
  const [gpsActive, setGpsActive] = useState<boolean>(settings.locationMode === 'gps');
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);

  // Prayer data
  const [prayers, setPrayers] = useState<PrayerTimesData>(() =>
    calculateAstronomicalPrayerTimes(new Date(), DEFAULT_CITY.latitude, DEFAULT_CITY.longitude, 7)
  );
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo>(() =>
    getNextPrayer(new Date(), prayers)
  );

  // Modals & Floating Widgets
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isWidgetGuideOpen, setIsWidgetGuideOpen] = useState(false);
  const [isMiniWidgetOpen, setIsMiniWidgetOpen] = useState(false);

  // Audio & Alarm
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [ringingPrayer, setRingingPrayer] = useState<PrayerName | null>(null);
  const [ringingTime, setRingingTime] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  const triggeredPrayersRef = useRef<Set<string>>(new Set());

  // Unlock AudioContext on first tap
  useEffect(() => {
    const handleFirstTouch = () => {
      audioEngine.unlockAudio();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('click', handleFirstTouch, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  // Online / Offline status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch or calculate prayer times whenever city or date changes
  const fetchPrayers = useCallback(async (targetDate: Date, targetCity: CityInfo) => {
    try {
      const data = await getPrayerTimes(targetDate, targetCity.latitude, targetCity.longitude, targetCity.timezone);
      setPrayers(data);
      setNextPrayer(getNextPrayer(targetDate, data));
    } catch (err) {
      console.warn('Error fetching prayer times, using offline formula', err);
      const fallback = calculateAstronomicalPrayerTimes(targetDate, targetCity.latitude, targetCity.longitude);
      setPrayers(fallback);
      setNextPrayer(getNextPrayer(targetDate, fallback));
    }
  }, []);

  useEffect(() => {
    fetchPrayers(new Date(), city);
  }, [city, fetchPrayers]);

  // Battery-Conscious Clock Loop & Real-Time Adzan Checking
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const checkAlarmAndTick = () => {
      const now = new Date();
      setCurrentTime(now);

      const next = getNextPrayer(now, prayers);
      setNextPrayer(next);

      const pad = (n: number) => String(n).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const todayDateStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

      const currentTotalMin = now.getHours() * 60 + now.getMinutes();

      // Check 1: Exact Adzan Time Trigger
      ADZAN_PRAYERS.forEach((prayerName) => {
        const prayerTime = prayers[prayerName];
        if (prayerTime && prayerTime === timeStr) {
          const key = `${todayDateStr}_${prayerName}`;
          if (!triggeredPrayersRef.current.has(key)) {
            triggeredPrayersRef.current.add(key);

            sendPrayerNotification(next.displayName, prayerTime, city.name);

            const alertConfig = settings.prayerAlerts[prayerName];
            if (alertConfig && alertConfig.enabled && !settings.muteAll) {
              setRingingPrayer(prayerName);
              setRingingTime(prayerTime);
              audioEngine.playSound(alertConfig.soundType, () => {
                setRingingPrayer(null);
              });
            }
          }
        }

        // Check 2: 7-Minute Early Prayer Reminder (Peringatan 7 menit sebelum masuk waktu sholat)
        if (settings.earlyPrayerReminder && prayerTime) {
          const [ph, pm] = prayerTime.split(':').map(Number);
          const prayerTotalMin = ph * 60 + pm;
          const diffMinutes = prayerTotalMin - currentTotalMin;

          if (diffMinutes === (settings.earlyPrayerReminderMinutes || 7)) {
            const earlyKey = `early7m_${todayDateStr}_${prayerName}`;
            if (!triggeredPrayersRef.current.has(earlyKey)) {
              triggeredPrayersRef.current.add(earlyKey);
              sendEarlyPrayerNotification(prayerName.toUpperCase(), prayerTime, settings.earlyPrayerReminderMinutes || 7);
              if (!settings.muteAll) {
                audioEngine.playSound('soft_chime');
              }
            }
          }
        }
      });

      // Check 3: 1-Day Early Reminder for Major Islamic Events (Peringatan H-1 Hari Besar)
      if (settings.earlyEventReminder) {
        const eventKey = `early_event_${todayDateStr}`;
        if (!triggeredPrayersRef.current.has(eventKey)) {
          const hijri = getDetailedHijriDate(now);
          const tomorrowEvents = getTomorrowIslamicEvents(hijri);
          if (tomorrowEvents.length > 0) {
            triggeredPrayersRef.current.add(eventKey);
            tomorrowEvents.forEach((ev) => {
              sendEarlyEventNotification(ev.title, ev.virtue || ev.description);
            });
          }
        }
      }
    };

    const intervalMs = settings.batterySaver && document.hidden ? 10000 : 1000;
    timerId = setInterval(checkAlarmAndTick, intervalMs);

    const handleVisibility = () => {
      if (!document.hidden) {
        checkAlarmAndTick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prayers, city, settings]);

  const handlePreviewSound = (type: AdzanSoundType) => {
    if (isPlayingPreview) {
      audioEngine.stopAll();
      setIsPlayingPreview(false);
    } else {
      setIsPlayingPreview(true);
      audioEngine.playSound(type, () => setIsPlayingPreview(false));
    }
  };

  const handleStopAdzan = () => {
    audioEngine.stopAll();
    setRingingPrayer(null);
  };

  const handleSnooze = () => {
    audioEngine.stopAll();
    setRingingPrayer(null);
    setTimeout(() => {
      if (!settings.muteAll) {
        audioEngine.playSound('soft_chime');
      }
    }, 5 * 60 * 1000);
  };

  const handleOpenDoaFromBanner = () => {
    handleStopAdzan();
    setActiveTab('istiqomah');
  };

  const handleUseGPS = async () => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung fitur Geolocation GPS.');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGPS(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let closestCity = DEFAULT_CITY;
        let minDistance = Infinity;

        POPULAR_CITIES.forEach((c) => {
          const d = Math.hypot(c.latitude - lat, c.longitude - lng);
          if (d < minDistance) {
            minDistance = d;
            closestCity = c;
          }
        });

        const gpsCity: CityInfo = {
          id: 'gps-current',
          name: `GPS: ${closestCity.name}`,
          province: closestCity.province,
          country: closestCity.country,
          latitude: lat,
          longitude: lng,
          timezone: closestCity.timezone,
        };

        setCity(gpsCity);
        setGpsActive(true);
        updateSettings({
          locationMode: 'gps',
          selectedCity: gpsCity,
        });
      },
      (err) => {
        setIsLocatingGPS(false);
        console.warn('Geolocation error:', err);
        alert('Gagal mendapatkan lokasi GPS. Pastikan izin lokasi aktif.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectCity = (newCity: CityInfo) => {
    setCity(newCity);
    setGpsActive(false);
    updateSettings({
      locationMode: 'manual',
      selectedCity: newCity,
    });
  };

  const hijriDateDetails = getDetailedHijriDate(currentTime);
  const contextualSunnah = getContextualSunnahPractices(currentTime, hijriDateDetails.day, prayers);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans transition-colors pb-20 selection:bg-emerald-500 selection:text-stone-950">
      {/* Top Bar for secondary tabs (Calendar, Istiqomah, Qibla, Settings) */}
      {activeTab !== 'schedule' && (
        <header className="sticky top-0 z-30 w-full px-3 py-2 backdrop-blur-md bg-stone-950/85 border-b border-emerald-950/80">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold">
                🕌
              </div>
              <h1 className="text-sm font-extrabold text-white">Demi Waktu</h1>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMuteAll}
                className={`p-1.5 rounded-lg transition ${
                  settings.muteAll ? 'bg-red-500/20 text-red-400' : 'text-stone-400 hover:text-emerald-400'
                }`}
                title={settings.muteAll ? 'Suara Dibisukan' : 'Suara Aktif'}
              >
                {settings.muteAll ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => updateSettings({ batterySaver: !settings.batterySaver })}
                className={`p-1.5 rounded-lg transition ${
                  settings.batterySaver ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
                }`}
                title="Hemat Baterai"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Ringing Alert Banner (when Adzan sounds) */}
      <AdzanRingingBanner
        ringingPrayer={ringingPrayer}
        ringingTime={ringingTime}
        onStopAdzan={handleStopAdzan}
        onSnooze={handleSnooze}
        onOpenDoa={handleOpenDoaFromBanner}
      />

      {/* Main Viewport */}
      <main className="flex-1 w-full max-w-md mx-auto px-3 pt-2 pb-4">
        {/* ======================================================== */}
        {/* TAB 1: COMPACT SINGLE-SCREEN HOME VIEW                    */}
        {/* ======================================================== */}
        {activeTab === 'schedule' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            {/* Unified Compact Main Card (Brand + Salam + Location + Countdown + 5-Prayer Ribbon) */}
            <CompactMainCard
              nextPrayer={nextPrayer}
              prayers={prayers}
              city={city}
              currentTime={currentTime}
              settings={settings}
              onOpenCitySelector={() => setIsCityModalOpen(true)}
              onOpenHijriCalendar={() => setActiveTab('calendar')}
              onToggleMute={toggleMuteAll}
              onToggleBatterySaver={() => updateSettings({ batterySaver: !settings.batterySaver })}
              onOpenWidgetMode={() => setIsMiniWidgetOpen(true)}
              batteryLevel={batteryLevel}
              isOffline={isOffline}
              gpsActive={gpsActive}
            />

            {/* Compact Segmented Control (Pill Tabs) for Secondary Views */}
            <div className="flex rounded-xl bg-stone-900/90 p-1 border border-emerald-900/70 shadow-sm">
              <button
                onClick={() => setHomeSubTab('prayers')}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 active:scale-95 ${
                  homeSubTab === 'prayers'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-400/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Jadwal Lengkap</span>
              </button>

              <button
                onClick={() => setHomeSubTab('sunnah')}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 active:scale-95 ${
                  homeSubTab === 'sunnah'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-400/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sunnah Hari Ini</span>
              </button>

              <button
                onClick={() => setHomeSubTab('hadits')}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 active:scale-95 ${
                  homeSubTab === 'hadits'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-400/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Hadits Harian</span>
              </button>
            </div>

            {/* Sub-view Content: Fits neatly in the remaining single-screen height */}
            <div className="transition-all duration-200">
              {homeSubTab === 'prayers' && (
                <PrayerList
                  prayers={prayers}
                  nextPrayer={nextPrayer}
                  settings={settings}
                  onUpdateAlert={(prayerName, updates) => setPrayerAlert(prayerName, updates)}
                  onPreviewSound={handlePreviewSound}
                  isPlayingPreview={isPlayingPreview}
                />
              )}

              {homeSubTab === 'sunnah' && (
                <ContextualSunnahCard
                  activePractices={contextualSunnah.activePractices}
                  allPractices={contextualSunnah.allPractices}
                  fridaySpecial={contextualSunnah.fridaySpecial}
                  fastingSpecial={contextualSunnah.fastingSpecial}
                />
              )}

              {homeSubTab === 'hadits' && (
                <DailyHaditsCard currentDate={currentTime} />
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: KALENDER HIJRIAH & MASEHI BERDAMPINGAN            */}
        {/* ======================================================== */}
        {activeTab === 'calendar' && (
          <div className="animate-in fade-in duration-150">
            <HijriCalendarView currentDate={currentTime} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ISTIQOMAH AMALAN & EVALUASI 30 HARI               */}
        {/* ======================================================== */}
        {activeTab === 'istiqomah' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <IstiqomahTracker currentDate={currentTime} />
            <DzikirDoaSection />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: 1001 KISAH ISLAMI, PARA NABI & SAHABAT            */}
        {/* ======================================================== */}
        {activeTab === 'stories' && (
          <div className="animate-in fade-in duration-150">
            <IslamicStoriesView currentDate={currentTime} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PENGATURAN                                        */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-150">
            <SettingsModal
              isOpen={true}
              onClose={() => setActiveTab('schedule')}
              settings={settings}
              onUpdateSettings={updateSettings}
              onOpenWidgetGuide={() => setIsWidgetGuideOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Mini Widget */}
      {isMiniWidgetOpen && (
        <MiniWidgetFloating
          nextPrayer={nextPrayer}
          city={city}
          isMuted={settings.muteAll}
          onToggleMute={toggleMuteAll}
          onExpand={() => {
            setIsMiniWidgetOpen(false);
            setActiveTab('schedule');
          }}
          onCloseWidget={() => setIsMiniWidgetOpen(false)}
        />
      )}

      {/* Modals */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={handleSelectCity}
        onUseGPS={handleUseGPS}
        isLocatingGPS={isLocatingGPS}
        gpsActive={gpsActive}
      />

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={settings}
          onUpdateSettings={updateSettings}
          onOpenWidgetGuide={() => setIsWidgetGuideOpen(true)}
        />
      )}

      <WidgetGuideModal
        isOpen={isWidgetGuideOpen}
        onClose={() => setIsWidgetGuideOpen(false)}
      />

      {/* Bottom Thumb Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
