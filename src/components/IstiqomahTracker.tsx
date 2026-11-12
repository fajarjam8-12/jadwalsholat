import React, { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Flame,
  Award,
  Trash2,
  Clock,
  Sparkles,
  X,
  Check,
  BarChart3,
  Calendar,
  Heart,
  TrendingUp,
  CheckCheck,
} from 'lucide-react';
import {
  getTodayHabits,
  getCompletedHabitIdsForDate,
  toggleHabitCompletion,
  calculateCurrentStreak,
  saveCustomHabit,
  deleteCustomHabit,
  get30DaysEvaluation,
  DayEvaluationLog,
  IstiqomahHabit,
} from '../data/istiqomahHabits';
import { audioEngine } from '../utils/audioEngine';
import { IslamicStarPattern, RubElHizbIcon, IslamicArchBorder } from './IslamicOrnaments';

interface IstiqomahTrackerProps {
  currentDate?: Date;
}

export const IstiqomahTracker: React.FC<IstiqomahTrackerProps> = ({ currentDate = new Date() }) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayStr = `${currentDate.getFullYear()}-${pad(currentDate.getMonth() + 1)}-${pad(currentDate.getDate())}`;

  const [habits, setHabits] = useState<IstiqomahHabit[]>(() => getTodayHabits(currentDate));
  const [completedIds, setCompletedIds] = useState<string[]>(() => getCompletedHabitIdsForDate(todayStr));
  const [streak, setStreak] = useState<number>(() => calculateCurrentStreak(currentDate));
  const [filter, setFilter] = useState<'all' | 'default' | 'custom'>('all');

  // 30 Days Evaluation Data & Modal toggle
  const [evaluation, setEvaluation] = useState(() => get30DaysEvaluation(currentDate));
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [selectedEvaluatedDay, setSelectedEvaluatedDay] = useState<DayEvaluationLog | null>(null);

  // Add custom habit modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customCategory, setCustomCategory] = useState<IstiqomahHabit['category']>('kustom');
  const [customReminder, setCustomReminder] = useState('');
  const [customIcon, setCustomIcon] = useState('✨');

  const handleToggle = (habitId: string) => {
    audioEngine.triggerVibration([40]);
    const updated = toggleHabitCompletion(todayStr, habitId);
    setCompletedIds(updated);

    if (updated.length === habits.length && habits.length > 0) {
      audioEngine.triggerVibration([100, 50, 150, 50, 200]);
    }

    setStreak(calculateCurrentStreak(currentDate));
    setEvaluation(get30DaysEvaluation(currentDate));
  };

  const handleDeleteCustom = (habitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomHabit(habitId);
    setHabits(getTodayHabits(currentDate));
    setCompletedIds(getCompletedHabitIdsForDate(todayStr));
    setEvaluation(get30DaysEvaluation(currentDate));
  };

  const handleCreateCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    saveCustomHabit({
      title: customTitle.trim(),
      subtitle: customSubtitle.trim() || 'Amalan kustom harian',
      category: customCategory,
      icon: customIcon || '✨',
      reminderTime: customReminder || undefined,
    });

    setHabits(getTodayHabits(currentDate));
    setIsAddModalOpen(false);
    setCustomTitle('');
    setCustomSubtitle('');
    setCustomReminder('');
    audioEngine.triggerVibration([50, 50, 100]);
    setEvaluation(get30DaysEvaluation(currentDate));
  };

  const totalCount = habits.length;
  const completedCount = completedIds.filter((id) => habits.some((h) => h.id === id)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredHabits = habits.filter((h) => {
    if (filter === 'default') return !h.isCustom;
    if (filter === 'custom') return h.isCustom;
    return true;
  });

  return (
    <div className="space-y-2.5 max-w-md mx-auto">
      {/* 1. TARGET & RAPOR KILAT (COMPACT SINGLE CARD: TODAY + 30-DAY STATS) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border border-emerald-500/50 p-3 shadow-md text-white">
        <IslamicStarPattern opacity={0.06} />

        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Left: Today's Target Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Amalan Hari Ini
              </span>
              <span className="font-mono text-xs font-black text-white">
                {completedCount}/{totalCount}
              </span>
              <span className="text-[10px] text-emerald-400 font-extrabold font-mono">
                ({progressPercent}%)
              </span>
            </div>

            {/* Slim progress bar */}
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden mt-1 border border-emerald-900/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Center: Streak Pill */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold flex-shrink-0">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{streak} Hari</span>
          </div>

          {/* Right: Rapor 30-Hari Button */}
          <button
            onClick={() => setIsEvaluationOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-[10px] font-bold flex-shrink-0 active:scale-95 transition"
            title="Buka Evaluasi 30 Hari"
          >
            <BarChart3 className="w-3 h-3 text-emerald-400" />
            <span>Rapor 30h</span>
            <span className="font-mono text-emerald-300">({evaluation.averagePercent}%)</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-ROW: FILTERS & TAMBAH AMALAN BUTTON */}
      <div className="flex items-center justify-between gap-1.5 px-0.5">
        <div className="flex rounded-xl bg-stone-900/90 p-0.5 border border-stone-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
              filter === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => setFilter('default')}
            className={`px-2 py-1 text-[11px] font-bold rounded-lg transition ${
              filter === 'default' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sunnah
          </button>
          <button
            onClick={() => setFilter('custom')}
            className={`px-2 py-1 text-[11px] font-bold rounded-lg transition ${
              filter === 'custom' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Kustom
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-[11px] active:scale-95 transition shadow-sm border border-emerald-400/30"
        >
          <Plus className="w-3 h-3" />
          <span>Tambah</span>
        </button>
      </div>

      {/* 3. DAFTAR AMALAN KOMPAK (SLIM ROW SPACING ~42px) */}
      <div className="space-y-1">
        {filteredHabits.map((habit) => {
          const isDone = completedIds.includes(habit.id);

          return (
            <div
              key={habit.id}
              onClick={() => handleToggle(habit.id)}
              className={`flex items-center justify-between py-2 px-3 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                  : 'bg-stone-900/60 border-stone-800/80 hover:border-emerald-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base flex-shrink-0 leading-none">{habit.icon}</span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={`text-xs font-bold truncate transition ${
                        isDone ? 'text-emerald-300 line-through opacity-75' : 'text-white'
                      }`}
                    >
                      {habit.title}
                    </h4>
                    {habit.reminderTime && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-400 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {habit.reminderTime}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 truncate leading-tight">
                    {habit.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                {habit.isCustom && (
                  <button
                    onClick={(e) => handleDeleteCustom(habit.id, e)}
                    className="p-1 rounded-lg text-stone-500 hover:text-red-400 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-stone-950 shadow-sm ring-1 ring-emerald-300'
                      : 'border-2 border-stone-600 text-transparent hover:border-stone-400'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            </div>
          );
        })}

        {filteredHabits.length === 0 && (
          <div className="text-center py-6 text-stone-500 text-xs">
            Belum ada amalan kustom. Ketuk &quot;+ Tambah&quot; untuk menambahkan target baru.
          </div>
        )}
      </div>

      {/* 4. MODAL EVALUASI 30 HARI TERAKHIR (RAPOR LENGKAP & HEATMAP) */}
      {isEvaluationOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-emerald-500/50 shadow-2xl overflow-hidden text-stone-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-stone-800 bg-emerald-950/40">
              <div className="flex items-center gap-2">
                <RubElHizbIcon size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Rapor Evaluasi Istiqomah (30 Hari)</h3>
              </div>
              <button
                onClick={() => setIsEvaluationOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs no-scrollbar">
              {/* Rapor Header */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 to-teal-950 border border-emerald-500/50 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                      Predikat Spiritual
                    </span>
                    <h4 className="text-base font-extrabold text-white">{evaluation.grade.label}</h4>
                    <p className="font-arabic text-xl text-emerald-300 mt-0.5">{evaluation.grade.arabic}</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-black/60 border border-emerald-500/40 flex flex-col items-center justify-center">
                    <span className="font-mono text-xl font-black text-emerald-400">{evaluation.averagePercent}%</span>
                    <span className="text-[8px] uppercase text-stone-400">Rata-rata</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-200 mt-2 bg-black/40 p-2 rounded-xl border border-emerald-800/40">
                  {evaluation.grade.message}
                </p>

                <div className="grid grid-cols-3 gap-1.5 mt-2 text-center text-[10px]">
                  <div className="p-1.5 rounded-lg bg-black/40">
                    <span className="font-mono font-bold text-emerald-300 block">{evaluation.totalCompletedDeeds}</span>
                    <span className="text-stone-400">Amalan Selesai</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40">
                    <span className="font-mono font-bold text-amber-300 block">{evaluation.streak} Hari</span>
                    <span className="text-stone-400">Streak Aktif</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40">
                    <span className="font-bold text-teal-300 block truncate">{evaluation.bestDayOfWeek}</span>
                    <span className="text-stone-400">Hari Terbaik</span>
                  </div>
                </div>
              </div>

              {/* 30-Day Heatmap Grid */}
              <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    Matriks Aktivitas 30 Hari
                  </span>
                  <span className="text-[9px] text-stone-400">Ketuk hari untuk cek</span>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {evaluation.days.map((dayLog) => {
                    const p = dayLog.percent;
                    const bgClass =
                      p >= 85
                        ? 'bg-emerald-500 text-stone-950 font-bold'
                        : p >= 65
                        ? 'bg-emerald-600 text-white font-bold'
                        : p >= 40
                        ? 'bg-teal-800 text-teal-200'
                        : 'bg-stone-800 text-stone-400';

                    return (
                      <button
                        key={dayLog.dateStr}
                        onClick={() => setSelectedEvaluatedDay(dayLog)}
                        className={`p-1 rounded-lg flex flex-col items-center justify-center text-[9px] border border-stone-800/60 ${bgClass}`}
                      >
                        <span className="leading-none">{dayLog.dayName}</span>
                        <span className="font-mono font-extrabold leading-tight">{dayLog.dayNumber}</span>
                        <span className="text-[7px] leading-none opacity-90">{dayLog.percent}%</span>
                      </button>
                    );
                  })}
                </div>

                {selectedEvaluatedDay && (
                  <div className="p-2 rounded-xl bg-black/70 border border-emerald-800/60 text-[11px] flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {selectedEvaluatedDay.dayName}, {selectedEvaluatedDay.dayNumber} {selectedEvaluatedDay.monthName}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {selectedEvaluatedDay.completedCount}/{selectedEvaluatedDay.totalTarget} Selesai ({selectedEvaluatedDay.percent}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2">
                <span className="font-bold text-white text-[11px] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  Rasio Keberhasilan Per-Kategori
                </span>

                <div className="space-y-1.5">
                  {Object.keys(evaluation.categoryStats).map((catKey) => {
                    const stat = evaluation.categoryStats[catKey];
                    return (
                      <div key={catKey} className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-300 font-medium">
                            {stat.icon} {stat.title}
                          </span>
                          <span className="font-mono font-bold text-emerald-300">
                            {stat.percent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${stat.percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-2.5 border-t border-stone-800 text-center">
              <button
                onClick={() => setIsEvaluationOpen(false)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                Tutup Rapor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: TAMBAH AMALAN KUSTOM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-emerald-500/40 shadow-2xl overflow-hidden text-stone-100">
            <div className="flex items-center justify-between p-3.5 border-b border-stone-800 bg-emerald-950/40">
              <div className="flex items-center gap-1.5">
                <RubElHizbIcon size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Tambah Amalan Kustom</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomHabit} className="p-3.5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-300 block mb-1">Nama Amalan Harian *</label>
                <input
                  type="text"
                  placeholder="Contoh: Sholat Taubat 2 Rakaat, Surah Al-Mulk..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">Catatan / Keterangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Rutin sesudah Maghrib"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-300 block mb-1">Kategori</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as IstiqomahHabit['category'])}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sholat">Sholat Sunnah</option>
                    <option value="quran">Tilawah Qur&apos;an</option>
                    <option value="dzikir">Dzikir / Wirid</option>
                    <option value="sedekah">Infaq / Sedekah</option>
                    <option value="kustom">Kebiasaan Baik</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-300 block mb-1">Pengingat Jam</label>
                  <input
                    type="time"
                    value={customReminder}
                    onChange={(e) => setCustomReminder(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">Pilih Ikon</label>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {['✨', '📖', '🤲', '🕌', '📿', '🌙', '❤️', '🪙', '🌱'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setCustomIcon(icon)}
                      className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition ${
                        customIcon === icon
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                          : 'bg-stone-950 border border-stone-800'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-xs active:scale-95 transition shadow-md"
                >
                  Simpan Amalan Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
