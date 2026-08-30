import React, { useState, useMemo } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';

export const CalendarView: React.FC<{
  onOpenQuickModal: (status?: 'present' | 'absent') => void;
}> = ({ onOpenQuickModal }) => {
  const { records, subjects, markAttendance, deleteRecord, triggerCelebration } = useAttendance();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0 - 11
  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().split('T')[0]);

  // Navigate Months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calendar Day Generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      records: AttendanceRecord[];
      statusSummary: 'attended' | 'absent' | 'empty';
    }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const dStr = `${prevMonthYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const recs = records.filter(r => r.date === dStr);
      days.push({
        dateStr: dStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        records: recs,
        statusSummary: recs.length === 0 ? 'empty' : recs.some(r => r.status === 'absent') ? 'absent' : 'attended',
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const recs = records.filter(r => r.date === dStr);
      let summary: 'attended' | 'absent' | 'empty' = 'empty';
      if (recs.length > 0) {
        summary = recs.some(r => r.status === 'absent') ? 'absent' : 'attended';
      }

      days.push({
        dateStr: dStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        records: recs,
        statusSummary: summary,
      });
    }

    // Next month padding to fill standard 35 or 42 grid
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const dStr = `${nextMonthYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const recs = records.filter(r => r.date === dStr);
      days.push({
        dateStr: dStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        records: recs,
        statusSummary: recs.length === 0 ? 'empty' : recs.some(r => r.status === 'absent') ? 'absent' : 'attended',
      });
    }

    return days;
  }, [currentYear, currentMonth, records]);

  // Selected date records
  const selectedDateRecords = useMemo(() => {
    return records
      .filter(r => r.date === selectedDate)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, [records, selectedDate]);

  const selectedDateFormatted = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isToday = selectedDate === today.toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Monthly Attendance Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize your attendance patterns day-by-day and inspect logs
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">All Attended</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">Has Absence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-400">No Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-indigo-400/40" />
            <span className="text-slate-600 dark:text-slate-400">Selected</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar (8 Cols) + Day Inspector (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Box (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 sm:p-6">
          {/* Month Navigator */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{monthName}</h2>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleGoToday}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 pt-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateStr === selectedDate;
              const isCurrentDay = item.dateStr === today.toISOString().split('T')[0];

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`min-h-[64px] sm:min-h-[76px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                      : item.isCurrentMonth
                      ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                      : 'bg-transparent border-transparent opacity-30 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : isCurrentDay
                          ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.dayNumber}
                    </span>

                    {item.records.length > 0 && (
                      <span className="text-[10px] font-semibold text-slate-400">
                        {item.records.length}
                      </span>
                    )}
                  </div>

                  {/* Status Indicator Dots */}
                  <div className="flex items-center gap-1 mt-1">
                    {item.statusSummary === 'attended' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                    {item.statusSummary === 'absent' && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                    {item.statusSummary === 'empty' && item.isCurrentMonth && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Selected Day
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedDateFormatted}
              </h3>
              {isToday && (
                <span className="inline-block mt-0.5 px-2 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  Today
                </span>
              )}
            </div>

            <button
              onClick={() => onOpenQuickModal('present')}
              className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60"
              title="Add record for this day"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Records on this date */}
          <div className="space-y-3">
            {selectedDateRecords.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No attendance records logged for this day.
                </p>
                <button
                  onClick={() => onOpenQuickModal('present')}
                  className="mt-3 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100"
                >
                  + Log Attendance
                </button>
              </div>
            ) : (
              selectedDateRecords.map(rec => {
                const sub = subjects.find(s => s.id === rec.subjectId);

                return (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sub?.color || '#3b82f6' }}
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {sub?.name || 'Class'}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {rec.time || 'Class'} &bull; {rec.topic || 'Lecture'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteRecord(rec.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Toggle Status */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() =>
                          markAttendance({
                            subjectId: rec.subjectId,
                            date: rec.date,
                            time: rec.time,
                            status: 'present',
                            topic: rec.topic,
                          })
                        }
                        className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          rec.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                        }`}
                      >
                        Present
                      </button>

                      <button
                        onClick={() =>
                          markAttendance({
                            subjectId: rec.subjectId,
                            date: rec.date,
                            time: rec.time,
                            status: 'absent',
                            topic: rec.topic,
                          })
                        }
                        className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          rec.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-rose-50'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
