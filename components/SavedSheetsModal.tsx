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
    const finalName = saveAsName.trim() || `${currentData.examName || "OMR Sheet"} - ${new Date().toLocaleDateString()}`;
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

  const filteredSheets = sheets.filter((s) =>
    s.name.toLowerCase().includes(filterText.toLowerCase()) ||
    (s.data.examName || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#E6007E] flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">My Saved OMR Sheets</h3>
              <p className="text-xs text-slate-500">Manage, reopen, and download your saved sheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Save Current Bar */}
        <div className="p-4 bg-pink-50/50 border-b border-pink-100">
          <form onSubmit={handleSaveCurrent} className="flex gap-2">
            <input
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              placeholder="e.g. Science Term 1 - Set A - Answer Key"
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-pink-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#E6007E] hover:bg-[#c9006e] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Save Current Work</span>
            </button>
          </form>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-2.5 border-b border-slate-100 flex items-center justify-between gap-4">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search saved sheets..."
            className="px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:border-[#E6007E] outline-none w-64"
          />

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExportJSON}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export All (JSON)</span>
            </button>
          </div>
        </div>

        {/* Sheets List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredSheets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-medium">No saved sheets found</p>
              <p className="text-xs text-slate-400 mt-1">
                Save your filled OMR sheet above to store it permanently on this browser.
              </p>
            </div>
          ) : (
            filteredSheets.map((sheet) => {
              const answeredCount = sheet.data.answers.filter((a) => a !== null).length;
              const dateStr = new Date(sheet.savedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={sheet.id}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-pink-200 bg-white hover:bg-pink-50/20 transition-all flex items-center justify-between gap-4"
                >
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    {editingId === sheet.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="px-2 py-1 text-xs border border-[#E6007E] rounded outline-none w-full font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(sheet.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded"
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
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {dateStr}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#E6007E]">
                        <CheckCircle2 className="w-3 h-3" />
                        {answeredCount} / 100 answered
                      </span>
                      {sheet.data.selectedSet && (
                        <span className="bg-pink-100 text-[#E6007E] px-1.5 py-0.2 rounded font-bold text-[10px]">
                          Set {sheet.data.selectedSet}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        onLoadSheet(sheet.data, sheet.name);
                        onClose();
                        showToast(`Opened "${sheet.name}"`);
                      }}
                      className="px-3 py-1.5 bg-[#E6007E] hover:bg-[#c9006e] text-white text-xs font-bold rounded shadow-sm transition-colors"
                    >
                      Open
                    </button>

                    <button
                      onClick={() => handleDuplicate(sheet.id)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDirectDownloadPdf(sheet.data, sheet.name)}
                      className="p-1.5 text-pink-700 hover:text-pink-900 hover:bg-pink-50 rounded border border-pink-200"
                      title="Quick Download PDF"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>

                    {deleteConfirmId === sheet.id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded border border-red-200">
                        <span className="text-[10px] text-red-600 font-bold px-1">Delete?</span>
                        <button
                          onClick={() => handleDelete(sheet.id)}
                          className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(sheet.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{sheets.length} total saved sheets</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
