import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Volume2, Sparkles, Heart, BookOpen } from 'lucide-react';
import { DOA_LIST, TASBIH_PRESETS, DoaItem } from '../data/doaDzikir';
import { audioEngine } from '../utils/audioEngine';
import { IslamicStarPattern, RubElHizbIcon, IslamicArchBorder } from './IslamicOrnaments';

export const DzikirDoaSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'doa_adzan' | 'dzikir_sholat' | 'tasbih'>('doa_adzan');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Digital Tasbih state
  const [selectedPreset, setSelectedPreset] = useState(TASBIH_PRESETS[0]);
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [tasbihLaps, setTasbihLaps] = useState<number>(0);

  const handleCopy = (item: DoaItem) => {
    const textToCopy = `${item.title}\n\n${item.arabic}\n\nLatin: ${item.latin}\n\nArtinya: "${item.translation}"\n\n(${item.source || ''})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTasbihClick = () => {
    audioEngine.triggerVibration([30]);
    const nextCount = tasbihCount + 1;
    if (nextCount >= selectedPreset.target) {
      setTasbihCount(0);
      setTasbihLaps((prev) => prev + 1);
      audioEngine.triggerVibration([80, 50, 150]); // celebration pattern
    } else {
      setTasbihCount(nextCount);
    }
  };

  const handleResetTasbih = () => {
    setTasbihCount(0);
    setTasbihLaps(0);
    audioEngine.triggerVibration([40]);
  };

  const doaAdzanItems = DOA_LIST.filter((d) => d.category === 'adzan');
  const dzikirSholatItems = DOA_LIST.filter((d) => d.category === 'sholat' || d.category === 'pagi_petang');

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Category Pills Navigation */}
      <div className="flex rounded-2xl bg-stone-900/90 p-1.5 border border-emerald-900/60 shadow-lg">
        <button
          onClick={() => setActiveTab('doa_adzan')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition active:scale-95 ${
            activeTab === 'doa_adzan'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md border border-emerald-400/30'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Doa Adzan
        </button>
        <button
          onClick={() => setActiveTab('dzikir_sholat')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition active:scale-95 ${
            activeTab === 'dzikir_sholat'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md border border-emerald-400/30'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Dzikir Sholat
        </button>
        <button
          onClick={() => setActiveTab('tasbih')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition active:scale-95 flex items-center justify-center gap-1 ${
            activeTab === 'tasbih'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md border border-emerald-400/30'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tasbih Digital</span>
        </button>
      </div>

      {/* TAB 1: DOA SETELAH ADZAN */}
      {activeTab === 'doa_adzan' && (
        <div className="space-y-3">
          {doaAdzanItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden p-4 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 border border-emerald-500/40 space-y-3 shadow-xl text-white"
            >
              <IslamicStarPattern opacity={0.05} />
              <div className="relative z-10 flex items-center justify-between border-b border-emerald-800/40 pb-2">
                <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <RubElHizbIcon size={14} className="text-emerald-400" />
                  <span>{item.title}</span>
                </span>
                <button
                  onClick={() => handleCopy(item)}
                  className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/50 hover:bg-emerald-800/50 transition"
                  title="Salin Doa"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Arabic text with beautiful Amiri font */}
              <p className="relative z-10 font-arabic text-2xl text-right leading-loose text-white px-1 py-1" dir="rtl">
                {item.arabic}
              </p>

              {/* Latin */}
              <div className="relative z-10 bg-black/60 p-3 rounded-2xl border border-emerald-900/50">
                <p className="text-xs text-emerald-300 font-medium italic leading-relaxed">
                  &ldquo;{item.latin}&rdquo;
                </p>
              </div>

              {/* Translation */}
              <p className="relative z-10 text-xs text-stone-200 leading-relaxed">
                <strong className="text-emerald-400">Artinya:</strong> {item.translation}
              </p>

              {item.source && (
                <div className="relative z-10 text-[10px] text-stone-400 pt-1 border-t border-stone-800/80">
                  Sumber: {item.source}
                </div>
              )}
            </div>
          ))}

          {/* Keutamaan membaca doa */}
          <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-600/50 text-xs text-emerald-200 space-y-1 shadow-md">
            <p className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              Keutamaan Membaca Doa Setelah Adzan
            </p>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Rasulullah SAW bersabda: <em>&ldquo;Barangsiapa membaca doa ini ketika mendengar adzan, maka ia berhak mendapatkan syafaatku pada hari kiamat.&rdquo;</em> (HR. Bukhari no. 614)
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: DZIKIR SETELAH SHOLAT */}
      {activeTab === 'dzikir_sholat' && (
        <div className="space-y-3">
          {dzikirSholatItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden p-4 rounded-3xl bg-stone-900/70 border border-emerald-950/80 hover:border-emerald-700/50 space-y-2.5 transition"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <RubElHizbIcon size={14} className="text-emerald-400" />
                  <span>{item.title}</span>
                </span>
                <button
                  onClick={() => handleCopy(item)}
                  className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-emerald-400 px-2 py-0.5 rounded-md hover:bg-stone-800 transition"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <p className="font-arabic text-xl sm:text-2xl text-right leading-loose text-stone-100 py-1" dir="rtl">
                {item.arabic}
              </p>

              <p className="text-xs text-emerald-300/90 italic">
                {item.latin}
              </p>

              <p className="text-xs text-stone-300 leading-relaxed">
                {item.translation}
              </p>

              {item.source && (
                <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-800/60">
                  {item.source}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DIGITAL TASBIH COUNTER */}
      {activeTab === 'tasbih' && (
        <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 border border-emerald-500/50 text-center space-y-4 shadow-2xl text-white">
          <IslamicStarPattern opacity={0.08} />

          {/* Preset Selector */}
          <div className="relative z-10 flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {TASBIH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  setTasbihCount(0);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                  selectedPreset.id === preset.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 font-bold shadow-md'
                    : 'bg-black/50 border border-emerald-900/60 text-emerald-200 hover:bg-stone-800'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>

          {/* Arabic phrase display */}
          <div className="relative z-10 py-1">
            <p className="font-arabic text-3xl text-emerald-300 mb-1" dir="rtl">
              {selectedPreset.arabic}
            </p>
            <p className="text-xs text-stone-300">
              {selectedPreset.meaning} (Target: {selectedPreset.target}x)
            </p>
          </div>

          {/* Big Tap Area Counter Button */}
          <div className="relative z-10 py-2 flex flex-col items-center justify-center">
            <button
              onClick={handleTasbihClick}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-600 via-teal-800 to-emerald-950 border-4 border-emerald-400/50 shadow-2xl shadow-emerald-950/80 flex flex-col items-center justify-center active:scale-95 transition-transform duration-75 select-none relative ring-4 ring-emerald-500/20"
            >
              <span className="font-mono text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                {tasbihCount}
              </span>
              <span className="text-xs uppercase tracking-widest text-emerald-200 mt-1 font-bold">
                / {selectedPreset.target}
              </span>
              <span className="text-[10px] text-emerald-300 mt-1 uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                Ketuk Layar
              </span>
            </button>
          </div>

          <IslamicArchBorder className="relative z-10 my-1" />

          {/* Lap info and Reset */}
          <div className="relative z-10 flex items-center justify-between px-3 pt-2 text-xs text-stone-300">
            <div>
              <span>Putaran Selesai: </span>
              <strong className="text-emerald-300 font-mono text-sm">{tasbihLaps}x</strong>
            </div>
            <button
              onClick={handleResetTasbih}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-semibold active:scale-95 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Reset Hitungan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
