import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { CircularProgress } from '../ui/CircularProgress';
import { STATUS_CONFIG } from '../../utils/calculations';
import { CheckCircle2, XCircle, Layers, Target, TrendingUp, AlertTriangle } from 'lucide-react';

export const OverallAttendanceCard: React.FC = () => {
  const { overallStats, settings, updateSettings } = useAttendance();

  const config = STATUS_CONFIG[overallStats.statusCategory];
  const targetPct = settings.defaultTargetPercentage;

  const targetOptions = [70, 75, 80, 85, 90];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 sm:p-6 transition-all">
      {/* Card Header with Target Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Overall Attendance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Aggregated performance across all enrolled courses
          </p>
        </div>

        {/* Target Percentage Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
            <Target className="w-3 h-3 text-indigo-500" /> Target:
          </span>
          {targetOptions.map(tgt => (
            <button
              key={tgt}
              onClick={() => updateSettings({ defaultTargetPercentage: tgt })}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                targetPct === tgt
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              {tgt}%
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Circular Meter + Key Numbers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-5">
        {/* Left: Big Circular Progress Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
          <CircularProgress
            percentage={overallStats.overallPercentage}
            statusCategory={overallStats.statusCategory}
            size={190}
            strokeWidth={16}
            target={targetPct}
          />
        </div>

        {/* Right: Detailed Metric Chips & Prediction */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          {/* Quick Stat Blocks */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Present</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {overallStats.totalAttended}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Classes Attended</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-800/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Absent</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {overallStats.totalMissed}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Classes Missed</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Conducted</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {overallStats.totalConducted}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Total Classes</span>
            </div>
          </div>

          {/* Smart Mathematical Prediction Box */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              overallStats.overallPercentage >= targetPct
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {overallStats.overallPercentage >= targetPct ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-sm block">
                  {overallStats.overallPercentage >= targetPct
                    ? `Safe zone: ${overallStats.classesCanMiss} ${overallStats.classesCanMiss === 1 ? 'class' : 'classes'} can be missed`
                    : `Action required: Attend next ${overallStats.classesNeeded} ${overallStats.classesNeeded === 1 ? 'class' : 'classes'}`}
                </span>
                {overallStats.overallPercentage >= targetPct ? (
                  <span>
                    You are currently <strong>{(overallStats.overallPercentage - targetPct).toFixed(1)}%</strong> above your {targetPct}% goal. You can miss up to {overallStats.classesCanMiss} consecutive classes without falling below {targetPct}%.
                  </span>
                ) : (
                  <span>
                    You are <strong>{(targetPct - overallStats.overallPercentage).toFixed(1)}%</strong> below your {targetPct}% goal. You need to attend the next {overallStats.classesNeeded} classes consecutively to recover.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
