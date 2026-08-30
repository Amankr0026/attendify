import { AppSettings, AttendanceRecord, DayOfWeek, StudentProfile, Subject, TimetableSlot } from '../types';

export const INITIAL_STUDENT: StudentProfile = {
  name: 'Aman',
  rollNumber: '23CS4092',
  collegeName: 'Apex Institute of Technology',
  semester: 5,
  branch: 'Computer Science & Engineering',
  email: 'aman.cs23@apex.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
};

export const INITIAL_SETTINGS: AppSettings = {
  defaultTargetPercentage: 75,
  theme: 'light',
  warningThreshold: 65,
  notificationsEnabled: true,
  academicYear: '2025-2026',
  semesterStartDate: '2025-08-01',
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-ds',
    name: 'Data Structures & Algorithms',
    code: 'CS-501',
    teacherName: 'Dr. Suresh Sharma',
    room: 'Lab 204 / LT-2',
    color: '#3b82f6', // Blue
    creditHours: 4,
    notes: 'Focus on Graph Algorithms & Dynamic Programming',
  },
  {
    id: 'sub-oop',
    name: 'Object Oriented Programming',
    code: 'CS-502',
    teacherName: 'Prof. Anita Rao',
    room: 'Room 304',
    color: '#8b5cf6', // Violet
    creditHours: 4,
    notes: 'Java & Design Patterns projects due mid-term',
  },
  {
    id: 'sub-dbms',
    name: 'Database Management Systems',
    code: 'CS-503',
    teacherName: 'Dr. Vikram Malhotra',
    room: 'Room 102',
    color: '#06b6d4', // Cyan
    creditHours: 3,
    notes: 'Strict 75% attendance policy enforced',
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CS-504',
    teacherName: 'Prof. R. K. Verma',
    room: 'LT-1',
    color: '#10b981', // Emerald
    creditHours: 4,
    notes: 'Packet tracer simulation labs on Thursdays',
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'CS-505',
    teacherName: 'Dr. Meera Iyer',
    room: 'Lab 105',
    color: '#f59e0b', // Amber
    creditHours: 4,
    notes: 'Process scheduling & memory management assignments',
  },
  {
    id: 'sub-math',
    name: 'Discrete Mathematics',
    code: 'MA-501',
    teacherName: 'Prof. P. N. Joshi',
    room: 'Room 401',
    color: '#ec4899', // Pink
    creditHours: 3,
    notes: 'Weekly tutorials and proof exercises',
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'tt-1', subjectId: 'sub-ds', day: 'Monday', startTime: '09:00', endTime: '10:00', room: 'LT-2', teacherName: 'Dr. Suresh Sharma' },
  { id: 'tt-2', subjectId: 'sub-dbms', day: 'Monday', startTime: '10:15', endTime: '11:15', room: 'Room 102', teacherName: 'Dr. Vikram Malhotra' },
  { id: 'tt-3', subjectId: 'sub-oop', day: 'Monday', startTime: '11:30', endTime: '12:30', room: 'Room 304', teacherName: 'Prof. Anita Rao' },
  { id: 'tt-4', subjectId: 'sub-os', day: 'Monday', startTime: '14:00', endTime: '16:00', room: 'Lab 105', teacherName: 'Dr. Meera Iyer' },

  // Tuesday
  { id: 'tt-5', subjectId: 'sub-cn', day: 'Tuesday', startTime: '09:00', endTime: '10:00', room: 'LT-1', teacherName: 'Prof. R. K. Verma' },
  { id: 'tt-6', subjectId: 'sub-math', day: 'Tuesday', startTime: '10:15', endTime: '11:15', room: 'Room 401', teacherName: 'Prof. P. N. Joshi' },
  { id: 'tt-7', subjectId: 'sub-ds', day: 'Tuesday', startTime: '11:30', endTime: '13:30', room: 'Lab 204', teacherName: 'Dr. Suresh Sharma' },
  { id: 'tt-8', subjectId: 'sub-dbms', day: 'Tuesday', startTime: '14:30', endTime: '15:30', room: 'Room 102', teacherName: 'Dr. Vikram Malhotra' },

  // Wednesday
  { id: 'tt-9', subjectId: 'sub-os', day: 'Wednesday', startTime: '09:00', endTime: '10:00', room: 'Room 102', teacherName: 'Dr. Meera Iyer' },
  { id: 'tt-10', subjectId: 'sub-oop', day: 'Wednesday', startTime: '10:15', endTime: '11:15', room: 'Room 304', teacherName: 'Prof. Anita Rao' },
  { id: 'tt-11', subjectId: 'sub-cn', day: 'Wednesday', startTime: '11:30', endTime: '12:30', room: 'LT-1', teacherName: 'Prof. R. K. Verma' },
  { id: 'tt-12', subjectId: 'sub-math', day: 'Wednesday', startTime: '14:00', endTime: '15:00', room: 'Room 401', teacherName: 'Prof. P. N. Joshi' },

  // Thursday
  { id: 'tt-13', subjectId: 'sub-ds', day: 'Thursday', startTime: '09:00', endTime: '10:00', room: 'LT-2', teacherName: 'Dr. Suresh Sharma' },
  { id: 'tt-14', subjectId: 'sub-cn', day: 'Thursday', startTime: '10:15', endTime: '12:15', room: 'Lab 204', teacherName: 'Prof. R. K. Verma' },
  { id: 'tt-15', subjectId: 'sub-dbms', day: 'Thursday', startTime: '13:30', endTime: '14:30', room: 'Room 102', teacherName: 'Dr. Vikram Malhotra' },
  { id: 'tt-16', subjectId: 'sub-os', day: 'Thursday', startTime: '14:45', endTime: '15:45', room: 'Room 105', teacherName: 'Dr. Meera Iyer' },

  // Friday
  { id: 'tt-17', subjectId: 'sub-oop', day: 'Friday', startTime: '09:00', endTime: '11:00', room: 'Lab 102', teacherName: 'Prof. Anita Rao' },
  { id: 'tt-18', subjectId: 'sub-math', day: 'Friday', startTime: '11:15', endTime: '12:15', room: 'Room 401', teacherName: 'Prof. P. N. Joshi' },
  { id: 'tt-19', subjectId: 'sub-ds', day: 'Friday', startTime: '13:30', endTime: '14:30', room: 'LT-2', teacherName: 'Dr. Suresh Sharma' },
  { id: 'tt-20', subjectId: 'sub-cn', day: 'Friday', startTime: '14:45', endTime: '15:45', room: 'LT-1', teacherName: 'Prof. R. K. Verma' },
];

/**
 * Generates sample records for recent weeks so everything is populated cleanly.
 */
export function generateInitialRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Create 30 calendar days of structured realistic history
  // Pattern ensures DBMS has warning (<75%), CN has 90%, DS has 88%, etc.
  const subjectRecordPlans: Record<string, { present: number; absent: number }> = {
    'sub-ds': { present: 22, absent: 3 }, // 22/25 = 88.0%
    'sub-oop': { present: 19, absent: 4 }, // 19/23 = 82.6%
    'sub-dbms': { present: 15, absent: 6 }, // 15/21 = 71.4% (Below 75% target!)
    'sub-cn': { present: 18, absent: 2 }, // 18/20 = 90.0%
    'sub-os': { present: 18, absent: 4 }, // 18/22 = 81.8%
    'sub-math': { present: 16, absent: 4 }, // 16/20 = 80.0%
  };

  // Overall: 108 present out of 131 = ~82.4%
  let recordCounter = 1;

  for (let daysAgo = 28; daysAgo >= 1; daysAgo--) {
    const d = new Date();
    d.setDate(today.getDate() - daysAgo);
    
    // Skip Sundays
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue;

    const dateStr = d.toISOString().split('T')[0];
    const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[dayOfWeek];

    // Find slots matching this day of week
    const slotsForDay = INITIAL_TIMETABLE.filter(s => s.day === currentDayName);

    for (const slot of slotsForDay) {
      const plan = subjectRecordPlans[slot.subjectId];
      let status: 'present' | 'absent' = 'present';

      // Decide status deterministically to match planned ratios
      if (plan && plan.absent > 0) {
        // Randomly distribute absences
        if ((daysAgo * 7 + recordCounter) % 5 === 0) {
          status = 'absent';
          plan.absent--;
        } else if (plan.present > 0) {
          status = 'present';
          plan.present--;
        }
      }

      records.push({
        id: `rec-${recordCounter++}`,
        subjectId: slot.subjectId,
        date: dateStr,
        time: slot.startTime,
        status: status,
        topic: `Lecture Unit ${((recordCounter % 5) + 1)}`,
        slotId: slot.id,
        createdAt: d.getTime(),
      });
    }
  }

  return records;
}
