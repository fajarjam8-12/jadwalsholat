import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Clock, Heart, Award } from 'lucide-react';
import { SunnahPractice } from '../data/sunnahPractices';
import { IslamicStarPattern, RubElHizbIcon } from './IslamicOrnaments';
import { audioEngine } from '../utils/audioEngine';

interface ContextualSunnahCardProps {
  activePractices: SunnahPractice[];
  allPractices: SunnahPractice[];
  fridaySpecial: SunnahPractice | null;
  fastingSpecial: SunnahPractice | null;
}

export const ContextualSunnahCard: React.FC<ContextualSunnahCardProps> = ({
  activePractices,
  allPractices,
  fridaySpecial,
  fastingSpecial,
}) => {
  const [completedPractices, setCompletedPractices] = useState<string[]>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`sunnah_completed_${today}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllModal, setShowAllModal] = useState<boolean>(false);

  const handleToggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date().toISOString().split('T')[0];
    let nextList: string[];

    if (completedPractices.includes(id)) {
      nextList = completedPractices.filter((item) => item !== id);
    } else {
      nextList = [...completedPractices, id];
      audioEngine.triggerVibration([60, 40, 100]);
    }

    setCompletedPractices(nextList);
    try {
      localStorage.setItem(`sunnah_completed_${today}`, JSON.stringify(nextList));
    } catch {}
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const primaryPractice = activePractices.length > 0 ? activePractices[0] : allPractices[2];

  return (
    <div className="space-y-2">
      {/* 1. FRIDAY OR FASTING SPECIAL BANNER (Compact) */}
      {fridaySpecial && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 border border-emerald-500/50 p-3 shadow-md text-white">
          <IslamicStarPattern opacity={0.06} />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-300">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>Jumat Berkah • Sayyidul Ayyam</span>
              </div>
              <h3 className="text-xs font-bold text-white truncate mt-0.5">{fridaySpecial.title}</h3>
              <p className="text-[10px] text-emerald-200 line-clamp-1">{fridaySpecial.virtue}</p>
            </div>

            <button
              onClick={(e) => handleToggleComplete(fridaySpecial.id, e)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold flex-shrink-0 transition active:scale-95 ${
                completedPractices.includes(fridaySpecial.id)
                  ? 'bg-emerald-500 text-stone-950 font-black'
                  : 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{completedPractices.includes(fridaySpecial.id) ? 'Selesai ✓' : 'Tandai'}</span>
            </button>
          </div>
        </div>
      )}

      {fastingSpecial && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950 via-emerald-950 to-stone-900 border border-teal-500/40 p-2.5 shadow-sm text-white">
          <IslamicStarPattern opacity={0.05} />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-teal-300 block">
                Puasa Sunnah Hari Ini
              </span>
              <h4 className="text-xs font-bold text-white truncate">{fastingSpecial.title}</h4>
            </div>
            <button
              onClick={(e) => handleToggleComplete(fastingSpecial.id, e)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex-shrink-0 transition active:scale-95 ${
                completedPractices.includes(fastingSpecial.id)
                  ? 'bg-emerald-500 text-stone-950 font-black'
                  : 'bg-stone-800 text-teal-300 hover:bg-stone-700'
              }`}
            >
              {completedPractices.includes(fastingSpecial.id) ? 'Berpuasa ✓' : 'Niat Puasa'}
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN ACTIVE SUNNAH CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-black border border-emerald-500/40 p-3 shadow-lg text-white">
        <IslamicStarPattern opacity={0.06} />

        <div className="relative z-10 flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Amalan Sunnah Saat Ini
            </span>
          </div>
          <span className="text-[9px] font-mono text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded-full border border-stone-800">
            {primaryPractice.timeSlotDescription}
          </span>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <RubElHizbIcon size={14} className="text-emerald-400 flex-shrink-0" />
                <span>{primaryPractice.title}</span>
              </h3>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                {primaryPractice.subtitle}
                {primaryPractice.rakatCount ? ` • ${primaryPractice.rakatCount}` : ''}
              </p>
            </div>

            <button
              onClick={(e) => handleToggleComplete(primaryPractice.id, e)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                completedPractices.includes(primaryPractice.id)
                  ? 'bg-emerald-500 text-stone-950 shadow-sm font-black'
                  : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{completedPractices.includes(primaryPractice.id) ? 'Selesai ✓' : 'Tandai'}</span>
            </button>
          </div>

          <p className="text-[11px] text-stone-300 mt-1.5 leading-relaxed bg-black/40 p-2 rounded-xl border border-emerald-900/40">
            <strong className="text-emerald-400">Keutamaan:</strong> {primaryPractice.virtue}
          </p>

          {/* Expand/Collapse Niat */}
          {primaryPractice.niatArabic && (
            <div className="mt-1.5">
              <button
                onClick={() => toggleExpand(primaryPractice.id)}
                className="flex items-center justify-between w-full text-[11px] text-emerald-300 hover:text-emerald-200 py-0.5"
              >
                <span className="font-semibold flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {expandedId === primaryPractice.id ? 'Sembunyikan Niat' : 'Bacaan Niat & Terjemahan'}
                </span>
                {expandedId === primaryPractice.id ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {expandedId === primaryPractice.id && (
                <div className="mt-1.5 p-2.5 rounded-xl bg-stone-950/90 border border-emerald-800/50 space-y-1 animate-in fade-in duration-150">
                  <p className="font-arabic text-lg text-right leading-relaxed text-white" dir="rtl">
                    {primaryPractice.niatArabic}
                  </p>
                  <p className="text-[11px] text-emerald-300 italic">
                    &ldquo;{primaryPractice.niatLatin}&rdquo;
                  </p>
                  <p className="text-[10px] text-stone-300">
                    <strong>Artinya:</strong> {primaryPractice.niatTranslation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
          <span>{completedPractices.length} amalan sunnah ditandai hari ini</span>
          <button
            onClick={() => setShowAllModal(true)}
            className="text-emerald-400 hover:underline font-bold flex items-center gap-0.5"
          >
            <span>Daftar Lengkap</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* ALL SUNNAH MODAL */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-emerald-500/40 shadow-2xl overflow-hidden text-stone-100">
            <div className="flex items-center justify-between p-3.5 border-b border-stone-800 bg-emerald-950/40">
              <div className="flex items-center gap-2">
                <RubElHizbIcon size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Panduan Amalan Sholat Sunnah</h3>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 no-scrollbar">
              {allPractices.map((practice) => {
                const isCompleted = completedPractices.includes(practice.id);
                return (
                  <div
                    key={practice.id}
                    className={`p-3 rounded-xl border transition-all ${
                      practice.isActiveNow
                        ? 'bg-emerald-950/60 border-emerald-500/50'
                        : 'bg-stone-950/60 border-stone-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white">{practice.title}</h4>
                          {practice.isActiveNow && (
                            <span className="text-[8px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-stone-950">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-emerald-300 font-medium">
                          {practice.subtitle} • {practice.timeSlotDescription}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleToggleComplete(practice.id, e)}
                        className={`p-1.5 rounded-lg transition ${
                          isCompleted
                            ? 'bg-emerald-500 text-stone-950'
                            : 'bg-stone-800 text-stone-400 hover:text-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-300 mt-1 leading-snug">
                      {practice.virtue}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-stone-800 text-center">
              <button
                onClick={() => setShowAllModal(false)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
