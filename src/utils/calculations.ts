import { AttendanceRecord, AttendanceStatusCategory, OverallStats, Subject, SubjectStats } from '../types';

/**
 * Calculates percentage with 1 decimal precision, safe against zero division.
 */
export function calculatePercentage(attended: number, conducted: number): number {
  if (conducted <= 0) return 100; // If no classes held yet, default to 100%
  const pct = (attended / conducted) * 100;
  return Math.round(pct * 10) / 10;
}

/**
 * Calculates the minimum number of consecutive classes a student must attend
 * to reach or maintain target percentage.
 * 
 * Formula:
 * (attended + x) / (conducted + x) >= target / 100
 * x * (1 - target/100) >= (target/100 * conducted) - attended
 * x >= ((target * conducted / 100) - attended) / (1 - target/100)
 */
export function calculateClassesNeeded(
  attended: number,
  conducted: number,
  targetPercentage: number
): number {
  if (conducted <= 0) return 0;
  
  const currentPct = (attended / conducted) * 100;
  if (currentPct >= targetPercentage) {
    return 0;
  }

  const targetRatio = targetPercentage / 100;
  if (targetRatio >= 1) {
    // 100% target requires never having missed a class. If already missed, can never reach 100% unless conducted is 0.
    if (attended < conducted) return 999; // Practically unreachable
    return 0;
  }

  const numerator = (targetRatio * conducted) - attended;
  const denominator = 1 - targetRatio;
  const needed = Math.ceil(numerator / denominator);
  
  return Math.max(0, needed);
}

/**
 * Calculates the maximum number of classes a student can miss while staying
 * at or above target percentage.
 * 
 * Formula:
 * attended / (conducted + x) >= target / 100
 * attended >= (target/100) * (conducted + x)
 * conducted + x <= attended / (target/100)
 * x <= (attended * 100 / target) - conducted
 */
export function calculateClassesCanMiss(
  attended: number,
  conducted: number,
  targetPercentage: number
): number {
  if (conducted <= 0 || targetPercentage <= 0) return 0;

  const currentPct = (attended / conducted) * 100;
  if (currentPct < targetPercentage) {
    return 0;
  }

  const targetRatio = targetPercentage / 100;
  const maxTotalClasses = attended / targetRatio;
  const canMiss = Math.floor(maxTotalClasses - conducted);

  return Math.max(0, canMiss);
}

/**
 * Returns categorical status based on attendance percentage.
 */
export function getStatusCategory(percentage: number): AttendanceStatusCategory {
  if (percentage >= 85) return 'excellent';
  if (percentage >= 75) return 'safe';
  if (percentage >= 65) return 'warning';
  return 'critical';
}

/**
 * Computes individual subject statistics given attendance records.
 */
export function computeSubjectStats(
  subject: Subject,
  records: AttendanceRecord[],
  defaultTarget: number
): SubjectStats {
  const subjectRecords = records.filter(r => r.subjectId === subject.id);
  
  let attended = 0;
  let missed = 0;
  let cancelled = 0;

  for (const record of subjectRecords) {
    if (record.status === 'present') {
      attended++;
    } else if (record.status === 'absent') {
      missed++;
    } else if (record.status === 'late') {
      // Treat late as attended
      attended++;
    } else if (record.status === 'cancelled') {
      cancelled++;
    }
  }

  const totalConducted = attended + missed;
  const percentage = calculatePercentage(attended, totalConducted);
  const target = subject.targetPercentage ?? defaultTarget;
  const statusCategory = getStatusCategory(percentage);
  const classesNeeded = calculateClassesNeeded(attended, totalConducted, target);
  const classesCanMiss = calculateClassesCanMiss(attended, totalConducted, target);

  return {
    subject,
    totalConducted,
    attended,
    missed,
    cancelled,
    percentage,
    statusCategory,
    classesNeeded,
    classesCanMiss,
    targetPercentage: target,
  };
}

/**
 * Computes aggregated overall statistics across all subjects.
 */
export function computeOverallStats(
  subjects: Subject[],
  records: AttendanceRecord[],
  defaultTarget: number
): OverallStats {
  let totalAttended = 0;
  let totalMissed = 0;
  let totalCancelled = 0;

  for (const record of records) {
    if (record.status === 'present' || record.status === 'late') {
      totalAttended++;
    } else if (record.status === 'absent') {
      totalMissed++;
    } else if (record.status === 'cancelled') {
      totalCancelled++;
    }
  }

  const totalConducted = totalAttended + totalMissed;
  const overallPercentage = calculatePercentage(totalAttended, totalConducted);
  const statusCategory = getStatusCategory(overallPercentage);
  const classesNeeded = calculateClassesNeeded(totalAttended, totalConducted, defaultTarget);
  const classesCanMiss = calculateClassesCanMiss(totalAttended, totalConducted, defaultTarget);

  return {
    totalConducted,
    totalAttended,
    totalMissed,
    totalCancelled,
    overallPercentage,
    statusCategory,
    classesNeeded,
    classesCanMiss,
    targetPercentage: defaultTarget,
  };
}

/**
 * Helpers for formatting and status colors
 */
export const STATUS_CONFIG: Record<
  AttendanceStatusCategory,
  {
    label: string;
    bgLight: string;
    textLight: string;
    borderLight: string;
    badgeBg: string;
    badgeText: string;
    color: string;
    gradient: string;
  }
> = {
  excellent: {
    label: 'Excellent',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    textLight: 'text-emerald-700 dark:text-emerald-300',
    borderLight: 'border-emerald-200 dark:border-emerald-800/60',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
  },
  safe: {
    label: 'Safe',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    textLight: 'text-blue-700 dark:text-blue-300',
    borderLight: 'border-blue-200 dark:border-blue-800/60',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-800 dark:text-blue-200',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
  },
  warning: {
    label: 'Warning',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    textLight: 'text-amber-700 dark:text-amber-300',
    borderLight: 'border-amber-200 dark:border-amber-800/60',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
  },
  critical: {
    label: 'Critical',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    textLight: 'text-rose-700 dark:text-rose-300',
    borderLight: 'border-rose-200 dark:border-rose-800/60',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-800 dark:text-rose-200',
    color: '#ef4444',
    gradient: 'from-rose-500 to-red-600',
  },
};
