"use client";

import React, { useState } from "react";
import {
  FolderOpen,
  Trash2,
  Copy,
  Edit2,
  FileDown,
  Upload,
  Download,
  Plus,
  X,
  Check,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { SavedSheet, OMRData } from "../types/omr";
import {
  saveSheet,
  renameSheet,
  duplicateSheet,
  deleteSheet,
  exportSheetsAsJSON,
  importSheetsFromJSON,
} from "../utils/storage";

interface SavedSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheets: SavedSheet[];
  currentData: OMRData;
  onLoadSheet: (data: OMRData, name: string) => void;
  onRefreshList: () => void;
  onDirectDownloadPdf: (data: OMRData, name: string) => Promise<void>;
  onDirectDownloadPng: (data: OMRData, name: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const SavedSheetsModal: React.FC<SavedSheetsModalProps> = ({
  isOpen,
  onClose,
  sheets,
  currentData,
  onLoadSheet,
  onRefreshList,
  onDirectDownloadPdf,
  onDirectDownloadPng,
  showToast,
}) => {
  const [saveAsName, setSaveAsName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");

  if (!isOpen) return null;

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName =
      saveAsName.trim() ||
      `${currentData.examName || "OMR Sheet"} - ${new Date().toLocaleDateString()}`;
    saveSheet(finalName, currentData);
    setSaveAsName("");
    onRefreshList();
    showToast(`Saved "${finalName}" to your local sheets`);
  };

  const handleStartRename = (sheet: SavedSheet) => {
    setEditingId(sheet.id);
    setEditingName(sheet.name);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      renameSheet(id, editingName.trim());
      onRefreshList();
      showToast("Sheet renamed successfully");
    }
    setEditingId(null);
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateSheet(id);
    if (copy) {
      onRefreshList();
      showToast(`Duplicated to "${copy.name}"`);
    }
  };

  const handleDelete = (id: string) => {
    deleteSheet(id);
    setDeleteConfirmId(null);
    onRefreshList();
    showToast("Sheet deleted");
  };

  const handleExportJSON = () => {
    const jsonStr = exportSheetsAsJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OMR_Saved_Sheets_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup exported as JSON");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const res = importSheetsFromJSON(content);
      if (res.success) {
        onRefreshList();
        showToast(`Successfully imported ${res.count} saved sheets`);
      } else {
        alert(`Import error: ${res.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const filteredSheets = sheets.filter(
    (s) =>
      s.name.toLowerCase().includes(filterText.toLowerCase()) ||
      (s.data.examName || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#E6007E] flex items-center justify-center font-bold">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                My Saved OMR Sheets
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage, reopen, and download your stored sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Save Current Bar */}
        <div className="p-3.5 sm:p-4 bg-pink-50/50 border-b border-pink-100">
          <form onSubmit={handleSaveCurrent} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              placeholder="Save name, e.g. Term 1 - Set A"
              className="flex-1 px-3 py-2 text-base sm:text-xs rounded-lg border border-pink-200 focus:border-[#E6007E] outline-none bg-white min-h-[40px]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#E6007E] hover:bg-[#c9006e] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Save Current Work</span>
            </button>
          </form>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 bg-white">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search sheets..."
            className="px-3 py-1.5 text-base sm:text-xs rounded-md border border-slate-200 focus:border-[#E6007E] outline-none w-full sm:w-60 min-h-[36px]"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors min-h-[40px]">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExportJSON}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors min-h-[40px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export All</span>
            </button>
          </div>
        </div>

        {/* Sheets List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredSheets.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <FolderOpen className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-medium">No saved sheets found</p>
              <p className="text-xs text-slate-400 mt-1">
                Save your filled OMR sheet to store it locally on this device.
              </p>
            </div>
          ) : (
            filteredSheets.map((sheet) => {
              const answeredCount = sheet.data.answers.filter((a) => a !== null).length;
              const dateStr = new Date(sheet.savedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={sheet.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-pink-200 bg-white hover:bg-pink-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    {editingId === sheet.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="px-2 py-1 text-base sm:text-xs border border-[#E6007E] rounded outline-none w-full font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(sheet.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {sheet.name}
                        </h4>
                        <button
                          onClick={() => handleStartRename(sheet)}
                          className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 min-w-[32px] min-h-[32px] flex items-center justify-center"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {dateStr}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#E6007E]">
                        <CheckCircle2 className="w-3 h-3" />
                        {answeredCount} / 100
                      </span>
                      {sheet.data.selectedSet && (
                        <span className="bg-pink-100 text-[#E6007E] px-1.5 py-0.2 rounded font-bold text-[10px]">
                          Set {sheet.data.selectedSet}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => {
                        onLoadSheet(sheet.data, sheet.name);
                        onClose();
                        showToast(`Opened "${sheet.name}"`);
                      }}
                      className="px-3.5 py-2 bg-[#E6007E] hover:bg-[#c9006e] text-white text-xs font-bold rounded-lg shadow-sm transition-colors min-h-[44px]"
                    >
                      Open
                    </button>

                    <button
                      onClick={() => handleDuplicate(sheet.id)}
                      className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDirectDownloadPdf(sheet.data, sheet.name)}
                      className="p-2.5 text-pink-700 hover:text-pink-900 hover:bg-pink-50 rounded-lg border border-pink-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Quick Download PDF"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    {deleteConfirmId === sheet.id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200 min-h-[44px]">
                        <span className="text-[10px] text-red-600 font-bold px-1">Sure?</span>
                        <button
                          onClick={() => handleDelete(sheet.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold min-h-[36px]"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs min-h-[36px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(sheet.id)}
                        className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{sheets.length} saved</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 rounded-lg transition-colors min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
