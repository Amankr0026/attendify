import React, { useState } from 'react';
import {
  calculateClassesCanMiss,
  calculateClassesNeeded,
  calculatePercentage,
  getStatusCategory,
  STATUS_CONFIG,
} from '../../utils/calculations';
import {
  Calculator,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  Sliders,
} from 'lucide-react';

export const CalculatorView: React.FC = () => {
  const [conducted, setConducted] = useState<number>(30);
  const [attended, setAttended] = useState<number>(24);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);

  // Ensure attended <= conducted
  const safeAttended = Math.min(conducted, attended);
  const currentPct = calculatePercentage(safeAttended, conducted);
  const statusCategory = getStatusCategory(currentPct);
  const config = STATUS_CONFIG[statusCategory];

  const classesNeeded = calculateClassesNeeded(safeAttended, conducted, targetPercentage);
  const classesCanMiss = calculateClassesCanMiss(safeAttended, conducted, targetPercentage);

  const isAbove = currentPct >= targetPercentage;

  const handleSetPreset = (cond: number, att: number, tgt: number) => {
    setConducted(cond);
    setAttended(att);
    setTargetPercentage(tgt);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Smart Attendance Goal Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Accurate mathematical projection for required classes and safe miss cushions
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => handleSetPreset(20, 14, 75)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
          >
            Midterm Risk
          </button>
          <button
            onClick={() => handleSetPreset(40, 36, 80)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
          >
            High Attendance
          </button>
          <button
            onClick={() => handleSetPreset(50, 38, 75)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
          >
            Near 75%
          </button>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" /> Input Variables
            </h3>
            <button
              onClick={() => handleSetPreset(30, 24, 75)}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Classes Conducted Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Total Classes Conducted (C)
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={conducted}
                onChange={e => {
                  const val = Math.max(1, parseInt(e.target.value) || 1);
                  setConducted(val);
                  if (attended > val) setAttended(val);
                }}
                className="w-20 px-2.5 py-1 text-right text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={conducted}
              onChange={e => {
                const val = parseInt(e.target.value);
                setConducted(val);
                if (attended > val) setAttended(val);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Classes Attended Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Classes Attended (A)
              </label>
              <input
                type="number"
                min="0"
                max={conducted}
                value={safeAttended}
                onChange={e => {
                  const val = Math.min(conducted, Math.max(0, parseInt(e.target.value) || 0));
                  setAttended(val);
                }}
                className="w-20 px-2.5 py-1 text-right text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              type="range"
              min="0"
              max={conducted}
              value={safeAttended}
              onChange={e => setAttended(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Target Attendance % Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              Desired Target Goal (T)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[70, 75, 80, 85, 90].map(tgt => (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => setTargetPercentage(tgt)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    targetPercentage === tgt
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tgt}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Results (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Calculation Result
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {currentPct}%
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${config.badgeBg} ${config.badgeText}`}>
                {config.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {safeAttended} attended out of {conducted} held ({conducted - safeAttended} missed)
            </p>

            {/* Smart Result Box */}
            <div
              className={`mt-5 p-4 rounded-2xl border ${
                isAbove
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {isAbove ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold leading-tight">
                    {isAbove
                      ? `You can miss ${classesCanMiss} ${classesCanMiss === 1 ? 'class' : 'classes'}`
                      : `You need to attend next ${classesNeeded} ${classesNeeded === 1 ? 'class' : 'classes'}`}
                  </h4>
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">
                    {isAbove
                      ? `You are currently above your ${targetPercentage}% goal. You can miss ${classesCanMiss} consecutive classes and your attendance will still remain at or above ${targetPercentage}%.`
                      : `You are currently below your ${targetPercentage}% target. You must attend the next ${classesNeeded} classes consecutively without missing any to reach ${targetPercentage}%.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Math Formula Footnote */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>Exact Mathematical Formula</span>
            </div>
            <p className="font-mono text-[10px]">
              {isAbove
                ? `Max miss = ⌊(Attended × 100 / Target) - Conducted⌋ = ${classesCanMiss}`
                : `Need = ⌈(Target% × Conducted - Attended) / (1 - Target%)⌉ = ${classesNeeded}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
