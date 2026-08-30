import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AppSettings,
  AttendanceRecord,
  AttendanceStatus,
  DayOfWeek,
  NavTab,
  OverallStats,
  StudentProfile,
  Subject,
  SubjectStats,
  TimetableSlot,
  ToastMessage,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_STUDENT,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  generateInitialRecords,
} from '../data/initialData';
import { computeOverallStats, computeSubjectStats } from '../utils/calculations';
import confetti from 'canvas-confetti';

interface AttendanceContextType {
  // State
  student: StudentProfile;
  subjects: Subject[];
  records: AttendanceRecord[];
  timetable: TimetableSlot[];
  settings: AppSettings;
  activeTab: NavTab;
  toasts: ToastMessage[];

  // Computed
  subjectStatsList: SubjectStats[];
  overallStats: OverallStats;
  todaysSlots: {
    slot: TimetableSlot;
    subject?: Subject;
    currentRecord?: AttendanceRecord;
  }[];
  activeWarnings: {
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    subjectId?: string;
  }[];

  // Actions - Navigation
  setActiveTab: (tab: NavTab) => void;

  // Actions - Student & Settings
  updateStudent: (student: Partial<StudentProfile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleTheme: () => void;

  // Actions - Subjects
  addSubject: (subject: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Actions - Timetable
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => TimetableSlot;
  updateTimetableSlot: (id: string, slot: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;

  // Actions - Attendance Marking
  markAttendance: (params: {
    subjectId: string;
    date: string;
    status: AttendanceStatus;
    time?: string;
    topic?: string;
    slotId?: string;
  }) => AttendanceRecord;
  quickIncrement: (subjectId: string, status: 'present' | 'absent') => void;
  updateRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  deleteRecord: (id: string) => void;
  bulkMarkToday: (status: AttendanceStatus) => void;

  // Actions - Notifications & Feedback
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  triggerCelebration: () => void;

  // Actions - Data Management
  exportCSV: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => { success: boolean; error?: string };
  resetToSampleData: () => void;
  clearAllData: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENT: 'attendify_student_v1',
  SUBJECTS: 'attendify_subjects_v1',
  RECORDS: 'attendify_records_v1',
  TIMETABLE: 'attendify_timetable_v1',
  SETTINGS: 'attendify_settings_v1',
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent state or fallback to defaults
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT;
    } catch {
      return INITIAL_STUDENT;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return saved ? JSON.parse(saved) : generateInitialRecords();
    } catch {
      return generateInitialRecords();
    }
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // Apply theme to document element
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'],
      });
    } catch {
      // Confetti fallback
    }
  };

  // Actions - Student & Settings
  const updateStudent = (updates: Partial<StudentProfile>) => {
    setStudent(prev => ({ ...prev, ...updates }));
    addToast({ type: 'success', title: 'Profile Updated', message: 'Student information saved successfully.' });
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    addToast({ type: 'success', title: 'Settings Saved', message: 'Preferences updated.' });
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  // Actions - Subjects
  const addSubject = (newSub: Omit<Subject, 'id'>): Subject => {
    const created: Subject = {
      ...newSub,
      id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    };
    setSubjects(prev => [...prev, created]);
    addToast({ type: 'success', title: 'Subject Added', message: `${created.name} is now tracked.` });
    return created;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    addToast({ type: 'success', title: 'Subject Updated', message: 'Changes have been saved.' });
  };

  const deleteSubject = (id: string) => {
    const sub = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Cascade delete related records & timetable slots
    setRecords(prev => prev.filter(r => r.subjectId !== id));
    setTimetable(prev => prev.filter(t => t.subjectId !== id));
    addToast({
      type: 'info',
      title: 'Subject Removed',
      message: `${sub?.name || 'Subject'} and associated records were deleted.`,
    });
  };

  // Actions - Timetable
  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>): TimetableSlot => {
    const created: TimetableSlot = {
      ...slot,
      id: 'tt-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    };
    setTimetable(prev => [...prev, created]);
    addToast({ type: 'success', title: 'Class Scheduled', message: 'Added to your weekly timetable.' });
    return created;
  };

  const updateTimetableSlot = (id: string, updates: Partial<TimetableSlot>) => {
    setTimetable(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    addToast({ type: 'success', title: 'Schedule Updated', message: 'Timetable changes saved.' });
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
    addToast({ type: 'info', title: 'Class Removed', message: 'Removed from timetable.' });
  };

  // Actions - Attendance
  const markAttendance = ({
    subjectId,
    date,
    status,
    time,
    topic,
    slotId,
  }: {
    subjectId: string;
    date: string;
    status: AttendanceStatus;
    time?: string;
    topic?: string;
    slotId?: string;
  }): AttendanceRecord => {
    // If a record with same date, subjectId, and (slotId or time) exists, update it; otherwise create new
    const existingIndex = records.findIndex(
      r => r.date === date && r.subjectId === subjectId && (slotId ? r.slotId === slotId : r.time === time)
    );

    let updatedRecord: AttendanceRecord;

    if (existingIndex >= 0) {
      const existing = records[existingIndex];
      updatedRecord = {
        ...existing,
        status,
        time: time ?? existing.time,
        topic: topic ?? existing.topic,
        slotId: slotId ?? existing.slotId,
      };
      setRecords(prev => {
        const copy = [...prev];
        copy[existingIndex] = updatedRecord;
        return copy;
      });
    } else {
      updatedRecord = {
        id: 'rec-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        subjectId,
        date,
        time: time || new Date().toTimeString().substring(0, 5),
        status,
        topic: topic || 'Regular Lecture',
        slotId,
        createdAt: Date.now(),
      };
      setRecords(prev => [updatedRecord, ...prev]);
    }

    const sub = subjects.find(s => s.id === subjectId);
    if (status === 'present') {
      addToast({
        type: 'success',
        title: 'Marked Present ✅',
        message: `${sub?.name || 'Class'} marked present for ${date}.`,
      });
    } else if (status === 'absent') {
      addToast({
        type: 'warning',
        title: 'Marked Absent ⚠️',
        message: `${sub?.name || 'Class'} marked absent for ${date}.`,
      });
    } else if (status === 'cancelled') {
      addToast({
        type: 'info',
        title: 'Class Cancelled',
        message: `${sub?.name || 'Class'} marked cancelled.`,
      });
    }

    return updatedRecord;
  };

  const quickIncrement = (subjectId: string, status: 'present' | 'absent') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().substring(0, 5);
    markAttendance({
      subjectId,
      date: todayStr,
      time: timeStr,
      status,
      topic: 'Quick Entry',
    });
  };

  const updateRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    addToast({ type: 'success', title: 'Record Updated', message: 'Attendance entry modified.' });
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    addToast({ type: 'info', title: 'Record Deleted', message: 'Attendance entry removed.' });
  };

  const bulkMarkToday = (status: AttendanceStatus) => {
    const today = new Date();
    const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[today.getDay()];
    const todayStr = today.toISOString().split('T')[0];

    const todaySlots = timetable.filter(t => t.day === currentDay);
    if (todaySlots.length === 0) {
      addToast({ type: 'info', title: 'No Classes Today', message: 'There are no timetable slots scheduled today.' });
      return;
    }

    todaySlots.forEach(slot => {
      markAttendance({
        subjectId: slot.subjectId,
        date: todayStr,
        time: slot.startTime,
        status,
        slotId: slot.id,
        topic: 'Regular Schedule',
      });
    });

    addToast({
      type: 'success',
      title: `All Marked ${status === 'present' ? 'Present' : status === 'absent' ? 'Absent' : status}`,
      message: `Updated all ${todaySlots.length} classes for today.`,
    });
  };

  // Computed Subject Stats & Overall Stats
  const subjectStatsList = useMemo(() => {
    return subjects.map(subject => computeSubjectStats(subject, records, settings.defaultTargetPercentage));
  }, [subjects, records, settings.defaultTargetPercentage]);

  const overallStats = useMemo(() => {
    return computeOverallStats(subjects, records, settings.defaultTargetPercentage);
  }, [subjects, records, settings.defaultTargetPercentage]);

  // Today's classes with their current status
  const todaysSlots = useMemo(() => {
    const today = new Date();
    const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[today.getDay()];
    const todayStr = today.toISOString().split('T')[0];

    // Filter timetable for today and sort by startTime
    const slots = timetable
      .filter(t => t.day === currentDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return slots.map(slot => {
      const subject = subjects.find(s => s.id === slot.subjectId);
      // Find if already marked today
      const currentRecord = records.find(
        r => r.date === todayStr && (r.slotId === slot.id || (r.subjectId === slot.subjectId && r.time === slot.startTime))
      );
      return {
        slot,
        subject,
        currentRecord,
      };
    });
  }, [timetable, subjects, records]);

  // Active Warnings & Insights
  const activeWarnings = useMemo(() => {
    const list: {
      id: string;
      type: 'critical' | 'warning' | 'info' | 'success';
      title: string;
      message: string;
      subjectId?: string;
    }[] = [];

    subjectStatsList.forEach(stat => {
      const target = stat.targetPercentage;
      if (stat.totalConducted > 0) {
        if (stat.percentage < settings.warningThreshold) {
          list.push({
            id: `crit-${stat.subject.id}`,
            type: 'critical',
            title: `Critical Attendance Alert: ${stat.subject.name}`,
            message: `Current attendance is ${stat.percentage}% (Target: ${target}%). You must attend the next ${stat.classesNeeded} ${stat.classesNeeded === 1 ? 'class' : 'classes'} without missing.`,
            subjectId: stat.subject.id,
          });
        } else if (stat.percentage < target) {
          list.push({
            id: `warn-${stat.subject.id}`,
            type: 'warning',
            title: `Below Target: ${stat.subject.name}`,
            message: `Attendance is at ${stat.percentage}%. Attend next ${stat.classesNeeded} ${stat.classesNeeded === 1 ? 'class' : 'classes'} to reach ${target}%.`,
            subjectId: stat.subject.id,
          });
        } else if (stat.percentage >= 90 && stat.totalConducted >= 8) {
          list.push({
            id: `safe-${stat.subject.id}`,
            type: 'success',
            title: `Excellent Record in ${stat.subject.name}`,
            message: `Outstanding! You have ${stat.percentage}% attendance. You can safely miss up to ${stat.classesCanMiss} classes and remain above ${target}%.`,
            subjectId: stat.subject.id,
          });
        }
      }
    });

    return list;
  }, [subjectStatsList, settings.warningThreshold]);

  // Export CSV
  const exportCSV = () => {
    if (records.length === 0) {
      addToast({ type: 'warning', title: 'No Data', message: 'No attendance records available to export.' });
      return;
    }

    const headers = ['Date', 'Time', 'Subject Name', 'Subject Code', 'Status', 'Topic'];
    const rows = records.map(r => {
      const sub = subjects.find(s => s.id === r.subjectId);
      return [
        r.date,
        r.time || '',
        `"${sub?.name || 'Unknown'}"`,
        sub?.code || '',
        r.status.toUpperCase(),
        `"${r.topic || ''}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendify_attendance_${student.name || 'records'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ type: 'success', title: 'CSV Exported', message: 'Attendance sheet downloaded successfully.' });
  };

  // Export JSON Backup
  const exportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      student,
      subjects,
      records,
      timetable,
      settings,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `attendify_backup_${student.name || 'data'}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({ type: 'success', title: 'Backup Created', message: 'Full JSON backup downloaded.' });
  };

  // Import JSON Backup
  const importJSON = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.subjects || !data.records || !Array.isArray(data.subjects) || !Array.isArray(data.records)) {
        return { success: false, error: 'Invalid backup format: subjects or records missing.' };
      }

      if (data.student) setStudent(data.student);
      if (data.subjects) setSubjects(data.subjects);
      if (data.records) setRecords(data.records);
      if (data.timetable) setTimetable(data.timetable);
      if (data.settings) setSettings(data.settings);

      addToast({ type: 'success', title: 'Restore Complete', message: 'Backup restored successfully.' });
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Failed to parse JSON file.' };
    }
  };

  // Reset to Sample Demo Data
  const resetToSampleData = () => {
    setStudent(INITIAL_STUDENT);
    setSubjects(INITIAL_SUBJECTS);
    setRecords(generateInitialRecords());
    setTimetable(INITIAL_TIMETABLE);
    setSettings(INITIAL_SETTINGS);
    addToast({ type: 'info', title: 'Demo Data Restored', message: 'Reset to standard sample curriculum.' });
  };

  // Clear All Data
  const clearAllData = () => {
    setSubjects([]);
    setRecords([]);
    setTimetable([]);
    addToast({ type: 'warning', title: 'Data Cleared', message: 'All subjects, timetable, and attendance wiped.' });
  };

  return (
    <AttendanceContext.Provider
      value={{
        student,
        subjects,
        records,
        timetable,
        settings,
        activeTab,
        toasts,
        subjectStatsList,
        overallStats,
        todaysSlots,
        activeWarnings,
        setActiveTab,
        updateStudent,
        updateSettings,
        toggleTheme,
        addSubject,
        updateSubject,
        deleteSubject,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        markAttendance,
        quickIncrement,
        updateRecord,
        deleteRecord,
        bulkMarkToday,
        addToast,
        removeToast,
        triggerCelebration,
        exportCSV,
        exportJSON,
        importJSON,
        resetToSampleData,
        clearAllData,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
