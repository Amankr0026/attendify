import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { AlertTriangle, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';

export const WarningsBanner: React.FC<{ onInspectSubject: (subjectId: string) => void }> = ({
  onInspectSubject,
}) => {
  const { activeWarnings } = useAttendance();

  if (activeWarnings.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {activeWarnings.map(warning => {
        let containerBg = 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200';
        let Icon = AlertTriangle;
        let iconColor = 'text-amber-600 dark:text-amber-400';

        if (warning.type === 'critical') {
          containerBg = 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200';
          Icon = AlertOctagon;
          iconColor = 'text-rose-600 dark:text-rose-400';
        } else if (warning.type === 'success') {
          containerBg = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-600 dark:text-emerald-400';
        }

        return (
          <div
            key={warning.id}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${containerBg}`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div>
                <h4 className="text-sm font-bold leading-tight">{warning.title}</h4>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{warning.message}</p>
              </div>
            </div>

            {warning.subjectId && (
              <button
                onClick={() => onInspectSubject(warning.subjectId!)}
                className="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-current shadow-2xs flex items-center gap-1 shrink-0 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
