import React, { useState, useMemo } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { calculatePercentage, STATUS_CONFIG } from '../../utils/calculations';
import {
  X,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit2,
  PlusCircle,
  Sliders,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SubjectDetailModalProps {
  subjectId: string | null;
  onClose: () => void;
  onEditSubject: (subjectId: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subjectId,
  onClose,
  onEditSubject,
}) => {
  const {
    subjects,
    records,
    timetable,
    subjectStatsList,
    deleteRecord,
    deleteSubject,
    quickIncrement,
    triggerCelebration,
  } = useAttendance();

  const [confirmDeleteSubject, setConfirmDeleteSubject] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // What-if simulator state
  const [simExtraAttend, setSimExtraAttend] = useState<number>(0);
  const [simExtraMiss, setSimExtraMiss] = useState<number>(0);

  const subject = useMemo(() => subjects.find(s => s.id === subjectId), [subjects, subjectId]);
  const stats = useMemo(() => subjectStatsList.find(s => s.subject.id === subjectId), [subjectStatsList, subjectId]);

  const subjectRecords = useMemo(() => {
    if (!subjectId) return [];
    return records
      .filter(r => r.subjectId === subjectId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, subjectId]);

  const subjectTimetable = useMemo(() => {
    if (!subjectId) return [];
    return timetable.filter(t => t.subjectId === subjectId);
  }, [timetable, subjectId]);

  if (!subject || !stats) return null;

  const config = STATUS_CONFIG[stats.statusCategory];

  // Simulation calculation
  const simTotalAttended = stats.attended + simExtraAttend;
  const simTotalConducted = stats.totalConducted + simExtraAttend + simExtraMiss;
  const simPercentage = calculatePercentage(simTotalAttended, simTotalConducted);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
        <div
          className="w-full max-w-3xl my-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-4 h-12 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: subject.color || '#3b82f6' }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {subject.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${config.badgeBg} ${config.badgeText}`}
                  >
                    {config.label}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {subject.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
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
                  {subject.creditHours && <span>{subject.creditHours} Credits</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEditSubject(subject.id);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Subject"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmDeleteSubject(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete Subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Modal Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current %</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {stats.percentage}%
                </p>
                <span className="text-[10px] text-slate-400">Target: {stats.targetPercentage}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Attended</span>
                <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-1">
                  {stats.attended}
                </p>
                <span className="text-[10px] text-emerald-600/80">classes present</span>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-800/50">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Missed</span>
                <p className="text-2xl font-black text-rose-800 dark:text-rose-200 mt-1">
                  {stats.missed}
                </p>
                <span className="text-[10px] text-rose-600/80">classes absent</span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/50">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Total Held</span>
                <p className="text-2xl font-black text-indigo-800 dark:text-indigo-200 mt-1">
                  {stats.totalConducted}
                </p>
                <span className="text-[10px] text-indigo-600/80">conducted so far</span>
              </div>
            </div>

            {/* Smart Target Assessment Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                stats.percentage >= stats.targetPercentage
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              {stats.percentage >= stats.targetPercentage ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm">
                  {stats.percentage >= stats.targetPercentage
                    ? `Safe Margin: You can miss up to ${stats.classesCanMiss} next classes`
                    : `Recovery Needed: Attend the next ${stats.classesNeeded} classes`}
                </p>
                <p className="mt-1 opacity-90">
                  {stats.percentage >= stats.targetPercentage
                    ? `Your attendance is above the required ${stats.targetPercentage}%. If you miss ${stats.classesCanMiss} classes, your attendance will still be at or above ${stats.targetPercentage}%.`
                    : `To reach your goal of ${stats.targetPercentage}%, you cannot miss any classes until you attend at least ${stats.classesNeeded} consecutive sessions.`}
                </p>
              </div>
            </div>

            {/* Interactive "What-If" Sandbox Simulation */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    What-If Attendance Simulator
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Projected %:</span>
                  <span
                    className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                      simPercentage >= stats.targetPercentage
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                    }`}
                  >
                    {simPercentage}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>If I attend next:</span>
                    <span className="font-bold text-indigo-600">+{simExtraAttend} classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={simExtraAttend}
                    onChange={e => setSimExtraAttend(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>If I miss next:</span>
                    <span className="font-bold text-rose-600">+{simExtraMiss} classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={simExtraMiss}
                    onChange={e => setSimExtraMiss(parseInt(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Weekly Timetable Schedule for this Subject */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Weekly Schedule ({subjectTimetable.length} slots)
              </h4>
              {subjectTimetable.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No scheduled timetable slots assigned yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {subjectTimetable.map(slot => (
                    <div
                      key={slot.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{slot.day}</span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {slot.room}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance History for this Subject */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Attendance History ({subjectRecords.length} records)
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      quickIncrement(subject.id, 'present');
                      triggerCelebration();
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                  >
                    + Mark Present
                  </button>
                  <button
                    onClick={() => quickIncrement(subject.id, 'absent')}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                  >
                    - Mark Absent
                  </button>
                </div>
              </div>

              {subjectRecords.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  No attendance records logged for this subject yet.
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5">Date</th>
                        <th className="px-3 py-2.5">Time</th>
                        <th className="px-3 py-2.5">Topic / Note</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {subjectRecords.slice(0, 10).map(rec => (
                        <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                          <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-white">
                            {rec.date}
                          </td>
                          <td className="px-3 py-2.5 text-slate-500">{rec.time || '—'}</td>
                          <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                            {rec.topic || 'Regular Lecture'}
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rec.status === 'present'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : rec.status === 'absent'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {rec.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              onClick={() => setRecordToDelete(rec.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subjectRecords.length > 10 && (
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/50 text-center text-[11px] text-slate-500">
                      Showing latest 10 of {subjectRecords.length} records. See Attendance tab for full history.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>

      {/* Delete Subject Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteSubject}
        onClose={() => setConfirmDeleteSubject(false)}
        onConfirm={() => {
          deleteSubject(subject.id);
          onClose();
        }}
        title={`Delete ${subject.name}?`}
        message="This will permanently delete this subject, all its scheduled classes, and all its logged attendance history. This action cannot be undone."
        confirmText="Delete Subject"
        isDestructive
      />

      {/* Delete Single Record Confirmation */}
      <ConfirmModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={() => {
          if (recordToDelete) {
            deleteRecord(recordToDelete);
            setRecordToDelete(null);
          }
        }}
        title="Delete Attendance Entry?"
        message="Are you sure you want to remove this specific attendance log entry? Statistics will be recalculated immediately."
        confirmText="Delete Entry"
        isDestructive
      />
    </>
  );
};
