"use client";

import React, { useState } from "react";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Printer,
  Save,
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Settings2,
  Check,
} from "lucide-react";
import { OMRData, INITIAL_OMR_DATA } from "../types/omr";

interface ToolbarProps {
  data: OMRData;
  onChange: (data: OMRData) => void;
  onOpenDownloadModal: () => void;
  onQuickDownloadPdf: () => void;
  onQuickDownloadPng: () => void;
  onQuickDownloadJpg: () => void;
  onPrint: () => void;
  onSaveCurrent: () => void;
  onOpenSavedModal: () => void;
  savedCount: number;
  zoom: number;
  setZoom: (fn: (prev: number) => number) => void;
  showToast: (msg: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  data,
  onChange,
  onOpenDownloadModal,
  onQuickDownloadPdf,
  onQuickDownloadPng,
  onQuickDownloadJpg,
  onPrint,
  onSaveCurrent,
  onOpenSavedModal,
  savedCount,
  zoom,
  setZoom,
  showToast,
}) => {
  const [quickFillOpen, setQuickFillOpen] = useState(false);
  const answeredCount = data.answers.filter((a) => a !== null).length;

  const handleFillAll = (opt: string) => {
    onChange({ ...data, answers: Array(100).fill(opt) });
    setQuickFillOpen(false);
    showToast(`Filled all 100 questions with option (${opt})`);
  };

  const handleRandomFill = () => {
    const opts = ["A", "B", "C", "D"];
    const randomized = Array.from({ length: 100 }, () => opts[Math.floor(Math.random() * opts.length)]);
    onChange({ ...data, answers: randomized });
    setQuickFillOpen(false);
    showToast("Filled all 100 questions with randomized answers");
  };

  const handleClearAnswers = () => {
    if (window.confirm("Clear all 100 answer bubbles?")) {
      onChange({ ...data, answers: Array(100).fill(null) });
      setQuickFillOpen(false);
      showToast("Cleared all 100 answers");
    }
  };

  const handleResetEntireSheet = () => {
    if (window.confirm("Reset entire sheet to initial blank state?")) {
      onChange({ ...INITIAL_OMR_DATA });
      setQuickFillOpen(false);
      showToast("Reset sheet to blank");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-sm no-print">
      <div className="max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E6007E] text-white flex items-center justify-center font-black text-sm shadow-sm">
              MG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                  OMR Replica Studio
                </span>
                <span className="bg-pink-100 text-[#E6007E] text-[10px] font-bold px-1.5 py-0.5 rounded border border-pink-200">
                  Multigraphics 100-Q
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                A4 Replica • Continuous Auto-Save Active
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
            <span className="text-slate-500">Answered:</span>
            <span className="font-bold text-[#E6007E] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
              {answeredCount} / 100
            </span>
          </div>
        </div>

        {/* Center: Zoom & Quick Fill Tools */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-semibold px-2 min-w-[50px] text-center text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(() => 1.0)}
              className="px-2 py-1 hover:bg-white rounded text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              title="Reset Zoom to 100%"
            >
              Reset
            </button>
          </div>

          {/* Quick Fill Dropdown */}
          <div className="relative">
            <button
              onClick={() => setQuickFillOpen(!quickFillOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6007E]" />
              <span>Quick Fill</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
            </button>

            {quickFillOpen && (
              <div
                className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setQuickFillOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Generate Answer Key
                </div>
                <button
                  onClick={handleRandomFill}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-pink-50 hover:text-[#E6007E] font-medium flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E6007E]" />
                  <span>Random 100 Answers (Simulate)</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Fill Uniformly
                </div>
                {["A", "B", "C", "D"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleFillAll(opt)}
                    className="w-full text-left px-3 py-1 text-xs text-slate-700 hover:bg-pink-50 font-medium"
                  >
                    Mark All ({opt})
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={handleClearAnswers}
                  className="w-full text-left px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50 font-medium flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All 100 Answers</span>
                </button>
                <button
                  onClick={handleResetEntireSheet}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium"
                >
                  Reset Entire Sheet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Save, My Sheets, and Download Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Save Button */}
          <button
            onClick={onSaveCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm hover:border-slate-400 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Save</span>
          </button>

          {/* My Saved Sheets */}
          <button
            onClick={onOpenSavedModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm hover:border-slate-400 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>My Sheets</span>
            {savedCount > 0 && (
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors"
            title="Open browser print dialog"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Download Image (PNG) */}
          <button
            onClick={onQuickDownloadPng}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm transition-colors"
            title="Download high-resolution PNG"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          {/* Download PDF (High Priority) */}
          <div className="flex items-center rounded-lg shadow-sm bg-[#E6007E] text-white">
            <button
              onClick={onQuickDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold hover:bg-[#c9006e] rounded-l-lg transition-colors border-r border-pink-400"
              title="Download sharp A4 PDF directly"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onOpenDownloadModal}
              className="p-1.5 hover:bg-[#c9006e] rounded-r-lg transition-colors"
              title="Download options (Summary page, custom name, JPG)"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
