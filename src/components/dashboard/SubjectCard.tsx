import React from 'react';
import { SubjectStats } from '../../types';
import { useAttendance } from '../../context/AttendanceContext';
import { STATUS_CONFIG } from '../../utils/calculations';
import {
  User,
  MapPin,
  Check,
  X,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SubjectCardProps {
  stats: SubjectStats;
  onViewDetails: (subjectId: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ stats, onViewDetails }) => {
  const { quickIncrement, triggerCelebration } = useAttendance();
  const { subject, percentage, attended, totalConducted, missed, statusCategory, classesCanMiss, classesNeeded, targetPercentage } = stats;

  const config = STATUS_CONFIG[statusCategory];

  const handleQuickPresent = () => {
    quickIncrement(subject.id, 'present');
    triggerCelebration();
  };

  const handleQuickAbsent = () => {
    quickIncrement(subject.id, 'absent');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Top Header: Code badge, status badge, title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: subject.color || '#3b82f6' }}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {subject.code}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 ${config.badgeBg} ${config.badgeText}`}
          >
            {percentage >= targetPercentage ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertTriangle className="w-3 h-3" />
            )}
            {config.label}
          </span>
        </div>

        {/* Subject Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {subject.name}
        </h3>

        {/* Teacher & Room metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {subject.teacherName}
          </span>
          {subject.room && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {subject.room}
            </span>
          )}
        </div>

        {/* Percentage Display & Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">{attended}</strong> / {totalConducted} classes
            </span>
          </div>

          {/* Progress bar with target indicator */}
          <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                statusCategory === 'excellent'
                  ? 'bg-emerald-500'
                  : statusCategory === 'safe'
                  ? 'bg-blue-500'
                  : statusCategory === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>

          {/* Target marker subtitle */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            <span>0%</span>
            <span>Target: {targetPercentage}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Prediction Info Banner */}
        <div
          className={`mt-3 p-2.5 rounded-xl text-xs font-medium border ${
            percentage >= targetPercentage
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300'
          }`}
        >
          {percentage >= targetPercentage ? (
            <div className="flex items-center gap-1.5">
              <span className="font-bold">✨ Safe:</span>
              <span>Can miss <strong>{classesCanMiss}</strong> {classesCanMiss === 1 ? 'class' : 'classes'} & remain ≥{targetPercentage}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="font-bold">⚠️ Warning:</span>
              <span>Need <strong>{classesNeeded}</strong> {classesNeeded === 1 ? 'class' : 'classes'} to hit {targetPercentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls: Quick +1 / -1 Buttons + View Details */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
        <button
          onClick={handleQuickPresent}
          title="Mark Present (+1)"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          <span>+ Present</span>
        </button>

        <button
          onClick={handleQuickAbsent}
          title="Mark Absent (-1)"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>- Absent</span>
        </button>

        <button
          onClick={() => onViewDetails(subject.id)}
          title="View detailed breakdown & logs"
          className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
