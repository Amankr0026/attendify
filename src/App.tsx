import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/ui/Toast';
import { QuickAttendanceModal } from './components/dashboard/QuickAttendanceModal';
import { SubjectDetailModal } from './components/ui/SubjectDetailModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { AttendanceView } from './components/views/AttendanceView';
import { SubjectsView } from './components/views/SubjectsView';
import { TimetableView } from './components/views/TimetableView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { CalculatorView } from './components/views/CalculatorView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, toasts, removeToast } = useAttendance();

  // Global Modals State
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [quickModalStatus, setQuickModalStatus] = useState<'present' | 'absent'>('present');
  const [inspectedSubjectId, setInspectedSubjectId] = useState<string | null>(null);

  const handleOpenQuickAttendance = (status: 'present' | 'absent' = 'present') => {
    setQuickModalStatus(status);
    setQuickModalOpen(true);
  };

  const handleInspectSubject = (subjectId: string) => {
    setInspectedSubjectId(subjectId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onOpenQuickAttendance={() => handleOpenQuickAttendance('present')} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Left Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenQuickModal={handleOpenQuickAttendance}
              onInspectSubject={handleInspectSubject}
              onOpenAddSubject={() => handleOpenQuickAttendance('present')}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView onOpenAddRecord={() => handleOpenQuickAttendance('present')} />
          )}

          {activeTab === 'subjects' && (
            <SubjectsView onInspectSubject={handleInspectSubject} />
          )}

          {activeTab === 'timetable' && <TimetableView />}

          {activeTab === 'calendar' && (
            <CalendarView onOpenQuickModal={handleOpenQuickAttendance} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView onInspectSubject={handleInspectSubject} />
          )}

          {activeTab === 'calculator' && <CalculatorView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* Quick Attendance Modal */}
      <QuickAttendanceModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        defaultStatus={quickModalStatus}
      />

      {/* Subject Deep Dive Modal */}
      <SubjectDetailModal
        subjectId={inspectedSubjectId}
        onClose={() => setInspectedSubjectId(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <MainLayout />
    </AttendanceProvider>
  );
}
