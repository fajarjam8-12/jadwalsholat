import React, { useState } from 'react';
import { Sparkles, Copy, Check, Bell, Quote } from 'lucide-react';
import { getDailyHadits } from '../data/haditsKisah';
import { IslamicStarPattern } from './IslamicOrnaments';
import { sendPrayerNotification } from '../utils/notificationService';
import { audioEngine } from '../utils/audioEngine';

interface DailyHaditsCardProps {
  currentDate?: Date;
}

export const DailyHaditsCard: React.FC<DailyHaditsCardProps> = ({ currentDate = new Date() }) => {
  const hadits = getDailyHadits(currentDate);
  const [copied, setCopied] = useState(false);
  const [notified, setNotified] = useState(false);

  const handleCopy = () => {
    const text = `${hadits.title}\n\n${hadits.arabic ? hadits.arabic + '\n\n' : ''}"${hadits.matanIndo}"\n\n(${hadits.source})\n\nHikmah: ${hadits.hikmah}\n\n— Dibagikan via Aplikasi Demi Waktu`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendNotification = () => {
    sendPrayerNotification(
      'Motivasi Hari Ini',
      hadits.title,
      hadits.matanIndo.slice(0, 100) + '...'
    );
    audioEngine.triggerVibration([50, 40, 80]);
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-emerald-950/60 to-stone-950 border border-emerald-500/40 p-3.5 shadow-lg text-white">
      <IslamicStarPattern opacity={0.06} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
            <Quote className="w-3 h-3 fill-current" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 leading-none block">
              Mutiara Hadits
            </span>
            <h4 className="text-xs font-bold text-white leading-tight">{hadits.title}</h4>
          </div>
        </div>

        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {hadits.category}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-2">
        {hadits.arabic && (
          <p className="font-arabic text-lg text-right leading-relaxed text-stone-100 py-0.5" dir="rtl">
            {hadits.arabic}
          </p>
        )}

        <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-900/40">
          <p className="text-[11px] text-stone-200 leading-relaxed italic">
            &ldquo;{hadits.matanIndo}&rdquo;
          </p>
          <span className="text-[9px] text-emerald-400 font-semibold block text-right mt-1">
            — {hadits.source}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-1.5 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-100/90 leading-snug">
            <strong className="text-amber-300">Hikmah:</strong> {hadits.hikmah}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex items-center justify-between text-xs border-t border-stone-800/80">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold active:scale-95 transition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-stone-400" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            onClick={handleSendNotification}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-[11px] font-semibold active:scale-95 transition shadow-sm"
          >
            <Bell className="w-3 h-3" />
            <span>{notified ? 'Terkirim ✓' : 'Kirim Notifikasi HP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
