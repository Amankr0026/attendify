import React, { useState, useRef } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  Settings as SettingsIcon,
  User,
  Target,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  Moon,
  Sun,
  ShieldAlert,
} from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

export const SettingsView: React.FC = () => {
  const {
    student,
    settings,
    updateStudent,
    updateSettings,
    exportCSV,
    exportJSON,
    importJSON,
    resetToSampleData,
    clearAllData,
    addToast,
  } = useAttendance();

  // Student Form State
  const [name, setName] = useState(student.name);
  const [rollNumber, setRollNumber] = useState(student.rollNumber);
  const [collegeName, setCollegeName] = useState(student.collegeName);
  const [semester, setSemester] = useState(student.semester);
  const [branch, setBranch] = useState(student.branch);
  const [email, setEmail] = useState(student.email || '');

  // Modals state
  const [confirmResetDemo, setConfirmResetDemo] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      collegeName: collegeName.trim(),
      semester: Number(semester),
      branch: branch.trim(),
      email: email.trim() || undefined,
    });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const res = importJSON(content);
        if (!res.success) {
          addToast({
            type: 'error',
            title: 'Import Failed',
            message: res.error || 'Invalid backup file format.',
          });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          Settings & Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your academic details, institutional attendance thresholds, and data backups
        </p>
      </div>

      {/* Student Profile Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Student Information</h2>
            <p className="text-xs text-slate-500">Details displayed on your dashboard and exported reports</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Roll / Registration Number *
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                College / University *
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Academic Branch / Major *
              </label>
              <input
                type="text"
                required
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Current Semester (1-8) *
              </label>
              <select
                value={semester}
                onChange={e => setSemester(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="student@example.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 active:scale-95 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Target Percentage & Attendance Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance Thresholds & Goals</h2>
            <p className="text-xs text-slate-500">Configure institutional target rules and alert sensitivities</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Default Target Attendance Percentage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[70, 75, 80, 85, 90].map(tgt => (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => updateSettings({ defaultTargetPercentage: tgt })}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    settings.defaultTargetPercentage === tgt
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tgt}% Target
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Standard Indian & international engineering colleges enforce a minimum of 75% for exam eligibility.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Critical Warning Alert Level
            </label>
            <div className="flex flex-wrap gap-2">
              {[60, 65, 70].map(th => (
                <button
                  key={th}
                  type="button"
                  onClick={() => updateSettings({ warningThreshold: th })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.warningThreshold === th
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Below {th}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Backup, Import & Export */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Data Export & Backup</h2>
            <p className="text-xs text-slate-500">Save offline backups or transfer attendance records to another device</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV Spreadsheet</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Download a clean spreadsheet of all logged lecture sessions compatible with Excel and Google Sheets.
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 transition-colors"
            >
              Download CSV (.csv)
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                <FileJson className="w-4 h-4 text-indigo-600" />
                <span>Full JSON Backup</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Export all student profile, subject catalogs, timetable hours, and attendance logs in JSON format.
              </p>
            </div>
            <button
              onClick={exportJSON}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 transition-colors"
            >
              Download JSON Backup (.json)
            </button>
          </div>
        </div>

        {/* Restore Backup File Picker */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Restore Backup from JSON
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset to Sample Demo Data & Wipe */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-100 dark:border-rose-900/40">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Data Reset & Demo Curricula</h2>
            <p className="text-xs text-slate-500">Restore standard pre-populated engineering courses or wipe everything</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Restore Pre-Populated Sample Data
            </h4>
            <p className="text-[11px] text-slate-500">
              Re-loads Aman's 6 Computer Science courses, timetables, and 120 sample attendance logs.
            </p>
          </div>
          <button
            onClick={() => setConfirmResetDemo(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Clear All Attendance Records & Subjects
            </h4>
            <p className="text-[11px] text-slate-500">
              Permanently wipes all subjects, timetables, and logged history to start completely fresh.
            </p>
          </div>
          <button
            onClick={() => setConfirmClearAll(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmResetDemo}
        onClose={() => setConfirmResetDemo(false)}
        onConfirm={resetToSampleData}
        title="Restore Standard Sample Curriculum?"
        message="This will reset your subjects, timetable slots, and attendance records back to the default CS-500 sample curriculum."
        confirmText="Reset to Demo"
      />

      <ConfirmModal
        isOpen={confirmClearAll}
        onClose={() => setConfirmClearAll(false)}
        onConfirm={clearAllData}
        title="Wipe All Data?"
        message="This will permanently delete all enrolled subjects, timetable entries, and attendance records from your browser's local storage. This action cannot be undone."
        confirmText="Wipe Everything"
        isDestructive
      />
    </div>
  );
};
