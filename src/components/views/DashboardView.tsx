import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { OverallAttendanceCard } from '../dashboard/OverallAttendanceCard';
import { SubjectCard } from '../dashboard/SubjectCard';
import { TodaysClasses } from '../dashboard/TodaysClasses';
import { WarningsBanner } from '../dashboard/WarningsBanner';
import {
  PlusCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Calculator,
  BarChart3,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenQuickModal: (status?: 'present' | 'absent') => void;
  onInspectSubject: (subjectId: string) => void;
  onOpenAddSubject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQuickModal,
  onInspectSubject,
  onOpenAddSubject,
}) => {
  const {
    student,
    subjectStatsList,
    records,
    todaysSlots,
    setActiveTab,
  } = useAttendance();

  // Time of day greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  // Recent 5 attendance records
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner with Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/15 relative overflow-hidden">
        {/* Background decorative rings */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-indigo-400/10 rounded-full pointer-events-none blur-xl" />

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-indigo-100 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Semester {student.semester} &bull; {student.branch}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {greeting}, {student.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 max-w-xl">
            Here is your daily attendance briefing for <strong>{student.collegeName}</strong>. Stay ahead of your 75% target and manage lecture attendance effortlessly.
          </p>
        </div>

        {/* Quick Marking Direct CTA Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => onOpenQuickModal('present')}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-900/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>+ Mark Present</span>
          </button>

          <button
            onClick={() => onOpenQuickModal('absent')}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/20 hover:bg-white/30 text-white border border-white/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            <span>- Mark Absent</span>
          </button>
        </div>
      </div>

      {/* Warnings & Actionable Alerts */}
      <WarningsBanner onInspectSubject={onInspectSubject} />

      {/* Overall Attendance Summary Card */}
      <OverallAttendanceCard />

      {/* Grid: Subject Attendance Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Enrolled Subjects ({subjectStatsList.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Individual course progress and attendance threshold predictions
            </p>
          </div>

          <button
            onClick={onOpenAddSubject}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>

        {subjectStatsList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Subjects Added Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Add your courses to track lecture attendance, calculate attendance cushions, and get risk alerts.
            </p>
            <button
              onClick={onOpenAddSubject}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              Add Your First Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {subjectStatsList.map(stats => (
              <SubjectCard
                key={stats.subject.id}
                stats={stats}
                onViewDetails={onInspectSubject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout: Today's Schedule & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Today's Schedule (7 cols) */}
        <div className="lg:col-span-7">
          <TodaysClasses onOpenQuickModal={() => onOpenQuickModal('present')} />
        </div>

        {/* Quick Utilities & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Tool Links */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Goal Calculator</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate missed & attended classes
              </p>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Full Analytics</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Trends, monthly stats & comparison
              </p>
            </button>
          </div>

          {/* Recent Attendance Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Recent Entries
              </h3>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="pt-3 space-y-2.5">
              {recentRecords.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No attendance logged yet.</p>
              ) : (
                recentRecords.map(rec => {
                  const sub = subjectStatsList.find(s => s.subject.id === rec.subjectId)?.subject;
                  return (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sub?.color || '#3b82f6' }}
                        />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {sub?.name || 'Class'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {rec.date} &bull; {rec.time || 'Class'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : rec.status === 'absent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {rec.status.toUpperCase()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
