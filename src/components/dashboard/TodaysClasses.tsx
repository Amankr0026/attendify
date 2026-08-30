import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { AttendanceStatus } from '../../types';
import { Clock, MapPin, User, Check, X, Slash, CalendarCheck2, CheckCircle2 } from 'lucide-react';

export const TodaysClasses: React.FC<{ onOpenQuickModal: () => void }> = ({ onOpenQuickModal }) => {
  const { todaysSlots, markAttendance, bulkMarkToday, triggerCelebration } = useAttendance();

  const todayStr = new Date().toISOString().split('T')[0];
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleMark = (slotId: string, subjectId: string, status: AttendanceStatus, time: string) => {
    markAttendance({
      slotId,
      subjectId,
      date: todayStr,
      time,
      status,
      topic: 'Scheduled Class',
    });

    if (status === 'present') {
      triggerCelebration();
    }
  };

  const markedCount = todaysSlots.filter(s => s.currentRecord).length;
  const totalToday = todaysSlots.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 sm:p-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Schedule</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200/60 dark:border-indigo-800/40">
              {dayName}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {markedCount} of {totalToday} classes recorded today
          </p>
        </div>

        {totalToday > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkMarkToday('present')}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>
          </div>
        )}
      </div>

      {/* Class List */}
      <div className="pt-4 space-y-3">
        {todaysSlots.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No classes scheduled for {dayName}!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enjoy your free day or configure your timetable in the Timetable tab.
            </p>
          </div>
        ) : (
          todaysSlots.map(({ slot, subject, currentRecord }) => {
            const status = currentRecord?.status;

            return (
              <div
                key={slot.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 transition-all gap-3"
              >
                {/* Left: Time & Subject Info */}
                <div className="flex items-start gap-3.5">
                  <div className="flex flex-col items-center justify-center w-16 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shrink-0">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {slot.startTime}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {slot.endTime}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: subject?.color || '#6366f1' }}
                      />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {subject?.name || 'Class'}
                      </h4>
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        ({subject?.code})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {slot.teacherName || subject?.teacherName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {slot.room}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Attendance Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleMark(slot.id, slot.subjectId, 'present', slot.startTime)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      status === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Present</span>
                  </button>

                  <button
                    onClick={() => handleMark(slot.id, slot.subjectId, 'absent', slot.startTime)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      status === 'absent'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Absent</span>
                  </button>

                  <button
                    onClick={() => handleMark(slot.id, slot.subjectId, 'cancelled', slot.startTime)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                      status === 'cancelled'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                    title="Mark class cancelled / holiday"
                  >
                    <Slash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
