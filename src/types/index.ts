export interface StudentProfile {
  name: string;
  rollNumber: string;
  collegeName: string;
  semester: number;
  branch: string;
  email?: string;
  avatarUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherName: string;
  room?: string;
  color: string; // Tailwind color class or hex (e.g., '#3b82f6')
  targetPercentage?: number; // Optional subject-specific override
  creditHours?: number;
  notes?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'cancelled' | 'late';

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string; // ISO date 'YYYY-MM-DD'
  time?: string; // 'HH:mm' e.g. '09:00'
  status: AttendanceStatus;
  topic?: string;
  slotId?: string; // Links to timetable slot if marked from today's schedule
  createdAt: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableSlot {
  id: string;
  subjectId: string;
  day: DayOfWeek;
  startTime: string; // '09:00'
  endTime: string; // '10:00'
  room: string;
  teacherName?: string;
}

export interface AppSettings {
  defaultTargetPercentage: number; // 70, 75, 80, 85, 90
  theme: 'light' | 'dark' | 'system';
  warningThreshold: number; // 65
  notificationsEnabled: boolean;
  academicYear: string;
  semesterStartDate: string;
}

export type AttendanceStatusCategory = 'excellent' | 'safe' | 'warning' | 'critical';

export interface SubjectStats {
  subject: Subject;
  totalConducted: number;
  attended: number;
  missed: number;
  cancelled: number;
  percentage: number;
  statusCategory: AttendanceStatusCategory;
  classesNeeded: number;
  classesCanMiss: number;
  targetPercentage: number;
}

export interface OverallStats {
  totalConducted: number;
  totalAttended: number;
  totalMissed: number;
  totalCancelled: number;
  overallPercentage: number;
  statusCategory: AttendanceStatusCategory;
  classesNeeded: number;
  classesCanMiss: number;
  targetPercentage: number;
}

export type NavTab = 
  | 'dashboard'
  | 'attendance'
  | 'subjects'
  | 'timetable'
  | 'calendar'
  | 'analytics'
  | 'calculator'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
