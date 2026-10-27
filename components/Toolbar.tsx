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
  Sparkles,
  ChevronDown,
  Settings2,
  Menu,
  X,
  Edit3,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import { OMRData, INITIAL_OMR_DATA } from "../types/omr";

export type ZoomMode = "fit-width" | "fit-page" | "custom";

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
  onOpenQuickEntry: () => void;
  onOpenPaperDetails: () => void;
  savedCount: number;
  zoomMode: ZoomMode;
  setZoomMode: (mode: ZoomMode) => void;
  customScale: number;
  setCustomScale: (fn: (prev: number) => number) => void;
  effectiveScale: number;
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
  onOpenQuickEntry,
  onOpenPaperDetails,
  savedCount,
  zoomMode,
  setZoomMode,
  customScale,
  setCustomScale,
  effectiveScale,
  showToast,
}) => {
  const [quickFillOpen, setQuickFillOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreTabletOpen, setMoreTabletOpen] = useState(false);

  const answeredCount = data.answers.filter((a) => a !== null).length;

  const handleFillAll = (opt: string) => {
    onChange({ ...data, answers: Array(100).fill(opt) });
    setQuickFillOpen(false);
    showToast(`Marked all 100 questions with (${opt})`);
  };

  const handleRandomFill = () => {
    const opts = ["A", "B", "C", "D"];
    const randomized = Array.from(
      { length: 100 },
      () => opts[Math.floor(Math.random() * opts.length)]
    );
    onChange({ ...data, answers: randomized });
    setQuickFillOpen(false);
    showToast("Filled 100 questions with simulated answers");
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
    <>
      {/* ============================================================ */}
      {/* 1. TOP STICKY TOOLBAR */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-[1700px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6007E] text-white flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
              MG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight">
                  OMR Studio
                </span>
                <span className="hidden sm:inline-block bg-pink-100 text-[#E6007E] text-[10px] font-bold px-1.5 py-0.2 rounded border border-pink-200">
                  100-Q Replica
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="hidden md:inline">Auto-Save Active</span>
                <span className="font-bold text-[#E6007E] inline-flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {answeredCount}/100 Answered
                </span>
              </div>
            </div>
          </div>

          {/* Center (Desktop & Tablet): Zoom Controls & Quick Entry Button */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Quick Entry Toggle Button */}
            <button
              onClick={onOpenQuickEntry}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-pink-50 hover:bg-pink-100 text-[#E6007E] border border-pink-200 rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              <Edit3 className="w-4 h-4 text-[#E6007E]" />
              <span>Quick Entry</span>
            </button>

            {/* Paper Details Editor Button */}
            <button
              onClick={onOpenPaperDetails}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="hidden lg:inline">Paper Details</span>
              <span className="lg:hidden">Details</span>
            </button>

            {/* Zoom Selector & Buttons */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => {
                  setZoomMode("custom");
                  setCustomScale((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))));
                }}
                className="p-2 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              {/* Zoom Mode selector */}
              <select
                value={zoomMode === "custom" ? String(Math.round(customScale * 100)) : zoomMode}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "fit-width" || val === "fit-page") {
                    setZoomMode(val);
                  } else {
                    setZoomMode("custom");
                    setCustomScale(() => Number(val) / 100);
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none px-1 text-center cursor-pointer min-h-[36px]"
              >
                <option value="fit-width">Fit Width</option>
                <option value="fit-page">Fit Page</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
                <option value="125">125%</option>
                <option value="150">150%</option>
                <option value="200">200%</option>
              </select>

              <button
                onClick={() => {
                  setZoomMode("custom");
                  setCustomScale((z) => Math.min(2.0, Number((z + 0.1).toFixed(2))));
                }}
                className="p-2 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Fill Menu */}
            <div className="relative">
              <button
                onClick={() => setQuickFillOpen(!quickFillOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E6007E]" />
                <span className="hidden lg:inline">Quick Fill</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
              </button>

              {quickFillOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setQuickFillOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulate Responses
                  </div>
                  <button
                    onClick={handleRandomFill}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-pink-50 hover:text-[#E6007E] font-medium flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E6007E]" />
                    <span>Random 100 Answers</span>
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Uniform Fill
                  </div>
                  {["A", "B", "C", "D"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleFillAll(opt)}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-pink-50 font-medium"
                    >
                      Mark All ({opt})
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={handleClearAnswers}
                    className="w-full text-left px-3 py-2 text-xs text-amber-600 hover:bg-amber-50 font-medium"
                  >
                    Clear All 100 Answers
                  </button>
                  <button
                    onClick={handleResetEntireSheet}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 font-medium"
                  >
                    Reset Entire Sheet
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions (Desktop >= 1024px) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onSaveCurrent}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Save</span>
            </button>

            <button
              onClick={onOpenSavedModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>My Sheets</span>
              {savedCount > 0 && (
                <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onQuickDownloadPng}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PNG</span>
            </button>

            {/* Download PDF button with Options popover trigger */}
            <div className="flex items-center rounded-lg shadow-sm bg-[#E6007E] text-white">
              <button
                onClick={onQuickDownloadPdf}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold hover:bg-[#c9006e] rounded-l-lg transition-colors border-r border-pink-400 min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={onOpenDownloadModal}
                className="p-2.5 hover:bg-[#c9006e] rounded-r-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Download Options (Summary page, custom name)"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right (Tablet 640-1023px): Download PDF + More Menu */}
          <div className="hidden sm:flex lg:hidden items-center gap-2">
            <button
              onClick={onQuickDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E6007E] text-white text-xs font-bold rounded-lg shadow-sm min-h-[44px]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={onQuickDownloadPng}
              className="p-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Download PNG"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Tablet More Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreTabletOpen(!moreTabletOpen)}
                className="p-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Menu className="w-4 h-4" />
              </button>

              {moreTabletOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setMoreTabletOpen(false)}
                >
                  <button
                    onClick={() => {
                      onSaveCurrent();
                      setMoreTabletOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-blue-600" />
                    <span>Save Sheet</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenSavedModal();
                      setMoreTabletOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FolderOpen className="w-4 h-4 text-amber-600" />
                    <span>My Sheets ({savedCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenDownloadModal();
                      setMoreTabletOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings2 className="w-4 h-4 text-pink-600" />
                    <span>Download Options</span>
                  </button>
                  <button
                    onClick={() => {
                      onPrint();
                      setMoreTabletOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print Sheet</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right: Menu button (<640px) */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onOpenQuickEntry}
              className="px-2.5 py-1.5 bg-pink-100 text-[#E6007E] rounded-lg text-xs font-extrabold flex items-center gap-1 min-h-[44px]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Q-Entry</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MOBILE BOTTOM BAR (Sticky Navigation for screens < 640px) */}
      {/* ============================================================ */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around no-print">
        <button
          onClick={onOpenQuickEntry}
          className="flex flex-col items-center justify-center p-1 text-[#E6007E] min-w-[48px] min-h-[44px]"
        >
          <Edit3 className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Entry</span>
        </button>

        <button
          onClick={onOpenPaperDetails}
          className="flex flex-col items-center justify-center p-1 text-slate-700 min-w-[48px] min-h-[44px]"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-semibold mt-0.5">Details</span>
        </button>

        <button
          onClick={onSaveCurrent}
          className="flex flex-col items-center justify-center p-1 text-slate-700 min-w-[48px] min-h-[44px]"
        >
          <Save className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-semibold mt-0.5">Save</span>
        </button>

        <button
          onClick={onQuickDownloadPdf}
          className="flex flex-col items-center justify-center p-1 text-[#E6007E] font-bold min-w-[48px] min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">PDF</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center p-1 text-slate-600 min-w-[48px] min-h-[44px]"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">More</span>
        </button>
      </nav>

      {/* ============================================================ */}
      {/* 3. MOBILE FULL MENU (Bottom Sheet / Modal Drawer) */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm sm:hidden animate-in fade-in">
          <div className="bg-white rounded-t-2xl shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E6007E] text-white flex items-center justify-center font-black text-xs">
                  MG
                </div>
                <span className="font-extrabold text-sm text-slate-900">
                  OMR Sheet Controls
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Zoom on Mobile */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Sheet Display &amp; Zoom
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setZoomMode("fit-width");
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2.5 rounded-lg border text-xs font-bold min-h-[44px] ${
                    zoomMode === "fit-width"
                      ? "bg-[#E6007E] text-white border-[#E6007E]"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Fit Width
                </button>
                <button
                  onClick={() => {
                    setZoomMode("fit-page");
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2.5 rounded-lg border text-xs font-bold min-h-[44px] ${
                    zoomMode === "fit-page"
                      ? "bg-[#E6007E] text-white border-[#E6007E]"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Fit Page
                </button>
                <button
                  onClick={() => {
                    setZoomMode("custom");
                    setCustomScale(() => 1.0);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2.5 rounded-lg border text-xs font-bold min-h-[44px] ${
                    zoomMode === "custom" && customScale === 1.0
                      ? "bg-[#E6007E] text-white border-[#E6007E]"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  100%
                </button>
              </div>
            </div>

            {/* Action Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Actions &amp; Export
              </label>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickEntry();
                }}
                className="w-full py-3 px-3.5 bg-pink-50 text-[#E6007E] font-bold text-xs rounded-xl flex items-center gap-3 min-h-[48px]"
              >
                <Edit3 className="w-4 h-4 text-[#E6007E]" />
                <span>Open Quick Entry Mode (Questions 1–100)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPaperDetails();
                }}
                className="w-full py-3 px-3.5 bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-3 min-h-[48px]"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Edit Paper &amp; Candidate Details</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onQuickDownloadPdf();
                }}
                className="w-full py-3 px-3.5 bg-[#E6007E] text-white font-bold text-xs rounded-xl flex items-center gap-3 min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF (Direct A4)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onQuickDownloadPng();
                }}
                className="w-full py-3 px-3.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-3 min-h-[48px]"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Download PNG (3x High-Res)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDownloadModal();
                }}
                className="w-full py-3 px-3.5 bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-3 min-h-[48px]"
              >
                <Settings2 className="w-4 h-4 text-pink-600" />
                <span>Download Options (Include Summary Page)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSavedModal();
                }}
                className="w-full py-3 px-3.5 bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-3 min-h-[48px]"
              >
                <FolderOpen className="w-4 h-4 text-amber-600" />
                <span>My Saved Sheets ({savedCount})</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPrint();
                }}
                className="w-full py-3 px-3.5 bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-3 min-h-[48px]"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Dialog</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
