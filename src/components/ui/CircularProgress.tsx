import React from 'react';
import { STATUS_CONFIG } from '../../utils/calculations';
import { AttendanceStatusCategory } from '../../types';

interface CircularProgressProps {
  percentage: number;
  statusCategory: AttendanceStatusCategory;
  size?: number;
  strokeWidth?: number;
  showDetails?: boolean;
  target?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  statusCategory,
  size = 200,
  strokeWidth = 16,
  showDetails = true,
  target = 75,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Clamp percentage between 0 and 100 for stroke dasharray
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  const config = STATUS_CONFIG[statusCategory];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={`grad-${statusCategory}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {statusCategory === 'excellent' && (
              <>
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </>
            )}
            {statusCategory === 'safe' && (
              <>
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#4f46e5" />
              </>
            )}
            {statusCategory === 'warning' && (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </>
            )}
            {statusCategory === 'critical' && (
              <>
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800 transition-colors"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#grad-${statusCategory})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Details */}
      {showDetails && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            Overall Attendance
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full text-[11px] font-bold ${config.badgeBg} ${config.badgeText}`}
          >
            {config.label} ({percentage >= target ? `+${(percentage - target).toFixed(1)}%` : `${(percentage - target).toFixed(1)}%`})
          </span>
        </div>
      )}
    </div>
  );
};
