# Cara Membuat APK "Demi Waktu"

## Cara termudah (tanpa Android Studio) — GitHub Actions
1. Buat repository baru di GitHub, lalu upload seluruh isi folder ini (branch `main`).
2. Buka tab **Actions** → workflow **Build APK Android** → **Run workflow**
   (juga otomatis berjalan setiap push).
3. Tunggu ±5–8 menit, lalu unduh artifact **DemiWaktu-APK** → ekstrak → `app-debug.apk`.
4. Kirim ke HP, izinkan "Install dari sumber tidak dikenal", lalu instal.

## Cara lokal (butuh Node 22, JDK 21, Android Studio/SDK)
```bash
npm install
npm run build
npx cap add android
# tambahkan izin ACCESS_FINE_LOCATION, POST_NOTIFICATIONS, VIBRATE
# di android/app/src/main/AndroidManifest.xml
npx cap sync android
cd android && ./gradlew assembleDebug
# hasil: android/app/build/outputs/apk/debug/app-debug.apk
```

## Catatan
- APK debug sudah bisa diinstal. Untuk Play Store, buat keystore dan build `assembleRelease`/AAB.
- Notifikasi hanya muncul saat aplikasi berjalan (sama seperti versi web). Untuk alarm
  saat aplikasi tertutup, perlu penjadwalan native tambahan.
