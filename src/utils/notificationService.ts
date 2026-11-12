/**
 * Notification & Vibration Trigger for Prayer Times
 * - Web/PWA: memakai Notification API + Service Worker
 * - APK Android (Capacitor): memakai @capacitor/local-notifications
 */
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const isNative = () => Capacitor.isNativePlatform();

export async function requestNotificationPermission(): Promise<boolean> {
  if (isNative()) {
    try {
      const current = await LocalNotifications.checkPermissions();
      if (current.display === 'granted') return true;
      const res = await LocalNotifications.requestPermissions();
      return res.display === 'granted';
    } catch {
      return false;
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }
  return false;
}

async function dispatch(title: string, body: string, tag: string) {
  if (isNative()) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') return;
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Date.now() % 2147483647),
            title,
            body,
            smallIcon: 'ic_stat_icon_config_sample',
          },
        ],
      });
    } catch (e) {
      console.warn('Could not dispatch native notification:', e);
    }
    return;
  }

  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const options: NotificationOptions = {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag,
      requireInteraction: false,
      silent: false,
    };
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, options));
    } else {
      new Notification(title, options);
    }
  } catch (e) {
    console.warn('Could not dispatch notification:', e);
  }
}

export function sendPrayerNotification(prayerName: string, timeStr: string, locationName: string) {
  dispatch(
    `Waktu ${prayerName} Telah Tiba (${timeStr})`,
    `Saatnya menunaikan ibadah Sholat ${prayerName} untuk wilayah ${locationName}. Mari dirikan sholat tepat waktu.`,
    `prayer-${prayerName}-${Date.now()}`,
  );
}

/** Pengingat 7 menit sebelum waktu sholat */
export function sendEarlyPrayerNotification(prayerName: string, timeStr: string, minutesLeft: number = 7) {
  dispatch(
    `⏳ ${minutesLeft} Menit Menuju Waktu ${prayerName} (${timeStr})`,
    `Waktu sholat ${prayerName} akan masuk dalam ${minutesLeft} menit lagi. Mari bersiap berwudhu dan merapikan urusan.`,
    `early-prayer-${prayerName}-${Date.now()}`,
  );
}

/** Pengingat 1 hari sebelum hari besar Islam */
export function sendEarlyEventNotification(eventTitle: string, eventVirtue: string) {
  dispatch(
    `🌙 Besok: ${eventTitle}`,
    `Peringatan hari besar besok: ${eventVirtue.slice(0, 120)}... Siapkan niat dan amalan terbaik Anda.`,
    `early-event-${eventTitle}-${Date.now()}`,
  );
}
