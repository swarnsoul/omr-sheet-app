"use client";

import React from "react";
import { X, User, FileText, Check } from "lucide-react";
import { OMRData } from "../types/omr";

interface PaperDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OMRData;
  onChange: (data: OMRData) => void;
  showToast: (msg: string) => void;
}

const CLASSES = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const STREAMS = ["PCM", "PCB", "COM", "HUM"];
const SETS = ["1", "2", "3"];

export const PaperDetailsModal: React.FC<PaperDetailsModalProps> = ({
  isOpen,
  onClose,
  data,
  onChange,
  showToast,
}) => {
  if (!isOpen) return null;

  const handleFieldChange = (field: keyof OMRData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleNameStringChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z ]/g, "").slice(0, 21);
    const arr = Array(21).fill("");
    for (let i = 0; i < cleaned.length; i++) {
      arr[i] = cleaned[i] === " " ? "" : cleaned[i];
    }
    onChange({ ...data, candidateName: arr });
  };

  const handleRollStringChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, "").slice(0, 2);
    onChange({
      ...data,
      rollNo: [digits[0] || null, digits[1] || null],
    });
  };

  const handleSubjCodeChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, "").slice(0, 3);
    onChange({
      ...data,
      subjectCode: [digits[0] || null, digits[1] || null, digits[2] || null],
    });
  };

  const handleAdmNoChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, "").slice(0, 4);
    onChange({
      ...data,
      admissionNo: [digits[0] || null, digits[1] || null, digits[2] || null, digits[3] || null],
    });
  };

  const candidateNameString = data.candidateName.map((c) => c || " ").join("").trim();
  const rollString = data.rollNo.map((d) => d || "").join("");
  const subjCodeString = data.subjectCode.map((d) => d || "").join("");
  const admNoString = data.admissionNo.map((d) => d || "").join("");

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#E6007E] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                Paper &amp; Candidate Details
              </h3>
              <p className="text-[11px] text-slate-500">
                Syncs directly to on-screen write-in boxes and bubbles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Top Paper Metadata */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E6007E] uppercase tracking-wider">
              Exam Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Name of Exam
                </label>
                <input
                  type="text"
                  value={data.examName}
                  onChange={(e) => handleFieldChange("examName", e.target.value)}
                  placeholder="e.g. Mid-Term Examination"
                  className="w-full text-base sm:text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#E6007E] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={data.subject}
                  onChange={(e) => handleFieldChange("subject", e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full text-base sm:text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#E6007E] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class &amp; Sec
                </label>
                <input
                  type="text"
                  value={data.classSec}
                  onChange={(e) => handleFieldChange("classSec", e.target.value)}
                  placeholder="e.g. 10 - A"
                  className="w-full text-base sm:text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#E6007E] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  placeholder="YYYY-MM-DD or DD/MM/YYYY"
                  className="w-full text-base sm:text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#E6007E] bg-white"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Candidate Identification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E6007E] uppercase tracking-wider">
              Candidate Identification
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Name (Capital Letters, max 21)
              </label>
              <input
                type="text"
                maxLength={21}
                value={candidateNameString}
                onChange={(e) => handleNameStringChange(e.target.value)}
                placeholder="e.g. JOHN DOE"
                className="w-full text-base sm:text-xs font-mono font-bold tracking-wider border border-slate-300 rounded-lg px-3 py-2 uppercase outline-none focus:border-[#E6007E] bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Auto-bubbles corresponding A-Z letters on the sheet.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Roll No (2 digits)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={rollString}
                  onChange={(e) => handleRollStringChange(e.target.value)}
                  placeholder="15"
                  className="w-full text-base sm:text-xs font-mono font-bold text-center border border-slate-300 rounded-lg px-2 py-2 outline-none focus:border-[#E6007E] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subj Code (3)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={subjCodeString}
                  onChange={(e) => handleSubjCodeChange(e.target.value)}
                  placeholder="086"
                  className="w-full text-base sm:text-xs font-mono font-bold text-center border border-slate-300 rounded-lg px-2 py-2 outline-none focus:border-[#E6007E] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adm No (4)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={admNoString}
                  onChange={(e) => handleAdmNoChange(e.target.value)}
                  placeholder="2024"
                  className="w-full text-base sm:text-xs font-mono font-bold text-center border border-slate-300 rounded-lg px-2 py-2 outline-none focus:border-[#E6007E] bg-white"
                />
              </div>
            </div>

            {/* Set & Stream */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Set Number
                </label>
                <div className="flex gap-1.5">
                  {SETS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        handleFieldChange("selectedSet", data.selectedSet === s ? null : s)
                      }
                      className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all min-h-[44px] ${
                        data.selectedSet === s
                          ? "bg-black text-white border-black"
                          : "bg-white text-slate-700 border-slate-300 hover:border-[#E6007E]"
                      }`}
                    >
                      Set {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stream
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {STREAMS.map((stm) => (
                    <button
                      key={stm}
                      type="button"
                      onClick={() =>
                        handleFieldChange("selectedStream", data.selectedStream === stm ? null : stm)
                      }
                      className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all min-h-[44px] ${
                        data.selectedStream === stm
                          ? "bg-black text-white border-black"
                          : "bg-white text-slate-700 border-slate-300 hover:border-[#E6007E]"
                      }`}
                    >
                      {stm}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
              showToast("Details updated on OMR sheet");
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#E6007E] hover:bg-[#c9006e] text-white text-xs font-bold rounded-lg shadow-sm transition-colors min-h-[44px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
