import React, { useState, useMemo } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  XCircle,
  Slash,
  ArrowUpDown,
  BookOpen,
  X,
} from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

export const AttendanceView: React.FC<{
  onOpenAddRecord: () => void;
}> = ({ onOpenAddRecord }) => {
  const {
    records,
    subjects,
    deleteRecord,
    updateRecord,
    exportCSV,
  } = useAttendance();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Deletion state
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);

  // Edit record inline/modal state
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return records
      .filter(r => {
        // Subject filter
        if (selectedSubjectId !== 'all' && r.subjectId !== selectedSubjectId) return false;
        // Status filter
        if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
        // Date range filter
        if (startDate && r.date < startDate) return false;
        if (endDate && r.date > endDate) return false;
        // Search query (matches topic or subject name)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const sub = subjects.find(s => s.id === r.subjectId);
          const subName = sub?.name.toLowerCase() || '';
          const subCode = sub?.code.toLowerCase() || '';
          const topic = (r.topic || '').toLowerCase();
          if (!subName.includes(q) && !subCode.includes(q) && !topic.includes(q)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime() + (a.time ? parseInt(a.time.replace(':', '')) * 60 : 0);
        const timeB = new Date(b.date).getTime() + (b.time ? parseInt(b.time.replace(':', '')) * 60 : 0);
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [records, subjects, selectedSubjectId, selectedStatus, startDate, endDate, searchQuery, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubjectId('all');
    setSelectedStatus('all');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters =
    searchQuery || selectedSubjectId !== 'all' || selectedStatus !== 'all' || startDate || endDate;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Attendance Records</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete searchable history of all logged lecture sessions ({filteredRecords.length} entries)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddRecord}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subject or topic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="absent">Absent Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>

          {/* Date Range Start / End */}
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              title="Start Date"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              title="End Date"
            />
          </div>
        </div>

        {/* Filter Summary & Clear Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 font-semibold"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Records Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Try clearing your search or filters to see all attendance records.'
                : 'No classes have been recorded yet. Click "Add Record" to start logging your attendance.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 px-3.5 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Lecture Topic / Notes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.map(record => {
                  const subject = subjects.find(s => s.id === record.subjectId);

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Date & Time */}
                      <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{record.date}</span>
                          {record.time && (
                            <span className="text-[11px] font-normal text-slate-400">({record.time})</span>
                          )}
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: subject?.color || '#3b82f6' }}
                          />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {subject?.name || 'Unknown Subject'}
                            </span>
                            <span className="ml-1 text-[10px] font-mono text-slate-400 font-semibold">
                              ({subject?.code})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {record.topic || 'Regular Lecture'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            record.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : record.status === 'absent'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {record.status === 'present' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : record.status === 'absent' ? (
                            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                          ) : (
                            <Slash className="w-3 h-3 text-slate-500 shrink-0" />
                          )}
                          {record.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingRecord(record)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingRecordId(record.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Edit Attendance Entry</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['present', 'absent', 'cancelled'] as AttendanceStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditingRecord({ ...editingRecord, status: st })}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        editingRecord.status === st
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                <input
                  type="date"
                  value={editingRecord.date}
                  onChange={e => setEditingRecord({ ...editingRecord, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Lecture Topic / Notes</label>
                <input
                  type="text"
                  value={editingRecord.topic || ''}
                  onChange={e => setEditingRecord({ ...editingRecord, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateRecord(editingRecord.id, editingRecord);
                  setEditingRecord(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Record Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingRecordId}
        onClose={() => setDeletingRecordId(null)}
        onConfirm={() => {
          if (deletingRecordId) {
            deleteRecord(deletingRecordId);
            setDeletingRecordId(null);
          }
        }}
        title="Delete Attendance Entry?"
        message="Are you sure you want to delete this specific log? Your calculated attendance metrics will adjust automatically."
        confirmText="Delete Record"
        isDestructive
      />
    </div>
  );
};
