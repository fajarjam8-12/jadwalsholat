import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Moon,
  Award,
  Heart,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import {
  HIJRI_MONTHS,
  MAJOR_ISLAMIC_EVENTS,
  getDetailedHijriDate,
  getUpcomingIslamicEvents,
  UpcomingEventInfo,
} from '../data/islamicEvents';
import { IslamicStarPattern, RubElHizbIcon } from './IslamicOrnaments';

interface HijriCalendarViewProps {
  currentDate: Date;
}

export const HijriCalendarView: React.FC<HijriCalendarViewProps> = ({ currentDate }) => {
  const hijriDetails = getDetailedHijriDate(currentDate);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(hijriDetails.monthIndex);
  const [selectedDayDetails, setSelectedDayDetails] = useState<{
    hijriDay: number;
    hijriMonth: string;
    hijriYear: number;
    gregorianStr: string;
    event?: UpcomingEventInfo;
    isAyyamulBidh: boolean;
  } | null>(null);

  const upcomingEvents = getUpcomingIslamicEvents(hijriDetails);
  const currentMonthData = HIJRI_MONTHS[selectedMonthIndex];

  const nextMonth = () => setSelectedMonthIndex((prev) => (prev + 1) % 12);
  const prevMonth = () => setSelectedMonthIndex((prev) => (prev - 1 + 12) % 12);

  const totalDays = currentMonthData.days;
  const isCurrentMonth = selectedMonthIndex === hijriDetails.monthIndex;

  const gregorianMonthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getGregorianForHijriDay = (dayNum: number): Date => {
    const monthDiff = selectedMonthIndex - hijriDetails.monthIndex;
    const approximateDaysDiff = monthDiff * 29.5 + (dayNum - hijriDetails.day);
    const targetMs = currentDate.getTime() + approximateDaysDiff * 24 * 60 * 60 * 1000;
    return new Date(targetMs);
  };

  const gregorianTodayStr = currentDate.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-2 max-w-md mx-auto">
      {/* 1. SLIM DUAL DATE HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border border-emerald-500/50 p-3 shadow-md text-white">
        <IslamicStarPattern opacity={0.06} />

        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Hijri & Gregorian Juxtaposition */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white leading-tight">
              <Moon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{hijriDetails.day} {hijriDetails.monthName} {hijriDetails.year} H</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-300/80 mt-0.5 font-medium">
              <CalendarDays className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{gregorianTodayStr} M</span>
            </div>
          </div>

          {/* Month Selector Buttons */}
          <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-xl border border-emerald-800/50 flex-shrink-0">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg text-stone-300 hover:text-white transition active:scale-95"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-emerald-300 px-1 font-mono">
              {currentMonthData.name.split(' ')[0]}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg text-stone-300 hover:text-white transition active:scale-95"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. GRID KALENDER PADAT (COMPACT DUAL DATE CELLS) */}
      <div className="rounded-2xl bg-stone-900/80 border border-stone-800/90 p-2.5 shadow-md">
        {/* Day of Week Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {dayLabels.map((lbl, i) => (
            <span
              key={lbl}
              className={`text-[9px] font-bold uppercase tracking-tight ${
                i === 0 ? 'text-rose-400' : i === 5 ? 'text-emerald-400' : 'text-stone-400'
              }`}
            >
              {lbl}
            </span>
          ))}
        </div>

        {/* Compact Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const isToday = isCurrentMonth && dayNum === hijriDetails.day;
            const isAyyamulBidh = dayNum === 13 || dayNum === 14 || dayNum === 15;

            const gregDate = getGregorianForHijriDay(dayNum);
            const gregDayNum = gregDate.getDate();
            const gregMonthName = gregorianMonthsShort[gregDate.getMonth()];

            const dayEvent = MAJOR_ISLAMIC_EVENTS.find(
              (e) => e.hijriMonthIndex === selectedMonthIndex && e.hijriDay === dayNum
            );

            return (
              <button
                key={dayNum}
                onClick={() =>
                  setSelectedDayDetails({
                    hijriDay: dayNum,
                    hijriMonth: currentMonthData.name,
                    hijriYear: hijriDetails.year,
                    gregorianStr: gregDate.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }),
                    event: dayEvent ? { ...dayEvent, daysLeft: 0, isToday, isTomorrow: false } : undefined,
                    isAyyamulBidh,
                  })
                }
                className={`relative py-1 px-0.5 rounded-lg flex flex-col items-center justify-center h-11 transition active:scale-95 border ${
                  isToday
                    ? 'bg-gradient-to-b from-emerald-500 to-teal-700 border-emerald-300 text-white font-extrabold shadow-sm ring-1 ring-emerald-300'
                    : isAyyamulBidh
                    ? 'bg-teal-950/70 border-teal-500/50 text-teal-200'
                    : dayEvent
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-stone-950/50 border-stone-800/80 text-stone-300 hover:bg-stone-800/50'
                }`}
              >
                {/* Top: Hijri Day Number */}
                <span className={`text-[11px] font-bold font-mono leading-none ${isToday ? 'text-white' : 'text-stone-100'}`}>
                  {dayNum}
                </span>

                {/* Dot indicator for events or Ayyamul Bidh */}
                <div className="h-1 flex items-center justify-center my-0.2">
                  {isToday ? (
                    <span className="w-1 h-1 rounded-full bg-white" />
                  ) : dayEvent ? (
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                  ) : isAyyamulBidh ? (
                    <span className="w-1 h-1 rounded-full bg-teal-400" />
                  ) : null}
                </div>

                {/* Bottom: Masehi Date & Month */}
                <span
                  className={`text-[8px] font-mono leading-none ${
                    isToday ? 'text-emerald-100 font-bold' : 'text-stone-400'
                  }`}
                >
                  {gregDayNum} {gregMonthName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Legend */}
        <div className="flex items-center justify-center gap-3 mt-1.5 pt-1 border-t border-stone-800/80 text-[9px] text-stone-400">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Hari Ini</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Ayyamul Bidh (13-15)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Hari Besar</span>
          </div>
        </div>
      </div>

      {/* 3. RINGKASAN HARI BESAR ISLAM (COMPACT SCROLLABLE ROWS) */}
      <div className="rounded-2xl bg-stone-900/80 border border-stone-800/90 p-2.5 shadow-md">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <h3 className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3 text-emerald-400" />
            <span>Peringatan Hari Besar Islam</span>
          </h3>
          <span className="text-[9px] text-stone-400">Ketuk untuk rincian</span>
        </div>

        {/* Slim Scrollable Rows */}
        <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar pr-0.5">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              onClick={() =>
                setSelectedDayDetails({
                  hijriDay: event.hijriDay,
                  hijriMonth: HIJRI_MONTHS[event.hijriMonthIndex].name,
                  hijriYear: hijriDetails.year,
                  gregorianStr: `± ${event.daysLeft === 0 ? 'Hari Ini' : `${event.daysLeft} hari mendatang`}`,
                  event,
                  isAyyamulBidh: false,
                })
              }
              className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-stone-950/60 hover:bg-stone-800/60 border border-stone-800/70 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-md flex-shrink-0 ${
                    event.category === 'hari_raya'
                      ? 'bg-amber-500/20 text-amber-300'
                      : event.category.startsWith('puasa')
                      ? 'bg-teal-500/20 text-teal-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {event.category === 'hari_raya' ? 'Raya' : event.category.startsWith('puasa') ? 'Puasa' : 'Sejarah'}
                </span>
                <span className="font-semibold text-white text-[11px] truncate">{event.title}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <span className="text-[10px] text-stone-400 font-mono">
                  {event.hijriDay} {HIJRI_MONTHS[event.hijriMonthIndex].name.slice(0, 3)}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                    event.daysLeft === 0
                      ? 'bg-emerald-500 text-stone-950 animate-pulse'
                      : event.daysLeft <= 30
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {event.daysLeft === 0 ? 'HARI INI' : `${event.daysLeft}h`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DUAL DATE DETAIL MODAL */}
      {selectedDayDetails && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[80vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-emerald-500/50 shadow-2xl overflow-hidden text-stone-100">
            <div className="flex items-center justify-between p-3.5 border-b border-stone-800 bg-emerald-950/40">
              <div className="flex items-center gap-1.5">
                <RubElHizbIcon size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Rincian Tanggal Bersanding</h3>
              </div>
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs no-scrollbar">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 block mb-0.5">
                    Kalender Hijriyah
                  </span>
                  <p className="text-xs font-extrabold text-white">
                    {selectedDayDetails.hijriDay} {selectedDayDetails.hijriMonth}
                  </p>
                  <p className="text-[10px] text-stone-400">{selectedDayDetails.hijriYear} H</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block mb-0.5">
                    Kalender Masehi
                  </span>
                  <p className="text-xs font-bold text-stone-100 leading-snug">
                    {selectedDayDetails.gregorianStr}
                  </p>
                </div>
              </div>

              {selectedDayDetails.isAyyamulBidh && (
                <div className="p-2.5 rounded-xl bg-teal-950/50 border border-teal-500/40 text-teal-200 text-[11px]">
                  <strong className="block text-teal-300 font-bold mb-0.5">
                    Hari Puasa Sunnah Ayyamul Bidh
                  </strong>
                  Disunnahkan berpuasa pada tanggal 13, 14, dan 15 bulan Hijriyah dengan pahala seperti berpuasa setahun penuh jika rutin dikerjakan.
                </div>
              )}

              {selectedDayDetails.event && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-emerald-400" />
                      Peringatan: {selectedDayDetails.event.title}
                    </span>
                    <p className="text-[11px] text-stone-200 leading-relaxed">
                      {selectedDayDetails.event.virtue}
                    </p>
                  </div>

                  {selectedDayDetails.event.practiceGuide && (
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                      <strong className="text-amber-400 text-[10px] block mb-0.5">
                        Amalan yang Dianjurkan:
                      </strong>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        {selectedDayDetails.event.practiceGuide}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-2.5 border-t border-stone-800">
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
