"use client";

import React, { useState, useEffect } from "react";
import { Download, FileText, Image as ImageIcon, Printer, X, Loader2 } from "lucide-react";
import { OMRData } from "../types/omr";
import { generateDefaultFileName } from "../utils/exportPdf";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OMRData;
  onDownloadPdf: (fileName: string, includeSummary: boolean) => Promise<void>;
  onDownloadImage: (fileName: string, format: "png" | "jpeg") => Promise<void>;
  onPrint: () => void;
  isProcessing: boolean;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  data,
  onDownloadPdf,
  onDownloadImage,
  onPrint,
  isProcessing,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "png" | "jpeg">("pdf");
  const [fileName, setFileName] = useState("");
  const [includeSummary, setIncludeSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const ext = selectedFormat === "jpeg" ? "jpg" : selectedFormat;
      const defaultName = generateDefaultFileName(data, ext);
      setFileName(defaultName.replace(/\.[^/.]+$/, ""));
    }
  }, [isOpen, selectedFormat, data]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    const finalName = fileName.trim() || "OMR_Sheet";
    if (selectedFormat === "pdf") {
      await onDownloadPdf(`${finalName}.pdf`, includeSummary);
    } else {
      await onDownloadImage(`${finalName}.${selectedFormat === "jpeg" ? "jpg" : "png"}`, selectedFormat);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#E6007E] flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Download Options</h3>
              <p className="text-[11px] text-slate-500">Export high-resolution file directly to your device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedFormat("pdf")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all min-h-[52px] ${
                  selectedFormat === "pdf"
                    ? "border-[#E6007E] bg-pink-50/50 text-[#E6007E] ring-1 ring-[#E6007E]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-5 h-5 mb-1 text-[#E6007E]" />
                <span>PDF Document</span>
                <span className="text-[10px] text-slate-400 font-normal">A4 Format</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat("png")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all min-h-[52px] ${
                  selectedFormat === "png"
                    ? "border-[#E6007E] bg-pink-50/50 text-[#E6007E] ring-1 ring-[#E6007E]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ImageIcon className="w-5 h-5 mb-1 text-emerald-600" />
                <span>PNG Image</span>
                <span className="text-[10px] text-slate-400 font-normal">3x High-Res</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat("jpeg")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all min-h-[52px] ${
                  selectedFormat === "jpeg"
                    ? "border-[#E6007E] bg-pink-50/50 text-[#E6007E] ring-1 ring-[#E6007E]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ImageIcon className="w-5 h-5 mb-1 text-amber-600" />
                <span>JPG Image</span>
                <span className="text-[10px] text-slate-400 font-normal">Smaller Size</span>
              </button>
            </div>
          </div>

          {/* Editable File Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">File Name</label>
            <div className="flex items-center rounded-lg border border-slate-300 px-3 py-2.5 focus-within:border-[#E6007E] focus-within:ring-1 focus-within:ring-[#E6007E] bg-white">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="w-full text-base sm:text-xs font-mono text-slate-900 outline-none bg-transparent"
              />
              <span className="text-xs font-mono text-slate-400 ml-1.5">
                .{selectedFormat === "jpeg" ? "jpg" : selectedFormat}
              </span>
            </div>
          </div>

          {/* Options: Include Answer Key Summary for PDF */}
          {selectedFormat === "pdf" && (
            <div className="bg-pink-50/40 p-3.5 rounded-lg border border-pink-100 flex items-start gap-3">
              <input
                type="checkbox"
                id="includeSummary"
                checked={includeSummary}
                onChange={(e) => setIncludeSummary(e.target.checked)}
                className="mt-0.5 w-5 h-5 sm:w-4 sm:h-4 rounded text-[#E6007E] focus:ring-[#E6007E] border-slate-300 min-w-[20px]"
              />
              <label htmlFor="includeSummary" className="text-xs cursor-pointer select-none">
                <span className="font-bold text-slate-900 block text-xs sm:text-xs">Include Answer Key Summary Page</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Appends a second A4 page with a clean 100-question response table &amp; statistics.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2.5 rounded-lg hover:bg-slate-200 transition-colors min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2.5 rounded-lg hover:bg-slate-200 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isProcessing}
              className="text-xs font-bold text-white bg-[#E6007E] hover:bg-[#c9006e] px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-60 min-h-[44px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
