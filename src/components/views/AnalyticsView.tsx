import React, { useMemo } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertOctagon,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  PieChart,
} from 'lucide-react';

export const AnalyticsView: React.FC<{ onInspectSubject: (subjectId: string) => void }> = ({
  onInspectSubject,
}) => {
  const { subjectStatsList, overallStats, records, settings } = useAttendance();

  // Find Best and Lowest Attended Subjects
  const sortedByPct = [...subjectStatsList].sort((a, b) => b.percentage - a.percentage);
  const bestSubject = sortedByPct[0];
  const lowestSubject = sortedByPct[sortedByPct.length - 1];

  // Group Records by Month
  const monthlyStats = useMemo(() => {
    const monthsMap: Record<string, { present: number; absent: number; total: number }> = {};

    records.forEach(r => {
      if (!r.date) return;
      const monthKey = r.date.substring(0, 7); // 'YYYY-MM'
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { present: 0, absent: 0, total: 0 };
      }

      if (r.status === 'present') {
        monthsMap[monthKey].present++;
        monthsMap[monthKey].total++;
      } else if (r.status === 'absent') {
        monthsMap[monthKey].absent++;
        monthsMap[monthKey].total++;
      }
    });

    return Object.entries(monthsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const pct = data.total > 0 ? Math.round((data.present / data.total) * 1000) / 10 : 0;
        return {
          key: monthKey,
          label,
          present: data.present,
          absent: data.absent,
          total: data.total,
          percentage: pct,
        };
      });
  }, [records]);

  // Day of Week Attendance Performance (Mon-Sat)
  const dayOfWeekStats = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const map: Record<string, { present: number; absent: number }> = {};
    days.forEach(d => (map[d] = { present: 0, absent: 0 }));

    records.forEach(r => {
      const d = new Date(r.date + 'T00:00:00');
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      if (map[dayName]) {
        if (r.status === 'present') map[dayName].present++;
        else if (r.status === 'absent') map[dayName].absent++;
      }
    });

    return days.map(dayName => {
      const { present, absent } = map[dayName];
      const total = present + absent;
      const pct = total > 0 ? Math.round((present / total) * 100) : 100;
      return { dayName, present, absent, total, pct };
    });
  }, [records]);

  const target = settings.defaultTargetPercentage;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Attendance Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into subject distribution, historical trends, and weekly consistency
          </p>
        </div>
      </div>

      {/* Top Highlight Metric Cards (Best vs Lowest) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Rate
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {overallStats.overallPercentage}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                overallStats.overallPercentage >= target
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {overallStats.overallPercentage >= target
                ? `+${(overallStats.overallPercentage - target).toFixed(1)}% above goal`
                : `${(overallStats.overallPercentage - target).toFixed(1)}% below goal`}
            </span>
          </div>
        </div>

        {/* Best Attended Subject */}
        {bestSubject && (
          <div
            onClick={() => onInspectSubject(bestSubject.subject.id)}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Best Course
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {bestSubject.subject.code}
              </span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-2 line-clamp-1 group-hover:text-indigo-600">
              {bestSubject.subject.name}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {bestSubject.percentage}%
              </span>
              <span className="text-xs text-slate-500">
                {bestSubject.attended} / {bestSubject.totalConducted} classes
              </span>
            </div>
          </div>
        )}

        {/* Lowest Attended Subject */}
        {lowestSubject && (
          <div
            onClick={() => onInspectSubject(lowestSubject.subject.id)}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs cursor-pointer hover:border-rose-400 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> Needs Attention
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {lowestSubject.subject.code}
              </span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-2 line-clamp-1 group-hover:text-rose-600">
              {lowestSubject.subject.name}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {lowestSubject.percentage}%
              </span>
              <span className="text-xs text-slate-500">
                {lowestSubject.attended} / {lowestSubject.totalConducted} classes
              </span>
            </div>
          </div>
        )}

        {/* Present vs Absent Ratio */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ratio Split
            </span>
            <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div>
              <span className="text-xs font-semibold text-emerald-600 block">Attended</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {overallStats.totalAttended}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-xs font-semibold text-rose-600 block">Missed</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {overallStats.totalMissed}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Comparison Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subject-wise Attendance Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparison across all enrolled courses against the {target}% institutional requirement line
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span>Current %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500" />
              <span>{target}% Target Line</span>
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart for Each Subject */}
        <div className="space-y-4 pt-2">
          {subjectStatsList.map(item => {
            const isAbove = item.percentage >= target;

            return (
              <div key={item.subject.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.subject.color || '#6366f1' }}
                    />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.subject.name}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">({item.subject.code})</span>
                  </div>

                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-slate-400 text-[11px]">
                      {item.attended}/{item.totalConducted}
                    </span>
                    <span
                      className={`font-black text-sm ${
                        isAbove
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar with Target Guideline */}
                <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all duration-700 ${
                      item.percentage >= 85
                        ? 'bg-emerald-500'
                        : item.percentage >= 75
                        ? 'bg-indigo-600'
                        : item.percentage >= 65
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />

                  {/* Target Threshold Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                    style={{ left: `${target}%` }}
                    title={`Target: ${target}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Monthly Trends & Day-of-Week Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Attendance Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Breakdown
              </h3>
              <p className="text-xs text-slate-500">Attendance trend per academic month</p>
            </div>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="pt-4 space-y-3">
            {monthlyStats.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No monthly records to compare.</p>
            ) : (
              monthlyStats.map(m => (
                <div key={m.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{m.label}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {m.percentage}% ({m.present}/{m.total} classes)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, m.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Day-of-Week Attendance Efficiency */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekday Attendance Pattern
              </h3>
              <p className="text-xs text-slate-500">How consistently you attend on each weekday</p>
            </div>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="pt-4 space-y-3">
            {dayOfWeekStats.map(d => (
              <div key={d.dayName} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{d.dayName}</span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {d.pct}% ({d.present} attended, {d.absent} missed)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.pct >= 85 ? 'bg-emerald-500' : d.pct >= 75 ? 'bg-indigo-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, d.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
