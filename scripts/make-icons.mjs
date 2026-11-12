import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const res = 'android/app/src/main/res';
const dens = { mdpi: [48, 108], hdpi: [72, 162], xhdpi: [96, 216], xxhdpi: [144, 324], xxxhdpi: [192, 432] };

for (const [d, [launcher, fg]] of Object.entries(dens)) {
  const dir = path.join(res, `mipmap-${d}`);
  fs.mkdirSync(dir, { recursive: true });
  await sharp('public/pwa-512x512.png').resize(launcher, launcher).toFile(path.join(dir, 'ic_launcher.png'));
  await sharp('public/pwa-512x512.png').resize(launcher, launcher).toFile(path.join(dir, 'ic_launcher_round.png'));
  await sharp('public/pwa-maskable-512x512.png').resize(fg, fg).toFile(path.join(dir, 'ic_launcher_foreground.png'));
}

const colors = path.join(res, 'values/ic_launcher_background.xml');
fs.writeFileSync(colors, '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#064E3B</color>\n</resources>\n');
console.log('Ikon selesai dibuat');
