import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { DayOfWeek, TimetableSlot } from '../../types';
import {
  Clock,
  PlusCircle,
  MapPin,
  User,
  Trash2,
  Edit2,
  Calendar,
  X,
  Layers,
} from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetableView: React.FC = () => {
  const {
    timetable,
    subjects,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
  } = useAttendance();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  // Form fields
  const [formSubjectId, setFormSubjectId] = useState<string>('');
  const [formDay, setFormDay] = useState<DayOfWeek>('Monday');
  const [formStartTime, setFormStartTime] = useState<string>('09:00');
  const [formEndTime, setFormEndTime] = useState<string>('10:00');
  const [formRoom, setFormRoom] = useState<string>('Room 101');
  const [formTeacher, setFormTeacher] = useState<string>('');

  const openAddModal = (day?: DayOfWeek) => {
    setEditingSlot(null);
    setFormSubjectId(subjects[0]?.id || '');
    setFormDay(day || selectedDay);
    setFormStartTime('09:00');
    setFormEndTime('10:00');
    setFormRoom(subjects[0]?.room || 'Room 101');
    setFormTeacher(subjects[0]?.teacherName || '');
    setIsModalOpen(true);
  };

  const openEditModal = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormSubjectId(slot.subjectId);
    setFormDay(slot.day);
    setFormStartTime(slot.startTime);
    setFormEndTime(slot.endTime);
    setFormRoom(slot.room);
    setFormTeacher(slot.teacherName || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubjectId) return;

    const payload = {
      subjectId: formSubjectId,
      day: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      room: formRoom.trim() || 'TBD',
      teacherName: formTeacher.trim() || undefined,
    };

    if (editingSlot) {
      updateTimetableSlot(editingSlot.id, payload);
    } else {
      addTimetableSlot(payload);
    }

    setIsModalOpen(false);
  };

  // Day filter slots
  const currentDaySlots = timetable
    .filter(t => t.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Weekly Class Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize lecture hours, lab blocks, and classrooms for each weekday
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Full Week Matrix
            </button>
          </div>

          <button
            onClick={() => openAddModal(selectedDay)}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Class Slot</span>
          </button>
        </div>
      </div>

      {viewMode === 'day' ? (
        <div className="space-y-5">
          {/* Day Tabs */}
          <div className="flex overflow-x-auto gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            {DAYS.map(day => {
              const count = timetable.filter(t => t.day === day).length;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{day}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count} {count === 1 ? 'class' : 'classes'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slots List for Selected Day */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedDay}'s Schedule ({currentDaySlots.length} Classes)
              </h3>
              <button
                onClick={() => openAddModal(selectedDay)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Class to {selectedDay}</span>
              </button>
            </div>

            <div className="pt-4 space-y-3">
              {currentDaySlots.length === 0 ? (
                <div className="py-10 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No classes scheduled for {selectedDay}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Click "Add Class Slot" to build your day schedule.</p>
                </div>
              ) : (
                currentDaySlots.map(slot => {
                  const subject = subjects.find(s => s.id === slot.subjectId);

                  return (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-4">
                        {/* Time Block */}
                        <div className="w-20 px-2 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shrink-0">
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block">
                            {slot.startTime}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{slot.endTime}</span>
                        </div>

                        {/* Subject Details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: subject?.color || '#3b82f6' }}
                            />
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {subject?.name || 'Unknown Class'}
                            </h4>
                            <span className="font-mono text-xs text-slate-400 font-semibold">
                              ({subject?.code})
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {slot.teacherName || subject?.teacherName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {slot.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(slot)}
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Slot"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingSlotId(slot.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Full Week Matrix Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map(day => {
            const daySlots = timetable
              .filter(t => t.day === day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{day}</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      {daySlots.length} {daySlots.length === 1 ? 'class' : 'classes'}
                    </span>
                  </div>

                  <div className="pt-3 space-y-2">
                    {daySlots.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4 text-center">Free day</p>
                    ) : (
                      daySlots.map(s => {
                        const sub = subjects.find(sub => sub.id === s.subjectId);
                        return (
                          <div
                            key={s.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                                {sub?.name}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                {s.startTime}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                              <span>{s.room}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openEditModal(s)}
                                  className="text-slate-400 hover:text-indigo-600 p-0.5"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setDeletingSlotId(s.id)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openAddModal(day)}
                  className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Class</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingSlot ? 'Edit Class Slot' : 'Schedule New Class'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Subject *
                </label>
                <select
                  value={formSubjectId}
                  onChange={e => {
                    setFormSubjectId(e.target.value);
                    const sub = subjects.find(s => s.id === e.target.value);
                    if (sub?.room) setFormRoom(sub.room);
                    if (sub?.teacherName) setFormTeacher(sub.teacherName);
                  }}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Weekday *
                </label>
                <select
                  value={formDay}
                  onChange={e => setFormDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={e => setFormRoom(e.target.value)}
                    placeholder="e.g. Lab 204"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Instructor Override
                  </label>
                  <input
                    type="text"
                    value={formTeacher}
                    onChange={e => setFormTeacher(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  {editingSlot ? 'Save Changes' : 'Schedule Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Slot Confirmation */}
      <ConfirmModal
        isOpen={!!deletingSlotId}
        onClose={() => setDeletingSlotId(null)}
        onConfirm={() => {
          if (deletingSlotId) {
            deleteTimetableSlot(deletingSlotId);
            setDeletingSlotId(null);
          }
        }}
        title="Remove Timetable Slot?"
        message="Are you sure you want to remove this class slot from your weekly schedule?"
        confirmText="Remove Slot"
        isDestructive
      />
    </div>
  );
};
