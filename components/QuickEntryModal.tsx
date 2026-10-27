"use client";

import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  ListOrdered,
} from "lucide-react";
import { OMRData } from "../types/omr";

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OMRData;
  onChange: (data: OMRData) => void;
  showToast: (msg: string) => void;
}

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({
  isOpen,
  onClose,
  data,
  onChange,
  showToast,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0); // 0-based index for Q1 to Q100
  const [viewMode, setViewMode] = useState<"stepper" | "overview">("stepper");

  if (!isOpen) return null;

  const currentAnswer = data.answers[currentQIndex];
  const answeredCount = data.answers.filter((a) => a !== null).length;

  const handleOptionSelect = (opt: string) => {
    const updated = [...data.answers];
    if (updated[currentQIndex] === opt) {
      updated[currentQIndex] = null;
    } else {
      updated[currentQIndex] = opt;
      // Auto-advance to next question if not at Q100
      if (currentQIndex < 99) {
        setTimeout(() => setCurrentQIndex((prev) => Math.min(99, prev + 1)), 150);
      }
    }
    onChange({ ...data, answers: updated });
  };

  const handleClearCurrent = () => {
    const updated = [...data.answers];
    updated[currentQIndex] = null;
    onChange({ ...data, answers: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[88vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#E6007E] flex items-center justify-center font-bold text-xs">
              Q
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                Quick Entry Mode
              </h3>
              <p className="text-[11px] text-slate-500">
                Large touch buttons • Instant state sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode(viewMode === "stepper" ? "overview" : "stepper")}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
              title={viewMode === "stepper" ? "Show 100-Grid Overview" : "Show Single Question Stepper"}
            >
              {viewMode === "stepper" ? (
                <>
                  <LayoutGrid className="w-4 h-4 text-[#E6007E]" />
                  <span className="hidden xs:inline">Grid</span>
                </>
              ) : (
                <>
                  <ListOrdered className="w-4 h-4 text-[#E6007E]" />
                  <span className="hidden xs:inline">Stepper</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-pink-50/60 px-5 py-2 border-b border-pink-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Answered:</span>
            <span className="font-bold text-[#E6007E] bg-white px-2 py-0.5 rounded-full border border-pink-200">
              {answeredCount} / 100
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#E6007E] h-full transition-all duration-300"
                style={{ width: `${answeredCount}%` }}
              />
            </div>
            <span className="font-mono text-slate-500 font-bold text-[11px]">
              {answeredCount}%
            </span>
          </div>
        </div>

        {/* Body */}
        {viewMode === "stepper" ? (
          <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
            {/* Question Selector & Current Question Title */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  Question Number
                </span>
                {/* Jump to question input */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Jump to:</span>
                  <select
                    value={currentQIndex}
                    onChange={(e) => setCurrentQIndex(Number(e.target.value))}
                    className="text-xs font-bold border border-slate-300 rounded-lg px-2 py-1 outline-none focus:border-[#E6007E] bg-white min-h-[36px]"
                  >
                    {Array.from({ length: 100 }).map((_, i) => (
                      <option key={i} value={i}>
                        Q {i + 1} {data.answers[i] ? `(${data.answers[i]})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Big Question Badge */}
              <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                <div className="text-3xl font-black text-slate-900">
                  Question {currentQIndex + 1}
                </div>
                <div className="text-xs font-semibold mt-1">
                  {currentAnswer ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Marked: Option ({currentAnswer})
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">Not answered yet</span>
                  )}
                </div>
              </div>

              {/* 4 Large Touch Option Buttons (min 52px high for easy tapping) */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {["A", "B", "C", "D"].map((opt) => {
                  const isSelected = currentAnswer === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleOptionSelect(opt)}
                      className={`h-16 rounded-xl border-2 flex items-center justify-center gap-3 transition-all active:scale-95 min-h-[52px] select-none ${
                        isSelected
                          ? "bg-black border-black text-white shadow-md ring-2 ring-[#E6007E]"
                          : "bg-white border-[#E6007E] text-[#E6007E] hover:bg-pink-50 font-bold"
                      }`}
                    >
                      <span className="text-2xl font-black">{opt}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepper Navigation: Prev, Clear, Next */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleClearCurrent}
                disabled={!currentAnswer}
                className="px-3 py-3 text-slate-500 hover:text-red-600 disabled:opacity-30 rounded-xl hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors min-h-[44px]"
                title="Clear current question"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentQIndex((prev) => Math.min(99, prev + 1))}
                disabled={currentQIndex === 99}
                className="flex-1 py-3 bg-[#E6007E] hover:bg-[#c9006e] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm min-h-[44px]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Grid Overview View (All 100 questions) */
          <div className="p-4 overflow-y-auto flex-1">
            <p className="text-xs text-slate-500 mb-3 text-center">
              Tap any question badge to jump to it and edit its response.
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {Array.from({ length: 100 }).map((_, i) => {
                const ans = data.answers[i];
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentQIndex(i);
                      setViewMode("stepper");
                    }}
                    className={`py-2 px-1 rounded-lg border text-center text-xs font-bold transition-all min-h-[44px] flex flex-col items-center justify-center ${
                      ans
                        ? "bg-black text-white border-black"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#E6007E]"
                    }`}
                  >
                    <span className="text-[10px] opacity-70">#{i + 1}</span>
                    <span className="text-xs font-black">{ans || "—"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
